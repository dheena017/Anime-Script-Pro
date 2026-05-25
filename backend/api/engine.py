from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models.engine import EngineConfig, AITelemetry, AIModel
from pydantic import BaseModel
from backend.lib.text_models import DEFAULT_TEXT_MODELS
from backend.lib.image_models import DEFAULT_IMAGE_MODELS
from backend.lib.video_models import DEFAULT_VIDEO_MODELS
from backend.lib.agent_models import DEFAULT_AGENT_MODELS
from backend.lib.audio_models import DEFAULT_AUDIO_MODELS

router = APIRouter(prefix="/api/engine", tags=["Engine Nexus"])

class EngineConfigUpdate(BaseModel):
    selected_model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    vibe: Optional[str] = None
    audience: Optional[str] = None

class TelemetryCreate(BaseModel):
    model: str
    latency_ms: float
    status: str = "SUCCESS"
    endpoint: str
    request_summary: Optional[str] = None
    error_message: Optional[str] = None
    metadata: dict = {}

@router.get("/config/{user_id}", response_model=EngineConfig)
async def get_engine_config(user_id: str, session: AsyncSession = Depends(get_async_session)):
    statement = select(EngineConfig).where(EngineConfig.user_id == user_id)
    result = await session.execute(statement)
    config = result.scalars().first()

    if not config:
        # Create default config for new users
        config = EngineConfig(user_id=user_id)
        session.add(config)
        await session.commit()
        await session.refresh(config)

    return config

@router.post("/config/{user_id}", response_model=EngineConfig)
async def update_engine_config(user_id: str, update: EngineConfigUpdate, session: AsyncSession = Depends(get_async_session)):
    statement = select(EngineConfig).where(EngineConfig.user_id == user_id)
    result = await session.execute(statement)
    config = result.scalars().first()

    if not config:
        config = EngineConfig(user_id=user_id)
        session.add(config)

    for key, value in update.dict(exclude_unset=True).items():
        setattr(config, key, value)

    config.updated_at = datetime.utcnow()
    session.add(config)
    await session.commit()
    await session.refresh(config)
    return config

@router.post("/telemetry", status_code=201)
async def record_telemetry(telemetry: TelemetryCreate, user_id: Optional[str] = None, session: AsyncSession = Depends(get_async_session)):
    db_telemetry = AITelemetry(
        user_id=user_id,
        model=telemetry.model,
        latency_ms=telemetry.latency_ms,
        status=telemetry.status,
        endpoint=telemetry.endpoint,
        request_summary=telemetry.request_summary,
        error_message=telemetry.error_message,
        extra_metadata=telemetry.metadata
    )
    session.add(db_telemetry)
    await session.commit()
    return {"status": "recorded"}

@router.get("/telemetry/recent", response_model=List[AITelemetry])
async def get_recent_telemetry(limit: int = 50, session: AsyncSession = Depends(get_async_session)):
    statement = select(AITelemetry).order_by(AITelemetry.timestamp.desc()).limit(limit)
    result = await session.execute(statement)
    return result.scalars().all()

@router.get("/models")
async def list_ai_models(session: AsyncSession = Depends(get_async_session)):
    # Fetch active models from DB
    statement = select(AIModel).where(AIModel.is_active == True)
    result = await session.execute(statement)
    db_models = result.scalars().all()

    # Compose default registry from split modules
    defaults = DEFAULT_TEXT_MODELS + DEFAULT_IMAGE_MODELS + DEFAULT_VIDEO_MODELS + DEFAULT_AGENT_MODELS + DEFAULT_AUDIO_MODELS
    # Remove duplicates and any that exist in DB
    db_ids = {m.model_id for m in db_models}
    unique_defaults = [m for m in dict.fromkeys(defaults) if m not in db_ids]

    # Build AIModel-like entries for defaults (minimal fields)
    default_entries = [
        AIModel(model_id=m, provider="registry", display_name=m, capabilities={}, is_active=True)
        for m in unique_defaults
    ]

    return db_models + default_entries
