from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from backend.database import async_session, get_async_session, AsyncSession
from backend.database.models import Project, ProjectContent
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/production", tags=["production"])


def resolve_project_id(route_project_id: Optional[int], header_project_id: Optional[int]) -> Optional[int]:
    return route_project_id or header_project_id

@router.get("/{user_id}", response_model=Optional[ProjectContent])
async def get_production_content(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Production Access")

    effective_project_id = resolve_project_id(project_id, x_project_id)

    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if effective_project_id is not None:
        project = await session.get(Project, effective_project_id)
        if not project or project.user_id != auth_user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        statement = statement.where(ProjectContent.project_id == effective_project_id)
    
    statement = statement.order_by(ProjectContent.updated_at.desc())
    result = await session.execute(statement)
    return result.scalars().first()

@router.post("/{user_id}", response_model=ProjectContent)
async def update_production_content(
    user_id: str,
    update: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    if user_id != auth_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized Production Update")

    effective_project_id = resolve_project_id(project_id, x_project_id)

    if effective_project_id is not None:
        project = await session.get(Project, effective_project_id)
        if not project or project.user_id != auth_user_id:
            raise HTTPException(status_code=404, detail="Production project not found")

    statement = select(ProjectContent).where(ProjectContent.user_id == user_id)
    if effective_project_id is not None:
        statement = statement.where(ProjectContent.project_id == effective_project_id)
    
    result = await session.execute(statement)
    db_content = result.scalars().first()
    
    if not db_content:
        db_content = ProjectContent(user_id=user_id, project_id=effective_project_id)
    elif effective_project_id is not None and db_content.project_id != effective_project_id:
        db_content.project_id = effective_project_id
    
    for key, value in update.items():
        if key in {"id", "user_id", "project_id", "created_at", "updated_at"}:
            continue
        if hasattr(db_content, key):
            setattr(db_content, key, value)
    
    db_content.updated_at = datetime.utcnow()
    
    session.add(db_content)
    await session.commit()
    await session.refresh(db_content)
    return db_content
