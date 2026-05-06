from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from backend.database import AsyncSession, async_engine
from loguru import logger
from backend.database.models import Scene, Episode, Project
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Scenes"])


@router.post("/scenes")
async def batch_create_scenes(payload: dict, user_id: str = Depends(get_auth_user_id)):
    """Batch create or update scenes.

    If `episode_id` is not provided the handler will infer episode numbers
    from each `scene_number` and create missing `Episode` records for the
    project as needed.
    """
    project_id = payload.get("project_id")
    scenes_data = payload.get("scenes", [])
    episode_id = payload.get("episode_id")
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

        created_scenes = []
        episode_map: dict = {}

        # Helper to ensure episode exists for given episode_number
        async def ensure_episode(ep_num: int):
            if ep_num in episode_map:
                return episode_map[ep_num]
            statement = select(Episode).where(Episode.project_id == project_pk, Episode.episode_number == ep_num)
            result = await session.execute(statement)
            existing = result.scalars().first()
            if existing:
                episode_map[ep_num] = existing.id
                return existing.id
            db_episode = Episode(
                project_id=project_pk,
                episode_number=ep_num,
                user_id=user_id,
                title=f"Episode {ep_num}"
            )
            session.add(db_episode)
            await session.commit()
            await session.refresh(db_episode)
            episode_map[ep_num] = db_episode.id
            return db_episode.id

        for s in scenes_data:
            # allow per-scene episode_id override if provided
            if s.get("episode_id"):
                ep_id = int(s.get("episode_id"))
            elif episode_id is not None:
                ep_id = int(episode_id)
            else:
                scene_number = s.get("scene_number") or 0
                try:
                    ep_num = ((int(scene_number) - 1) // 16) + 1 if int(scene_number) > 0 else 1
                except Exception:
                    ep_num = 1
                ep_id = await ensure_episode(ep_num)

            db_scene = Scene(
                project_id=project_pk,
                episode_id=int(ep_id),
                scene_number=s.get("scene_number") or 0,
                status=s.get("status", "QUEUED"),
                visual_variance_index=s.get("visual_variance_index", 0),
                prompt=s.get("prompt"),
                content=s.get("content")
            )
            session.add(db_scene)
            created_scenes.append(db_scene)

        await session.commit()
        # refresh to populate ids
        for cs in created_scenes:
            await session.refresh(cs)

        # prepare response payload
        episodes_out = []
        for ep_num, ep_id in episode_map.items():
            episodes_out.append({"episode_number": int(ep_num), "episode_id": int(ep_id)})

        scenes_out = []
        for cs in created_scenes:
            scenes_out.append({
                "id": cs.id,
                "project_id": cs.project_id,
                "episode_id": cs.episode_id,
                "scene_number": cs.scene_number,
                "status": cs.status,
            })

        logger.info(f"[SCENES] Batch scaffold sync for project {project_pk}")
        return {"episodes": episodes_out, "scenes": scenes_out}


@router.get("/scenes")
async def get_scenes(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Get scenes for a project (ownership required)."""
    async with AsyncSession(async_engine) as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        statement = select(Scene).where(Scene.project_id == project_id)
        result = await session.execute(statement)
        return result.scalars().all()
