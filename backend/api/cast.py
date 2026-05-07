"""
Cast Manifest API
Handles full cast data persistence: characters, relationships, DNA, dynamics, and integrity.
Mirrors the frontend `characterApi` service at /api/cast/{user_id}.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.database.models.world import CastManifest, CastMember, CharacterRelationship
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import List, Optional
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
    result = await session.execute(statement)
    manifest = result.scalars().first()
    if not manifest:
        # Return empty manifest instead of 404 to avoid frontend breaks
        return {"user_id": user_id, "project_id": project_id, "characters": [], "relationships": []}
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

    result = await session.execute(statement)
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


# --- Legacy Granular Character Endpoints ---

@router.get("/characters", response_model=List[CastMember])
async def get_characters(
    project_id: Optional[int] = None, 
    user_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    effective_user_id = user_id or auth_user_id
    if effective_user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    statement = select(CastMember).where(CastMember.user_id == effective_user_id)
    if project_id:
        statement = statement.where(CastMember.project_id == project_id)
    
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/characters", response_model=CastMember)
async def create_character(
    character: CastMember,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    character.user_id = auth_user_id 
    session.add(character)
    await session.commit()
    await session.refresh(character)
    return character

@router.put("/characters/{character_id}", response_model=CastMember)
async def update_character(
    character_id: int,
    updates: dict,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    db_char = await session.get(CastMember, character_id)
    if not db_char or db_char.user_id != auth_user_id:
        raise HTTPException(status_code=404, detail="Character not found")
    
    for key, value in updates.items():
        if hasattr(db_char, key):
            setattr(db_char, key, value)
    
    db_char.updated_at = datetime.utcnow()
    session.add(db_char)
    await session.commit()
    await session.refresh(db_char)
    return db_char

@router.delete("/characters/{character_id}")
async def delete_character(
    character_id: int,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    db_char = await session.get(CastMember, character_id)
    if not db_char or db_char.user_id != auth_user_id:
        raise HTTPException(status_code=404, detail="Character not found")
    
    await session.delete(db_char)
    await session.commit()
    return {"status": "success"}

# --- Legacy Granular Relationship Endpoints ---

@router.get("/relationships", response_model=List[CharacterRelationship])
async def get_relationships(
    project_id: Optional[int] = None, 
    user_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    effective_user_id = user_id or auth_user_id
    statement = select(CharacterRelationship).where(CharacterRelationship.user_id == effective_user_id)
    if project_id:
        statement = statement.where(CharacterRelationship.project_id == project_id)
    
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/relationships", response_model=CharacterRelationship)
async def create_relationship(
    relationship: CharacterRelationship,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    relationship.user_id = auth_user_id
    session.add(relationship)
    await session.commit()
    await session.refresh(relationship)
    return relationship
