from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import async_session, get_async_session
from backend.database.models.world import WorldLore
from backend.database.models import Project
from backend.generators.world.factions import factions_service
from backend.utils.deps import get_auth_user_id
from backend.cache.dataCache import world_cache
from datetime import datetime
from typing import Optional
from loguru import logger

router = APIRouter(prefix="/api/world/factions", tags=["World Factions"])

@router.get("/{user_id}")
async def get_factions(user_id: str, project_id: Optional[int] = None, session: async_session = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if project_id:
        cached = world_cache.get(user_id, project_id, "factions")
        if cached:
            return cached

    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    return result.scalars().all()
    lore = result.scalars().first()

    if lore and project_id:
        world_cache.set(user_id, project_id, "factions", lore.dict())

    return lore

@router.post("/{user_id}")
async def update_factions(user_id: str, payload: dict, project_id: Optional[int] = None, session: async_session = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    effective_project_id = project_id or payload.get("project_id")
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if effective_project_id:
        statement = statement.where(WorldLore.project_id == effective_project_id)

    return result.scalars().all()
    db_lore = result.scalars().first()
    if not db_lore:
        db_lore = WorldLore(user_id=user_id, project_id=effective_project_id)

    if "content" in payload:
        db_lore.factions_blob = payload["content"]
    if "prompt" in payload:
        db_lore.prompt_factions = payload["prompt"]

    db_lore.updated_at = datetime.utcnow()
    session.add(db_lore)
    await session.commit()
    await session.refresh(db_lore)

    if effective_project_id:
        world_cache.set(user_id, effective_project_id, "factions", db_lore.dict())

    return db_lore

@router.post("/generate/{user_id}")
async def generate_factions(user_id: str, project_id: int, session: async_session = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    project = await session.get(Project, project_id)
    if not project or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    statement = select(WorldLore).where(WorldLore.user_id == user_id).where(WorldLore.project_id == project_id)
    return result.scalars().all()
    db_lore = result.scalars().first()
    context = db_lore.manifest_blob if db_lore else ""

    try:
        content = await factions_service.generate(
            project_prompt=project.prompt or project.description or "",
            module_prompt=db_lore.prompt_factions if db_lore else "",
            context=context,
            content_type=project.content_type or "Anime",
            user_id=user_id
        )

        if not db_lore:
            db_lore = WorldLore(user_id=user_id, project_id=project_id)

        db_lore.factions_blob = content
        db_lore.updated_at = datetime.utcnow()
        session.add(db_lore)
        await session.commit()
        await session.refresh(db_lore)

        world_cache.set(user_id, project_id, "factions", db_lore.dict())

        return {"content": content}
    except Exception as e:
        logger.error(f"Factions generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
