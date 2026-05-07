from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, async_engine
from loguru import logger
from backend.database.models import Episode, Project
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Episodes"])


@router.post("/episodes")
async def batch_create_episodes(payload: dict, user_id: str = Depends(get_auth_user_id)):
    project_id = payload.get("project_id")
    episodes_data = payload.get("episodes", [])
    session_id = payload.get("session_id")
    if project_id is None or str(project_id).strip() == "":
        raise HTTPException(status_code=400, detail="project_id is required")

    try:
        project_pk = int(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="project_id must be an integer")

    async with AsyncSession(async_engine) as session:
        # Verify project ownership
        project = await session.get(Project, project_pk)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        created = []
        for e in episodes_data:
            db_episode = Episode(
                project_id=project_pk,
                session_id=session_id,
                user_id=user_id,
                episode_number=e.get("episode_number") or 0,
                title=e.get("title") or "Untitled Episode",
                hook=e.get("hook"),
                summary=e.get("summary")
            )
            session.add(db_episode)
            created.append(db_episode)

        await session.commit()
        # refresh to populate ids
        for ep in created:
            await session.refresh(ep)

        episodes_out = []
        for ep in created:
            episodes_out.append({
                "id": ep.id,
                "episode_id": ep.id,
                "episode_number": ep.episode_number,
                "title": ep.title,
            })

        logger.info(f"[EPISODES] Batch synchronized for session {session_id}")
        return episodes_out


@router.get("/episodes")
async def get_episodes(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Get episodes for a project (ownership required)."""
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        statement = select(Episode).where(Episode.project_id == project_id)
        result = await session.execute(statement)
        return result.scalars().all()

