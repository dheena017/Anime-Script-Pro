from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models.world import CharacterManifest
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional, Any
from loguru import logger

router = APIRouter(prefix="/api/characters", tags=["Character Management"])

def resolve_project_id(route_project_id: Optional[int], header_project_id: Optional[int]) -> Optional[int]:
    return route_project_id or header_project_id

# --- Neural Response Wrapper ---
def wrap_response(data: Any, message: str = "Success"):
    return {
        "status": "success",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

@router.get("/{user_id}")
async def get_character_manifest(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the full character manifest for a user."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Character Access")

    effective_project_id = resolve_project_id(project_id, x_project_id)

    statement = select(CharacterManifest).where(CharacterManifest.user_id == user_id)
    if effective_project_id:
        statement = statement.where(CharacterManifest.project_id == effective_project_id)
    statement = statement.order_by(CharacterManifest.updated_at.desc())
    
    result = await session.execute(statement)
    manifest = result.scalars().first()
    
    if not manifest:
        logger.info(f"[CHARACTER] No manifest found for user {user_id}. Returning null context.")
        return wrap_response(None, "No Manifest Found")
        
    logger.info(f"[CHARACTER] Manifest retrieved for {user_id}")
    return wrap_response(manifest)


@router.post("/{user_id}")
async def update_character_manifest(
    user_id: str,
    update: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Upsert the full character manifest for a user. Creates a new record if none exists."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Character Update")

    effective_project_id = resolve_project_id(project_id, x_project_id) or update.get("project_id")

    statement = select(CharacterManifest).where(CharacterManifest.user_id == user_id)
    if effective_project_id:
        statement = statement.where(CharacterManifest.project_id == effective_project_id)

    result = await session.execute(statement)
    db_manifest = result.scalars().first()

    if not db_manifest:
        logger.info(f"[CHARACTER] Initializing new manifest record for user {user_id}")
        db_manifest = CharacterManifest(user_id=user_id, project_id=effective_project_id)

    protected_fields = {"id", "user_id", "created_at", "updated_at"}
    for key, value in update.items():
        if key in protected_fields:
            continue
        # Support legacy field name: cast_list_blob → character_list_blob
        if key == "cast_list_blob":
            key = "character_list_blob"
        if hasattr(db_manifest, key):
            setattr(db_manifest, key, value)

    db_manifest.updated_at = datetime.utcnow()
    session.add(db_manifest)

    try:
        await session.commit()
        await session.refresh(db_manifest)
        logger.success(f"[CHARACTER] Manifest synchronized for user {user_id}")
        return wrap_response(db_manifest, "Character Manifest Synced")
    except Exception as e:
        logger.error(f"[CHARACTER] Sync failure: {e}")
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Character sync failure: {str(e)}")


@router.get("/history/{user_id}")
async def get_character_history(
    user_id: str,
    limit: int = 10,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the character manifest history for a user."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized History Access")

    statement = (
        select(CharacterManifest)
        .where(CharacterManifest.user_id == user_id)
        .order_by(CharacterManifest.updated_at.desc())
        .limit(limit)
    )
    result = await session.execute(statement)
    history = result.scalars().all()
    logger.info(f"[CHARACTER] History stack ({len(history)} frames) retrieved for {user_id}")
    return wrap_response(history)
