from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from backend.database import async_session, async_engine
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

    async with async_session() as session:
        # Verify project ownership
        project = await session.get(Project, project_pk)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        # 1. Pre-fetch all episodes for the project to avoid N+1 lookups
        ep_statement = select(Episode).where(Episode.project_id == project_pk)
        ep_result = await session.execute(ep_statement)
        episode_map = {ep.episode_number: ep.id for ep in ep_result.scalars().all()}

        created_scenes = []

        # Helper to ensure episode exists for given episode_number
        async def ensure_episode(ep_num: int):
            if ep_num in episode_map:
                return episode_map[ep_num]

            # If not in map, double check DB (though pre-fetch should have got it)
            statement = select(Episode).where(Episode.project_id == project_pk, Episode.episode_number == ep_num)
            res = await session.execute(statement)
            existing = res.scalars().first()
            if existing:
                episode_map[ep_num] = existing.id
                return existing.id

            # Create if still not found
            db_episode = Episode(
                project_id=project_pk,
                episode_number=ep_num,
                user_id=user_id,
                title=f"Episode {ep_num}"
            )
            session.add(db_episode)
            await session.flush() # Flush instead of commit to keep session active and avoid N+1 commit overhead
            episode_map[ep_num] = db_episode.id
            return db_episode.id

        # 2. Build scene objects
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
            created_scenes.append(db_scene)

        # 3. Bulk add and commit
        if created_scenes:
            session.add_all(created_scenes)
            await session.flush() # Populate IDs for response before commit expires them

        # prepare response payload BEFORE commit to avoid N+1 refresh/lazy loading
        scenes_out = []
        for cs in created_scenes:
            scenes_out.append({
                "id": cs.id,
                "project_id": cs.project_id,
                "episode_id": cs.episode_id,
                "scene_number": cs.scene_number,
                "status": cs.status,
            })

        await session.commit()

        episodes_out = []
        for ep_num, ep_id in episode_map.items():
            episodes_out.append({"episode_number": int(ep_num), "episode_id": int(ep_id)})

        logger.info(f"[SCENES] Batch scaffold sync for project {project_pk}")
        return {"episodes": episodes_out, "scenes": scenes_out}


@router.get("/scenes")
async def get_scenes(project_id: int, user_id: str = Depends(get_auth_user_id)):
    """Get scenes for a project (ownership required)."""
    async with async_session() as session:
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            raise HTTPException(status_code=401, detail="Project access denied")

        statement = select(Scene).where(Scene.project_id == project_id)
        res = await session.execute(statement)
        return res.scalars().all()
