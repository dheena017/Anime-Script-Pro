from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from backend.database import async_session, async_engine, AsyncSession, get_async_session
from loguru import logger
from backend.database.models import Episode, Project
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import List, Optional, Dict, Any
import os, json, time, uuid, zipfile, base64, asyncio
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Episodes"])

# --- Neural Response Wrapper ---
def wrap_response(data: Any, message: str = "Success"):
    return {
        "status": "success",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }

# --- Core CRUD ---

@router.get("/episodes")
async def get_episodes(project_id: int, user_id: str = Depends(get_auth_user_id), session: AsyncSession = Depends(get_async_session)):
    """Get episodes for a project (ownership required)."""
    # Verify project ownership
    project = await session.get(Project, project_id)
    if not project or project.user_id != user_id:
        raise HTTPException(status_code=401, detail="Project access denied")

    statement = select(Episode).where(Episode.project_id == project_id)
    result = await session.execute(statement)
    episodes = result.scalars().all()
    logger.info(f"[EPISODES] Retrieved {len(episodes)} materializations for project {project_id}")
    return wrap_response(episodes)

@router.post("/episodes")
async def create_episode(
    episode: Episode,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    episode.user_id = episode.user_id or auth_user_id
    session.add(episode)
    await session.commit()
    await session.refresh(episode)
    logger.success(f"[EPISODES] Materialized Episode {episode.episode_number}: {episode.title}")
    return wrap_response(episode, "Episode Materialized")

@router.put("/episodes/{episode_id}")
async def update_episode(
    episode_id: int,
    updates: dict,
    session: AsyncSession = Depends(get_async_session)
):
    db_episode = await session.get(Episode, episode_id)
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    for key, value in updates.items():
        if hasattr(db_episode, key):
            setattr(db_episode, key, value)
    
    db_episode.updated_at = datetime.utcnow()
    session.add(db_episode)
    await session.commit()
    await session.refresh(db_episode)
    logger.info(f"[EPISODES] Updated materialization: {db_episode.title}")
    return wrap_response(db_episode, "Episode Updated")

@router.delete("/episodes/{episode_id}")
async def delete_episode(
    episode_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    db_episode = await session.get(Episode, episode_id)
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    
    title = db_episode.title
    await session.delete(db_episode)
    await session.commit()
    logger.warning(f"[EPISODES] Purged materialization: {title}")
    return wrap_response(None, f"Episode '{title}' Purged")

# --- Render System ---

class RenderJobRequest(BaseModel):
    episode_package: Dict[str, Any]
    generate_assets: bool = False

class RenderJobStatus(BaseModel):
    job_id: str
    status: str
    created_at: float
    updated_at: float
    user_id: str
    generate_assets: bool
    download_url: Optional[str] = None
    filename: Optional[str] = None
    error: Optional[str] = None

render_job_queue: "asyncio.Queue[str]" = asyncio.Queue()
render_jobs: Dict[str, Dict[str, Any]] = {}
render_worker_task: Optional[asyncio.Task] = None
render_worker_lock = asyncio.Lock()
RENDER_JOB_TTL_SECONDS = int(os.getenv("RENDER_JOB_TTL_SECONDS", "86400"))

def _build_episode_export_zip(episode_package: dict, generate_assets: bool) -> Dict[str, str]:
    exports_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'exports')
    os.makedirs(exports_dir, exist_ok=True)

    timestamp = int(time.time())
    uid = uuid.uuid4().hex[:8]
    filename = f"episode_export_{timestamp}_{uid}.zip"
    zip_path = os.path.join(exports_dir, filename)

    one_px_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="

    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr('sidecar.json', json.dumps(episode_package, indent=2))
        if generate_assets:
            scenes = episode_package.get('scenes', []) or []
            for idx, _ in enumerate(scenes, start=1):
                img_bytes = base64.b64decode(one_px_png_base64)
                z.writestr(f'images/scene_{idx}.png', img_bytes)

    return {"download_url": f"/static/exports/{filename}", "filename": filename}

async def _render_worker_loop():
    while True:
        job_id = await render_job_queue.get()
        job = render_jobs.get(job_id)
        if not job: 
            render_job_queue.task_done()
            continue

        job["status"] = "running"
        job["updated_at"] = time.time()
        logger.info(f"[RENDER] Job {job_id} starting for user {job['user_id']}...")

        try:
            result = await asyncio.to_thread(_build_episode_export_zip, job["episode_package"], job["generate_assets"])
            job["status"] = "completed"
            job["download_url"] = result["download_url"]
            job["filename"] = result["filename"]
            logger.success(f"[RENDER] Job {job_id} completed successfully.")
        except Exception as e:
            job["status"] = "failed"
            job["error"] = str(e)
            logger.error(f"[RENDER] Job {job_id} failed: {e}")
        finally:
            job["updated_at"] = time.time()
            render_job_queue.task_done()

async def _ensure_render_worker():
    global render_worker_task
    async with render_worker_lock:
        if render_worker_task is None or render_worker_task.done():
            render_worker_task = asyncio.create_task(_render_worker_loop())

@router.post('/episodes/render/jobs')
async def create_render_job(request: RenderJobRequest, auth_user_id: str = Depends(get_auth_user_id)):
    await _ensure_render_worker()
    job_id = f"job_{int(time.time())}_{uuid.uuid4().hex[:10]}"
    now = time.time()
    render_jobs[job_id] = {
        "job_id": job_id, "status": "queued", "created_at": now, "updated_at": now,
        "user_id": auth_user_id, "generate_assets": request.generate_assets,
        "episode_package": request.episode_package, "download_url": None, "filename": None, "error": None
    }
    await render_job_queue.put(job_id)
    logger.info(f"[RENDER] Job {job_id} queued by {auth_user_id}")
    return {"status": "accepted", "jobId": job_id, "queueSize": render_job_queue.qsize()}

@router.get('/episodes/render/jobs/{job_id}', response_model=RenderJobStatus)
async def get_render_job_status(job_id: str, auth_user_id: str = Depends(get_auth_user_id)):
    job = render_jobs.get(job_id)
    if not job: raise HTTPException(status_code=404, detail="Job not found")
    if job["user_id"] != auth_user_id: raise HTTPException(status_code=403)
    return RenderJobStatus(**job)
