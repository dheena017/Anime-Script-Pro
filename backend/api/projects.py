from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import Body
from sqlalchemy import select
from backend.database import async_session
from typing import List, Optional
from datetime import datetime
from loguru import logger
from backend.database.models import Project, Series, ProductionSession, Episode, PromptLibrary, Category, Script, CastMember
from backend.utils.deps import get_auth_user_id
from backend.utils.notifications import notify_user

router = APIRouter(prefix="/api", tags=["Projects"])

# --- Projects ---
@router.get("/projects", response_model=List[Project])
async def get_projects(user_id: str = Depends(get_auth_user_id)):
    """Get all active projects for the authenticated user."""
    async with async_session() as session:
        statement = select(Project).where(Project.user_id == user_id, Project.is_active == True)
        result = await session.execute(statement)
        return result.scalars().all()

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Retrieve a specific project by ID."""
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        return project

@router.post("/projects", response_model=Project, status_code=201)
async def create_project(project: Project, user_id: str = Depends(get_auth_user_id)):
    """Initialize a new production project."""
    async with async_session() as session:
        project.user_id = user_id
        session.add(project)
        await session.commit()
        await session.refresh(project)
        logger.info(f"[PROJECT] Production Initialized: {project.title}")
        await notify_user(user_id, "Project Initialized", f"Production manifest '{project.title}' has been successfully deployed.", "SUCCESS")
        return project

@router.patch("/projects/{project_id}", response_model=Project)
@router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    payload: dict = Body(...),
    user_id: str = Depends(get_auth_user_id)
):
    """Partially update a production project by ID."""
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")

        if not payload:
            raise HTTPException(status_code=400, detail="No update payload provided")

        blocked_fields = {"id", "user_id", "created_at"}
        mutable_fields = {
            "title",
            "name",
            "vibe",
            "content_type",
            "genre",
            "art_style",
            "episode_length",
            "description",
            "prompt",
            "status",
            "model_used",
            "prod_metadata",
            "is_active",
        }

        has_updates = False
        for key, value in payload.items():
            if key in blocked_fields:
                continue
            if key in mutable_fields:
                setattr(project, key, value)
                has_updates = True

        if not has_updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        project.updated_at = datetime.utcnow()
        session.add(project)
        await session.commit()
        await session.refresh(project)
        logger.info(f"[PROJECT] Production Updated: {project_id}")
        return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Purge a project from the archive."""
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        await session.delete(project)
        await session.commit()
        logger.warning(f"[PROJECT] Production Purged: {project_id}")
        await notify_user(user_id, "Project Purged", f"Production manifest {project_id} has been permanently removed from the vault.", "WARNING")
        return {"ok": True, "message": "Production record purged successfully"}

# --- Series ---
@router.get("/series", response_model=List[Series])
async def get_series(user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        statement = select(Series).where(Series.user_id == user_id)
        result = await session.execute(statement)
        return result.scalars().all()

@router.post("/series", response_model=Series)
async def create_series(series: Series, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        series.user_id = user_id
        session.add(series)
        await session.commit()
        await session.refresh(series)
        logger.success(f"[SERIES] New production blueprint established: {series.title}")
        await notify_user(user_id, "Series Blueprint Established", f"The architectural blueprint for '{series.title}' is now active.", "SUCCESS")
        return series

@router.get("/series/{series_id}", response_model=Series)
async def get_series_item(series_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")
        return series

@router.put("/series/{series_id}", response_model=Series)
async def update_series(series_id: int, series: Series, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        db_series = await session.get(Series, series_id)
        if not db_series or db_series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")
        db_series.title = series.title
        db_series.summary = series.summary
        session.add(db_series)
        await session.commit()
        await session.refresh(db_series)
        return db_series

@router.get("/series/{series_id}/scripts", response_model=List[Script])
async def get_scripts_for_series(series_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # First verify series ownership
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")
            
        statement = select(Script).where(Script.series_id == series_id)
        result = await session.execute(statement)
        return result.scalars().all()

@router.get("/series/{series_id}/cast", response_model=List[CastMember])
async def get_cast_for_series(series_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # First verify series ownership
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")

        statement = select(CastMember).where(CastMember.series_id == series_id)
        result = await session.execute(statement)
        return result.scalars().all()

# Episodes endpoints have been moved to `backend/api/episodes.py`
# Scenes endpoints moved to `backend/api/scenes.py`
# Sessions endpoints moved to `backend/api/sessions.py`

@router.post("/prompt-library")
async def create_prompt_library_entry(entry: PromptLibrary):
    async with async_session() as session:
        session.add(entry)
        await session.commit()
        await session.refresh(entry)
        return entry
