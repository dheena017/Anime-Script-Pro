from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
import time
from loguru import logger
import asyncio
from pathlib import Path
from gtts import gTTS
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api/audio", tags=["Audio"])

class AudioRequest(BaseModel):
    text: str
    language: str = "en"
    tld: str = "com"

class AudioResponse(BaseModel):
    success: bool
    audioUrl: str | None = None
    message: str | None = None

@router.post("/generate", response_model=AudioResponse)
async def generate_audio(req: AudioRequest, user_id: str = Depends(get_auth_user_id)):
    """Generate TTS audio for a given text manifest. Requires authentication."""

    # 1. Input Validation & Resource Limits
    if not req.text or len(req.text.strip()) < 2:
        raise HTTPException(status_code=400, detail="Text too short for audio generation.")

    if len(req.text) > 5000:
        raise HTTPException(status_code=400, detail="Text exceeds maximum length of 5000 characters.")

    # 2. Secure Language/TLD validation
    safe_languages = ["en", "ja", "fr", "de", "es", "it", "ko", "zh-CN"]
    if req.language not in safe_languages:
         req.language = "en" # Fallback to en for safety

    safe_tlds = ["com", "co.uk", "ca", "ie", "co.in"]
    if req.tld not in safe_tlds:
        req.tld = "com"

    try:
        backend_root = Path(__file__).parent.resolve().parent
        # SECURITY: Ensure the path is within the outputs directory
        out_dir = (backend_root / "outputs" / "audio").resolve()

        # Verify out_dir is still under backend/outputs
        if not str(out_dir).startswith(str((backend_root / "outputs").resolve())):
             raise HTTPException(status_code=400, detail="Invalid output directory.")

        out_dir.mkdir(parents=True, exist_ok=True)
        
        # SECURITY: Use a safe filename generation
        import hashlib
        text_hash = hashlib.sha256(req.text.encode()).hexdigest()[:12]
        filename = f"voiceover-{int(time.time())}-{text_hash}.mp3"
        dest = (out_dir / filename).resolve()

        # Final safety check on destination path
        if not str(dest).startswith(str(out_dir)):
            raise HTTPException(status_code=400, detail="Invalid output path.")
        
        def _create_audio():
            tts = gTTS(req.text, lang=req.language, tld=req.tld)
            tts.save(str(dest))
            return filename

        await asyncio.to_thread(_create_audio)
        
        public_url = f"/outputs/audio/{filename}"
        logger.info(f"AUDIO: User {user_id} generated audio: {filename}")
        return AudioResponse(
            success=True, 
            audioUrl=public_url, 
            message="Audio manifest synthesized successfully."
        )
    except Exception as e:
        logger.error(f"Audio generation failed: {e}")
        # Return a generic error to the client to avoid leaking internal details
        raise HTTPException(status_code=500, detail="Neural audio synthesis failed.")
