import os

modules = [
    ("manifest", "Manifest", "manifest_blob", "prompt_history"),
    ("history", "History", "history_blob", "prompt_history"),
    ("factions", "Factions", "factions_blob", "prompt_factions"),
    ("powers", "Powers", "powers_blob", "prompt_powers"),
    ("architecture", "Architecture", "architecture_blob", "prompt_architecture"),
    ("atlas", "Atlas", "atlas_blob", "prompt_atlas"),
    ("culture", "Culture", "culture_blob", "prompt_culture"),
    ("systems", "Systems", "systems_blob", "prompt_systems")
]

template = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from backend.database import async_session, get_async_session
from backend.database.models.world import WorldLore
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/world/{name}", tags=["World {title}"])

@router.get("/{{user_id}}")
async def get_{name}(user_id: str, project_id: Optional[int] = None, session: async_session = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    result = await session.execute(statement)
    return result.scalars().first()

@router.post("/{{user_id}}")
async def update_{name}(user_id: str, payload: dict, project_id: Optional[int] = None, session: async_session = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
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
        db_lore.{blob_field} = payload["content"]
    if "prompt" in payload:
        db_lore.{prompt_field} = payload["prompt"]

    db_lore.updated_at = datetime.utcnow()
    session.add(db_lore)
    await session.commit()
    return db_lore
"""

for name, title, blob, prompt in modules:
    path = os.path.join("backend/api/world", f"{name}.py")
    with open(path, "w") as f:
        f.write(template.format(name=name, title=title, blob_field=blob, prompt_field=prompt))
