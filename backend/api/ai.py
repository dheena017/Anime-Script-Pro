import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from google import genai
from google.genai import types
from loguru import logger

logger.info(f"!!! AI MODULE INITIALIZED: {__file__} !!!")
from sqlmodel import select

from backend.database import AsyncSession, async_engine
from backend.database.models import Project
from backend.database.models.world import WorldLore
from backend.utils.deps import get_auth_user_id
from backend.services.ai_engine import ai_engine, build_genai_client
from backend.schemas import GenerationRequest, GenerationResponse

# Import world generator services for God Mode
from backend.services.generators.world.manifest import manifest_service
from backend.services.generators.world.history import history_service
from backend.services.generators.world.factions import factions_service
from backend.services.generators.world.powers import powers_service
from backend.services.generators.world.architecture import architecture_service
from backend.services.generators.world.atlas import atlas_service
from backend.services.generators.world.culture import culture_service
from backend.services.generators.world.systems import systems_service

router = APIRouter(prefix="/api", tags=["AI Engine"])

MODEL_MAP = {
    # 3.1 Series (Highest Quota)
    "gemini-3.1-flash": "gemini-3.1-flash-lite-preview",
    "gemini-3.1-pro": "gemini-3.1-pro-preview",

    # 3.0 Series
    "gemini-3-flash": "gemini-3-flash-preview",
    "gemini-3-pro": "gemini-3-pro-preview",

    # 2.5 Series
    "gemini-2.5-flash": "gemini-2.5-flash",
    "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
    "gemini-2.5-pro": "gemini-2.5-pro",

    # 2.0 Series
    "gemini-2.0-flash": "gemini-3.1-flash-lite-preview", # Redirecting 2.0 to 3.1 Lite due to 0 quota
    "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
    "gemini-2.0-pro": "gemini-2.5-pro",
    "gemini-2.0-pro-exp-02-05": "gemini-2.5-pro",

    # Legacy/Standard Aliases
    "gemini-flash-latest": "gemini-3.1-flash-lite-preview",
    "gemini-pro-latest": "gemini-2.5-pro",
    "gemini-1.5-flash": "gemini-3.1-flash-lite-preview",
    "gemini-1.5-pro": "gemini-2.5-pro",
    "gemini-1.5-flash-8b": "gemini-3.1-flash-lite-preview",
}

@router.post("/generate", response_model=GenerationResponse)
async def generate_content(request: GenerationRequest, user_id: str = Depends(get_auth_user_id)):
    """
    Unified AI generation endpoint with robust model mapping and fallback.
    Prioritizes user-provided API keys from their settings.
    """
    raw_model = request.model.lower().strip()
    normalized_model = raw_model.replace(" ", "-")

    # Direct lookup in the map
    target_model = MODEL_MAP.get(normalized_model, MODEL_MAP.get(raw_model, normalized_model))

    # Second pass resolution (for double-aliased models)
    if target_model in MODEL_MAP:
        target_model = MODEL_MAP[target_model]

    # Final safety check against the known stable registry
    STABLE_MODELS = [
        "gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash",
        "gemini-3-flash-preview", "gemini-3-pro-preview",
        "gemini-3.1-flash-lite-preview", "gemini-2.0-flash-lite"
    ]
    if target_model not in STABLE_MODELS and not any(target_model.startswith(m) for m in STABLE_MODELS):
        logger.warning(f"Resolved model '{target_model}' not in stable registry. Falling back to gemini-2.5-flash.")
        target_model = "gemini-2.5-flash"

    if target_model.startswith("models/"):
        target_model = target_model.replace("models/", "")

    logger.info(f"SYNTHESIS: Request for '{request.model}' resolved to target model: <cyan>{target_model}</cyan>")

    # --- API Key Strategy ---
    # 1. Try to fetch user-provided key from database settings
    user_api_key = None
    try:
        from backend.database.models.user import UserSettings
        async with AsyncSession(async_engine) as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            result = await session.exec(statement)
            settings = result.first()
            if settings and settings.ai_models:
                user_api_key = settings.ai_models.get("gemini_api_key")
    except Exception as e:
        logger.warning(f"Failed to fetch user settings for key retrieval: {e}")

    # 2. Fallback to environment variables
    api_key = user_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="AI Engine API key not configured. Please add your key in Settings or contact the administrator.")


    # --- Ultra-Fallback Logic ---
    # Optimized based on User Quota Table (RPM/TPM/RPD)
    FALLBACK_MODELS = [
        target_model, # Try requested first (Likely 3.1 Flash Lite)
        "gemini-3.1-flash-lite-preview", # 15 RPM
        "gemini-2.5-flash-lite",         # 10 RPM
        "gemini-3-flash-preview",        # 5 RPM
        "gemini-2.5-flash",              # 5 RPM
        "gemma-3-27b-it",                # 30 RPM (High availability fallback)
    ]

    # Remove duplicates while preserving order
    unique_fallbacks = []
    for m in FALLBACK_MODELS:
        if m not in unique_fallbacks:
            unique_fallbacks.append(m)

    client = build_genai_client(api_key=api_key)
    import time
    start_time = time.perf_counter()
    last_error = None
    attempted_fallbacks = []

    for current_model in unique_fallbacks:
        try:
            is_fallback = current_model != target_model
            if is_fallback:
                attempted_fallbacks.append(current_model)
                logger.warning(f"RECOVERY: Primary model failed or exhausted. Attempting fallback: <yellow>{current_model}</yellow>")

            key_source = "User-Provided" if user_api_key else "System-Global"
            logger.info(f"PROCESS: [🧠] Neural Synthesis via {current_model} ({key_source} Key)")
            config = {}
            if request.systemInstruction:
                config["system_instruction"] = request.systemInstruction

            # Use AIO (Async) client to prevent blocking the event loop
            response = await client.aio.models.generate_content(
                model=current_model,
                contents=request.prompt,
                config=types.GenerateContentConfig(**config) if config else None
            )

            # --- Content Blocking & Safety Checks ---
            if not response or not hasattr(response, "text"):
                # Check for candidates and finish reasons
                if hasattr(response, "candidates") and response.candidates:
                    candidate = response.candidates[0]
                    finish_reason = getattr(candidate, "finish_reason", "UNKNOWN")
                    if finish_reason == "SAFETY":
                        logger.warning(f"Synthesis blocked by Safety Filters for model {current_model}")
                        raise HTTPException(
                            status_code=400,
                            detail="Synthesis blocked by safety filters. Please refine your prompt to avoid restricted content (e.g., extreme violence, explicit adult themes)."
                        )
                raise ValueError("Gemini returned an empty or malformed response.")

            output_text = response.text

            # Extract usage metadata
            usage_dict = {}
            if hasattr(response, "usage_metadata") and response.usage_metadata:
                try:
                    usage_dict = {
                        "prompt_tokens": getattr(response.usage_metadata, "prompt_token_count", 0),
                        "candidates_tokens": getattr(response.usage_metadata, "candidates_token_count", 0),
                        "total_tokens": getattr(response.usage_metadata, "total_token_count", 0)
                    }
                except Exception: pass

            latency_ms = (time.perf_counter() - start_time) * 1000

            # Professional Success Report
            logger.success(f"COMPLETED: [✅] Synthesis Successful | Model: {current_model} | Latency: {latency_ms:.2f}ms")

            if usage_dict:
                tokens = usage_dict.get('total_tokens', 0)
                logger.info(f"METRICS: [📊] Usage: {tokens} tokens | Efficiency: {(tokens/(latency_ms/1000)):.1f} tps")

            preview = output_text[:120].replace("\n", " ")
            logger.info(f"PREVIEW: [📝] \"{preview}...\" ({len(output_text)} chars generated)")

            return GenerationResponse(
                text=output_text,
                model_used=current_model,
                finish_reason="STOP",
                usage=usage_dict,
                latency_ms=latency_ms,
                fallbacks=attempted_fallbacks[:-1] if attempted_fallbacks else []
            )

        except HTTPException:
            # Re-raise explicit HTTPExceptions (like Safety blocks)
            raise
        except Exception as e:
            last_error = e
            err_msg = str(e).upper()

            # Log the specific failure for backend diagnostics
            logger.warning(f"Model {current_model} failed: {str(e)}")

            # Handle Authentication issues (401)
            if any(term in err_msg for term in ["401", "UNAUTHENTICATED", "API_KEY_INVALID", "INVALID_ARGUMENT", "API KEY NOT VALID"]):
                # If the key is invalid, there's no point in trying fallbacks
                logger.error("Invalid Gemini API Key detected. Aborting fallbacks.")
                raise HTTPException(
                    status_code=401,
                    detail="Invalid AI Credentials. Please verify your Gemini API key in Settings."
                )

            # Handle Rate Limiting (429) - continue to fallback
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                logger.warning(f"Model {current_model} hit rate limits.")
                continue

            # Handle Invalid Arguments (400) - usually prompt too long or invalid model
            if "400" in err_msg or "INVALID_ARGUMENT" in err_msg:
                logger.error(f"Invalid request for {current_model}: {str(e)}")
                continue

            # Handle Timeouts / Deadline Exceeded (504)
            if "504" in err_msg or "DEADLINE_EXCEEDED" in err_msg:
                logger.warning(f"Model {current_model} timed out.")
                continue

            continue # General retry/fallback

    # --- Final Error Aggregation ---
    logger.error(f"[AI SYNTHESIS] -> CRITICAL FAILURE: All fallback models exhausted.")
    logger.error(f"Last observed error: {last_error}")

    err_msg = str(last_error).upper()

    if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
        raise HTTPException(
            status_code=429,
            detail="Neural Network Overloaded: All Gemini models have reached their quota. Please wait 60 seconds and try again."
        )

    if "INTERNAL" in err_msg or "500" in err_msg:
        raise HTTPException(
            status_code=502,
            detail="Google AI Services are currently experiencing an internal outage. Check the Gemini Status page."
        )

    raise HTTPException(
        status_code=500,
        detail=f"Neural Engine Synthesis Failed: {str(last_error)}"
    )


@router.post("/generate/god-mode/{project_id}")
async def initialize_god_mode(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """
    MASTER GENERATION LOOP:
    1. Generates 8 World Modules (Manifest, History, Factions, Powers, Architecture, Atlas, Culture, Systems)
    2. Designs a Core Cast
    3. Scaffolds the Pilot Narrative Beats
    """
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Project not found")

        try:
            # --- Phase 1: Neural World Architecture (8 Modules) ---
            logger.info(f"GOD_MODE: Initializing 8-module World Architecture for project {project_id}")

            project_prompt = project.prompt or project.description or "A new creative production."
            content_type = project.content_type or "Anime"
            tone = project.vibe or "Standard"

            # 1. Manifest (The Foundation)
            manifest = await manifest_service.generate(project.title, project_prompt, tone, content_type, user_id)

            # 2-8: Specialized Modules
            history = await history_service.generate(project_prompt, "", manifest, content_type, user_id)
            factions = await factions_service.generate(project_prompt, "", manifest, content_type, user_id)
            powers = await powers_service.generate(project_prompt, "", manifest, content_type, user_id)
            architecture = await architecture_service.generate(project_prompt, "", manifest, content_type, user_id)
            atlas = await atlas_service.generate(project_prompt, "", manifest, content_type, user_id)
            culture = await culture_service.generate(project_prompt, "", manifest, content_type, user_id)
            systems = await systems_service.generate(project_prompt, "", manifest, content_type, user_id)

            # Persist to WorldLore
            statement = select(WorldLore).where(WorldLore.user_id == user_id).where(WorldLore.project_id == project_id)
            result = await session.execute(statement)
            db_lore = result.scalars().first()
            if not db_lore:
                db_lore = WorldLore(user_id=user_id, project_id=project_id)

            db_lore.manifest_blob = manifest
            db_lore.history_blob = history
            db_lore.factions_blob = factions
            db_lore.powers_blob = powers
            db_lore.architecture_blob = architecture
            db_lore.atlas_blob = atlas
            db_lore.culture_blob = culture
            db_lore.systems_blob = systems
            db_lore.updated_at = datetime.utcnow()

            session.add(db_lore)

            # --- Phase 2: Character DNA Synthesis ---
            cast_raw = await ai_engine.generate_characters(
                manifest,
                tone=tone,
                content_type=content_type,
                user_id=user_id
            )
            project.prod_metadata["cast_dna"] = cast_raw

            # --- Phase 3: Narrative Beat Scaffolding ---
            beats_raw = await ai_engine.generate_script_beats(
                project.title,
                manifest,
                cast_raw,
                tone=tone,
                content_type=content_type,
                user_id=user_id
            )
            project.prod_metadata["narrative_scaffolding"] = beats_raw

            project.status = "INITIALIZED"
            project.updated_at = datetime.utcnow()
            session.add(project)

            await session.commit()

            return {
                "status": "READY",
                "project_id": project_id,
                "workflow": "GOD_MODE_SYNC_COMPLETE",
                "modules_initialized": 8
            }
        except Exception as e:
            logger.error(f"God Mode Global Failure for project {project_id}: {str(e)}")
            await session.rollback()
            raise HTTPException(status_code=500, detail=f"Global neural synthesis failed: {str(e)}")
