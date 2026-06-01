"""
Anime Script Pro — Local Video Compilation Engine

This module compiles high-fidelity animated cinematic video clips locally
using Pillow, NumPy, and MoviePy, providing a robust, free visual compilation
layer that runs entirely offline with zero external API key requirements.
"""

import os
import time
import base64
import httpx
from io import BytesIO
from typing import Optional
from pathlib import Path
from loguru import logger

# Ensure optional video rendering libraries are handled gracefully
try:
    from PIL import Image, ImageDraw, ImageFont
    import numpy as np
    from moviepy.editor import VideoClip
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False


def get_premium_font(size: int = 24) -> Optional["ImageFont.ImageFont"]:
    """Resolve a clean system font (like Arial, Segoe UI, or Helvetica) if possible."""
    if not DEPENDENCIES_AVAILABLE:
        return None
    font_names = ["arial.ttf", "segoeui.ttf", "helvetica.ttf", "tahoma.ttf", "LiberationSans-Regular.ttf"]
    for font_name in font_names:
        try:
            return ImageFont.truetype(font_name, size)
        except Exception:
            continue
    try:
        return ImageFont.load_default()
    except Exception:
        return None


def wrap_text(text: str, max_chars_per_line: int = 50) -> list[str]:
    """Wraps text into multiple lines safely without splitting words."""
    words = text.split(" ")
    lines = []
    current_line = []
    current_len = 0
    for word in words:
        if current_len + len(word) + (1 if current_line else 0) <= max_chars_per_line:
            current_line.append(word)
            current_len += len(word) + (1 if len(current_line) > 1 else 0)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]
            current_len = len(word)
    if current_line:
        lines.append(" ".join(current_line))
    return lines


def create_cybernetic_fallback_image(prompt: str, width: int = 1024, height: int = 1024) -> "Image.Image":
    """Create a stunning cybernetic visual template in Pillow as a rendering backdrop."""
    img = Image.new("RGB", (width, height), color=(2, 2, 5))
    draw = ImageDraw.Draw(img)
    
    # Draw cybernetic grid
    grid_spacing = 100
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=(15, 23, 42), width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=(15, 23, 42), width=1)
        
    # Draw center visual circles
    cx, cy = width // 2, height // 2
    draw.ellipse([cx - 300, cy - 300, cx + 300, cy + 300], outline=(6, 182, 212), width=1)
    draw.ellipse([cx - 200, cy - 200, cx + 200, cy + 200], outline=(168, 85, 247), width=1)
    
    # Technical branding texts
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
        
    draw.text((80, 80), "SYSTEM DIRECTIVE: VISUAL COMPILATION ACTIVE", fill=(6, 182, 212), font=font)
    draw.text((width - 300, 80), "PRIORITY STATE: DEVELOPER FREE TIER", fill=(168, 85, 247), font=font)
    
    # Title
    draw.text((80, cx - 20), "LOCAL NEURAL BLUEPRINT STAGE", fill=(255, 255, 255), font=font)
    return img


async def load_target_image(image_url: Optional[str], prompt: str) -> "Image.Image":
    """Parse, download, or generate the visual image layer for compiling."""
    if not image_url:
        logger.info("LOCAL VIDEO: No image URL provided. Generating default cybernetic backdrop...")
        return create_cybernetic_fallback_image(prompt)
        
    try:
        if image_url.startswith("data:image"):
            logger.info("LOCAL VIDEO: Resolving base64 data URI...")
            header, encoded = image_url.split(",", 1)
            data = base64.b64decode(encoded)
            return Image.open(BytesIO(data)).convert("RGB")
            
        elif image_url.startswith("http"):
            logger.info(f"LOCAL VIDEO: Downloading remote visual from: {image_url}...")
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(image_url)
                if res.status_code == 200:
                    return Image.open(BytesIO(res.content)).convert("RGB")
                else:
                    logger.warning(f"LOCAL VIDEO: Remote image download failed (status {res.status_code}). Using fallback.")
                    
        else:
            # Resolve relative outputs path locally
            logger.info(f"LOCAL VIDEO: Checking local path: {image_url}...")
            backend_root = Path(__file__).parent.resolve().parent
            # Trim leading slash if present
            clean_url = image_url.lstrip("/")
            local_path = backend_root / clean_url
            if local_path.exists():
                return Image.open(local_path).convert("RGB")
                
    except Exception as e:
        logger.error(f"LOCAL VIDEO: Failed to load target image layer: {e}")
        
    return create_cybernetic_fallback_image(prompt)


async def compile_local_scene_video(
    prompt: str,
    image_url: Optional[str] = None,
    duration: int = 4,
) -> str:
    """Compile a gorgeous cinematic 4-second MP4 locally using Pillow and MoviePy.
    
    Args:
        prompt: Subtitle script content describing the scene.
        image_url: Background image layer (data URI, remote URL, or local relative path).
        duration: The clip duration in seconds.
        
    Returns:
        str: Public URL path pointing to the generated local MP4.
    """
    if not DEPENDENCIES_AVAILABLE:
        raise RuntimeError("Video rendering dependencies (Pillow, numpy, moviepy) are not fully installed.")

    start_time = time.perf_counter()
    backend_root = Path(__file__).parent.resolve().parent
    out_dir = backend_root / "outputs" / "video"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    # Load and scale the base image to standard 1024x1024
    base_img = await load_target_image(image_url, prompt)
    img = base_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    w, h = img.size
    
    filename = f"scene-compile-{int(time.time())}-{hash(prompt) % 10000}.mp4"
    dest = out_dir / filename
    
    def _render_frame(t):
        """Image generation callback for VideoClip rendering."""
        # Ken burns effect: Slow zoom-in from 1.0 to 1.08 over duration
        scale = 1.0 + 0.08 * (t / duration)
        new_w, new_h = int(w * scale), int(h * scale)
        
        # Resize frame
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center-crop frame back to 1024x1024
        left = (new_w - w) // 2
        top = (new_h - h) // 2
        cropped = resized.crop((left, top, left + w, top + h))
        
        # Draw tech HUD scanlines & subtitle prompt overlays
        draw = ImageDraw.Draw(cropped)
        
        # 1. Subtle cyan scanline moving down
        scan_y = int((t / duration) * h)
        draw.line([(0, scan_y), (w, scan_y)], fill=(6, 182, 212), width=1)
        
        # 2. Draw cyber HUD brackets
        pad = 40
        size = 30
        draw.line([(pad, pad), (pad + size, pad)], fill=(6, 182, 212), width=3)
        draw.line([(pad, pad), (pad, pad + size)], fill=(6, 182, 212), width=3)
        
        draw.line([(w - pad, pad), (w - pad - size, pad)], fill=(6, 182, 212), width=3)
        draw.line([(w - pad, pad), (w - pad, pad + size)], fill=(6, 182, 212), width=3)
        
        draw.line([(pad, h - pad), (pad + size, h - pad)], fill=(6, 182, 212), width=3)
        draw.line([(pad, h - pad), (pad, h - pad - size)], fill=(6, 182, 212), width=3)
        
        draw.line([(w - pad, h - pad), (w - pad - size, h - pad)], fill=(6, 182, 212), width=3)
        draw.line([(w - pad, h - pad), (w - pad, h - pad - size)], fill=(6, 182, 212), width=3)
        
        # Resolve premium custom system fonts
        hud_font = get_premium_font(18)
        subtitle_font = get_premium_font(22)
            
        # Draw HUD Indicators with drop shadow for premium visibility
        hud_text_left = f"NEURAL CAMERA FEED // T={t:.2f}S"
        draw.text((pad + 15 + 1, pad + 15 + 1), hud_text_left, fill=(0, 0, 0), font=hud_font)
        draw.text((pad + 15, pad + 15), hud_text_left, fill=(6, 182, 212), font=hud_font)
        
        hud_text_right = "STATUS: RENDER_ACTIVE"
        try:
            hud_right_w = draw.textlength(hud_text_right, font=hud_font)
        except AttributeError:
            hud_right_w = len(hud_text_right) * 11
        draw.text((w - pad - hud_right_w - 15 + 1, pad + 15 + 1), hud_text_right, fill=(0, 0, 0), font=hud_font)
        draw.text((w - pad - hud_right_w - 15, pad + 15), hud_text_right, fill=(168, 85, 247), font=hud_font)
        
        # Subtitle wrapping and dynamic layout
        prompt_lines = wrap_text(prompt.strip(), max_chars_per_line=50)
        prompt_lines = prompt_lines[:3]  # Max 3 lines to fit beautifully
        
        line_height = 28
        padding_y = 15
        box_h = len(prompt_lines) * line_height + (padding_y * 2)
        box_w = w - (pad * 4)
        box_left = (w - box_w) // 2
        box_top = h - pad - box_h - 20
        
        # Draw gorgeous glassmorphic black backdrop with 70% opacity
        # To draw with opacity in Pillow, we create a RGBA overlay and draw on it
        overlay = Image.new("RGBA", cropped.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        try:
            overlay_draw.rounded_rectangle(
                [box_left, box_top, box_left + box_w, box_top + box_h],
                radius=10,
                fill=(10, 10, 15, 180),  # Glassmorphic semi-transparent backdrop
                outline=(6, 182, 212, 255),  # Neon cyan outline
                width=2
            )
        except AttributeError:
            overlay_draw.rectangle(
                [box_left, box_top, box_left + box_w, box_top + box_h],
                fill=(10, 10, 15, 180),
                outline=(6, 182, 212, 255),
                width=2
            )
            
        # Blend overlay with base frame
        cropped = Image.alpha_composite(cropped.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(cropped)
        
        # Draw each subtitle line centered beautifully
        for idx, line in enumerate(prompt_lines):
            line_y = box_top + padding_y + (idx * line_height)
            try:
                line_w = draw.textlength(line, font=subtitle_font)
            except AttributeError:
                line_w = len(line) * 11
            line_x = (w - line_w) // 2
            
            # Subtle drop shadow behind the text for maximum legibility
            draw.text((line_x + 1, line_y + 1), line, fill=(0, 0, 0), font=subtitle_font)
            draw.text((line_x, line_y), line, fill=(255, 255, 255), font=subtitle_font)
        
        return np.array(cropped)

    logger.info(f"LOCAL VIDEO: Starting MoviePy rendering timeline...")
    
    def _run_moviepy():
        clip = VideoClip(_render_frame, duration=duration)
        # Write out MP4 using ffmpeg with standard h264 encoding
        clip.write_videofile(
            str(dest),
            fps=24,
            codec="libx264",
            audio=False,
            verbose=False,
            logger=None
        )
        clip.close()

    # Offload standard synchronous MoviePy rendering to a background worker thread
    import asyncio
    await asyncio.to_thread(_run_moviepy)
    
    latency_ms = (time.perf_counter() - start_time) * 1000
    logger.success(f"LOCAL VIDEO: Successfully compiled {duration}s MP4 locally in {latency_ms:.2f}ms")
    
    return f"/outputs/video/{filename}"
