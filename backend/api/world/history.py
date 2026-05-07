from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.database.models.world import WorldLore
from backend.database.models import Project
from backend.services.ai_engine import ai_engine
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional
from loguru import logger

router = APIRouter(prefix="/api/world/history", tags=["World History"])

@router.get("/{user_id}")
async def get_history(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    result = await session.execute(statement)
    lore = result.scalars().first()

    if not lore:
        return {"content": "", "prompt": ""}
    return {"content": lore.history_blob, "prompt": lore.prompt_history}

@router.post("/{user_id}")
async def update_history(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    effective_project_id = project_id or payload.get("project_id")
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if effective_project_id:
        statement = statement.where(WorldLore.project_id == effective_project_id)

    result = await session.execute(statement)
    db_lore = result.scalars().first()
    if not db_lore:
        db_lore = WorldLore(user_id=user_id, project_id=effective_project_id)

    if "content" in payload:
        db_lore.history_blob = payload["content"]
    if "prompt" in payload:
        db_lore.prompt_history = payload["prompt"]

    db_lore.updated_at = datetime.utcnow()
    session.add(db_lore)
    await session.commit()
    return {"status": "success"}

@router.post("/generate/{user_id}")
async def generate_history(user_id: str, project_id: int, tuning: Optional[dict] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    project = await session.get(Project, project_id)
    if not project or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found")

    project_prompt = project.prompt or project.description or ""
    
    statement = select(WorldLore).where(WorldLore.user_id == user_id).where(WorldLore.project_id == project_id)
    result = await session.execute(statement)
    lore = result.scalars().first()
    module_prompt = lore.prompt_history if lore else ""

    content = await ai_engine.generate_history(
        project_prompt=project_prompt,
        module_prompt=module_prompt,
        tuning=tuning,
        user_id=user_id
    )

    if not lore:
        lore = WorldLore(user_id=user_id, project_id=project_id)

    lore.history_blob = content
    lore.updated_at = datetime.utcnow()
    session.add(lore)
    await session.commit()
    return {"content": content}
