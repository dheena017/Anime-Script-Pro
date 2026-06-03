"""
Anime Script Pro — Core AI API Router

This router serves as the central API orchestration layer for AI tasks.
It provides backward compatibility endpoints that dynamically route incoming text,
image, and agent generation requests to their specialized routers, resolves API keys,
and maintains a real-time Neural Health Registry.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Pydantic Schemas & Neural Health Registry
  5. API Router Initialization
  6. Helper Utilities
  7. API Endpoints
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from anthropic.types.beta import beta_request_document_block_param
from anthropic.types.beta import beta_request_document_block_param
from datetime import datetime
import json
import os
import re
import time
from typing import Dict, List, Optional
import uuid

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from loguru import logger
from pydantic import BaseModel
from sqlalchemy import select

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import (
    AIEngine,
    ai_engine,
    create_gemini_client,
    resolve_engine_model,
    stream_ai_text,
)
from backend.database import async_session
from backend.database.models import Project
from backend.database.models.user import UserBalance, UserSettings
from backend.lib.agent_models import DEFAULT_AGENT_MODELS
from backend.lib.audio_models import DEFAULT_AUDIO_MODELS
from backend.lib.defaults import DEFAULT_SCRIPT_MODEL, MODEL_MAP, STABLE_MODELS
from backend.lib.image_models import DEFAULT_IMAGE_MODELS
from backend.lib.video_models import DEFAULT_VIDEO_MODELS
from backend.schemas import GenerationRequest, GenerationResponse
from backend.utils.deps import get_auth_user_id

# ==============================================================================
# 4. PYDANTIC SCHEMAS & NEURAL HEALTH REGISTRY
# ==============================================================================

class ImageRequest(BaseModel):
    """Pydantic schema for backward-compatible image generation requests."""
    prompt: str
    model: str = "stable-image/generate/core"


class VideoRequest(BaseModel):
    """Pydantic schema for backward-compatible video generation requests."""
    prompt: str
    model: str = "veo-2.0-generate-001"
    duration: int = 6
    provider: Optional[str] = None
    image_url: Optional[str] = None


class NeuralHealthRegistry:
    """Tracks model performance and failures in real-time.

    Allows the application to optimize model selection and gracefully trigger
    fallback models if a particular engine is degraded.
    """

    def __init__(self) -> None:
        """Initialize the health registry database dict."""
        self.health: Dict[str, Dict[str, float]] = {}  # model_name -> {"failures": 0, "last_failure": 0}

    def report_failure(self, model: str) -> None:
        """Report a failure occurrence for a specific model to track degradation.

        Args:
            model: The name/identifier of the degraded model.
        """
        stats = self.health.get(model, {"failures": 0, "last_failure": 0})
        stats["failures"] += 1
        stats["last_failure"] = time.time()
        self.health[model] = stats

    def report_success(self, model: str) -> None:
        """Reset failures count for a model when a successful inference completes.

        Args:
            model: The name/identifier of the model.
        """
        stats = self.health.get(model)
        if stats and stats["failures"] > 0:
            stats["failures"] = 0
            self.health[model] = stats

    def is_degraded(self, model: str) -> bool:
        """Check if a model is considered degraded due to high recent failures.

        Args:
            model: The name/identifier of the model.

        Returns:
            bool: True if the model failed > 2 times within the last 2 minutes.
        """
        stats = self.health.get(model)
        if not stats:
            return False
        # If model failed in the last 2 minutes, consider it degraded
        return stats["failures"] > 2 and (time.time() - stats["last_failure"] < 120)


health_registry = NeuralHealthRegistry()

# ==============================================================================
# 5. API ROUTER INITIALIZATION
# ==============================================================================
router = APIRouter(prefix="/api", tags=["AI Engine"])

# ==============================================================================
# 6. HELPER UTILITIES
# ==============================================================================

async def get_api_key(user_id: str, target_model: str) -> str:
    """Resolve the API key from user settings or environment based on provider and mode.
    
    Dynamically classifies model tier (Free vs. Paid/Premium) and handles
    billing deduction or custom keys verification.

    Args:
        user_id: The authenticated user's ID.
        target_model: The resolved, SDK-safe target model identifier.

    Returns:
        str: The verified API key for standard or custom provider execution.

    Raises:
        HTTPException(402): If standard credits are insufficient or premium limits hit.
        HTTPException(500): If API key is not configured at all.
    """
    user_api_key = None
    target_lower = target_model.lower()
    mode = "free"

    # Identify premium models dynamically (requires credit deduction or custom keys)
    # Premium models are heavy/reasoning models (pro, ultra, large, turbo, 70b, o1, standard GPT-4/Claude)
    # excluding lightweight versions (mini, lite, flash, haiku).
    is_premium = (
        any(term in target_lower for term in ["-pro", "-ultra", "large", "turbo", "70b", "o1-", "gpt-4", "claude"])
        and not any(term in target_lower for term in ["mini", "lite", "flash", "haiku"])
    )

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
                detail=(
                    f"Model '{target_model}' is a premium model. Premium models require Paid Mode "
                    f"or a custom API key. Please switch to Paid Mode or configure your own API key in settings."
                ),
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
                                detail=(
                                    f"Insufficient credits (Requires {required_credits} credits). "
                                    f"Please configure your own API key in settings or top up your credit ledger."
                                ),
                            )

                        # Process transaction
                        balance.credits -= required_credits
                        session.add(balance)
                        await session.commit()
                        logger.info(
                            f"AI LEDGER: Transaction successful. Deducted {required_credits} credits from "
                            f"user {user_id} for '{target_model}'. Remaining: {balance.credits}"
                        )
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
    elif (
        any(m in target_lower for m in ["llama", "mixtral", "deepseek"])
        and "gemma" not in target_lower
        and "nvidia" not in target_lower
        and "meta/" not in target_lower
    ):
        api_key = user_api_key or os.getenv("GROQ_API_KEY")
    elif "nvidia" in target_lower or "meta/" in target_lower or "nemotron" in target_lower:
        api_key = user_api_key or os.getenv("NVIDIA_API_KEY")
    else:
        api_key = (
            user_api_key
            or os.getenv("GOOGLE_API_KEY")
            or os.getenv("VITE_GEMINI_API_KEY")
            or os.getenv("GEMINI_API_KEY")
        )

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=f"API key for {target_model} not configured. Please add your key in Settings.",
        )

    return api_key

# ==============================================================================
# 7. API ENDPOINTS
# ==============================================================================

@router.post("/generate", response_model=GenerationResponse)
async def generate_content(
    request: GenerationRequest,
    user_id: str = Depends(get_auth_user_id),
) -> GenerationResponse:
    """Backward compatibility generate endpoint routing to Text/Agent or Image routers.

    Performs dynamic request analysis and forwards execution to the target endpoint.
    Lazy/inline imports are utilized to prevent circular import chains.
    """
    raw_model = request.model.lower()

    # Check if image request
    is_image_request = (
        raw_model in DEFAULT_IMAGE_MODELS
        or raw_model in DEFAULT_VIDEO_MODELS
        or any(m in raw_model for m in DEFAULT_IMAGE_MODELS)
        or any(m in raw_model for m in DEFAULT_VIDEO_MODELS)
        or any(
            kw in raw_model
            for kw in ["imagen", "stable-diffusion", "dall-e", "flux", "midjourney", "veo", "banana", "lyria"]
        )
    )

    if is_image_request:
        # Inline lazy imports prevent circular dependency loops
        from backend.api.image import generate_image, ImageGenerationRequest
        return await generate_image(
            request=ImageGenerationRequest(
                model=request.model,
                prompt=request.prompt,
                systemInstruction=request.systemInstruction,
            ),
            user_id=user_id,
        )

    # Check if agent request
    is_agent = any(agent_id in raw_model for agent_id in DEFAULT_AGENT_MODELS)
    if is_agent:
        # Inline lazy imports prevent circular dependency loops
        from backend.api.agent import generate_agent, AgentGenerationRequest
        return await generate_agent(
            request=AgentGenerationRequest(
                model=request.model,
                prompt=request.prompt,
                systemInstruction=request.systemInstruction,
                stream=False,
            ),
            user_id=user_id,
        )

    # Standard text request
    # Inline lazy imports prevent circular dependency loops
    from backend.api.text import generate_text, TextGenerationRequest
    return await generate_text(
        request=TextGenerationRequest(
            model=request.model,
            prompt=request.prompt,
            systemInstruction=request.systemInstruction,
            stream=False,
        ),
        user_id=user_id,
    )


@router.post("/generate/image")
async def generate_image_endpoint(
    request: ImageRequest,
    user_id: str = Depends(get_auth_user_id),
):
    """Backward compatibility image endpoint forwarding to the specialized image router."""
    # Inline lazy imports prevent circular dependency loops
    from backend.api.image import generate_image, ImageGenerationRequest
    return await generate_image(
        request=ImageGenerationRequest(model=request.model, prompt=request.prompt),
        user_id=user_id,
    )


@router.post("/video")
async def generate_video_endpoint(
    request: VideoRequest,
    user_id: str = Depends(get_auth_user_id),
):
    """Backward compatibility video endpoint used by the storyboard scene render UI.

    Orchestrates live cloud rendering via Veo 3.1 Fast Generate on Google GenAI,
    falling back to a premium local rendering compiler when cloud providers are unconfigured.
    """
    logger.info(
        "VIDEO COMPAT: render requested by %s | model=%s | provider=%s | duration=%s | has_image=%s",
        user_id,
        request.model,
        request.provider or "default",
        request.duration,
        bool(request.image_url),
    )

    # 1. Attempt Live Cloud Veo Generation
    api_key = None
    try:
        api_key = await get_api_key(user_id, "veo-3.1-fast-generate-preview")
    except Exception as key_err:
        logger.info(f"VIDEO ENDPOINT: Could not resolve cloud API key for Veo: {key_err}. Falling back to local rendering.")

    if api_key and ("veo" in request.model.lower() or request.provider in ("gemini", "google")):
        logger.info("VIDEO ENDPOINT: Dispatching live cloud Veo generation via Google GenAI...")
        try:
            import asyncio
            from google import genai
            from google.genai import types
            from pathlib import Path

            client = genai.Client(
                http_options={"api_version": "v1beta"},
                api_key=api_key,
            )

            veo_model = request.model
            # Map legacy or unset models to Veo 3.1 Fast Generate Preview
            if not veo_model or veo_model in ("veo-2.0-generate-001", "default"):
                veo_model = "veo-3.1-fast-generate-preview"

            video_config = types.GenerateVideosConfig(
                person_generation="dont_allow",
                aspect_ratio="16:9",
                number_of_videos=1,
                duration_seconds=request.duration or 6,
                resolution="720p",
            )

            # Offload blocking client request to background worker thread
            def _start_operation():
                return client.models.generate_videos(
                    model=veo_model,
                    source=types.VideoGenerationSource(
                        prompt=request.prompt,
                    ),
                    config=video_config,
                )

            operation = await asyncio.to_thread(_start_operation)

            # Async polling loop keeps server responsive
            poll_count = 0
            while not operation.done:
                poll_count += 1
                logger.info(f"VIDEO ENDPOINT: Veo video is generating. Polling again in 10s (attempt {poll_count})...")
                await asyncio.sleep(10)
                
                def _get_operation():
                    return client.operations.get(operation)
                operation = await asyncio.to_thread(_get_operation)

            result = operation.result
            if not result or not result.generated_videos:
                raise ValueError("Veo service returned empty generation results.")

            generated_video = result.generated_videos[0]
            
            # Save downloaded video file into backend outputs folder
            backend_root = Path(__file__).parent.resolve().parent
            out_dir = backend_root / "outputs" / "video"
            out_dir.mkdir(parents=True, exist_ok=True)
            
            filename = f"veo-compile-{int(time.time())}-{hash(request.prompt) % 10000}.mp4"
            dest = out_dir / filename

            def _download_video():
                try:
                    client.files.download(file=generated_video.video)
                    generated_video.video.save(str(dest))
                except Exception:
                    # Fallback to direct bytes writing if custom save() fails
                    content = client.files.download(file=generated_video.video)
                    with open(dest, "wb") as f:
                        f.write(content)

            await asyncio.to_thread(_download_video)
            
            logger.success(f"VIDEO ENDPOINT: Live Veo video generated successfully: /outputs/video/{filename}")
            return {
                "success": True,
                "videoUrl": f"/outputs/video/{filename}",
                "message": f"Veo video generated successfully via model {veo_model}."
            }
        except Exception as cloud_err:
            logger.warning(f"VIDEO ENDPOINT: Cloud Veo generation encountered an error: {cloud_err}. Failing over to local renderer...")

    # 2. Local Rendering Fallback (Pillow + NumPy + MoviePy)
    try:
        from backend.utils.video_generator import compile_local_scene_video
        video_url = await compile_local_scene_video(
            prompt=request.prompt,
            image_url=request.image_url,
            duration=request.duration or 4
        )
        return {
            "success": True,
            "videoUrl": video_url,
            "message": "Local neural video compiled successfully."
        }
    except Exception as e:
        logger.error(f"LOCAL VIDEO: Local compilation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Local neural video engine failed: {str(e)}"
        )


@router.post("/generate/stream")
async def stream_content(
    request: GenerationRequest,
    user_id: str = Depends(get_auth_user_id),
):
    """Backward compatibility stream endpoint forwarding to specialized agent or text routers."""
    # Check if agent request
    raw_model = request.model.lower()
    is_agent = any(agent_id in raw_model for agent_id in DEFAULT_AGENT_MODELS)
    if is_agent:
        # Inline lazy imports prevent circular dependency loops
        from backend.api.agent import generate_agent, AgentGenerationRequest
        return await generate_agent(
            request=AgentGenerationRequest(
                model=request.model,
                prompt=request.prompt,
                systemInstruction=request.systemInstruction,
                stream=True,
            ),
            user_id=user_id,
        )

    # Inline lazy imports prevent circular dependency loops
    from backend.api.text import generate_text, TextGenerationRequest
    return await generate_text(
        request=TextGenerationRequest(
            model=request.model,
            prompt=request.prompt,
            systemInstruction=request.systemInstruction,
            stream=True,
        ),
        user_id=user_id,
    )


@router.get("/ai/health")
async def get_neural_health() -> dict:
    """Return the current health status of all registered AI models.

    Includes failure registry tracking details and recognized stable models list.
    """
    return {
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "registry": health_registry.health,
        "active_models": STABLE_MODELS,
    }
