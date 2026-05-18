from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
import os
import time
from loguru import logger
import httpx
import asyncio
import math
from pathlib import Path
import hashlib
from typing import Optional
from backend.utils.deps import get_auth_user_id
from backend.database import async_session
from backend.database.models import Scene, Project
import json

# Simple in-memory cache for API Shielding
_render_cache = {}

router = APIRouter(prefix="/api/video", tags=["Video"])

# --- Security & Path Helpers ---

def _get_safe_outputs_dir() -> Path:
    backend_root = Path(__file__).parent.resolve().parent
    out_dir = (backend_root / 'outputs').resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    return out_dir

def _is_safe_path(base_dir: Path, target_path: Path) -> bool:
    try:
        return str(target_path.resolve()).startswith(str(base_dir.resolve()))
    except Exception:
        return False

async def cleanup_old_renders(directory: Path, max_age_hours: int = 24):
    """Scan the outputs directory and delete MP4, MP3, and PNG files older than max_age_hours in a non-blocking manner."""
    logger.info(f"Garbage Collector: Starting non-blocking cleanup of {directory}...")
    try:
        if not directory.exists() or not directory.is_dir():
            logger.warning(f"Garbage Collector: Directory {directory} does not exist. Skipping.")
            return

        max_age_seconds = max_age_hours * 3600
        now = time.time()
        deleted_count = 0

        def _scan_and_delete():
            nonlocal deleted_count
            for p in directory.glob("*"):
                if p.is_file() and p.suffix.lower() in ('.mp4', '.mp3', '.png'):
                    try:
                        file_mtime = p.stat().st_mtime
                        age = now - file_mtime
                        if age > max_age_seconds:
                            logger.info(f"Garbage Collector: Deleting expired file {p.name} (age: {age/3600:.1f} hours)")
                            p.unlink()
                            deleted_count += 1
                    except Exception as fe:
                        logger.warning(f"Garbage Collector: Failed to process file {p.name}: {fe}")
            return deleted_count

        count = await asyncio.to_thread(_scan_and_delete)
        logger.info(f"Garbage Collector: Cleanup completed. Deleted {count} expired file(s).")
    except Exception as e:
        logger.error(f"Garbage Collector: Cleanup failed: {e}")

# --- Media Processing Helpers ---

def _attach_audio_to_clip(clip, audio_clip):
    """Attach audio to a moviepy clip across different moviepy versions."""
    if hasattr(clip, 'with_audio'):
        return clip.with_audio(audio_clip)
    if hasattr(clip, 'set_audio'):
        return clip.set_audio(audio_clip)
    raise RuntimeError('moviepy clip does not support audio attachment')

def _mux_media_task(video_path: Path, audio_path: Optional[Path], out_path: Path):
    """Combine video and audio, looping or trimming video to match audio length."""
    try:
        try:
            from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips
        except ImportError:
            from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips
    except ImportError as e:
        logger.error("Failed to import MoviePy components")
        raise RuntimeError("Missing moviepy library.") from e

    logger.info(f"Muxing {video_path.name} and {audio_path.name if audio_path else 'silence'}...")
    video_clip = VideoFileClip(str(video_path))

    if audio_path and audio_path.exists():
        audio_clip = AudioFileClip(str(audio_path))
        v_dur = video_clip.duration
        a_dur = audio_clip.duration
        logger.info(f"Video duration: {v_dur:.2f}s, Audio duration: {a_dur:.2f}s")

        if a_dur > v_dur:
            logger.info(f"Audio is longer than video. Looping video to {a_dur:.2f}s...")
            try:
                if hasattr(video_clip, 'loop'):
                    final_video = video_clip.loop(duration=a_dur)
                else:
                    from moviepy.video.fx.all import loop
                    final_video = loop(video_clip, duration=a_dur)
            except Exception as e:
                logger.warning(f"Built-in looping failed, falling back to manual concatenation: {e}")
                n_repeats = math.ceil(a_dur / v_dur)
                final_video = concatenate_videoclips([video_clip] * n_repeats).subclip(0, a_dur)
        else:
            logger.info(f"Video is longer than or equal to audio. Trimming video to {a_dur:.2f}s...")
            final_video = video_clip.subclip(0, a_dur)

        final_clip = _attach_audio_to_clip(final_video, audio_clip)

        temp_audio = out_path.parent / f"temp-audio-mux-{int(time.time())}.m4a"
        final_clip.write_videofile(
            str(out_path),
            codec='libx264',
            audio_codec='aac',
            temp_audiofile=str(temp_audio),
            remove_temp=True,
            logger=None
        )
        final_clip.close()
        audio_clip.close()
    else:
        video_clip.write_videofile(str(out_path), codec='libx264', logger=None)

    video_clip.close()
    logger.info("Muxing completed successfully.")

async def _download_file(url: str, dest: Path, headers: dict | None = None):
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.get(url, headers=headers)
        r.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open('wb') as f:
            f.write(r.content)

def _get_audio_duration(audio_path: Path) -> float:
    try:
        try:
            from moviepy.editor import AudioFileClip
        except ImportError:
            from moviepy import AudioFileClip
        audio_clip = AudioFileClip(str(audio_path))
        duration = audio_clip.duration
        audio_clip.close()
        return duration
    except Exception as e:
        logger.error(f"Failed to get audio duration: {e}")
        return 4.0 # Default fallback

# --- Models ---

class RenderResponse(BaseModel):
    success: bool
    videoUrl: str | None = None
    message: str | None = None

class SceneRenderRequest(BaseModel):
    provider: Optional[str] = None
    bypass_cache: Optional[bool] = False
    voice_id: Optional[str] = None
    generate_audio: Optional[bool] = True

# --- Main API ---

@router.post("/render/scene/{scene_id}", response_model=RenderResponse)
async def render_scene_v2(
    scene_id: int,
    req: SceneRenderRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_auth_user_id)
):
    """
    Production-grade scene renderer. Securely ties video generation to a manifested scene.
    """
    async with async_session() as session:
        scene = await session.get(Scene, scene_id)
        if not scene:
            raise HTTPException(status_code=404, detail="Scene not found")

        project = await session.get(Project, scene.project_id)
        if not project or project.user_id != user_id:
            logger.warning(f"SECURITY: Unauthorized render attempt by user {user_id} for scene {scene_id}")
            raise HTTPException(status_code=401, detail="Project access denied")

        if scene.status != "MANIFESTED" or not scene.content:
             raise HTTPException(status_code=400, detail="Scene must be manifested before rendering.")

    try:
        scene_data = json.loads(scene.content)
    except Exception:
         raise HTTPException(status_code=500, detail="Failed to parse scene blueprint.")

    prompt = scene_data.get("visuals", scene.prompt or "Cinematic anime scene")
    narration = scene_data.get("narration", "")

    # SECURITY: Strict input validation
    if len(prompt) > 2000:
        prompt = prompt[:2000]
    if len(narration) > 2000:
        narration = narration[:2000]

    provider = (req.provider or os.environ.get('VIDEO_PROVIDER', 'production_anime')).lower()
    out_dir = _get_safe_outputs_dir()

    # 1. Trigger Garbage Collection
    background_tasks.add_task(cleanup_old_renders, out_dir, max_age_hours=24)

    # 2. API Shield (Caching)
    prompt_hash = hashlib.sha256(f"{provider}_{prompt}_{narration}".encode()).hexdigest()
    if not req.bypass_cache:
        expected_filename = f"scene-render-{prompt_hash}.mp4"
        disk_path = out_dir / expected_filename
        if disk_path.exists():
            logger.info(f"API Shield: Cache hit for scene {scene_id}")
            return RenderResponse(
                success=True,
                videoUrl=f"/outputs/{expected_filename}",
                message="Served from Cache"
            )

    # --- Production Anime Pipeline (Runway + ElevenLabs) ---
    if provider == 'production_anime':
        runway_key = os.environ.get("RUNWAY_API_KEY")
        elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")

        if not runway_key or not elevenlabs_key:
            logger.warning("Missing API Keys for production_anime. Falling back to local.")
            provider = 'local'
        else:
            video_dest = out_dir / f"video-{prompt_hash}.mp4"
            audio_dest = out_dir / f"audio-{prompt_hash}.mp3"
            final_dest = out_dir / f"scene-render-{prompt_hash}.mp4"

            # Step 1: Neural Audio
            audio_duration = 4.0 # Default
            if req.generate_audio:
                voice_id = req.voice_id or "21m00Tcm4TlvDq8ikWAM"
                # SECURITY: voice_id validation
                if not voice_id.isalnum():
                    voice_id = "21m00Tcm4TlvDq8ikWAM"

                tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                tts_payload = {
                    "text": narration or prompt,
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                }

                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        resp = await client.post(tts_url, json=tts_payload, headers={"xi-api-key": elevenlabs_key})
                        resp.raise_for_status()
                        with audio_dest.open('wb') as f:
                            f.write(resp.content)

                    audio_duration = await asyncio.to_thread(_get_audio_duration, audio_dest)
                except Exception as e:
                    logger.error(f"Neural Audio failed: {e}")
                    raise HTTPException(status_code=502, detail="Neural audio generation failed.")

            runway_duration = min(10, max(4, math.ceil(audio_duration))) # Hard Limit duration for safety

            # Step 2: Video Generation (Runway Gen-3)
            try:
                async with httpx.AsyncClient(timeout=300.0) as client:
                    payload = {
                        "prompt": f"High quality 2D anime style, masterpiece. {prompt}",
                        "duration": runway_duration,
                        "format": "mp4"
                    }
                    headers = {"Authorization": f"Bearer {runway_key}"}
                    op_url = "https://api.runwayml.com/v1/models/gen-3/outputs"

                    resp = await client.post(op_url, json=payload, headers=headers)
                    resp.raise_for_status()
                    job_id = resp.json().get('id')

                    # Polling
                    waited = 0
                    while waited < 300:
                        st = await client.get(f"https://api.runwayml.com/v1/operations/{job_id}", headers=headers)
                        stj = st.json()
                        state = stj.get('state', '').lower()
                        if state in ('succeeded', 'completed'):
                            video_url = stj['outputs'][0]['url']
                            await _download_file(video_url, video_dest)
                            break
                        elif state in ('failed', 'error'):
                             raise Exception(f"Runway job failed: {stj}")
                        await asyncio.sleep(5)
                        waited += 5
                    else:
                        raise Exception("Runway timeout")
            except Exception as e:
                logger.error(f"Video Gen failed: {e}")
                raise HTTPException(status_code=502, detail="Neural video generation failed.")

            # Step 3: Mux
            try:
                await asyncio.to_thread(_mux_media_task, video_dest, audio_dest, final_dest)
                # Cleanup
                for p in [video_dest, audio_dest]:
                    if p.exists(): p.unlink()

                return RenderResponse(
                    success=True,
                    videoUrl=f"/outputs/{final_dest.name}",
                    message="Scene rendered successfully with neural sync."
                )
            except Exception as e:
                logger.error(f"Muxing failed: {e}")
                raise HTTPException(status_code=500, detail="Final production assembly failed.")

    # --- Local Fallback ---
    if provider == 'local':
        final_filename = f"scene-render-{prompt_hash}.mp4"
        final_dest = out_dir / final_filename

        # Security Check
        if not _is_safe_path(out_dir, final_dest):
             raise HTTPException(status_code=400, detail="Invalid output path")

        return RenderResponse(
            success=False,
            message="Local renderer requires full implementation. Use production_anime with keys."
        )

    raise HTTPException(status_code=400, detail=f"Unsupported provider {provider}")

# Deprecated endpoint
@router.post("/render/scene", include_in_schema=False)
async def legacy_render_scene(user_id: str = Depends(get_auth_user_id)):
     raise HTTPException(
         status_code=410,
         detail="This endpoint is deprecated. Use /api/video/render/scene/{scene_id} instead."
    )
