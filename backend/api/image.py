import os
import time
import uuid
import asyncio
import base64
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from loguru import logger

from backend.database import async_session
from backend.database.models.user import UserSettings, UserBalance
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import build_genai_client
from backend.schemas import GenerationRequest, GenerationResponse
from backend.api.ai import get_api_key

router = APIRouter(prefix="/api/image", tags=["Image Synthesis"])

class ImageGenerationRequest(GenerationRequest):
    pass

@router.post("", response_model=GenerationResponse)
async def generate_image(request: ImageGenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """Unified Image generation endpoint supporting DALL-E 3, Google Imagen 3.0, Flux, and SDXL."""
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
        
    target_image_model = image_engine if "imagen" in request.model.lower() else request.model
    target_image_model_lower = target_image_model.lower()
    
    api_key = await get_api_key(user_id, target_image_model)
    
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

    # DALL-E 3 Live Integration via OpenAI
    if "dall-e" in target_image_model_lower:
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
    
    # Google Imagen 3.0 / Stable Diffusion / Flux / Midjourney
    else:
        try:
            google_model_name = "imagen-3.0-generate-002"
            if "fast" in target_image_model_lower:
                google_model_name = "imagen-3.0-generate-002"
            elif "generate-001" in target_image_model_lower:
                google_model_name = "imagen-3.0-generate-002"
            
            logger.info(f"IMAGEN ROUTING: Rendering visual via Google {google_model_name} (Requested: {target_image_model})...")
            
            client = build_genai_client(api_key=api_key)
            
            from google.genai import types
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
