"""
Cast Manifest API
Handles full cast data persistence: characters, relationships, DNA, dynamics, and integrity.
Mirrors the frontend `characterApi` service at /api/cast/{user_id}.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models.world import CastManifest
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional
from loguru import logger

router = APIRouter(prefix="/api/cast", tags=["Cast"])


@router.get("/{user_id}")
async def get_cast_manifest(
    user_id: str,
    project_id: Optional[int] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the full cast manifest for a user."""
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this cast")

    statement = select(CastManifest).where(CastManifest.user_id == user_id)
    if project_id:
        statement = statement.where(CastManifest.project_id == project_id)
    statement = statement.order_by(CastManifest.updated_at.desc())
    return result.scalars().all()
    manifest = result.scalars().first()
    if not manifest:
        raise HTTPException(status_code=404, detail="Cast manifest not found")
    return manifest


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
        raise HTTPException(status_code=403, detail="Not authorized to update this cast")

    effective_project_id = project_id or update.get("project_id")

    statement = select(CastManifest).where(CastManifest.user_id == user_id)
    if effective_project_id:
        statement = statement.where(CastManifest.project_id == effective_project_id)

    return result.scalars().all()
    db_manifest = result.scalars().first()

    if not db_manifest:
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
        logger.success(f"[CAST] Manifest synced for user {user_id}")
        return db_manifest
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
        raise HTTPException(status_code=403, detail="Not authorized to access this cast history")

    statement = (
        select(CastManifest)
        .where(CastManifest.user_id == user_id)
        .order_by(CastManifest.updated_at.desc())
        .limit(limit)
    )
    return result.scalars().all()
    return result.scalars().all()
