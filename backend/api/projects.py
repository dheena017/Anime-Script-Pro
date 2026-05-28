"""
Anime Script Pro — Projects, Series, and Library Router

This router manages endpoints related to project instances, creative series blueprints,
associated script references, cast member list resources, and prompt libraries.

Sections (in order):
  1. Third-Party Imports
  2. Local Imports
  3. Router Initialization
  4. Projects Endpoints
  5. Series Endpoints
  6. Prompt Library Endpoints
"""

# ==============================================================================
# 1. THIRD-PARTY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from loguru import logger
from sqlalchemy import select

# ==============================================================================
# 2. LOCAL IMPORTS
# ==============================================================================
from backend.database import async_session
from backend.database.models import (
    CastMember,
    Category,
    Episode,
    ProductionSession,
    Project,
    PromptLibrary,
    Script,
    Series,
)
from backend.utils.deps import get_auth_user_id

# ==============================================================================
# 3. ROUTER INITIALIZATION
# ==============================================================================
router = APIRouter(prefix="/api", tags=["Projects"])

# ==============================================================================
# 4. PROJECTS ENDPOINTS
# ==============================================================================

@router.get("/projects", response_model=List[Project])
async def get_projects(
    user_id: str = Depends(get_auth_user_id),
    include_archived: bool = False,
) -> List[Project]:
    """Get projects for the authenticated user.

    Args:
        user_id: The authenticated user's ID.
        include_archived: Whether to include archived/inactive projects.

    Returns:
        List[Project]: List of active or all user projects.
    """
    async with async_session() as session:
        statement = select(Project).where(Project.user_id == user_id)
        if not include_archived:
            statement = statement.where(Project.is_active == True)
        result = await session.execute(statement)
        return result.scalars().all()


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(
    project_id: int,
    user_id: str = Depends(get_auth_user_id),
) -> Project:
    """Retrieve a specific project by ID.

    Args:
        project_id: The unique project ID.
        user_id: The authenticated user's ID.

    Returns:
        Project: The requested Project instance.

    Raises:
        HTTPException(404): If the project is not found or belongs to another user.
    """
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        return project


@router.post("/projects", response_model=Project, status_code=201)
async def create_project(
    project: Project,
    user_id: str = Depends(get_auth_user_id),
) -> Project:
    """Initialize a new production project.

    Args:
        project: The Project object populate metadata.
        user_id: The authenticated user's ID.

    Returns:
        Project: The created Project database instance.
    """
    async with async_session() as session:
        project.user_id = user_id
        session.add(project)
        await session.commit()
        await session.refresh(project)
        logger.info(f"[PROJECT] Production Initialized: {project.title}")
        from backend.utils.notifications import notify_user
        await notify_user(
            user_id,
            "Project Initialized",
            f"Production manifest '{project.title}' has been successfully deployed.",
            "SUCCESS",
        )
        return project


@router.patch("/projects/{project_id}", response_model=Project)
@router.put("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: int,
    payload: dict = Body(...),
    user_id: str = Depends(get_auth_user_id),
) -> Project:
    """Partially update a production project by ID.

    Args:
        project_id: The project ID.
        payload: Dictionary of fields to update.
        user_id: The authenticated user's ID.

    Returns:
        Project: The updated Project database instance.

    Raises:
        HTTPException(404): If the project is not found.
        HTTPException(400): If no update payload or no valid fields are provided.
    """
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
async def delete_project(
    project_id: int,
    user_id: str = Depends(get_auth_user_id),
) -> dict:
    """Purge a project from the archive.

    Args:
        project_id: The project ID.
        user_id: The authenticated user's ID.

    Returns:
        dict: Confirmation map.

    Raises:
        HTTPException(404): If the project is not found.
    """
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=404, detail="Production project not found")
        await session.delete(project)
        await session.commit()
        logger.warning(f"[PROJECT] Production Purged: {project_id}")
        from backend.utils.notifications import notify_user
        await notify_user(
            user_id,
            "Project Purged",
            f"Production manifest {project_id} has been permanently removed from the vault.",
            "WARNING",
        )
        return {"ok": True, "message": "Production record purged successfully"}

# ==============================================================================
# 5. SERIES ENDPOINTS
# ==============================================================================

@router.get("/series", response_model=List[Series])
async def get_series(
    user_id: str = Depends(get_auth_user_id),
) -> List[Series]:
    """Retrieve series blueprints for the user.

    Args:
        user_id: The authenticated user's ID.

    Returns:
        List[Series]: List of Series models.
    """
    async with async_session() as session:
        statement = select(Series).where(Series.user_id == user_id)
        result = await session.execute(statement)
        return result.scalars().all()


@router.post("/series", response_model=Series)
async def create_series(
    series: Series,
    user_id: str = Depends(get_auth_user_id),
) -> Series:
    """Establish a new creative series blueprint.

    Args:
        series: The Series data model.
        user_id: The authenticated user's ID.

    Returns:
        Series: The generated blueprint instance.
    """
    async with async_session() as session:
        series.user_id = user_id
        session.add(series)
        await session.commit()
        await session.refresh(series)
        logger.success(f"[SERIES] New production blueprint established: {series.title}")
        from backend.utils.notifications import notify_user
        await notify_user(
            user_id,
            "Series Blueprint Established",
            f"The architectural blueprint for '{series.title}' is now active.",
            "SUCCESS",
        )
        return series


@router.get("/series/{series_id}", response_model=Series)
async def get_series_item(
    series_id: int,
    user_id: str = Depends(get_auth_user_id),
) -> Series:
    """Get unique series item by ID.

    Args:
        series_id: The series blueprint ID.
        user_id: The authenticated user's ID.

    Returns:
        Series: The matching Series instance.

    Raises:
        HTTPException(404): If series not found.
    """
    async with async_session() as session:
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")
        return series


@router.put("/series/{series_id}", response_model=Series)
async def update_series(
    series_id: int,
    series: Series,
    user_id: str = Depends(get_auth_user_id),
) -> Series:
    """Modify details of a series blueprint.

    Args:
        series_id: The series ID to alter.
        series: The updated details payload.
        user_id: The authenticated user's ID.

    Returns:
        Series: The modified Series blueprint instance.

    Raises:
        HTTPException(404): If series not found.
    """
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
async def get_scripts_for_series(
    series_id: int,
    user_id: str = Depends(get_auth_user_id),
) -> List[Script]:
    """Retrieve all scripts configured for a specific series.

    Args:
        series_id: The series ID.
        user_id: The authenticated user's ID.

    Returns:
        List[Script]: Scripts tied to the target series.

    Raises:
        HTTPException(404): If series not found.
    """
    async with async_session() as session:
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")
            
        statement = select(Script).where(Script.series_id == series_id)
        result = await session.execute(statement)
        return result.scalars().all()


@router.get("/series/{series_id}/cast", response_model=List[CastMember])
async def get_cast_for_series(
    series_id: int,
    user_id: str = Depends(get_auth_user_id),
) -> List[CastMember]:
    """Retrieve cast roster assigned to a specific series.

    Args:
        series_id: The series ID.
        user_id: The authenticated user's ID.

    Returns:
        List[CastMember]: Roster of cast members.

    Raises:
        HTTPException(404): If series not found.
    """
    async with async_session() as session:
        series = await session.get(Series, series_id)
        if not series or series.user_id != user_id:
            raise HTTPException(status_code=404, detail="Series not found")

        statement = select(CastMember).where(CastMember.series_id == series_id)
        result = await session.execute(statement)
        return result.scalars().all()

# ==============================================================================
# 6. PROMPT LIBRARY ENDPOINTS
# ==============================================================================

@router.post("/prompt-library", response_model=PromptLibrary)
async def create_prompt_library_entry(
    entry: PromptLibrary,
) -> PromptLibrary:
    """Save an entry to the collective prompt library.

    Args:
        entry: The PromptLibrary entry model.

    Returns:
        PromptLibrary: The created library database entry.
    """
    async with async_session() as session:
        session.add(entry)
        await session.commit()
        await session.refresh(entry)
        return entry
