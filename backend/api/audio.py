from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import time
from loguru import logger
import asyncio
from pathlib import Path
from gtts import gTTS

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
async def generate_audio(req: AudioRequest):
    """Generate TTS audio for a given text manifest."""
    if not req.text or len(req.text.strip()) < 2:
        raise HTTPException(status_code=400, detail="Text too short for audio generation.")

    try:
        backend_root = Path(__file__).parent.resolve().parent
        out_dir = backend_root / "outputs" / "audio"
        out_dir.mkdir(parents=True, exist_ok=True)
        
        filename = f"voiceover-{int(time.time())}-{hash(req.text) % 10000}.mp3"
        dest = out_dir / filename
        
        def _create_audio():
            tts = gTTS(req.text, lang=req.language, tld=req.tld)
            tts.save(str(dest))
            return filename

        await asyncio.to_thread(_create_audio)
        
        public_url = f"/outputs/audio/{filename}"
        return AudioResponse(
            success=True, 
            audioUrl=public_url, 
            message="Audio manifest synthesized successfully."
        )
    except Exception as e:
        logger.error(f"Audio generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Neural audio synthesis failed: {e}")
