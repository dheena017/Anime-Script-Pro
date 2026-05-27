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
# Model registries split into focused modules
from backend.lib.text_models import DEFAULT_TEXT_MODELS
from backend.lib.image_models import DEFAULT_IMAGE_MODELS
from backend.lib.video_models import DEFAULT_VIDEO_MODELS
from backend.lib.agent_models import DEFAULT_AGENT_MODELS
from backend.lib.audio_models import DEFAULT_AUDIO_MODELS

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

STABLE_MODELS = list(dict.fromkeys(
    DEFAULT_TEXT_MODELS
    + DEFAULT_IMAGE_MODELS
    + DEFAULT_VIDEO_MODELS
    + DEFAULT_AGENT_MODELS
    + DEFAULT_AUDIO_MODELS
))

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
    """Backward compatibility generate endpoint routing to Text/Agent or Image routers."""
    raw_model = request.model.lower()
    
    # Check if image request
    is_image_request = any(m in raw_model for m in [
        "imagen", "stable-diffusion", "dall-e", "flux", "midjourney", 
        "banana", "lyria", "veo", "gpt-image", "recraft", "ideogram", 
        "hugging-face", "deepai", "together", "replicate", "fal-ai", 
        "leonardo", "civitai", "gemini-3.1-flash-image", "gemini-2.5-flash-image",
        "gemini-3-pro-image"
    ])
    
    if is_image_request:
        from backend.api.image import generate_image, ImageGenerationRequest
        return await generate_image(
            request=ImageGenerationRequest(model=request.model, prompt=request.prompt, systemInstruction=request.systemInstruction),
            user_id=user_id
        )
        
    # Check if agent request
    from backend.lib.agent_models import DEFAULT_AGENT_MODELS
    is_agent = any(agent_id in raw_model for agent_id in DEFAULT_AGENT_MODELS)
    if is_agent:
        from backend.api.agent import generate_agent, AgentGenerationRequest
        return await generate_agent(
            request=AgentGenerationRequest(model=request.model, prompt=request.prompt, systemInstruction=request.systemInstruction, stream=False),
            user_id=user_id
        )
        
    # Standard text request
    from backend.api.text import generate_text, TextGenerationRequest
    return await generate_text(
        request=TextGenerationRequest(model=request.model, prompt=request.prompt, systemInstruction=request.systemInstruction, stream=False),
        user_id=user_id
    )

@router.post("/generate/image")
async def generate_image_endpoint(request: ImageRequest, user_id: str = Depends(get_auth_user_id)):
    """Backward compatibility image endpoint."""
    from backend.api.image import generate_image, ImageGenerationRequest
    return await generate_image(
        request=ImageGenerationRequest(model=request.model, prompt=request.prompt),
        user_id=user_id
    )

@router.post("/generate/stream")
async def stream_content(request: GenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """Backward compatibility stream endpoint."""
    # Check if agent request
    raw_model = request.model.lower()
    from backend.lib.agent_models import DEFAULT_AGENT_MODELS
    is_agent = any(agent_id in raw_model for agent_id in DEFAULT_AGENT_MODELS)
    if is_agent:
        from backend.api.agent import generate_agent, AgentGenerationRequest
        return await generate_agent(
            request=AgentGenerationRequest(model=request.model, prompt=request.prompt, systemInstruction=request.systemInstruction, stream=True),
            user_id=user_id
        )
        
    from backend.api.text import generate_text, TextGenerationRequest
    return await generate_text(
        request=TextGenerationRequest(model=request.model, prompt=request.prompt, systemInstruction=request.systemInstruction, stream=True),
        user_id=user_id
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
