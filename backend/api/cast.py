from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models.world import CastManifest
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional, Any
from loguru import logger

router = APIRouter(prefix="/api/cast", tags=["Cast Management"])

# --- Neural Response Wrapper ---
def wrap_response(data: Any, message: str = "Success"):
    return {
        "status": "success",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

@router.get("/{user_id}")
async def get_cast_manifest(
    user_id: str,
    project_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the full cast manifest for a user."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Cast Access")

    statement = select(CastManifest).where(CastManifest.user_id == user_id)
    if project_id:
        statement = statement.where(CastManifest.project_id == project_id)
    statement = statement.order_by(CastManifest.updated_at.desc())
    
    result = await session.execute(statement)
    manifest = result.scalars().first()
    
    if not manifest:
        logger.info(f"[CAST] No manifest found for user {user_id}. Returning null context.")
        return wrap_response(None, "No Manifest Found")
        
    logger.info(f"[CAST] Manifest retrieved for {user_id}")
    return wrap_response(manifest)


@router.post("/{user_id}")
async def update_cast_manifest(
    user_id: str,
    update: dict,
    project_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Upsert the full cast manifest for a user. Creates a new record if none exists."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Cast Update")

    effective_project_id = project_id or update.get("project_id")

    statement = select(CastManifest).where(CastManifest.user_id == user_id)
    if effective_project_id:
        statement = statement.where(CastManifest.project_id == effective_project_id)

    result = await session.execute(statement)
    db_manifest = result.scalars().first()

    if not db_manifest:
        logger.info(f"[CAST] Initializing new manifest record for user {user_id}")
        db_manifest = CastManifest(user_id=user_id, project_id=effective_project_id)

    protected_fields = {"id", "user_id", "created_at", "updated_at"}
    for key, value in update.items():
        if key in protected_fields:
            continue
        if hasattr(db_manifest, key):
            setattr(db_manifest, key, value)

    db_manifest.updated_at = datetime.utcnow()
    session.add(db_manifest)

    try:
        await session.commit()
        await session.refresh(db_manifest)
        logger.success(f"[CAST] Manifest synchronized for user {user_id}")
        return wrap_response(db_manifest, "Cast Manifest Synced")
    except Exception as e:
        logger.error(f"[CAST] Sync failure: {e}")
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Cast sync failure: {str(e)}")


@router.get("/history/{user_id}")
async def get_cast_history(
    user_id: str,
    limit: int = 10,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the cast history for a user."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized History Access")

    statement = (
        select(CastManifest)
        .where(CastManifest.user_id == user_id)
        .order_by(CastManifest.updated_at.desc())
        .limit(limit)
    )
    result = await session.execute(statement)
    history = result.scalars().all()
    logger.info(f"[CAST] History stack ({len(history)} frames) retrieved for {user_id}")
    return wrap_response(history)
