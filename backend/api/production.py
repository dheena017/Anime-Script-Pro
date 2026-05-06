from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.database.models import ProjectContent
from datetime import datetime
from typing import Optional, List

router = APIRouter(prefix="/api/production", tags=["production"])

@router.get("/{user_id}", response_model=Optional[ProjectContent])
async def get_production_content(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session)):
    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if project_id:
        statement = statement.where(ProjectContent.project_id == project_id)
    
    statement = statement.order_by(ProjectContent.updated_at.desc())
    result = await session.execute(statement)
    return result.scalars().first()

@router.post("/{user_id}", response_model=ProjectContent)
async def update_production_content(user_id: str, update: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session)):
    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if project_id:
        statement = statement.where(ProjectContent.project_id == project_id)
    
    result = await session.execute(statement)
    db_content = result.scalars().first()
    
    if not db_content:
        db_content = ProjectContent(user_id=user_id, project_id=project_id)
    
    for key, value in update.items():
        if hasattr(db_content, key):
            setattr(db_content, key, value)
    
    db_content.updated_at = datetime.utcnow()
    
    session.add(db_content)
    await session.commit()
    await session.refresh(db_content)
    return db_content
