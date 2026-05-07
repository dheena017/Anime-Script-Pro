from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select
from typing import List
from backend.database.models import Category, Scene
from backend.database import AsyncSession, async_engine

router = APIRouter(prefix="/api", tags=["Stats"])

@router.get("/categories", response_model=List[Category])
async def get_categories():
    async with AsyncSession(async_engine) as session:
        statement = select(Category).order_by(Category.name)
        results = await session.exec(statement)
        return results.all()

@router.get("/stats/progress")
async def get_stats_progress(project_id: int):
    async with AsyncSession(async_engine) as session:
        statement = select(Scene).where(Scene.project_id == project_id)
        results = await session.exec(statement)
        scenes = results.all()
        
        stats = {}
        for s in scenes:
            sess_idx = (s.scene_number - 1) // 192 + 1
            if sess_idx not in stats:
                stats[sess_idx] = {"session": sess_idx, "total": 0, "completed": 0, "in_production": 0}
            stats[sess_idx]["total"] += 1
            if s.status == "COMPLETED":
                stats[sess_idx]["completed"] += 1
            elif s.status != "QUEUED":
                stats[sess_idx]["in_production"] += 1
        return sorted(list(stats.values()), key=lambda x: x["session"])
