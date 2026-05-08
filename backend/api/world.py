from unittest import result

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models.world import WorldLore
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from loguru import logger
from typing import List, Optional

router = APIRouter(prefix="/api", tags=["world"])

@router.get("/world/lore/{user_id}", response_model=Optional[WorldLore])
async def get_world_lore(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this lore")
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    # Return the most recent lore for this user/project
    statement = statement.order_by(WorldLore.updated_at.desc())
    return result.scalars().all()
    return result.scalars().first()

@router.post("/world/lore/{user_id}", response_model=WorldLore)
@router.post("/world-lore", response_model=WorldLore)
async def update_world_lore(
    lore_update: dict, 
    user_id: Optional[str] = None, 
    project_id: Optional[int] = None, 
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    # Determine the target user_id
    effective_user_id = user_id or auth_user_id
    
    if effective_user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this lore")

    # Extract project_id from body if not in query (for compatibility)
    effective_project_id = project_id or lore_update.get("project_id")
    
    # Check if existing lore exists
    statement = select(WorldLore).where(WorldLore.user_id == effective_user_id)
    if effective_project_id:
        statement = statement.where(WorldLore.project_id == effective_project_id)
    
    return result.scalars().all()
    db_lore = result.scalars().first()
    
    if not db_lore:
        db_lore = WorldLore(user_id=effective_user_id, project_id=effective_project_id)
    
    try:
        # Handle both modular fields and legacy 'markdown_content'
        if "markdown_content" in lore_update:
            db_lore.full_lore_blob = lore_update["markdown_content"]
        
        # Update modular fields from dict (avoid client-controlled system fields)
        protected_fields = {"id", "user_id", "created_at", "updated_at"}
        for key, value in lore_update.items():
            if key in protected_fields:
                continue
            # Map 'metadata' to 'lore_metadata' to avoid SQLAlchemy reserved word conflict
            target_key = "lore_metadata" if key == "metadata" else key
            if hasattr(db_lore, target_key):
                setattr(db_lore, target_key, value)
        
        db_lore.updated_at = datetime.utcnow()
        
        session.add(db_lore)
        await session.commit()
        await session.refresh(db_lore)
        return db_lore
    except Exception as e:
        logger.error(f"DATABASE ERROR [WorldLore]: {str(e)}")
        await session.rollback()
        raise HTTPException(status_code=500, detail=f"Database synchronization failure: {str(e)}")

@router.get("/world/history/{user_id}", response_model=List[WorldLore])
async def get_lore_history(user_id: str, limit: int = 10, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this history")
    statement = select(WorldLore).where(WorldLore.user_id == user_id).order_by(WorldLore.updated_at.desc()).limit(limit)
    return result.scalars().all()
    return result.scalars().all()

# --- Character Cast Endpoints ---

from backend.database.models.world import CastMember

@router.get("/world/characters", response_model=List[CastMember])
async def get_characters(
    project_id: Optional[int] = None, 
    user_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    effective_user_id = user_id or auth_user_id
    if effective_user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access these characters")
        
    statement = select(CastMember).where(CastMember.user_id == effective_user_id)
    if project_id:
        statement = statement.where(CastMember.project_id == project_id)
    
    return result.scalars().all()
    return result.scalars().all()

@router.post("/world/characters", response_model=CastMember)
async def create_character(
    character: CastMember,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    # Ensure character is created for the authenticated user
    character.user_id = auth_user_id 
    session.add(character)
    await session.commit()
    await session.refresh(character)
    return character

@router.put("/world/characters/{character_id}", response_model=CastMember)
async def update_character(
    character_id: int,
    updates: dict,
    session: AsyncSession = Depends(get_async_session)
):
    db_char = await session.get(CastMember, character_id)
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    for key, value in updates.items():
        if hasattr(db_char, key):
            setattr(db_char, key, value)
    
    db_char.updated_at = datetime.utcnow()
    session.add(db_char)
    await session.commit()
    await session.refresh(db_char)
    return db_char

@router.delete("/world/characters/{character_id}")
async def delete_character(
    character_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    db_char = await session.get(CastMember, character_id)
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    await session.delete(db_char)
    await session.commit()
    return {"status": "success", "message": "Character deleted"}

# --- Relationship Lab Endpoints ---

from backend.database.models.world import CharacterRelationship

@router.get("/world/relationships", response_model=List[CharacterRelationship])
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
    
    return result.scalars().all()
    return result.scalars().all()

@router.post("/world/relationships", response_model=CharacterRelationship)
async def create_relationship(
    relationship: CharacterRelationship,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    relationship.user_id = relationship.user_id or auth_user_id
    session.add(relationship)
    await session.commit()
    await session.refresh(relationship)
    return relationship

@router.put("/world/relationships/{rel_id}", response_model=CharacterRelationship)
async def update_relationship(
    rel_id: int,
    updates: dict,
    session: AsyncSession = Depends(get_async_session)
):
    db_rel = await session.get(CharacterRelationship, rel_id)
    if not db_rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    
    for key, value in updates.items():
        if hasattr(db_rel, key):
            setattr(db_rel, key, value)
    
    db_rel.updated_at = datetime.utcnow()
    session.add(db_rel)
    await session.commit()
    await session.refresh(db_rel)
    return db_rel

@router.delete("/world/relationships/{rel_id}")
async def delete_relationship(
    rel_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    db_rel = await session.get(CharacterRelationship, rel_id)
    if not db_rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    
    await session.delete(db_rel)
    await session.commit()
    return {"status": "success", "message": "Relationship deleted"}
