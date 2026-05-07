import json
from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from backend.schemas import AnalysisRequest, AnalysisResponse
from backend.services.ai_engine import AIEngine
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api/ai", tags=["Script Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_script(request: AnalysisRequest, user_id: str = Depends(get_auth_user_id)):
    """
    Analyzes a script to extract technical production data (Shot list, Pulse, Audio).
    """
    try:
        engine = AIEngine(model_name=request.model)
        raw_json = await engine.analyze_script(request.script, user_id=user_id)
        
        # Parse and return as AnalysisResponse
        data = json.loads(raw_json)
        return AnalysisResponse(**data)
        
    except Exception as e:
        logger.error(f"Script Analysis Failed: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Neural Engine Analysis Failed: {str(e)}"
        )
