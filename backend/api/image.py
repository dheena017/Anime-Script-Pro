"""
Anime Script Pro — Image Generation Router

This router manages visual synthesis endpoints, orchestrating image generation across
DALL-E 3, Google Imagen 3, Stable Diffusion, SDXL, and Flux models. It handles user settings,
billing verification, custom vs free mode routing, and payload serialization.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Pydantic Schemas / Request Payload Models
  5. Router Initialization
  6. Image Generation Endpoints
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
import base64
import os
import time
from typing import Optional
import uuid

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import APIRouter, Depends, HTTPException
import httpx
from loguru import logger
from pydantic import BaseModel
from sqlalchemy import select

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import create_gemini_client
from backend.ai_engine import ai_engine
from backend.database import async_session
from backend.database.models.user import UserBalance, UserSettings
from backend.schemas import GenerationRequest, GenerationResponse
from backend.api.ai import get_api_key
from backend.utils.deps import get_auth_user_id

# ==============================================================================
# 4. PYDANTIC SCHEMAS / REQUEST PAYLOAD MODELS
# ==============================================================================

class ImageGenerationRequest(GenerationRequest):
    """Pydantic request wrapper for image generation parameters."""
    pass

# ==============================================================================
# 5. ROUTER INITIALIZATION
# ==============================================================================
router = APIRouter(prefix="/api/image", tags=["Image Synthesis"])

HF_MODEL_ALIASES = {
    "hugging-face-inference": "black-forest-labs/FLUX.1-schnell",
    "prism-ml/bonsai-image-ternary-4b-gemlite-2bit": "prism-ml/bonsai-image-ternary-4B-gemlite-2bit",
    "flux-1-schnell": "black-forest-labs/FLUX.1-schnell",
    "stable-diffusion-xl": "stabilityai/stable-diffusion-xl-base-1.0",
    "stable-diffusion-3.5": "stabilityai/stable-diffusion-3.5-large",
    "stable-diffusion-3": "stabilityai/stable-diffusion-3.5-large",
    "stable-diffusion-3-medium": "stabilityai/stable-diffusion-3.5-large",
    "auraflow": "black-forest-labs/FLUX.1-schnell",
    "hunyuan-dit": "Tencent/HunyuanDiT-v1.1",
    "kolors": "Kwai-Kolors/Kolors",
    "kandinsky-3": "kandinsky-community/kandinsky-3",
    "pixart-sigma": "PixArt-alpha/PixArt-Sigma-XL-2-1024-MS",
    "tripo-sr": "black-forest-labs/FLUX.1-schnell",
    "sv3d": "black-forest-labs/FLUX.1-schnell",
    "unique3d": "black-forest-labs/FLUX.1-schnell",
    "instantmesh": "black-forest-labs/FLUX.1-schnell",
    "deepai": "black-forest-labs/FLUX.1-schnell",
    "leonardo-ai": "black-forest-labs/FLUX.1-schnell",
    "civitai": "black-forest-labs/FLUX.1-schnell",
    "flux-2-pro": "black-forest-labs/FLUX.1-dev",
    "gpt-image-1.5": "black-forest-labs/FLUX.1-dev",
    "recraft-v4": "black-forest-labs/FLUX.1-schnell",
    "ideogram-3.0": "black-forest-labs/FLUX.1-dev",
    "midjourney-v7": "black-forest-labs/FLUX.1-dev",
    "together-ai-replicate": "black-forest-labs/FLUX.1-schnell",
    "fal-ai": "black-forest-labs/FLUX.1-schnell",
    "replicate": "black-forest-labs/FLUX.1-schnell",
    "hugging-face-flux-schnell": "black-forest-labs/FLUX.1-schnell",
    "hugging-face-flux-dev": "black-forest-labs/FLUX.1-dev",
    "hugging-face-sdxl": "stabilityai/stable-diffusion-xl-base-1.0",
    "hugging-face-sdxl-turbo": "stabilityai/sdxl-turbo",
    "hugging-face-sd35": "stabilityai/stable-diffusion-3.5-large",
    "hugging-face-pixart": "PixArt-alpha/PixArt-Sigma-XL-2-1024-MS",
    "hugging-face-anime": "Linaqruf/animagine-xl-3.1",
    "hugging-face-anime-xl": "Linaqruf/animagine-xl-3.1",
    "hugging-face-anime-dark": "Linaqruf/animagine-xl-3.1",
    "hugging-face-realvis": "SG161222/RealVisXL_V4.0",
    "hugging-face-juggernaut": "RunDiffusion/Juggernaut-XL-v9",
    "hugging-face-portrait-plus": "SG161222/RealVisXL_V4.0",
}


def _get_huggingface_token() -> Optional[str]:
    return os.getenv("HF_API_TOKEN") or os.getenv("HF_TOKEN")


def _is_huggingface_routed_model(current_model_lower: str) -> bool:
    return current_model_lower in {
        "hugging-face-inference",
        "prism-ml/bonsai-image-ternary-4b-gemlite-2bit",
        "flux-1-schnell",
        "stable-diffusion-xl",
        "stable-diffusion-3.5",
        "stable-diffusion-3",
        "stable-diffusion-3-medium",
        "auraflow",
        "hunyuan-dit",
        "kolors",
        "kandinsky-3",
        "pixart-sigma",
        "tripo-sr",
        "sv3d",
        "unique3d",
        "instantmesh",
        "deepai",
        "leonardo-ai",
        "civitai",
        "flux-2-pro",
        "gpt-image-1.5",
        "recraft-v4",
        "ideogram-3.0",
        "midjourney-v7",
        "together-ai-replicate",
        "fal-ai",
        "replicate",
        "hugging-face-flux-schnell",
        "hugging-face-flux-dev",
        "hugging-face-sdxl",
        "hugging-face-sdxl-turbo",
        "hugging-face-sd35",
        "hugging-face-pixart",
        "hugging-face-anime",
        "hugging-face-anime-xl",
        "hugging-face-anime-dark",
        "hugging-face-realvis",
        "hugging-face-juggernaut",
        "hugging-face-portrait-plus",
        "huggingface",
        "hf",
        "hf-inference",
    }


def _resolve_google_image_model(current_model: str, configured_model: str) -> str:
    """Pick a Google image model that the current request is actually asking for.

    The previous implementation hardcoded imagen-3.0-generate-002 for every request,
    which breaks on environments where that model is not available for v1beta.
    """
    current_model_lower = current_model.lower()

    if current_model_lower.startswith("gemini-") and "image" in current_model_lower:
        return current_model

    if current_model_lower.startswith("imagen-"):
        return current_model

    if current_model_lower in {"google-imagen", "imagen", "imagen-4", "imagen-4-fast", "imagen-4-ultra"}:
        return configured_model

    return configured_model if configured_model.lower().startswith("imagen-") else current_model


async def _generate_huggingface_image(prompt: str, start_time: float, user_id: str, attempted_fallbacks: list[str], requested_model: Optional[str] = None) -> GenerationResponse:
    """Generate an image via Hugging Face Inference API using the local HF token."""
    hf_token = _get_huggingface_token()
    if not hf_token:
        raise HTTPException(
            status_code=500,
            detail="Hugging Face image generation requires HF_API_TOKEN or HF_TOKEN in the backend environment. Set one of them to enable the free image path.",
        )

    default_hf_model = os.getenv("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell").strip() or "black-forest-labs/FLUX.1-schnell"
    requested_model_lower = (requested_model or "").lower()
    hf_model = HF_MODEL_ALIASES.get(requested_model_lower, default_hf_model)
    hf_model_candidates = list(dict.fromkeys([hf_model, default_hf_model]))

    async with httpx.AsyncClient(timeout=120.0) as client:
        headers = {
            "Authorization": f"Bearer {hf_token}",
            "Content-Type": "application/json",
        }
        payload = {"inputs": prompt}

        response = None
        last_status = None
        last_body = None

        for candidate_model in hf_model_candidates:
            hf_url = f"https://api-inference.huggingface.co/models/{candidate_model}"
            logger.info(f"HF ROUTING: Rendering visual via Hugging Face Serverless ({candidate_model})...")
            try:
                response = await client.post(hf_url, headers=headers, json=payload)
            except httpx.RequestError as request_error:
                last_status = "network-error"
                last_body = str(request_error)
                logger.warning(f"HF ROUTING: Network error for '{candidate_model}': {request_error}")
                continue

            if response.status_code == 503:
                logger.warning("HF ROUTING: Model loading, waiting 8 seconds...")
                await asyncio.sleep(8)
                response = await client.post(hf_url, headers=headers, json=payload)

            if response.status_code == 200:
                hf_model = candidate_model
                break

            last_status = response.status_code
            last_body = response.text
            logger.warning(
                f"HF ROUTING: Candidate model '{candidate_model}' returned {response.status_code}; trying fallback if available."
            )

        if not response or response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Hugging Face API returned status {last_status}: {last_body}",
            )

        image_bytes = response.content
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        image_data_uri = f"data:image/jpeg;base64,{base64_image}"

        latency_ms = (time.perf_counter() - start_time) * 1000
        logger.success(f"HF ROUTING: Successfully generated image via {hf_model} in {latency_ms:.2f}ms")

        from backend.utils.notifications import notify_user
        await notify_user(
            user_id,
            "Image Synthesized via Hugging Face",
            f"Visual synthesized using Hugging Face {hf_model}.",
            "SUCCESS",
        )

        return GenerationResponse(
            text=image_data_uri,
            model_used=hf_model,
            finish_reason="STOP",
            usage={"total_tokens": 0},
            latency_ms=latency_ms,
            fallbacks=attempted_fallbacks,
        )

# ==============================================================================
# 6. IMAGE GENERATION ENDPOINTS
# ==============================================================================

@router.post("", response_model=GenerationResponse)
async def generate_image(
    request: ImageGenerationRequest,
    user_id: str = Depends(get_auth_user_id),
) -> GenerationResponse:
    """Unified Image generation endpoint supporting DALL-E 3, Google Imagen 3.0, Flux, and SDXL.

    Handles engine resolution based on user settings, deducts paid credits if user is in paid mode
    without custom keys, dispatches api calls, and maps responses to standardized JSON.
    Automatically loops through backup free models if primary generation fails.

    Args:
        request: The ImageGenerationRequest configuration.
        user_id: The authenticated user's ID.

    Returns:
        GenerationResponse: The base64-encoded image data URI and generation telemetry.

    Raises:
        HTTPException(402): If the user does not have enough balance for generation.
        HTTPException(500): If the provider's API returns an error or visual synthesis fails.
    """
    start_time = time.perf_counter()
    from backend.lib.image_models import FREE_IMAGE_MODEL_IDS
    
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
        
    # Force Free Mode for development as explicitly requested by the developer
    mode = "free"
        
    target_image_model = image_engine if "imagen" in request.model.lower() else request.model
    
    # PAID MODE: Deduct credits (100 credits) pure transaction check
    if mode == "paid" and not custom_key_present: 
        async with async_session() as session:
            if user_id != "local-dev-architect-id":
                bal_statement = select(UserBalance).where(UserBalance.user_id == user_id)
                bal_result = await session.execute(bal_statement)
                balance = bal_result.scalars().first()
                
                required_credits = 100
                
                if not balance or balance.credits < required_credits:
                    raise HTTPException(
                        status_code=402,
                        detail=f"Insufficient credits for Paid Image Generation (Requires {required_credits} credits). Please supply a custom API key, switch to Free mode, or purchase more credits."
                    )
                    
                balance.credits -= required_credits
                session.add(balance)
                await session.commit()
                logger.info(f"AI LEDGER: Deducted {required_credits} credits from user {user_id} for image generation.")

    # Neural image orchestration loop
    FALLBACK_MODELS = [target_image_model] + FREE_IMAGE_MODEL_IDS
    unique_fallbacks = [m for m in list(dict.fromkeys(FALLBACK_MODELS))]
    
    attempted_fallbacks = []
    last_error = None
    hf_route_failed = False

    for current_model in unique_fallbacks:
        current_model_lower = current_model.lower()
        
        if current_model != target_image_model and current_model not in attempted_fallbacks:
            logger.warning(f"IMAGE RECOVERY: Primary model failed. Attempting failover to: {current_model}")
            attempted_fallbacks.append(current_model)

        try:
            if _is_huggingface_routed_model(current_model_lower):
                if hf_route_failed:
                    logger.warning(f"IMAGE RECOVERY: Skipping Hugging Face model '{current_model}' because HF routing already failed earlier in this request.")
                    continue

                if not _get_huggingface_token():
                    logger.warning(f"IMAGE RECOVERY: Skipping Hugging Face model '{current_model}' because HF_API_TOKEN/HF_TOKEN is not set.")
                    hf_route_failed = True
                    continue

                try:
                    return await _generate_huggingface_image(request.prompt, start_time, user_id, attempted_fallbacks, current_model)
                except Exception as hf_error:
                    hf_route_failed = True
                    last_error = hf_error
                    logger.error(f"IMAGE RECOVERY: Hugging Face route failed for {current_model}: {hf_error}")
                    continue

            api_key = await get_api_key(user_id, current_model)
            
            # 1. DALL-E 3 Live Integration via OpenAI
            if "dall-e" in current_model_lower:
                openai_key = api_key or os.getenv("OPENAI_API_KEY")
                if not openai_key:
                    raise ValueError("OpenAI API key not configured for DALL-E 3 generation.")
                
                logger.info(f"DALL-E: Generating image via DALL-E 3 (Requested model: {current_model})...")
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
                        model_used=current_model,
                        finish_reason="STOP",
                        usage={"total_tokens": 0},
                        latency_ms=latency_ms,
                        fallbacks=attempted_fallbacks
                    )
            
            # 2. Stable Diffusion / Stability AI
            elif "stable-image" in current_model_lower or "stable-diffusion" in current_model_lower:
                logger.info(f"STABILITY ROUTING: Rendering visual via Stability endpoint ({current_model})...")
                image_data_uri = await ai_engine.generate_stability_image(
                    prompt=request.prompt,
                    model_name=current_model,
                    user_id=user_id,
                )

                latency_ms = (time.perf_counter() - start_time) * 1000
                from backend.utils.notifications import notify_user
                await notify_user(
                    user_id,
                    "Image Synthesized Successfully",
                    f"Real visual synthesized using {current_model}.",
                    "SUCCESS"
                )

                return GenerationResponse(
                    text=image_data_uri,
                    model_used=current_model,
                    finish_reason="STOP",
                    usage={"total_tokens": 0},
                    latency_ms=latency_ms,
                    fallbacks=attempted_fallbacks
                )

            # 3. Google GenAI (Gemini native image vs Imagen)
            else:
                google_model_name = _resolve_google_image_model(current_model, image_engine)
                if not (google_model_name.lower().startswith("imagen-") or google_model_name.lower().startswith("gemini-")):
                    logger.warning(f"IMAGE RECOVERY: Model '{current_model}' (resolved to '{google_model_name}') is not a recognized Google Imagen/Gemini model. Skipping Google GenAI attempt.")
                    raise ValueError(f"Model '{google_model_name}' is not supported by Google GenAI.")

                logger.info(f"GOOGLE GENAI IMAGE ROUTING: Rendering visual via Google {google_model_name} (Requested: {current_model})...")

                client = create_gemini_client(api_key=api_key)
                from google.genai import types

                is_gemini_image_model = google_model_name.lower().startswith("gemini-") and "image" in google_model_name.lower()

                if is_gemini_image_model:
                    # Native Gemini multimodal image models (called via generate_content)
                    logger.info(f"GEMINI IMAGE ROUTING: Generating native image via generate_content using {google_model_name}...")
                    config = types.GenerateContentConfig(
                        response_modalities=["IMAGE"],
                        response_format={"image": {"aspect_ratio": "1:1"}}  # type: ignore
                    )
                    
                    response = await asyncio.to_thread(
                        client.models.generate_content,
                        model=google_model_name,
                        contents=[request.prompt],
                        config=config
                    )

                    image_bytes = None
                    for part in response.parts:
                        # 1. Try recommended helper `part.as_image()`
                        try:
                            if hasattr(part, "as_image") or part.inline_data is not None:
                                pil_img = part.as_image()
                                if pil_img:
                                    from io import BytesIO
                                    buf = BytesIO()
                                    pil_img.save(buf, format="JPEG")  # type: ignore
                                    image_bytes = buf.getvalue()
                                    break
                        except Exception as as_img_err:
                            logger.debug(f"GEMINI IMAGE: as_image() helper failed: {as_img_err}. Trying direct inline_data parsing.")

                        # 2. Fallback to raw base64/bytes parsing from part.inline_data
                        if part.inline_data is not None and part.inline_data.mime_type.startswith("image/"):
                            raw_data = part.inline_data.data
                            if isinstance(raw_data, str):
                                try:
                                    image_bytes = base64.b64decode(raw_data)
                                except Exception:
                                    image_bytes = raw_data.encode("latin-1")
                            else:
                                image_bytes = raw_data
                            break

                    if not image_bytes:
                        raise ValueError(f"Gemini native image generation returned no visual parts. Response was: {response}")
                else:
                    # Traditional Google Imagen models (called via generate_images)
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

                    image_bytes = result.generated_images[0].image.image_bytes

                base64_image = base64.b64encode(image_bytes).decode("utf-8")
                image_data_uri = f"data:image/jpeg;base64,{base64_image}"

                latency_ms = (time.perf_counter() - start_time) * 1000
                logger.success(f"GOOGLE GENAI IMAGE: Image synthesized successfully in {latency_ms:.2f}ms")

                from backend.utils.notifications import notify_user
                await notify_user(
                    user_id,
                    "Image Synthesized Successfully",
                    f"Real character visualization synthesized using {current_model}.",
                    "SUCCESS"
                )

                return GenerationResponse(
                    text=image_data_uri,
                    model_used=current_model,
                    finish_reason="STOP",
                    usage={"total_tokens": 0},
                    latency_ms=latency_ms,
                    fallbacks=attempted_fallbacks
                )

        except Exception as e:
            last_error = e
            logger.error(f"IMAGE RECOVERY: Loop failure for {current_model}: {e}")
            continue

    # 4. Ultimate free recovery loop: Hugging Face Serverless (FLUX.1-schnell)
    logger.info("IMAGE RECOVERY: All primary and free loop models failed. Trying final Hugging Face serverless fallback...")
    try:
        return await _generate_huggingface_image(request.prompt, start_time, user_id, attempted_fallbacks + ["gemini-imagen", "stability-ai"])
    except Exception as hf_err:
        logger.error(f"HF FALLBACK: Hugging Face generation failed: {hf_err}")

        # If HF fails and Google is available, try a stable Google Imagen fallback as a final savior!
        logger.info("IMAGE RECOVERY: HF fallback failed. Attempting final savior fallback via Google Imagen...")
        try:
            api_key = await get_api_key(user_id, "imagen-3.0-generate-001")
            client = create_gemini_client(api_key=api_key)
            from google.genai import types
            result = await asyncio.to_thread(
                client.models.generate_images,
                model="imagen-3.0-generate-001",
                prompt=request.prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    output_mime_type="image/jpeg",
                    aspect_ratio="1:1"
                )
            )
            if result and result.generated_images:
                image_bytes = result.generated_images[0].image.image_bytes
                base64_image = base64.b64encode(image_bytes).decode("utf-8")
                image_data_uri = f"data:image/jpeg;base64,{base64_image}"
                latency_ms = (time.perf_counter() - start_time) * 1000
                logger.success(f"IMAGEN: Ultimate savior fallback succeeded in {latency_ms:.2f}ms")
                
                from backend.utils.notifications import notify_user
                await notify_user(
                    user_id,
                    "Image Synthesized via Savior Fallback",
                    "Visual successfully compiled using Google Imagen fallback.",
                    "SUCCESS"
                )
                return GenerationResponse(
                    text=image_data_uri,
                    model_used="imagen-3.0-generate-001",
                    finish_reason="STOP",
                    usage={"total_tokens": 0},
                    latency_ms=latency_ms,
                    fallbacks=attempted_fallbacks + ["final-savior-imagen"]
                )
        except Exception as google_err:
            logger.error(f"IMAGE RECOVERY: Final savior Google fallback also failed: {google_err}")

    raise HTTPException(
        status_code=500,
        detail=f"All active neural image compilation loops exhausted. Final failure: {str(last_error)}"
    )

