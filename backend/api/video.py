from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import time
from loguru import logger
import httpx
import asyncio
import math
from pathlib import Path

router = APIRouter(prefix="/api", tags=["Video"])


class RenderRequest(BaseModel):
    prompt: str
    model: str | None = None
    duration: int | None = 4


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


@router.post("/render/scene", response_model=RenderResponse)
async def render_scene(req: RenderRequest):
    """Proxy endpoint to dispatch scene render requests to a chosen provider.

    Environment variables:
    - VIDEO_PROVIDER: one of 'veo', 'runway', 'luma', 'sora' or 'local'
    - Provider-specific API keys must be set (e.g. VEO_API_KEY, RUNWAY_API_KEY)
    """
    provider = os.environ.get('VIDEO_PROVIDER', '').lower()
    if not provider:
        logger.warning("Render requested but VIDEO_PROVIDER is not configured.")
        raise HTTPException(status_code=501, detail="No video provider configured. Set VIDEO_PROVIDER and provider API key in environment.")

    # Basic validation
    if not req.prompt or len(req.prompt.strip()) < 10:
        raise HTTPException(status_code=400, detail="Prompt too short for rendering.")

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
                        from moviepy.editor import ImageSequenceClip  # type: ignore
                    except Exception:
                        from moviepy import ImageSequenceClip  # type: ignore
                except Exception as e:
                    raise RuntimeError('Missing dependencies for local renderer (Pillow, moviepy).') from e

                fps = 24
                frames = []
                w, h = 1280, 720
                # Simple animation: moving text from bottom to center
                lines = []
                text = req.prompt.strip()
                # Split long text
                max_len = 60
                for i in range(0, len(text), max_len):
                    lines.append(text[i:i+max_len])

                total_frames = duration * fps
                total_frames = duration * fps
                for f in range(total_frames):
                    # Aetheria Cinematic Gradient Background
                    img = Image.new('RGB', (w, h))
                    draw = ImageDraw.Draw(img)
                    
                    # Create a vertical gradient (Deep Indigo to Black)
                    for row in range(h):
                        r_c = max(0, 20 - int(row / h * 20))
                        g_c = max(0, 15 - int(row / h * 15))
                        b_c = max(0, 45 - int(row / h * 30))
                        draw.line([(0, row), (w, row)], fill=(r_c, g_c, b_c))

                    try:
                        font_main = ImageFont.truetype('arial.ttf', 32)
                        font_sub = ImageFont.truetype('arial.ttf', 18)
                    except Exception:
                        font_main = ImageFont.load_default()
                        font_sub = ImageFont.load_default()

                    def _measure_text(text_line: str, font_obj):
                        try:
                            bbox = draw.textbbox((0, 0), text_line, font=font_obj)
                            return bbox[2] - bbox[0], bbox[3] - bbox[1]
                        except Exception:
                            return len(text_line) * 10, 20

                    # Compute progress-based animations
                    progress = f / max(1, total_frames - 1)
                    
                    # Draw "NEURAL RENDER" watermark
                    draw.text((40, 40), "NEURAL MANIFESTATION // AETHERIA", font=font_sub, fill=(100, 100, 150))
                    draw.line([(40, 65), (200, 65)], fill=(100, 100, 150), width=1)

                    # Draw animated text lines
                    y_start = int(h * 0.6)
                    alpha = int(255 * (1 - abs(progress - 0.5) * 2)) # Fade in/out
                    
                    for idx, line in enumerate(lines):
                        tw, th = _measure_text(line, font_main)
                        # Subtle horizontal float using sine wave
                        x_off = int(math.sin(progress * math.pi) * 10)
                        
                        # Draw shadow
                        draw.text(((w - tw) / 2 + 2, y_start + idx * (th + 12) + 2), line, font=font_main, fill=(0, 0, 0, alpha))
                        # Draw main text
                        draw.text(((w - tw) / 2 + x_off, y_start + idx * (th + 12)), line, font=font_main, fill=(255, 255, 255, alpha))

                    frames.append(img)

                import numpy as np
                clip = ImageSequenceClip([np.array(frame) for frame in frames], fps=fps)
                backend_root = Path(__file__).parent.resolve().parent
                out_dir = backend_root / 'outputs'
                out_dir.mkdir(parents=True, exist_ok=True)
                filename = f"local-scene-{int(time.time())}.mp4"
                dest = out_dir / filename

                # Attempt to generate TTS audio in-thread and attach to clip if available
                audio_path = None
                try:
                    try:
                        from gtts import gTTS
                        mp3_path = out_dir / f"local-scene-audio-{int(time.time())}.mp3"
                        tts = gTTS(text)
                        tts.save(str(mp3_path))
                        audio_path = mp3_path
                    except Exception:
                        audio_path = None
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
                    logger.warning(f"Local render: attaching TTS audio failed; proceeding without audio ({e})")

                clip.write_videofile(str(dest), codec='libx264', audio=bool(audio_path), logger=None)
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
        runway_base = os.environ.get('RUNWAY_API_URL', 'https://api.runwayml.com/v1')
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
                headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
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
