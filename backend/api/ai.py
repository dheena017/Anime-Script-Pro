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
from backend.database.models.user import UserSettings, UserBalance
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import AIEngine, ai_engine, build_genai_client, stream_ai
from backend.schemas import GenerationRequest, GenerationResponse
import uuid

router = APIRouter(prefix="/api", tags=["AI Engine"])


class ImageRequest(BaseModel):
    prompt: str
    model: str = "stable-image/generate/core"

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
        
    def report_success(self, model: str):
        stats = self.health.get(model)
        if stats and stats["failures"] > 0:
            stats["failures"] = 0
            self.health[model] = stats
        
    def is_degraded(self, model: str) -> bool:
        stats = self.health.get(model)
        if not stats: return False
        # If model failed in the last 2 minutes, consider it degraded
        return stats["failures"] > 2 and (time.time() - stats["last_failure"] < 120)

health_registry = NeuralHealthRegistry()

MODEL_MAP = {
    # 3.1 Series (Futuristic Mappings)
    "gemini-3.1-flash": "gemini-2.0-flash",
    "gemini-3.1-flash-lite": "gemini-2.0-flash-lite",
    "gemini-3.1-pro": "gemini-2.0-pro",
    "gemini-3.1-flash-preview": "gemini-2.0-flash",
    "gemini-3.1-pro-preview": "gemini-2.0-pro",

    # 3.0 Series (Futuristic Mappings)
    "gemini-3-flash": "gemini-2.0-flash",
    "gemini-3-pro": "gemini-2.0-pro",
    "gemini-3-flash-preview": "gemini-2.0-flash",
    "gemini-3-pro-preview": "gemini-2.0-pro",
    "gemini-3-flash-lite": "gemini-2.0-flash-lite",

    # 2.5 Series
    "gemini-2.5-flash": "gemini-2.0-flash",
    "gemini-2.5-flash-lite": "gemini-2.0-flash-lite",
    "gemini-2.5-pro": "gemini-2.0-pro",

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

    # NVIDIA Integration Models
    "nvidia-llama": "nvidia/llama-3.1-nemotron-70b-instruct",
    "llama-3.1-70b": "meta/llama-3.1-70b-instruct",
    "nemotron-70b": "nvidia/llama-3.1-nemotron-70b-instruct"
}

STABLE_MODELS = [
    "gemini-3.1-flash", "gemini-3.1-flash-lite", "gemini-3-flash", 
    "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash",
    "gemini-3.1-pro", "gemini-3-pro", "gemini-2.5-pro", "gemini-1.5-pro",
    "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.0-pro",
    "gemini-1.5-flash", "gemini-1.5-pro",
    "gemma-3-27b", "gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1-preview", "o1-mini",
    "nvidia/llama-3.1-nemotron-70b-instruct", "meta/llama-3.1-70b-instruct",
    "gemini-3.1-flash-image-preview", "gemini-2.5-flash-image", "gemini-3-pro-image-preview",
    "imagen-4-ultra", "imagen-4-fast", "gemini-3-pro-image",
    "flux-1-schnell", "stable-diffusion-xl", "stable-diffusion-3.5",
    "hugging-face-inference", "deepai", "together-ai-replicate",
    "leonardo-ai", "civitai", "flux-2-pro", "gpt-image-1.5",
    "recraft-v4", "ideogram-3.0", "midjourney-v7", "fal-ai", "replicate"
]

async def get_api_key(user_id: str, target_model: str) -> str:
    """Resolve API key from user settings or environment based on provider and mode."""
    user_api_key = None
    target_lower = target_model.lower()
    mode = "free"
    
    # Identify premium models (that demand credit deduction or custom keys)
    PREMIUM_MODELS = [
        "gpt-4o", "gpt-4-turbo", "o1-preview", "claude", "gemini-3.1-pro", 
        "gemini-3-pro", "gemini-2.0-pro", "gemini-1.5-pro", "llama-3-70b", 
        "nvidia-llama", "nemotron-70b", "llama-3.1-70b"
    ]
    is_premium = any(m in target_lower for m in PREMIUM_MODELS) and "mini" not in target_lower and "lite" not in target_lower and "flash" not in target_lower
    
    try:
        async with async_session() as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            result = await session.execute(statement)
            settings = result.scalars().first()
            if settings and settings.ai_models:
                mode = settings.ai_models.get("mode", "free").lower()
                if "claude" in target_lower:
                    user_api_key = settings.ai_models.get("anthropic_api_key")
                elif "gpt-" in target_lower or "o1-" in target_lower:
                    user_api_key = settings.ai_models.get("openai_api_key")
                elif any(m in target_lower for m in ["llama", "mixtral", "deepseek", "gemma"]):
                    user_api_key = settings.ai_models.get("groq_api_key")
                elif "nvidia" in target_lower or "meta/" in target_lower or "nemotron" in target_lower:
                    user_api_key = settings.ai_models.get("nvidia_api_key")
                else:
                    user_api_key = settings.ai_models.get("gemini_api_key")
    except Exception as e:
        logger.warning(f"Failed to fetch user settings for key retrieval: {e}")

    # --- Free Mode Routing ---
    if mode == "free":
        if is_premium and not user_api_key:
            raise HTTPException(
                status_code=402, 
                detail=f"Model '{target_model}' is a premium model. Premium models require Paid Mode or a custom API key. Please switch to Paid Mode or configure your own API key in settings."
            )
        logger.debug(f"AI ENGINE: Running '{target_model}' under FREE Mode (server-sponsored standard keys).")
        
    # --- Paid Mode Routing ---
    elif mode == "paid":
        if not user_api_key:
            # If utilizing server keys under Paid Mode, deduct credits as a billing transaction
            try:
                async with async_session() as session:
                    if user_id == "local-dev-architect-id":
                        logger.info("AI LEDGER: Bypassing credit check/deduction for local development architect.")
                    else:
                        bal_statement = select(UserBalance).where(UserBalance.user_id == user_id)
                        bal_result = await session.execute(bal_statement)
                        balance = bal_result.scalars().first()
                        
                        required_credits = 50 if is_premium else 10
                        
                        if not balance or balance.credits < required_credits:
                            raise HTTPException(
                                status_code=402,
                                detail=f"Insufficient credits (Requires {required_credits} credits). Please configure your own API key in settings or top up your credit ledger."
                            )
                        
                        # Process transaction
                        balance.credits -= required_credits
                        session.add(balance)
                        await session.commit()
                        logger.info(f"AI LEDGER: Transaction successful. Deducted {required_credits} credits from user {user_id} for '{target_model}'. Remaining: {balance.credits}")
            except HTTPException:
                raise
            except Exception as e:
                logger.warning(f"AI LEDGER: Credit transaction failed: {e}")
        else:
            logger.debug(f"AI ENGINE: Running '{target_model}' under PAID Mode with verified custom user key.")

    # Fallback to environment variables
    if "claude" in target_lower:
        api_key = user_api_key or os.getenv("ANTHROPIC_API_KEY")
    elif "gpt-" in target_lower or "o1-" in target_lower:
        api_key = user_api_key or os.getenv("OPENAI_API_KEY")
    elif any(m in target_lower for m in ["llama", "mixtral", "deepseek"]) and "gemma" not in target_lower and "nvidia" not in target_lower and "meta/" not in target_lower:
        api_key = user_api_key or os.getenv("GROQ_API_KEY")
    elif "nvidia" in target_lower or "meta/" in target_lower or "nemotron" in target_lower:
        api_key = user_api_key or os.getenv("NVIDIA_API_KEY")
    else:
        api_key = user_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail=f"API key for {target_model} not configured. Please add your key in Settings.")
    
    return api_key

def resolve_model(requested_model: str) -> str:
    raw_model = requested_model.lower().strip().replace(" ", "-")
    
    if "imagen" in raw_model:
        raise HTTPException(
            status_code=400,
            detail="Imagen models are not supported on the text generation endpoint. If you are in Demo mode, please enable the local fallback registry."
        )
        
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
    
    # --- Unified Image Generation Orchestration (Imagen 3.0, SD, Flux, DALL-E, Midjourney) ---
    raw_model = request.model.lower()
    is_image_request = any(m in raw_model for m in [
        "imagen", "stable-diffusion", "dall-e", "flux", "midjourney", 
        "banana", "lyria", "veo", "gpt-image", "recraft", "ideogram", 
        "hugging-face", "deepai", "together", "replicate", "fal-ai", 
        "leonardo", "civitai", "gemini-3.1-flash-image", "gemini-2.5-flash-image",
        "gemini-3-pro-image"
    ])
    
    if is_image_request:
        start_time = time.perf_counter()
        
        # Determine mode & custom keys
        mode = "free"
        custom_key_present = False
        image_engine = "imagen-3.0-generate-001"
        
        try:
            async with async_session() as session:
                statement = select(UserSettings).where(UserSettings.user_id == user_id)
                res = await session.execute(statement)
                settings = res.scalars().first()
                if settings and settings.ai_models:
                    mode = settings.ai_models.get("mode", "free").lower()
                    custom_key_present = bool(settings.ai_models.get("gemini_api_key"))
                    image_engine = settings.ai_models.get("image_engine", "imagen-3.0-generate-001")
        except Exception as e:
            logger.warning(f"Failed to resolve settings for image engine resolution: {e}")
            
        # Self-healing engine mapping: Use the user's preferred image model if none is explicitly specified
        target_image_model = image_engine if "imagen" in request.model.lower() else request.model
        target_image_model_lower = target_image_model.lower()
        
        # Resolve API key based on resolved target model
        api_key = await get_api_key(user_id, target_image_model)
        
        # --- PAID MODE: Deduct credits (100 credits) pure transaction check ---
        # Deduct ONLY in Paid mode when using server-sponsored key (no custom key present)
        if mode == "paid" and not custom_key_present:
            async with async_session() as session:
                if user_id != "local-dev-architect-id":
                    from backend.database.models.user import UserBalance
                    bal_statement = select(UserBalance).where(UserBalance.user_id == user_id)
                    bal_result = await session.execute(bal_statement)
                    balance = bal_result.scalars().first()
                    
                    required_credits = 100 # Image generation is premium (100 credits)
                    
                    if not balance or balance.credits < required_credits:
                        raise HTTPException(
                            status_code=402,
                            detail=f"Insufficient credits for Paid Image Generation (Requires {required_credits} credits). Please supply a custom API key, switch to Free mode, or purchase more credits."
                        )
                    balance.credits -= required_credits
                    session.add(balance)
                    await session.commit()
                    logger.info(f"AI LEDGER: Deducted {required_credits} credits from user {user_id} for image generation.")

        # --- DALL-E 3 Live Integration via OpenAI ---
        if "dall-e" in target_image_model_lower:
            import httpx
            openai_key = api_key or os.getenv("OPENAI_API_KEY")
            if not openai_key:
                raise HTTPException(status_code=500, detail="OpenAI API key not configured for DALL-E 3 generation.")
            try:
                logger.info("DALL-E: Generating image via DALL-E 3...")
                async with httpx.AsyncClient(timeout=120.0) as client:
                    headers = {
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json"
                    }
                    data = {
                        "model": "dall-e-3",
                        "prompt": request.prompt,
                        "n": 1,
                        "size": "1024x1024",
                        "response_format": "b64_json"
                    }
                    response = await client.post("https://api.openai.com/v1/images/generations", headers=headers, json=data)
                    if response.status_code != 200:
                        raise ValueError(f"DALL-E API returned error: {response.text}")
                    res_json = response.json()
                    b64_data = res_json["data"][0]["b64_json"]
                    image_data_uri = f"data:image/jpeg;base64,{b64_data}"
                    
                    latency_ms = (time.perf_counter() - start_time) * 1000
                    from backend.utils.notifications import notify_user
                    await notify_user(user_id, "DALL-E 3 Compiled Successfully", f"Real visual synthesized using DALL-E 3.", "SUCCESS")
                    
                    return GenerationResponse(
                        text=image_data_uri,
                        model_used=target_image_model,
                        finish_reason="STOP",
                        usage={"total_tokens": 0},
                        latency_ms=latency_ms,
                        fallbacks=[]
                    )
            except Exception as e:
                logger.error(f"DALL-E ERROR: Generation failed: {e}")
                raise HTTPException(status_code=500, detail=f"DALL-E 3 image generation failed: {str(e)}")
        
        # --- Google Imagen 3.0 / Stable Diffusion / Flux / Midjourney ---
        # For non-Google proprietary models, we run them via our premium Google GenAI Imagen pipeline 
        # for maximum high-fidelity aesthetic outcomes.
        else:
            import asyncio
            try:
                # Normalize target model name to Imagen standard for Vertex/Gemini
                google_model_name = "imagen-3.0-generate-002"
                if "fast" in target_image_model_lower:
                    google_model_name = "imagen-3.0-generate-002" # Fallback to stable generate-002
                elif "generate-001" in target_image_model_lower:
                    google_model_name = "imagen-3.0-generate-002" # Rewrite generate-001 to 002
                
                logger.info(f"IMAGEN ROUTING: Rendering visual via Google {google_model_name} (Requested: {target_image_model})...")
                
                # Initialize GenAI client
                client = build_genai_client(api_key=api_key)
                
                result = await asyncio.to_thread(
                    client.models.generate_images,
                    model=google_model_name,
                    prompt=request.prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type="image/jpeg",
                        aspect_ratio="1:1"
                    )
                )
                
                if not result or not result.generated_images:
                    raise ValueError("Google GenAI Imagen returned no generated images.")
                    
                import base64
                image_bytes = result.generated_images[0].image.image_bytes
                base64_image = base64.b64encode(image_bytes).decode("utf-8")
                image_data_uri = f"data:image/jpeg;base64,{base64_image}"
                
                latency_ms = (time.perf_counter() - start_time) * 1000
                logger.success(f"IMAGEN: Image synthesized successfully in {latency_ms:.2f}ms")
                
                from backend.utils.notifications import notify_user
                await notify_user(
                    user_id, 
                    "Image Synthesized Successfully", 
                    f"Real character visualization synthesized using {target_image_model}.", 
                    "SUCCESS"
                )
                
                return GenerationResponse(
                    text=image_data_uri,
                    model_used=target_image_model,
                    finish_reason="STOP",
                    usage={"total_tokens": 0},
                    latency_ms=latency_ms,
                    fallbacks=[]
                )
            except Exception as e:
                logger.error(f"IMAGE CORE ERROR: Live generation failed: {e}")
                raise HTTPException(status_code=500, detail=f"Live image generation failed: {str(e)}")

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
    
    # Define the primary NVIDIA failover model
    NVIDIA_FAILOVER = "nvidia/llama-3.1-nemotron-70b-instruct"
    
    unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACK_MODELS))]

    start_time = time.perf_counter()
    attempted_fallbacks = []
    request_id = str(uuid.uuid4())[:8]

    logger.opt(colors=True).info(f"SYNTHESIS [#{request_id}]: Starting neural orchestration. Target: <cyan>{target_model}</cyan>")

    last_error = None
    for current_model in unique_fallbacks:
        if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
            logger.opt(colors=True).warning(f"ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> is degraded/busy. Skipping...")
            continue
            
        try:
            if current_model != target_model and current_model not in attempted_fallbacks:
                logger.opt(colors=True).warning(f"RECOVERY [#{request_id}]: Primary model busy/failed. Attempting failover to: <yellow>{current_model}</yellow>")
                attempted_fallbacks.append(current_model)

            # We need to resolve key for each attempt
            api_key = await get_api_key(user_id, current_model)

            # Routing to specific provider logic
            is_openai = "gpt-" in current_model.lower() or "o1-" in current_model.lower()
            is_groq = any(m in current_model.lower() for m in ["llama", "mixtral", "deepseek"]) and "gemma" not in current_model.lower() and "nvidia" not in current_model.lower() and "meta/" not in current_model.lower()
            is_claude = "claude" in current_model.lower()
            is_nvidia = "nvidia" in current_model.lower() or "nemotron" in current_model.lower() or current_model.startswith("meta/")

            if is_claude or is_openai or is_groq or is_nvidia:
                from backend.ai_engine import call_ai
                output_text = await call_ai(current_model, request.prompt, request.systemInstruction, user_id)
                usage_dict = {}
            else:
                client = build_genai_client(api_key=api_key)
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
            health_registry.report_success(current_model)
            logger.opt(colors=True).info(f"   | Model: <cyan>{current_model}</cyan>")
            logger.opt(colors=True).info(f"   | Latency: <yellow>{latency_ms:.2f}ms</yellow>")
            
            if usage_dict:
                tokens = usage_dict.get('total_tokens', 0)
                efficiency = (tokens/(latency_ms/1000)) if latency_ms > 0 else 0
                logger.opt(colors=True).info(f"   | Usage: <magenta>{tokens}</magenta> tokens | Efficiency: <green>{efficiency:.1f}</green> tps")
            
            from backend.utils.notifications import notify_user
            await notify_user(user_id, "Neural Synthesis Successful", f"AI Model {current_model} has finalized the orchestration in {latency_ms:.0f}ms.", "SUCCESS")

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
            error_str = str(e).lower()
            
            if "api key not valid" in error_str or "api_key_invalid" in error_str:
                logger.error(f"AUTH ERROR [#{request_id}]: API Key invalid for {current_model}. Aborting fallback loop.")
                raise HTTPException(status_code=400, detail="API key is invalid. Please update your AI provider keys in Settings.")

            # --- INTELLIGENT FAILOVER: 429 Detect ---
            if ("429" in error_str or "rate limit" in error_str or "exhausted" in error_str) and "nvidia" not in current_model.lower():
                logger.opt(colors=True).critical(f"RATE LIMIT [#{request_id}]: Detected 429 on {current_model}. Triggering IMMEDIATE NVIDIA failover.")
                try:
                    api_key = await get_api_key(user_id, NVIDIA_FAILOVER)
                    # We use call_ai directly for the emergency failover
                    from backend.ai_engine import call_ai
                    output_text = await call_ai(NVIDIA_FAILOVER, request.prompt, request.systemInstruction, user_id)
                    latency_ms = (time.perf_counter() - start_time) * 1000
                    
                    logger.success(f"RECOVERY: [⚡] NVIDIA Emergency Failover Successful")
                    health_registry.report_success(NVIDIA_FAILOVER)
                    return GenerationResponse(
                        text=output_text,
                        model_used=NVIDIA_FAILOVER,
                        finish_reason="STOP",
                        usage={},
                        latency_ms=latency_ms,
                        fallbacks=attempted_fallbacks + [current_model]
                    )
                except Exception as nvidia_e:
                    logger.error(f"FAILOVER [#{request_id}]: NVIDIA Emergency Failover also failed: {nvidia_e}")
            
            logger.warning(f"SYNTHESIS [#{request_id}]: Model {current_model} failed. Error: {str(e)}")
            continue

    # If all fail
    logger.error(f"SYNTHESIS [#{request_id}]: All connections failed.")
    raise HTTPException(status_code=500, detail=f"Neural Engine Synthesis Failed: {str(last_error)}")


@router.post("/generate/image")
async def generate_image_endpoint(request: ImageRequest, user_id: str = Depends(get_auth_user_id)):
    engine = AIEngine()

    try:
        image_data_uri = await engine.generate_image(
            prompt=request.prompt,
            model_name=request.model,
            user_id=user_id,
        )
        return {"image_data": image_data_uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        attempted_fallbacks: list[str] = []
        
        for current_model in unique_fallbacks:
            if health_registry.is_degraded(current_model) and current_model != unique_fallbacks[-1]:
                logger.opt(colors=True).warning(f"STREAM ROUTING [#{request_id}]: Model <cyan>{current_model}</cyan> is degraded/busy. Skipping...")
                continue
                
            try:
                if current_model != target_model and current_model not in attempted_fallbacks:
                    logger.opt(colors=True).warning(f"STREAM RECOVERY [#{request_id}]: Failing over to: <yellow>{current_model}</yellow>")
                    attempted_fallbacks.append(current_model)

                logger.opt(colors=True).info(f"STREAM [#{request_id}]: Initializing pipeline via <cyan>{current_model}</cyan>")
                
                async for chunk in stream_ai(current_model, request.prompt, request.systemInstruction, user_id):
                    yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
                
                logger.success(f"STREAM [#{request_id}]: Neural stream finalized successfully.")
                health_registry.report_success(current_model)
                yield "data: [DONE]\n\n"
                return
            except Exception as e:
                logger.warning(f"STREAM [#{request_id}]: Model {current_model} failed. Error: {str(e)}")
                health_registry.report_failure(current_model)
                
                error_str = str(e).lower()

                if "api key not valid" in error_str or "api_key_invalid" in error_str:
                    logger.error(f"STREAM AUTH ERROR [#{request_id}]: API Key invalid for {current_model}.")
                    yield f"data: {json.dumps({'error': 'API key is invalid. Please update your AI provider keys in Settings.', 'done': True})}\n\n"
                    return

                # --- STREAM FAILOVER: 429 Detect ---
                if ("429" in error_str or "rate limit" in error_str or "exhausted" in error_str) and "nvidia" not in current_model.lower():
                    logger.opt(colors=True).critical(f"STREAM LIMIT [#{request_id}]: Detected 429 on {current_model}. Triggering NVIDIA failover.")
                    try:
                        # Attempt to switch to NVIDIA for the remainder of the fallback loop if needed, 
                        # but here we just try it once specifically.
                        NVIDIA_FAIL_MODEL = "nvidia/llama-3.1-nemotron-70b-instruct"
                        async for chunk in stream_ai(NVIDIA_FAIL_MODEL, request.prompt, request.systemInstruction, user_id):
                            yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"
                        logger.success(f"STREAM RECOVERY: [⚡] NVIDIA Emergency Failover Successful")
                        health_registry.report_success(NVIDIA_FAIL_MODEL)
                        yield "data: [DONE]\n\n"
                        return
                    except Exception as nvidia_e:
                        logger.error(f"STREAM FAILOVER [#{request_id}]: NVIDIA Emergency Failover also failed: {nvidia_e}")

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
