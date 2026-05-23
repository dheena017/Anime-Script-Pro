from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import os
import time
from loguru import logger
import httpx
import asyncio
import math
from pathlib import Path
import hashlib

# Simple in-memory cache for API Shielding
_render_cache = {}

router = APIRouter(prefix="/api", tags=["Video"])


def _cleanup_old_renders(directory: Path, max_age_hours: int = 24):
    """Background Task: Zombie File Explosion Fix"""
    try:
        now = time.time()
        count = 0
        for f in directory.glob("*.*"):
            if f.suffix in ['.mp4', '.mp3', '.png']:
                # If file is older than max_age_hours, delete it
                if os.stat(f).st_mtime < now - (max_age_hours * 3600):
                    try:
                        os.remove(f)
                        count += 1
                    except Exception as fe:
                        logger.warning(f"Failed to delete {f.name}: {fe}")
        if count > 0:
            logger.info(f"Garbage Collector: Cleared {count} old media files from {directory.name}")
    except Exception as e:
        logger.error(f"Garbage Collector failed: {e}")


def _mux_media_task(video_path: Path, audio_path: Path | None, dest: Path):
    """Synchronous offloaded task: Thread Blocking Fix"""
    try:
        from moviepy.editor import VideoFileClip, AudioFileClip # type: ignore
    except Exception:
        from moviepy import VideoFileClip, AudioFileClip # type: ignore
        
    video_clip = VideoFileClip(str(video_path))
    
    if audio_path:
        audio_clip = AudioFileClip(str(audio_path))
        # Temporal Desync Fix: Loop video if audio is longer
        if audio_clip.duration > video_clip.duration:
            try:
                if hasattr(video_clip, 'loop'):
                    video_clip = video_clip.loop(duration=audio_clip.duration)
                else:
                    from moviepy.video.fx.all import loop
                    video_clip = loop(video_clip, duration=audio_clip.duration)
            except Exception:
                import math as sys_math
                from moviepy.editor import concatenate_videoclips
                n_repeats = sys_math.ceil(audio_clip.duration / video_clip.duration)
                video_clip = concatenate_videoclips([video_clip] * n_repeats).subclip(0, audio_clip.duration)
        
        final_clip = _attach_audio_to_clip(video_clip, audio_clip)
        final_clip.write_videofile(str(dest), codec='libx264', audio_codec='aac', logger=None)
        
        final_clip.close()
        video_clip.close()
        audio_clip.close()
    else:
        video_clip.write_videofile(str(dest), codec='libx264', logger=None)
        video_clip.close()
        
    return dest


class RenderRequest(BaseModel):
    prompt: str
    model: str | None = None
    duration: int | None = 4
    image_url: str | None = None
    character_name: str | None = None
    sys_label: str | None = None
    sync_rate: str | None = None
    telemetry_logs: list[str] | None = None
    provider: str | None = None
    narration: str | None = None
    voice_id: str | None = None
    bypass_cache: bool | None = False


class RenderResponse(BaseModel):
    success: bool
    videoUrl: str | None = None
    message: str | None = None


async def _download_file(url: str, dest: Path, headers: dict | None = None):
    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.get(url, headers=headers)
        r.raise_for_status()
        dest.parent.mkdir(parents=True, exist_ok=True)
        with dest.open('wb') as f:
            f.write(r.content)


def _attach_audio_to_clip(clip, audio_clip):
    """Attach audio to a moviepy clip across different moviepy versions."""
    if hasattr(clip, 'with_audio'):
        return clip.with_audio(audio_clip)
    if hasattr(clip, 'set_audio'):
        return clip.set_audio(audio_clip)
    raise RuntimeError('moviepy clip does not support audio attachment')


async def _generate_tts(text: str, out_dir: Path, basename: str):
    """Generate a TTS mp3 file from text using gTTS. Returns Path or None if not available."""
    def _sync_tts():
        try:
            from gtts import gTTS
        except Exception:
            return None
        out_dir.mkdir(parents=True, exist_ok=True)
        mp3_path = out_dir / f"{basename}.mp3"
        try:
            tts = gTTS(text)
            tts.save(str(mp3_path))
            return mp3_path
        except Exception:
            return None

    return await asyncio.to_thread(_sync_tts)


def _get_audio_duration(audio_path: Path) -> float:
    """Load the audio file and return its exact duration in seconds using MoviePy."""
    try:
        try:
            from moviepy.editor import AudioFileClip
        except ImportError:
            from moviepy import AudioFileClip
    except ImportError as e:
        logger.error("Failed to import MoviePy AudioFileClip")
        raise RuntimeError("Missing moviepy library.") from e

    audio_clip = AudioFileClip(str(audio_path))
    duration = audio_clip.duration
    audio_clip.close()
    return duration


def _mux_media_task(video_path: Path, audio_path: Path, out_path: Path):
    """Combine the Runway video and ElevenLabs audio, looping the video if needed to match audio length."""
    try:
        try:
            from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips
        except ImportError:
            from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips
    except ImportError as e:
        logger.error("Failed to import MoviePy components")
        raise RuntimeError("Missing moviepy library.") from e

    logger.info("Muxing video and audio with MoviePy...")
    video_clip = VideoFileClip(str(video_path))
    audio_clip = AudioFileClip(str(audio_path))

    v_dur = video_clip.duration
    a_dur = audio_clip.duration
    logger.info(f"Video duration: {v_dur:.2f}s, Audio duration: {a_dur:.2f}s")

    if a_dur > v_dur:
        # Loop the video clip automatically so the duration perfectly matches the audio.
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
        # Trim video to match the audio duration exactly
        logger.info(f"Video is longer than or equal to audio. Trimming video to {a_dur:.2f}s...")
        final_video = video_clip.subclip(0, a_dur)

    # Attach the audio clip
    final_clip = _attach_audio_to_clip(final_video, audio_clip)
    
    # Write to final destination
    temp_audio = out_path.parent / f"temp-audio-mux-{int(time.time())}.m4a"
    logger.info(f"Writing final muxed video to {out_path}...")
    final_clip.write_videofile(
        str(out_path),
        codec='libx264',
        audio_codec='aac',
        temp_audiofile=str(temp_audio),
        remove_temp=False,
        logger=None
    )
    
    # Close clips to release file locks on Windows
    final_clip.close()
    video_clip.close()
    audio_clip.close()
    
    # Clean up temp audio after a short delay
    try:
        import time as sys_time
        sys_time.sleep(1.0)
        if temp_audio.exists():
            temp_audio.unlink()
    except Exception as cleanup_err:
        logger.warning(f"Muxer temp audio cleanup failed (non-blocking): {cleanup_err}")
    logger.info("Muxing completed successfully.")


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


@router.post("/render/scene", response_model=RenderResponse)
async def render_scene(req: RenderRequest, background_tasks: BackgroundTasks):
    """Proxy endpoint to dispatch scene render requests to a chosen provider.

    Environment variables:
    - VIDEO_PROVIDER: one of 'veo', 'runway', 'luma', 'sora' or 'local'
    - Provider-specific API keys must be set (e.g. VEO_API_KEY, RUNWAY_API_KEY)
    """
    provider = (req.provider or os.environ.get('VIDEO_PROVIDER', 'production_anime')).lower()
    if not provider:
        logger.warning("Render requested but VIDEO_PROVIDER is not configured.")
        raise HTTPException(status_code=501, detail="No video provider configured. Set VIDEO_PROVIDER and provider API key in environment.")

    # Basic validation
    if not req.prompt or len(req.prompt.strip()) < 10:
        raise HTTPException(status_code=400, detail="Prompt too short for rendering.")

    backend_root = Path(__file__).parent.resolve().parent
    out_dir = backend_root / 'outputs'
    out_dir.mkdir(parents=True, exist_ok=True)

    # 1. TRIGGER GARBAGE COLLECTOR
    background_tasks.add_task(_cleanup_old_renders, out_dir, max_age_hours=24)

    # 2. TRIGGER API SHIELD (CACHING)
    prompt_hash = hashlib.sha256(f"{provider}_{req.prompt}".encode()).hexdigest()
    if not req.bypass_cache:
        if prompt_hash in _render_cache:
            cached_val = _render_cache[prompt_hash]
            if isinstance(cached_val, dict):
                cached_filename = cached_val.get("video_url", "").split("/outputs/")[-1]
            else:
                cached_filename = cached_val
                
            if cached_filename:
                cached_file = out_dir / cached_filename
                if cached_file.exists():
                    logger.info("Cache hit! Saving API credits.")
                    return RenderResponse(
                        success=True,
                        videoUrl=f"/outputs/{cached_file.name}",
                        message="Served from Cache (API Shield Active)"
                    )

        # Check disk cache next
        expected_filename = f"prod-anime-mux-{prompt_hash}.mp4"
        disk_path = out_dir / expected_filename
        if disk_path.exists():
            age_seconds = time.time() - disk_path.stat().st_mtime
            if age_seconds < 86400:
                public_url = f"/outputs/{expected_filename}"
                logger.info(f"API Shield: Cache hit (disk) for prompt hash {prompt_hash}. Age: {age_seconds/3600:.2f} hours. Populating in-memory cache.")
                _render_cache[prompt_hash] = expected_filename
                return RenderResponse(
                    success=True,
                    videoUrl=public_url,
                    message="Served from Cache (API Shield Active)"
                )

    # Key-based Fallback Check for Production Anime
    if provider == 'production_anime':
        runway_key = os.environ.get("RUNWAY_API_KEY")
        elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
        if not runway_key or not elevenlabs_key:
            logger.warning("Missing API Keys for production_anime. Falling back to local.")
            provider = 'local'

    # Production Anime pipeline (Runway Gen-3 + ElevenLabs Neural Audio + MoviePy Muxing)
    if provider == 'production_anime':
        runway_key = os.environ.get("RUNWAY_API_KEY")
        elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")

        backend_root = Path(__file__).parent.resolve().parent
        out_dir = backend_root / 'outputs'
        out_dir.mkdir(parents=True, exist_ok=True)
        
        video_filename = f"prod-anime-video-{prompt_hash}.mp4"
        audio_filename = f"prod-anime-audio-{prompt_hash}.mp3"
        final_filename = f"prod-anime-mux-{prompt_hash}.mp4"
        
        video_dest = out_dir / video_filename
        audio_dest = out_dir / audio_filename
        final_dest = out_dir / final_filename

        # Step 1: Neural Audio Generation (ElevenLabs) first
        voice_id = req.voice_id or "21m00Tcm4TlvDq8ikWAM"
        tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        tts_headers = {
            "xi-api-key": elevenlabs_key,
            "Content-Type": "application/json"
        }
        narration_text = req.narration or req.prompt
        
        logger.info(f"Step 1: Triggering ElevenLabs TTS generation for narration: '{narration_text[:60]}...' using voice ID: {voice_id}")
        tts_payload = {
            "text": narration_text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(tts_url, json=tts_payload, headers=tts_headers)
                if resp.status_code >= 400:
                    logger.error(f"ElevenLabs TTS failed: {resp.text}")
                    raise HTTPException(status_code=502, detail=f"ElevenLabs TTS failed: {resp.text}")
                
                audio_content = resp.content
                
                def _write_audio():
                    with audio_dest.open('wb') as f:
                        f.write(audio_content)
                    return audio_dest
                
                await asyncio.to_thread(_write_audio)
                logger.info("ElevenLabs audio generated and saved successfully.")
        except httpx.RequestError as exc:
            logger.error(f"Network error while talking to ElevenLabs: {exc}")
            raise HTTPException(status_code=502, detail=f"ElevenLabs connection failed: {exc}")
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            logger.error(f"ElevenLabs generation failed: {e}")
            raise HTTPException(status_code=500, detail=f"ElevenLabs generation failed: {e}")

        # Step 2: Dynamic Duration Analysis
        try:
            audio_duration = await asyncio.to_thread(_get_audio_duration, audio_dest)
            logger.info(f"Step 2: Dynamically calculated audio duration: {audio_duration:.2f}s")
        except Exception as dur_err:
            logger.error(f"Failed to calculate audio duration: {dur_err}")
            try:
                if audio_dest.exists():
                    audio_dest.unlink()
            except Exception:
                pass
            raise HTTPException(status_code=500, detail=f"Failed to analyze neural voiceover track: {dur_err}")
        
        runway_duration = math.ceil(audio_duration)
        logger.info(f"Target duration for Runway Gen-3 payload: {runway_duration}s")

        # Step 3: Video Generation (Runway Gen-3) passing the calculated duration
        async def run_video_generation():
            async with httpx.AsyncClient(timeout=120.0) as client:
                wrapped_prompt = f"High quality 2D anime style, masterpiece, ufotable studio style, cinematic anime lighting. {req.prompt}"
                payload = {
                    "prompt": wrapped_prompt,
                    "duration": runway_duration,
                    "format": "mp4"
                }
                headers = {
                    "Authorization": f"Bearer {runway_key}",
                    "Content-Type": "application/json",
                    "X-Runway-Version": "2024-11-06"
                }
                op_url = "https://api.dev.runwayml.com/v1/models/gen-3/outputs"
                
                logger.info(f"Step 3: Triggering Runway Gen-3 generation with wrapped prompt and dynamic duration of {runway_duration}s")
                resp = await client.post(op_url, json=payload, headers=headers)
                if resp.status_code >= 400:
                    logger.error(f"Runway Gen-3 API returned error: {resp.text}")
                    raise HTTPException(status_code=502, detail=f"Runway Gen-3 API error: {resp.text}")
                
                data = resp.json()
                outputs = data.get('outputs') or data.get('result') or []
                if outputs and isinstance(outputs, list) and outputs[0].get('url'):
                    video_url = outputs[0]['url']
                    logger.info("Runway Gen-3 returned video URL immediately.")
                    await _download_file(video_url, video_dest, headers=None)
                    return video_dest
                
                job_id = data.get('id') or data.get('operation_id') or data.get('job_id')
                if not job_id:
                    logger.error(f"Runway response missing job ID and output: {data}")
                    raise HTTPException(status_code=502, detail="Runway response missing job ID and outputs")
                
                status_url = f"https://api.dev.runwayml.com/v1/operations/{job_id}"
                timeout = int(os.environ.get('RENDER_TIMEOUT_SECONDS', '300'))
                interval = float(os.environ.get('RENDER_POLL_INTERVAL', '3.0'))
                waited = 0
                logger.info(f"Runway job {job_id} started. Polling status...")
                
                while waited < timeout:
                    st = await client.get(status_url, headers=headers)
                    if st.status_code >= 400:
                        logger.error(f"Runway status check failed: {st.text}")
                        raise HTTPException(status_code=502, detail="Runway status check failed")
                    
                    stj = st.json()
                    state = stj.get('state') or stj.get('status') or ''
                    logger.debug(f"Runway job {job_id} state: {state}")
                    
                    if state.lower() in ('succeeded', 'completed', 'done'):
                        out = stj.get('outputs') or stj.get('result') or []
                        if out and out[0].get('url'):
                            video_url = out[0]['url']
                            logger.info(f"Runway job {job_id} succeeded. Downloading video...")
                            await _download_file(video_url, video_dest, headers=None)
                            return video_dest
                        else:
                            raise HTTPException(status_code=502, detail="Runway completed but no outputs found")
                    
                    if state.lower() in ('failed', 'error'):
                        error_detail = stj.get('error') or stj
                        raise HTTPException(status_code=502, detail=f"Runway generation failed: {error_detail}")
                    
                    await asyncio.sleep(interval)
                    waited += interval
                
                raise HTTPException(status_code=504, detail="Runway generation timed out")

        # Execute video generation
        try:
            video_path = await run_video_generation()
            audio_path = audio_dest
        except Exception as gen_err:
            logger.error(f"Runway Gen-3 video generation failed: {gen_err}")
            for p in [video_dest, audio_dest]:
                try:
                    if p.exists():
                        p.unlink()
                except Exception:
                    pass
            if isinstance(gen_err, HTTPException):
                raise gen_err
            raise HTTPException(status_code=500, detail=f"Production Anime video generation failed: {gen_err}")

        # Step 4: Mux audio and video in a separate thread (Event Loop Freeze Protection)
        try:
            logger.info("Step 4: Scheduling synchronous MoviePy muxing task in separate thread...")
            await asyncio.to_thread(
                _mux_media_task,
                video_path,
                audio_path,
                final_dest
            )
            
            # Clean up intermediate video and audio
            def _cleanup_intermediates():
                for p in [video_path, audio_path]:
                    try:
                        if p.exists():
                            p.unlink()
                    except Exception as e:
                        logger.warning(f"Failed to delete intermediate file {p}: {e}")
            
            await asyncio.to_thread(_cleanup_intermediates)
            
            public_url = f"/outputs/{final_filename}"
            
            # Populate in-memory cache
            _render_cache[prompt_hash] = final_filename
            # Trigger background cleanup in fire-and-forget task
            asyncio.create_task(cleanup_old_renders(out_dir))
            
            return RenderResponse(
                success=True,
                videoUrl=public_url,
                message="High-fidelity production anime scene render and neural voiceover completed successfully with perfect duration synchronization."
            )
        except Exception as mux_err:
            logger.error(f"Muxing or cleanup failed: {mux_err}")
            try:
                if final_dest.exists():
                    final_dest.unlink()
            except Exception:
                pass
            raise HTTPException(status_code=500, detail=f"Muxing failed: {mux_err}")

    # =========================================================================
    # FREE AI ENGINE (Hugging Face + gTTS)
    # =========================================================================
    if provider == 'free_ai':
        hf_token = os.environ.get('HF_API_TOKEN') or os.environ.get('HF_API_KEY')
        hf_model = os.environ.get('HF_MODEL', 'stabilityai/stable-diffusion-2')
        
        if not hf_token:
            logger.warning("HF_API_TOKEN missing. Falling back to local renderer.")
            provider = 'local'
        else:
            logger.info("Manifesting Free AI Scene...")
            try:
                # 1. UPGRADED AUDIO FIRST LOGIC (Neural Free Audio)
                audio_filename = f"free-audio-{prompt_hash[:8]}.mp3"
                audio_path = out_dir / audio_filename
                
                try:
                    import edge_tts
                    # Using a high-quality free Neural Voice (Christopher is good for narration/anime)
                    voice = "en-US-ChristopherNeural" 
                    communicate = edge_tts.Communicate(req.prompt, voice)
                    
                    # edge_tts is beautifully async, so we await it directly without blocking!
                    await communicate.save(str(audio_path))
                    has_audio = True
                except ImportError:
                    logger.warning("edge-tts not installed. Falling back to gTTS fallback.")
                    def _generate_gtts():
                        try:
                            from gtts import gTTS
                            tts = gTTS(req.prompt)
                            tts.save(str(audio_path))
                            return True
                        except Exception as e:
                            logger.error(f"gTTS failed: {e}")
                            return False
                    has_audio = await asyncio.to_thread(_generate_gtts)
                except Exception as e:
                    logger.error(f"Free audio generation failed: {e}")
                    has_audio = False
                
                dynamic_duration = req.duration or 4
                if has_audio:
                    try:
                        from moviepy.editor import AudioFileClip # type: ignore
                        temp_audio = AudioFileClip(str(audio_path))
                        dynamic_duration = math.ceil(temp_audio.duration)
                        temp_audio.close()
                    except Exception:
                        pass
                else:
                    audio_path = None

                # 2. GENERATE IMAGES (HF API)
                fps = 12
                total_frames = dynamic_duration * fps
                # Limit HF calls to save free tier rate limits (e.g., generate 3 keyframes)
                images_to_generate = min(3, max(1, total_frames // fps)) 
                
                generated_images = []
                async with httpx.AsyncClient(timeout=120.0) as client:
                    headers = {"Authorization": f"Bearer {hf_token}"}
                    for i in range(images_to_generate):
                        # Force anime aesthetic onto the free model
                        payload = {"inputs": f"High quality 2D anime style, ufotable studio style, cinematic lighting. {req.prompt}"}
                        resp = await client.post(f"https://api-inference.huggingface.co/models/{hf_model}", json=payload, headers=headers)
                        resp.raise_for_status()
                        
                        img_path = out_dir / f"freeai-{prompt_hash[:8]}-{i}.png"
                        with img_path.open('wb') as f:
                            f.write(resp.content)
                        generated_images.append(str(img_path))
                
                # 3. OFFLOADED MUXING (Thread Blocking Fix)
                def _mux_free_ai():
                    try:
                        from moviepy.editor import ImageSequenceClip, AudioFileClip # type: ignore
                    except Exception:
                        from moviepy import ImageSequenceClip, AudioFileClip # type: ignore
                    
                    # Stretch the limited images across the dynamic duration timeline
                    sequence = []
                    repeats = max(1, total_frames // max(1, len(generated_images)))
                    for img in generated_images:
                        sequence.extend([img] * repeats)
                    while len(sequence) < total_frames:
                        sequence.append(generated_images[-1])
                        
                    clip = ImageSequenceClip(sequence, fps=fps)
                    final_filename = f"freeai-final-{prompt_hash[:8]}.mp4"
                    dest = out_dir / final_filename
                    
                    if audio_path:
                        audio_clip = AudioFileClip(str(audio_path))
                        if audio_clip.duration > clip.duration:
                            try:
                                if hasattr(clip, 'loop'):
                                    clip = clip.loop(duration=audio_clip.duration)
                                else:
                                    from moviepy.video.fx.all import loop
                                    clip = loop(clip, duration=audio_clip.duration)
                            except Exception:
                                import math as sys_math
                                from moviepy.editor import concatenate_videoclips
                                n_repeats = sys_math.ceil(audio_clip.duration / clip.duration)
                                clip = concatenate_videoclips([clip] * n_repeats).subclip(0, audio_clip.duration)
                        clip = _attach_audio_to_clip(clip, audio_clip)
                        
                        # Export with strict codecs for web compatibility
                        clip.write_videofile(str(dest), codec='libx264', audio_codec='aac', logger=None)
                        audio_clip.close()
                    else:
                        clip.write_videofile(str(dest), codec='libx264', logger=None)
                    
                    clip.close()
                    return final_filename
                    
                # Run the heavy video compilation in the background thread
                final_filename = await asyncio.to_thread(_mux_free_ai)
                
                # Cache the result to save API calls
                _render_cache[prompt_hash] = final_filename
                public_url = f"/outputs/{final_filename}"
                return RenderResponse(success=True, videoUrl=public_url, message="Free AI Anime Scene Manifested")
                
            except Exception as e:
                logger.error(f'Free AI Engine failed: {e}')
                logger.info("Falling back to local fallback engine.")
                provider = 'local' # Triggers the local fallback below if HF API fails

    # Local free renderer: create a simple MP4 from the prompt using Pillow + moviepy
    if provider == 'local':
        # Create a short video (default 4s) with the prompt text animated
        try:
            duration = int(req.duration or 4)
            # Defer heavy work to thread to avoid blocking event loop
            def _create():
                try:
                    from PIL import Image, ImageDraw, ImageFont
                    try:
                        from moviepy.editor import ImageSequenceClip, AudioFileClip  # type: ignore
                    except Exception:
                        from moviepy import ImageSequenceClip, AudioFileClip  # type: ignore
                except Exception as e:
                    raise RuntimeError('Missing dependencies for local renderer (Pillow, moviepy).') from e

                fps = 24
                frames = []
                w, h = 1280, 720
                text = req.prompt.strip()

                backend_root = Path(__file__).parent.resolve().parent
                out_dir = backend_root / 'outputs'
                out_dir.mkdir(parents=True, exist_ok=True)

                # 1. Synthesize gTTS audio first to determine exact video duration
                audio_path = None
                audio_clip = None
                audio_duration = float(duration)
                try:
                    from gtts import gTTS
                    mp3_path = out_dir / f"local-scene-audio-{int(time.time())}.mp3"
                    tts = gTTS(text)
                    tts.save(str(mp3_path))
                    audio_path = mp3_path
                    
                    try:
                        audio_clip = AudioFileClip(str(audio_path))
                        audio_duration = audio_clip.duration
                        # Add a small buffer so the voiceover doesn't clip off abruptly
                        audio_duration = max(3.0, audio_duration + 0.5)
                        logger.info(f"Local render: TTS audio generated successfully. Duration: {audio_duration:.2f}s")
                    except Exception as ac_err:
                        logger.warning(f"Local render: Failed to load AudioFileClip ({ac_err})")
                except Exception as tts_err:
                    logger.warning(f"Local render: gTTS generation failed, falling back to silent video ({tts_err})")

                # Set duration dynamically to match voiceover speech length
                final_duration = audio_duration
                
                # Split long text
                lines = []
                max_len = 60
                for i in range(0, len(text), max_len):
                    lines.append(text[i:i+max_len])

                # Load background image if specified
                bg_img = None
                if req.image_url:
                    try:
                        if '/outputs/' in req.image_url:
                            filename = req.image_url.split('/outputs/')[-1]
                            local_path = Path(__file__).parent.resolve().parent / 'outputs' / filename
                            if local_path.exists():
                                bg_img = Image.open(local_path).convert('RGB')
                                logger.info(f"Local render: Loaded local background image {local_path}")
                        
                        if not bg_img and req.image_url.startswith('http'):
                            logger.info(f"Local render: Downloading remote background image {req.image_url}")
                            with httpx.Client(timeout=10.0) as client:
                                r = client.get(req.image_url)
                                r.raise_for_status()
                                from io import BytesIO
                                bg_img = Image.open(BytesIO(r.content)).convert('RGB')
                    except Exception as e:
                        logger.warning(f"Local render: Failed to load background image {req.image_url}; falling back to gradient background ({e})")

                # Setup random particles for neural ambient atmosphere
                import random
                rng = random.Random(42)
                particles = []
                for _ in range(25):
                    particles.append({
                        'x': rng.randint(0, w),
                        'y': rng.randint(0, h),
                        'speed_x': rng.uniform(-1.5, 1.5),
                        'speed_y': rng.uniform(1.0, 3.0),
                        'size': rng.randint(2, 6),
                        'color': rng.choice([
                            (0, 240, 255),  # Cyber Cyan
                            (255, 120, 0),  # Orange Glow
                            (255, 255, 255) # Pure White
                        ])
                    })

                # 2. Dynamic Character & Lore Context Extractor
                import re
                char_name = req.character_name or "SHOGUN ARCHITECT"
                sys_label = req.sys_label or "SYS_PERSONA"
                prompt_lower = text.lower()
                
                if not req.character_name:
                    # Check common names
                    known_names = ["Zephyr", "Vance", "Aria", "Lumina", "Kai", "Ren", "Yuki", "Sakura", "Kenji"]
                    found_known = False
                    for name in known_names:
                        if name.lower() in prompt_lower:
                            char_name = name.upper()
                            sys_label = f"SYS_{name.upper()}"
                            found_known = True
                            break
                            
                    if not found_known:
                        # Scan for first capitalised word (excluding common instruction words)
                        match = re.search(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b', text)
                        if match and match.group(1).lower() not in ["scene", "image", "visuals", "narration", "sound"]:
                            extracted = match.group(1).upper()
                            char_name = extracted
                            sys_label = f"SYS_{extracted.split()[-1]}"
                
                # Dynamic theme-aligned logs
                if req.telemetry_logs:
                    logs_hud = req.telemetry_logs
                else:
                    is_steampunk = "steam" in prompt_lower or "aether" in prompt_lower or "brass" in prompt_lower
                    if is_steampunk:
                        logs_hud = [
                            "AETHER_RESONANCE // 94.2%",
                            "STEAM_PRESSURE // SYNCED",
                            "VALVE_LATENCY  // 12ms",
                            "GEAR_COMPILER  // ACTIVE",
                            "BOILER_CORE    // STABLE",
                            "BRASS_MATRIX   // SECURE"
                        ]
                    else:
                        logs_hud = [
                            "SYS_LOAD // 14.2%",
                            "MEM_POOL // RESOLVED",
                            "LATENCY  // 12ms",
                            "RENDERER // ACTIVE",
                            "AUDIO_CH // SYNTH",
                            "MATRIX   // SECURE"
                        ]

                total_frames = int(final_duration * fps)
                for f in range(total_frames):
                    # Compute progress-based animations
                    progress = f / max(1, total_frames - 1)

                    # 1. Base Layer (Ken Burns Image Zoom/Pan or Tech Grid Gradient)
                    if bg_img:
                        scale = 1.0 + 0.08 * progress
                        new_w = int(w * scale)
                        new_h = int(h * scale)
                        scaled_bg = bg_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                        
                        pan_x = int(math.sin(progress * math.pi) * 15)
                        pan_y = int(progress * 10)
                        
                        left = max(0, min((new_w - w) // 2 + pan_x, new_w - w))
                        top = max(0, min((new_h - h) // 2 + pan_y, new_h - h))
                        img = scaled_bg.crop((left, top, left + w, top + h))
                    else:
                        img = Image.new('RGB', (w, h))
                        draw_grad = ImageDraw.Draw(img)
                        # Create deep indigo gradient
                        for row in range(h):
                            r_c = max(0, 20 - int(row / h * 20))
                            g_c = max(0, 15 - int(row / h * 15))
                            b_c = max(0, 45 - int(row / h * 30))
                            draw_grad.line([(0, row), (w, row)], fill=(r_c, g_c, b_c))

                        # Draw horizontal scrolling 3D-perspective grid
                        horizon_y = h // 3
                        center_x = w // 2
                        phase = (progress * 50) % 50
                        
                        for angle_idx in range(-12, 13):
                            target_x = center_x + angle_idx * 120
                            draw_grad.line([(center_x, horizon_y), (target_x, h)], fill=(0, 240, 255, 30), width=1)
                            
                        for grid_idx in range(15):
                            y = horizon_y + int(((grid_idx * 30 + phase) ** 1.8) * 0.05)
                            if y < h:
                                opacity = int(100 * (y - horizon_y) / (h - horizon_y))
                                draw_grad.line([(0, y), (w, y)], fill=(0, 240, 255, opacity), width=1)

                    # 2. Transparent High-Fidelity HUD & Watermark Overlays
                    img_rgba = img.convert('RGBA')
                    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
                    draw = ImageDraw.Draw(overlay)

                    try:
                        font_main = ImageFont.truetype('arial.ttf', 32)
                        font_sub = ImageFont.truetype('arial.ttf', 16)
                    except Exception:
                        font_main = ImageFont.load_default()
                        font_sub = ImageFont.load_default()

                    # Neon Ambient Particle Drift
                    for p in particles:
                        curr_x = int((p['x'] + p['speed_x'] * f) % w)
                        curr_y = int((p['y'] - p['speed_y'] * f) % h)
                        flicker = int(140 + math.sin(f * 0.2 + p['x']) * 100)
                        flicker = max(0, min(flicker, 255))
                        draw.ellipse(
                            [(curr_x - p['size'], curr_y - p['size']), (curr_x + p['size'], curr_y + p['size'])],
                            fill=(p['color'][0], p['color'][1], p['color'][2], int(flicker * 0.35))
                        )
                        draw.ellipse(
                            [(curr_x - p['size']//2, curr_y - p['size']//2), (curr_x + p['size']//2, curr_y + p['size']//2)],
                            fill=(255, 255, 255, flicker)
                        )

                    # Cyber Corner HUD Brackets
                    pad = 30
                    blen = 40
                    color_hud = (0, 240, 255, 180)
                    draw.line([(pad, pad), (pad + blen, pad)], fill=color_hud, width=2)
                    draw.line([(pad, pad), (pad, pad + blen)], fill=color_hud, width=2)
                    draw.line([(w - pad, pad), (w - pad - blen, pad)], fill=color_hud, width=2)
                    draw.line([(w - pad, pad), (w - pad, pad + blen)], fill=color_hud, width=2)
                    draw.line([(pad, h - pad), (pad + blen, h - pad)], fill=color_hud, width=2)
                    draw.line([(pad, h - pad), (pad, h - pad - blen)], fill=color_hud, width=2)
                    draw.line([(w - pad, h - pad), (w - pad - blen, h - pad)], fill=color_hud, width=2)
                    draw.line([(w - pad, h - pad), (w - pad, h - pad - blen)], fill=color_hud, width=2)

                    # Rotating Sighting Reticle (Upper Right)
                    rx, ry = w - 160, 160
                    draw.ellipse([(rx - 60, ry - 60), (rx + 60, ry + 60)], outline=(0, 240, 255, 80), width=1)
                    draw.ellipse([(rx - 30, ry - 30), (rx + 30, ry + 30)], outline=(255, 120, 0, 100), width=1)
                    angle = progress * 2 * math.pi
                    for tick_angle in [angle, angle + math.pi/2, angle + math.pi, angle + 3*math.pi/2]:
                        tx = rx + int(math.cos(tick_angle) * 55)
                        ty = ry + int(math.sin(tick_angle) * 55)
                        tx2 = rx + int(math.cos(tick_angle) * 45)
                        ty2 = ry + int(math.sin(tick_angle) * 45)
                        draw.line([(tx, ty), (tx2, ty2)], fill=(0, 240, 255, 150), width=2)
                    draw.ellipse([(rx - 3, ry - 3), (rx + 3, ry + 3)], fill=(255, 120, 0, 200))
                    draw.text((rx - 70, ry + 75), "TGT_LOCK: 99.8%", font=font_sub, fill=(0, 240, 255, 150))

                    # Character Link Diagnostics Panel (Top Left)
                    panel_w, panel_h = 320, 220
                    draw.rectangle([(40, 40), (40 + panel_w, 40 + panel_h)], fill=(5, 15, 30, 180), outline=(0, 240, 255, 100), width=1)
                    draw.rectangle([(40, 40), (40 + panel_w, 70)], fill=(0, 240, 255, 40))
                    draw.text((55, 48), "NEURAL INTERFACE // CAST_PORTRAIT", font=font_sub, fill=(255, 255, 255, 220))
                    
                    # Stylized Vector Character Face Profile Wireframe (The Anime Character!)
                    face_cx, face_cy = 100, 150
                    draw.arc([(face_cx - 30, face_cy - 40), (face_cx + 30, face_cy + 30)], start=30, end=150, fill=(0, 240, 255, 200), width=2)
                    draw.line([(face_cx - 30, face_cy - 20), (face_cx - 10, face_cy - 45)], fill=(0, 240, 255, 200), width=2)
                    draw.line([(face_cx - 10, face_cy - 45), (face_cx + 10, face_cy - 45)], fill=(0, 240, 255, 200), width=2)
                    draw.line([(face_cx + 10, face_cy - 45), (face_cx + 30, face_cy - 20)], fill=(0, 240, 255, 200), width=2)
                    draw.line([(face_cx - 20, face_cy - 10), (face_cx + 20, face_cy - 10)], fill=(255, 120, 0, 255), width=3)
                    draw.text((face_cx - 40, face_cy + 35), sys_label, font=font_sub, fill=(0, 240, 255, 180))

                    # Diagnostics data readouts
                    tx_start = 160
                    draw.text((tx_start, 85), f"ID: {char_name}", font=font_sub, fill=(255, 255, 255, 200))
                    sync_pct = int(95.0 + math.sin(f * 0.1) * 3)
                    draw.text((tx_start, 110), f"SYNC RATE: {sync_pct}%", font=font_sub, fill=(255, 120, 0, 220))
                    
                    # ECG/Sync Waveform
                    wave_points = []
                    for wx in range(120):
                        local_phase = (wx - f * 4) % 60
                        wy = math.sin((local_phase - 20) * math.pi / 10) * 18 if 20 < local_phase < 30 else math.sin(wx * 0.1) * 2
                        wave_points.append((tx_start + wx, 175 + int(wy)))
                    for wp_idx in range(len(wave_points) - 1):
                        draw.line([wave_points[wp_idx], wave_points[wp_idx + 1]], fill=(0, 240, 255, 180), width=2)

                    # Dynamic Audio Spectrum Frequency Bars (Bottom Right HUD)
                    bx, by = w - 300, h - 85
                    draw.text((bx, by - 20), "AUDIO SPECTRUM PROTOCOL", font=font_sub, fill=(0, 240, 255, 150))
                    for bar_idx in range(10):
                        bar_h = int(12 + math.sin(f * 0.3 + bar_idx * 0.8) * 12 + math.cos(f * 0.1 + bar_idx) * 8)
                        bar_h = max(2, min(bar_h, 35))
                        x1 = bx + bar_idx * 16
                        y1 = by + (35 - bar_h)
                        x2 = x1 + 10
                        y2 = by + 35
                        draw.rectangle([(x1, y1), (x2, y2)], fill=(0, 210, 255, 200))

                    # Scrolling Code Matrix readouts (Right Edge)
                    mx, my = w - 190, 240
                    shift_idx = (f // 8) % len(logs_hud)
                    for log_row_idx in range(4):
                        curr_log = logs_hud[(log_row_idx + shift_idx) % len(logs_hud)]
                        draw.text((mx, my + log_row_idx * 22), curr_log, font=font_sub, fill=(0, 240, 255, 100))

                    # High-Fidelity Dialog Banner (Bottom Center)
                    def _measure_text(text_line: str, font_obj):
                        try:
                            bbox = draw.textbbox((0, 0), text_line, font=font_obj)
                            return bbox[2] - bbox[0], bbox[3] - bbox[1]
                        except Exception:
                            return len(text_line) * 10, 20

                    tw, th = _measure_text(lines[0], font_main)
                    banner_h = int(th + 30) if len(lines) == 1 else int(len(lines) * (th + 12) + 30)
                    banner_y = h - banner_h - 40
                    
                    draw.rectangle(
                        [(w // 2 - 400, banner_y), (w // 2 + 400, h - 40)],
                        fill=(0, 5, 15, 210),
                        outline=(0, 240, 255, 80),
                        width=1
                    )
                    draw.line([(w // 2 - 400, banner_y), (w // 2 + 400, banner_y)], fill=(0, 240, 255, 225), width=2)
                    draw.text((w // 2 - 380, banner_y - 22), f"NARRATION FEED // {char_name}", font=font_sub, fill=(0, 240, 255, 160))

                    # Render text with fade in/out animation
                    alpha = int(255 * (1 - abs(progress - 0.5) * 2))
                    y_start = banner_y + 15
                    for idx, line in enumerate(lines):
                        line_tw, line_th = _measure_text(line, font_main)
                        draw.text(((w - line_tw) / 2 + 1, y_start + idx * (line_th + 12) + 1), line, font=font_main, fill=(0, 0, 0, alpha))
                        draw.text(((w - line_tw) / 2, y_start + idx * (line_th + 12)), line, font=font_main, fill=(255, 255, 255, alpha))

                    img = Image.alpha_composite(img_rgba, overlay).convert('RGB')
                    frames.append(img)

                import numpy as np
                clip = ImageSequenceClip([np.array(frame) for frame in frames], fps=fps)
                filename = f"local-scene-{int(time.time())}.mp4"
                dest = out_dir / filename
                temp_audio = out_dir / f"temp-audio-{int(time.time())}.m4a"

                # Attach audio
                if audio_clip:
                    try:
                        clip = _attach_audio_to_clip(clip, audio_clip)
                    except Exception as e:
                        logger.warning(f"Local render: attaching audio failed; proceeding without audio ({e})")

                # Render output mp4 with aac audio codec to make sure it plays nicely in HTML5
                clip.write_videofile(
                    str(dest),
                    codec='libx264',
                    audio_codec='aac',
                    audio=bool(audio_clip),
                    temp_audiofile=str(temp_audio),
                    remove_temp=False,
                    logger=None
                )

                # Close all clips to release file locks on Windows
                clip.close()
                if audio_clip:
                    audio_clip.close()

                # Cleanup temp audio files after a short delay
                try:
                    import time as sys_time
                    sys_time.sleep(1.0)
                    if temp_audio.exists():
                        temp_audio.unlink()
                    if audio_path and audio_path.exists():
                        audio_path.unlink()
                    logger.info("Local render: Cleaned up temporary audio tracks successfully")
                except Exception as cleanup_err:
                    logger.warning(f"Local render: Cleanup failed (non-blocking) ({cleanup_err})")

                return dest

            dest_path = await asyncio.to_thread(_create)
            public_url = f"/outputs/{dest_path.name}"
            return RenderResponse(success=True, videoUrl=public_url, message='Local render completed')
        except RuntimeError as re:
            logger.error(str(re))
            raise HTTPException(status_code=500, detail=str(re))
        except Exception as e:
            logger.error('Local render failed: %s', str(e))
            raise HTTPException(status_code=500, detail=f'Local render failed: {e}')

    # Provider stubs — implement real provider calls here using httpx/requests
    # Free AI provider: attempt to generate a small set of images via Hugging Face inference API
    if provider == 'free_ai':
        hf_token = os.environ.get('HF_API_TOKEN')
        hf_model = os.environ.get('HF_MODEL', 'stabilityai/stable-diffusion-2')
        duration = int(req.duration or 4)
        fps = 12
        total_frames = duration * fps
        images_to_generate = min(8, max(1, total_frames // fps))

        if not hf_token:
            logger.info('HF_API_TOKEN not set; falling back to local renderer for free_ai')
            try:
                def _create_local():
                    from PIL import Image, ImageDraw, ImageFont
                    try:
                        from moviepy.editor import ImageSequenceClip
                    except Exception:
                        from moviepy import ImageSequenceClip

                    fps_local = 24
                    frames = []
                    w, h = 1280, 720
                    text = req.prompt.strip()
                    max_len = 60
                    lines = [text[i:i+max_len] for i in range(0, len(text), max_len)]
                    total_frames_local = duration * fps_local
                    for f in range(total_frames_local):
                        img = Image.new('RGB', (w, h), color=(18, 18, 30))
                        draw = ImageDraw.Draw(img)
                        try:
                            font = ImageFont.truetype('arial.ttf', 26)
                        except Exception:
                            font = ImageFont.load_default()

                        def _measure_text(text_line: str):
                            try:
                                bbox = draw.textbbox((0, 0), text_line, font=font)
                                return bbox[2] - bbox[0], bbox[3] - bbox[1]
                            except Exception:
                                return draw.textlength(text_line, font=font), 32

                        progress = f / max(1, total_frames_local - 1)
                        y = int(h * (0.75 - 0.45 * progress))
                        for idx, line in enumerate(lines):
                            tw, th = _measure_text(line)
                            draw.text(((w - tw) / 2, y + idx * (th + 8)), line, font=font, fill=(240, 240, 240))
                        frames.append(img)
                    import numpy as np
                    clip = ImageSequenceClip([np.array(frame) for frame in frames], fps=fps_local)
                    backend_root = Path(__file__).parent.resolve().parent
                    out_dir = backend_root / 'outputs'
                    out_dir.mkdir(parents=True, exist_ok=True)
                    filename = f"freeai-local-scene-{int(time.time())}.mp4"
                    dest = out_dir / filename
                    clip.write_videofile(str(dest), codec='libx264', audio=False, logger=None)
                    return dest

                dest_path = await asyncio.to_thread(_create_local)
                public_url = f"/outputs/{dest_path.name}"
                _render_cache[prompt_hash] = dest_path.name
                return RenderResponse(success=True, videoUrl=public_url, message='Local fallback render completed')
            except Exception as e:
                logger.error('free_ai local fallback failed: %s', e)
                raise HTTPException(status_code=500, detail=f'free_ai fallback failed: {e}')

        # If HF token exists, call HF inference endpoint to generate a small set of images
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                headers = {"Authorization": f"Bearer {hf_token}"}
                backend_root = Path(__file__).parent.resolve().parent
                out_dir = backend_root / 'outputs'
                out_dir.mkdir(parents=True, exist_ok=True)
                generated = []
                for i in range(images_to_generate):
                    payload = {"inputs": req.prompt}
                    resp = await client.post(f"https://api-inference.huggingface.co/models/{hf_model}", json=payload, headers=headers)
                    if resp.status_code >= 400:
                        logger.error('HF inference error: %s', resp.text)
                        raise HTTPException(status_code=502, detail=f'HF inference error: {resp.text}')
                    # HF image endpoints return raw image bytes
                    img_bytes = resp.content
                    img_path = out_dir / f"freeai-{int(time.time())}-{i}.png"
                    with img_path.open('wb') as f:
                        f.write(img_bytes)
                    generated.append(str(img_path))

                # create video by repeating generated images to match total_frames
                try:
                    from moviepy.editor import ImageSequenceClip  # type: ignore
                except Exception:
                    from moviepy import ImageSequenceClip  # type: ignore
                except Exception as e:
                    logger.error('moviepy missing for assembling free_ai frames: %s', e)
                    raise HTTPException(status_code=500, detail='moviepy required to assemble frames')

                # Build sequence stretched to total frames
                sequence = []
                repeats = max(1, total_frames // max(1, len(generated)))
                for img in generated:
                    sequence.extend([img] * repeats)
                # if short, pad with last
                while len(sequence) < total_frames:
                    sequence.append(generated[-1])

                clip = ImageSequenceClip(sequence, fps=fps)
                filename = f"freeai-scene-{int(time.time())}.mp4"
                dest = out_dir / filename

                # Attempt to generate TTS for the prompt and attach to the clip
                audio_path = None
                try:
                    from gtts import gTTS
                    mp3_path = out_dir / f"freeai-scene-audio-{int(time.time())}.mp3"
                    tts = gTTS(req.prompt)
                    tts.save(str(mp3_path))
                    audio_path = mp3_path
                except Exception:
                    audio_path = None

                try:
                    if audio_path:
                        try:
                            from moviepy.editor import AudioFileClip  # type: ignore
                        except Exception:
                            from moviepy import AudioFileClip  # type: ignore
                        audio_clip = AudioFileClip(str(audio_path))
                        clip = _attach_audio_to_clip(clip, audio_clip)
                except Exception as e:
                    logger.warning(f"free_ai: attaching TTS audio failed; proceeding without audio ({e})")

                clip.write_videofile(str(dest), codec='libx264', audio=bool(audio_path), logger=None)
                public_url = f"/outputs/{filename}"
                _render_cache[prompt_hash] = filename
                return RenderResponse(success=True, videoUrl=public_url, message='Free AI render completed')

            except httpx.RequestError as exc:
                logger.error('Network error during HF inference: %s', str(exc))
                raise HTTPException(status_code=502, detail=str(exc))
            except Exception as e:
                logger.error('free_ai provider failed: %s', str(e))
                raise HTTPException(status_code=500, detail=str(e))
    if provider == 'veo':
        api_key = os.environ.get('VEO_API_KEY')
        if not api_key:
            raise HTTPException(status_code=401, detail="VEO_API_KEY missing for Veo provider.")
        # TODO: call Veo API here and return the generated video URL
        logger.info("Veo provider selected but call is not yet implemented.")
        return RenderResponse(success=False, videoUrl=None, message="Veo provider integration not implemented in this build. Provide API credentials and enable integration.")

    if provider == 'runway':
        api_key = os.environ.get('RUNWAY_API_KEY')
        runway_base = os.environ.get('RUNWAY_API_URL', 'https://api.dev.runwayml.com/v1')
        runway_model = os.environ.get('RUNWAY_MODEL', 'gen-3')
        if not api_key:
            raise HTTPException(status_code=401, detail="RUNWAY_API_KEY missing for Runway provider.")

        logger.info("Dispatching render to Runway model %s", runway_model)

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                op_url = f"{runway_base}/models/{runway_model}/outputs"
                payload = {
                    "prompt": req.prompt,
                    "duration": req.duration or 4,
                    "format": "mp4"
                }
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "X-Runway-Version": "2024-11-06"
                }
                resp = await client.post(op_url, json=payload, headers=headers)
                if resp.status_code >= 400:
                    logger.error("Runway API returned error: %s", resp.text)
                    raise HTTPException(status_code=502, detail=f"Runway API error: {resp.text}")

                data = resp.json()
                outputs = data.get('outputs') or data.get('result') or []
                if outputs and isinstance(outputs, list) and outputs[0].get('url'):
                    video_url = outputs[0]['url']
                    backend_root = Path(__file__).parent.resolve().parent
                    out_dir = backend_root / 'outputs'
                    out_dir.mkdir(parents=True, exist_ok=True)
                    filename = f"scene-{int(time.time())}.mp4"
                    dest = out_dir / filename
                    await _download_file(video_url, dest, headers=None)
                    public_url = f"/outputs/{filename}"
                    _render_cache[prompt_hash] = filename
                    return RenderResponse(success=True, videoUrl=public_url, message="Render completed")

                job_id = data.get('id') or data.get('operation_id') or data.get('job_id')
                if not job_id:
                    logger.error("Runway response did not include outputs or job id: %s", data)
                    raise HTTPException(status_code=502, detail="Runway response missing job id and outputs")

                status_url = f"{runway_base}/operations/{job_id}"
                timeout = int(os.environ.get('RENDER_TIMEOUT_SECONDS', '300'))
                interval = float(os.environ.get('RENDER_POLL_INTERVAL', '3.0'))
                waited = 0
                while waited < timeout:
                    st = await client.get(status_url, headers=headers)
                    if st.status_code >= 400:
                        logger.error("Runway status check failed: %s", st.text)
                        raise HTTPException(status_code=502, detail="Runway status check failed")
                    stj = st.json()
                    state = stj.get('state') or stj.get('status') or ''
                    if state.lower() in ('succeeded', 'completed', 'done'):
                        out = stj.get('outputs') or stj.get('result') or []
                        if out and out[0].get('url'):
                            video_url = out[0]['url']
                            backend_root = Path(__file__).parent.resolve().parent
                            out_dir = backend_root / 'outputs'
                            out_dir.mkdir(parents=True, exist_ok=True)
                            filename = f"scene-{int(time.time())}.mp4"
                            dest = out_dir / filename
                            await _download_file(video_url, dest, headers=None)
                            public_url = f"/outputs/{filename}"
                            return RenderResponse(success=True, videoUrl=public_url, message="Render completed")
                        else:
                            raise HTTPException(status_code=502, detail="Runway completed but no outputs found")
                    if state.lower() in ('failed', 'error'):
                        detail = stj.get('error') or stj
                        raise HTTPException(status_code=502, detail=f"Render failed: {detail}")
                    await asyncio.sleep(interval)
                    waited += interval

                raise HTTPException(status_code=504, detail="Render timed out")

            except httpx.RequestError as exc:
                logger.error("Network error while talking to Runway: %s", str(exc))
                raise HTTPException(status_code=502, detail=str(exc))

    if provider == 'luma':
        api_key = os.environ.get('LUMA_API_KEY')
        if not api_key:
            raise HTTPException(status_code=401, detail="LUMA_API_KEY missing for Luma provider.")
        logger.info("Luma provider selected but call is not yet implemented.")
        return RenderResponse(success=False, videoUrl=None, message="Luma provider integration not implemented in this build.")

    if provider == 'sora':
        api_key = os.environ.get('SORA_API_KEY')
        if not api_key:
            raise HTTPException(status_code=401, detail="SORA_API_KEY missing for Sora provider.")
        logger.info("Sora provider selected but call is not yet implemented.")
        return RenderResponse(success=False, videoUrl=None, message="Sora provider integration not implemented in this build.")

    raise HTTPException(status_code=400, detail=f"Unknown VIDEO_PROVIDER '{provider}'")
