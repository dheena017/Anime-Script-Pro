from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from backend.database import AsyncSession, get_async_session
from backend.database.models.projects import Episode
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import List, Optional, Dict, Any
import os
import json
import time
import uuid
import zipfile
import base64
import asyncio
from pydantic import BaseModel

router = APIRouter(prefix="/api/series", tags=["episodes"])


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
            for idx, _scene in enumerate(scenes, start=1):
                scene_prompt = (
                    _scene.get('videoPrompts')
                    or _scene.get('narration')
                    or _scene.get('visuals')
                    or _scene.get('sceneOutput', {}).get('narration')
                    or _scene.get('sceneOutput', {}).get('visuals')
                    or ''
                )
                img_bytes = base64.b64decode(one_px_png_base64)
                z.writestr(f'images/scene_{idx}.png', img_bytes)
                z.writestr(f'videos/scene_{idx}.txt', scene_prompt)
                z.writestr(f'videos/scene_{idx}.mp4', b'SIMULATED_VIDEO_PLACEHOLDER')

    return {
        "download_url": f"/static/exports/{filename}",
        "filename": filename,
    }


def _cleanup_expired_render_jobs() -> int:
    now = time.time()
    expired_job_ids: List[str] = []

    for job_id, job in render_jobs.items():
        updated_at = float(job.get("updated_at", now))
        if now - updated_at > RENDER_JOB_TTL_SECONDS:
            expired_job_ids.append(job_id)

    removed_count = 0
    for job_id in expired_job_ids:
        job = render_jobs.pop(job_id, None)
        if not job:
            continue

        filename = job.get("filename")
        if filename:
            file_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'exports', filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass
        removed_count += 1

    return removed_count


async def _render_worker_loop() -> None:
    while True:
        job_id = await render_job_queue.get()
        job = render_jobs.get(job_id)
        if not job:
            render_job_queue.task_done()
            continue

        if job.get("status") == "cancelled":
            job["updated_at"] = time.time()
            render_job_queue.task_done()
            _cleanup_expired_render_jobs()
            continue

        job["status"] = "running"
        job["updated_at"] = time.time()

        try:
            result = await asyncio.to_thread(
                _build_episode_export_zip,
                job["episode_package"],
                job["generate_assets"],
            )
            job["status"] = "completed"
            job["download_url"] = result["download_url"]
            job["filename"] = result["filename"]
        except Exception as e:
            job["status"] = "failed"
            job["error"] = str(e)
        finally:
            job["updated_at"] = time.time()
            render_job_queue.task_done()
            _cleanup_expired_render_jobs()


async def _ensure_render_worker() -> None:
    global render_worker_task
    async with render_worker_lock:
        if render_worker_task is None or render_worker_task.done():
            render_worker_task = asyncio.create_task(_render_worker_loop())


@router.get("/episodes", response_model=List[Episode])
async def get_episodes(
    project_id: Optional[int] = None,
    user_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    effective_user_id = user_id or auth_user_id
    statement = select(Episode).where(Episode.user_id == effective_user_id)
    if project_id:
        statement = statement.where(Episode.project_id == project_id)

    result = await session.execute(statement)
    return result.scalars().all()


@router.post("/episodes", response_model=Episode)
async def create_episode(
    episode: Episode,
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id)
):
    episode.user_id = episode.user_id or auth_user_id
    session.add(episode)
    await session.commit()
    await session.refresh(episode)
    return episode


@router.put("/episodes/{episode_id}", response_model=Episode)
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
    return db_episode


@router.delete("/episodes/{episode_id}")
async def delete_episode(
    episode_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    db_episode = await session.get(Episode, episode_id)
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    await session.delete(db_episode)
    await session.commit()
    return {"status": "success", "message": "Episode deleted"}


@router.post('/episodes/render')
async def render_episode(
    episode_package: dict,
    generate_assets: bool = Query(False, description="If true, create placeholder images/videos for each scene"),
    auth_user_id: str = Depends(get_auth_user_id)
):
    """Create a ZIP export for an episode package on the server.

    This endpoint writes the provided `episode_package` as `sidecar.json` and,
    when `generate_assets` is true, generates placeholder image/video files for
    each scene along with a text file containing the scene's video prompt. The
    ZIP is saved under `backend/static/exports/` and a public download URL is
    returned.
    """
    try:
        result = _build_episode_export_zip(episode_package, generate_assets)
        return {
            "status": "ok",
            "downloadUrl": result["download_url"],
            "filename": result["filename"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create export: {e}")


@router.post('/episodes/render/jobs')
async def create_render_job(
    request: RenderJobRequest,
    auth_user_id: str = Depends(get_auth_user_id)
):
    await _ensure_render_worker()
    _cleanup_expired_render_jobs()

    job_id = f"job_{int(time.time())}_{uuid.uuid4().hex[:10]}"
    now = time.time()
    render_jobs[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "created_at": now,
        "updated_at": now,
        "user_id": auth_user_id,
        "generate_assets": request.generate_assets,
        "episode_package": request.episode_package,
        "download_url": None,
        "filename": None,
        "error": None,
    }

    await render_job_queue.put(job_id)
    queue_size = render_job_queue.qsize()

    return {
        "status": "accepted",
        "jobId": job_id,
        "queueSize": queue_size,
    }


@router.get('/episodes/render/jobs/{job_id}', response_model=RenderJobStatus)
async def get_render_job_status(
    job_id: str,
    auth_user_id: str = Depends(get_auth_user_id)
):
    _cleanup_expired_render_jobs()
    job = render_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Render job not found")

    if job["user_id"] != auth_user_id:
        raise HTTPException(status_code=403, detail="You do not have access to this render job")

    return RenderJobStatus(
        job_id=job["job_id"],
        status=job["status"],
        created_at=job["created_at"],
        updated_at=job["updated_at"],
        user_id=job["user_id"],
        generate_assets=job["generate_assets"],
        download_url=job.get("download_url"),
        filename=job.get("filename"),
        error=job.get("error"),
    )


@router.delete('/episodes/render/jobs/{job_id}')
async def delete_render_job(
    job_id: str,
    auth_user_id: str = Depends(get_auth_user_id)
):
    _cleanup_expired_render_jobs()
    job = render_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Render job not found")

    if job["user_id"] != auth_user_id:
        raise HTTPException(status_code=403, detail="You do not have access to this render job")

    status_value = job.get("status")

    if status_value in {"queued", "running"}:
        job["status"] = "cancelled"
        job["updated_at"] = time.time()
        return {
            "status": "ok",
            "jobId": job_id,
            "message": "Render job cancelled",
        }

    filename = job.get("filename")
    if filename:
        file_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'exports', filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass

    render_jobs.pop(job_id, None)
    return {
        "status": "ok",
        "jobId": job_id,
        "message": "Render job deleted",
    }
