from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from typing import List, Optional
from backend.database.models.assets import GrowthStrategy
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id
from backend.schemas import GenerationResponse

router = APIRouter(prefix="/api/growth", tags=["Growth"])

@router.get("/strategies", response_model=List[GrowthStrategy])
async def get_growth_strategies(
    track: Optional[str] = Query(None),
    is_active: bool = True
):
    async with async_session() as session:
        query = select(GrowthStrategy).where(GrowthStrategy.is_active == is_active)
        if track:
            query = query.where(GrowthStrategy.track == track)
        results = await session.execute(query)
        return results.scalars().all()
        return results.all()

@router.post("/generate/{strategy_id}", response_model=GenerationResponse)
async def generate_specific_strategy(
    strategy_id: int,
    script_content: str,
    model: str = "gemini-1.5-flash-latest",
    user_id: str = Depends(get_auth_user_id)
):
    async with async_session() as session:
        strategy = await session.get(GrowthStrategy, strategy_id)
        if not strategy:
            raise HTTPException(status_code=404, detail="Strategy blueprint not found")
        
        try:
            # Call AI with the specific prompt from the strategy blueprint
            from backend.ai_engine import call_ai
            system_instruction = f"{strategy.prompt}\n\nUSE THIS SCRIPT AS SOURCE DATA:\n{script_content}"
            content = await call_ai(model, "Generate the strategy blueprint based on my script.", system_instruction)
            
            return {
                "content": content,
                "model": model,
                "timestamp": str(datetime.utcnow()),
                "signal_id": "GROWTH-" + str(strategy_id)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

from datetime import datetime
