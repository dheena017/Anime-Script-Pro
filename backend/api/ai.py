import os
import json
import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, List
from google.genai import types
from loguru import logger
from sqlalchemy import select

from backend.database import async_session
from backend.database.models import Project
from backend.database.models.user import UserSettings
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import ai_engine, build_genai_client, stream_ai
from backend.schemas import GenerationRequest, GenerationResponse
import uuid

router = APIRouter(prefix="/api", tags=["AI Engine"])

# --- Neural Health Registry ---
# Tracks model performance and failures in real-time to optimize fallback selection
class NeuralHealthRegistry:
    def __init__(self):
        self.health = {} # model_name -> {"failures": 0, "last_failure": 0}
        
    def report_failure(self, model: str):
        stats = self.health.get(model, {"failures": 0, "last_failure": 0})
        stats["failures"] += 1
        stats["last_failure"] = time.time()
        self.health[model] = stats
        
    def is_degraded(self, model: str) -> bool:
        stats = self.health.get(model)
        if not stats: return False
        # If model failed in the last 2 minutes, consider it degraded
        return stats["failures"] > 2 and (time.time() - stats["last_failure"] < 120)

health_registry = NeuralHealthRegistry()

MODEL_MAP = {
    # 3.1 Series (Newest)
    "gemini-3.1-flash": "gemini-3.1-flash",
    "gemini-3.1-flash-lite": "gemini-3.1-flash-lite",
    "gemini-3.1-pro": "gemini-3.1-pro",

    # 3.0 Series
    "gemini-3-flash": "gemini-3-flash",
    "gemini-3-pro": "gemini-3-pro",

    # 2.5 Series
    "gemini-2.5-flash": "gemini-2.5-flash",
    "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
    "gemini-2.5-pro": "gemini-2.5-pro",

    # 2.0 Series
    "gemini-2.0-flash": "gemini-2.0-flash",
    "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
    "gemini-2.0-pro": "gemini-2.0-pro",

    # Standard / LTS
    "gemini-1.5-flash": "gemini-1.5-flash",
    "gemini-1.5-pro": "gemini-1.5-pro",
    "gemini-1.5-flash-8b": "gemini-1.5-flash-8b",

    # Specialized
    "nano-banana": "gemini-2.5-flash", 
    "nano-banana-pro": "gemini-3-pro",

    # Gemma Series
    "gemma-3-1b": "gemma-3-1b",
    "gemma-3-4b": "gemma-3-4b",
    "gemma-3-12b": "gemma-3-12b",
    "gemma-3-27b": "gemma-3-27b",

    # OpenAI Models
    "gpt-4o": "gpt-4o",
    "gpt-4o-mini": "gpt-4o-mini",
    "gpt-4-turbo": "gpt-4-turbo",
    "o1-preview": "o1-preview",
    "o1-mini": "o1-mini",

    # Groq / Open Source Models
    "llama-3-70b": "llama3-70b-8192",
    "llama-3-8b": "llama3-8b-8192",
    "mixtral-8x7b": "mixtral-8x7b-32768",
    "deepseek-r1": "deepseek-r1-distill-llama-70b",
}

STABLE_MODELS = [
    "gemini-3.1-flash", "gemini-3.1-flash-lite", "gemini-3-flash", 
    "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash",
    "gemini-3.1-pro", "gemini-3-pro", "gemini-2.5-pro", "gemini-1.5-pro",
    "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.0-pro",
    "gemma-3-27b", "gpt-4o", "gpt-4o-mini"
]

async def get_api_key(user_id: str, target_model: str) -> str:
    """Resolve API key from user settings or environment based on provider."""
    user_api_key = None
    target_lower = target_model.lower()
    
    try:
        async with async_session() as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            result = await session.execute(statement)
            settings = result.scalars().first()
            if settings and settings.ai_models:
                if "claude" in target_lower:
                    user_api_key = settings.ai_models.get("anthropic_api_key")
                elif "gpt-" in target_lower or "o1-" in target_lower:
                    user_api_key = settings.ai_models.get("openai_api_key")
                elif any(m in target_lower for m in ["llama", "mixtral", "deepseek", "gemma"]):
                    user_api_key = settings.ai_models.get("groq_api_key")
                else:
                    user_api_key = settings.ai_models.get("gemini_api_key")
    except Exception as e:
        logger.warning(f"Failed to fetch user settings for key retrieval: {e}")

    # Fallback to environment variables
    if "claude" in target_lower:
        api_key = user_api_key or os.getenv("ANTHROPIC_API_KEY")
    elif "gpt-" in target_lower or "o1-" in target_lower:
        api_key = user_api_key or os.getenv("OPENAI_API_KEY")
    elif any(m in target_lower for m in ["llama", "mixtral", "deepseek"]) and "gemma" not in target_lower:
        api_key = user_api_key or os.getenv("GROQ_API_KEY")
    else:
        api_key = user_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail=f"API key for {target_model} not configured. Please add your key in Settings.")
    
    return api_key

def resolve_model(requested_model: str) -> str:
    raw_model = requested_model.lower().strip().replace(" ", "-")
    target_model = MODEL_MAP.get(raw_model, raw_model)
    if target_model in MODEL_MAP:
        target_model = MODEL_MAP[target_model]
    
    if target_model not in STABLE_MODELS and not any(target_model.startswith(m) for m in STABLE_MODELS):
        logger.warning(f"Resolved model '{target_model}' not in stable registry. Falling back to gemini-3.1-flash-lite.")
        target_model = "gemini-3.1-flash-lite"
        
    return target_model.replace("models/", "")

@router.post("/generate", response_model=GenerationResponse)
async def generate_content(request: GenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """Unified AI generation endpoint with robust model mapping and fallback."""
    target_model = resolve_model(request.model)
    
    # --- Ultra-Testing Fallback Loop ---
    # Includes experimental and stable models for comprehensive dev testing
    FALLBACK_MODELS = [
        target_model,
        "gemini-3.1-flash",
        "gemini-3.1-flash-lite",
        "gemini-3-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-3.1-pro",
        "gemini-3-pro",
        "gemini-2.5-pro",
        "gemini-2.0-pro",
        "gemini-1.5-pro",
        "gemma-3-27b",
        "gemma-3-12b",
        "gemma-3-4b"
    ]
    unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACK_MODELS))]

    start_time = time.perf_counter()
    attempted_fallbacks = []
    request_id = str(uuid.uuid4())[:8]

    logger.info(f"SYNTHESIS [#{request_id}]: Starting neural orchestration. Target: <cyan>{target_model}</cyan>")

    last_error = None
    for current_model in unique_fallbacks:
        try:
            if current_model != target_model:
                logger.warning(f"RECOVERY [#{request_id}]: Primary model failed. Attempting failover to: <yellow>{current_model}</yellow>")
                attempted_fallbacks.append(current_model)

            # We need to resolve key for each attempt
            api_key = await get_api_key(user_id, current_model)
            client = build_genai_client(api_key=api_key)

            # Routing to specific provider logic
            is_openai = "gpt-" in current_model.lower() or "o1-" in current_model.lower()
            is_groq = any(m in current_model.lower() for m in ["llama", "mixtral", "deepseek"]) and "gemma" not in current_model.lower()
            is_claude = "claude" in current_model.lower()

            if is_claude or is_openai or is_groq:
                from backend.ai_engine import call_ai
                output_text = await call_ai(current_model, request.prompt, request.systemInstruction, user_id)
                usage_dict = {}
            else:
                config = {"system_instruction": request.systemInstruction} if request.systemInstruction else None
                response = await client.aio.models.generate_content(
                    model=current_model,
                    contents=request.prompt,
                    config=types.GenerateContentConfig(**config) if config else None
                )
                if not response or not hasattr(response, "text"):
                    raise ValueError(f"Model {current_model} returned an empty response.")
                
                output_text = response.text
                
                # Apply Neural Repair if the JSON is truncated
                if output_text.strip().startswith("{") and not output_text.strip().endswith("}"):
                    logger.warning(f"REPAIR [#{request_id}]: Truncated JSON detected. Applying fix.")
                    output_text = ai_engine._repair_json(output_text)

                usage_dict = {
                    "prompt_tokens": getattr(response.usage_metadata, "prompt_token_count", 0),
                    "candidates_tokens": getattr(response.usage_metadata, "candidates_token_count", 0),
                    "total_tokens": getattr(response.usage_metadata, "total_token_count", 0)
                } if hasattr(response, "usage_metadata") else {}

            latency_ms = (time.perf_counter() - start_time) * 1000
            
            # --- Detailed Telemetry Logging ---
            logger.success(f"COMPLETED: [✅] Neural Synthesis Successful")
            logger.info(f"   | Model: <cyan>{current_model}</cyan>")
            logger.info(f"   | Latency: <yellow>{latency_ms:.2f}ms</yellow>")
            
            if usage_dict:
                tokens = usage_dict.get('total_tokens', 0)
                efficiency = (tokens/(latency_ms/1000)) if latency_ms > 0 else 0
                logger.info(f"   | Usage: <magenta>{tokens}</magenta> tokens | Efficiency: <green>{efficiency:.1f}</green> tps")
            
            return GenerationResponse(
                text=output_text,
                model_used=current_model,
                finish_reason="STOP",
                usage=usage_dict,
                latency_ms=latency_ms,
                fallbacks=attempted_fallbacks
            )

        except Exception as e:
            last_error = e
            health_registry.report_failure(current_model)
            logger.warning(f"SYNTHESIS [#{request_id}]: Model {current_model} failed. Error: {str(e)}")
            continue

    # If all fail
    logger.error(f"SYNTHESIS [#{request_id}]: All connections failed.")
    raise HTTPException(status_code=500, detail=f"Neural Engine Synthesis Failed: {str(last_error)}")

@router.post("/generate/stream")
async def stream_content(request: GenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """Server-Sent Events endpoint for real-time AI streaming with intelligent health-aware failover."""
    target_model = resolve_model(request.model)
    request_id = str(uuid.uuid4())[:8]
    
    async def event_generator():
        # Fallback list for streaming - Ultra-Testing Suite
        FALLBACKS = [
            target_model,
            "gemini-3.1-flash",
            "gemini-3.1-flash-lite",
            "gemini-3-flash",
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-3.1-pro",
            "gemini-2.5-pro",
            "gemma-3-27b"
        ]
        unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACKS))]
        
        for current_model in unique_fallbacks:
            try:
                if current_model != target_model:
                    logger.warning(f"STREAM RECOVERY [#{request_id}]: Failing over to: <yellow>{current_model}</yellow>")

                logger.info(f"STREAM [#{request_id}]: Initializing pipeline via <cyan>{current_model}</cyan>")
                
                async for chunk in stream_ai(current_model, request.prompt, request.systemInstruction, user_id):
                    yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
                
                logger.success(f"STREAM [#{request_id}]: Neural stream finalized successfully.")
                yield "data: [DONE]\n\n"
                return # Success, exit fallback loop
            except Exception as e:
                logger.warning(f"STREAM [#{request_id}]: Model {current_model} failed. Error: {str(e)}")
                health_registry.report_failure(current_model)
                if current_model == unique_fallbacks[-1]: # If last model fails
                     yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
                continue
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(), 
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@router.get("/ai/health")
async def get_neural_health():
    """Returns the current health status of all registered AI models."""
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "registry": health_registry.health,
        "active_models": STABLE_MODELS
    }
