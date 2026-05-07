import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List
from loguru import logger
from backend.database.models import Tutorial
from backend.database import AsyncSession, async_engine
from backend.utils.deps import get_auth_user_id
from backend.services.user_manager import current_active_user

router = APIRouter(prefix="/api/tutorials", tags=["Tutorials"])

@router.get("/", response_model=List[Tutorial])
async def get_tutorials():
    async with AsyncSession(async_engine) as session:
        statement = select(Tutorial).where(Tutorial.is_active == True)
        results = await session.exec(statement)
        return results.all()

@router.post("/", response_model=Tutorial)
async def create_tutorial(tutorial: Tutorial, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        session.add(tutorial)
        await session.commit()
        await session.refresh(tutorial)
        return tutorial

@router.get("/{tutorial_id}", response_model=Tutorial)
async def get_tutorial(tutorial_id: int):
    async with AsyncSession(async_engine) as session:
        tutorial = await session.get(Tutorial, tutorial_id)
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        return tutorial

@router.put("/{tutorial_id}", response_model=Tutorial)
async def update_tutorial(tutorial_id: int, tutorial_update: Tutorial, user=Depends(current_active_user)):
    async with AsyncSession(async_engine) as session:
        db_tutorial = await session.get(Tutorial, tutorial_id)
        if not db_tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        db_tutorial.title = tutorial_update.title
        db_tutorial.description = tutorial_update.description
        db_tutorial.icon_name = tutorial_update.icon_name
        db_tutorial.duration = tutorial_update.duration
        db_tutorial.level = tutorial_update.level
        db_tutorial.category = tutorial_update.category
        
        session.add(db_tutorial)
        await session.commit()
        await session.refresh(db_tutorial)
        return db_tutorial

@router.delete("/{tutorial_id}")
async def delete_tutorial(tutorial_id: int, user_id: str = Depends(get_auth_user_id)):
    async with AsyncSession(async_engine) as session:
        tutorial = await session.get(Tutorial, tutorial_id)
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        await session.delete(tutorial)
        await session.commit()
        return {"ok": True}

@router.post("/seed")
async def seed_tutorials():
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "tutorials.json")
    try:
        if not os.path.exists(json_path):
             raise HTTPException(status_code=404, detail=f"Seed file not found at {json_path}")

        with open(json_path, "r") as f:
            initial_tutorials = json.load(f)
        
        async with AsyncSession(async_engine) as session:
            for t_data in initial_tutorials:
                statement = select(Tutorial).where(Tutorial.title == t_data["title"])
                results = await session.exec(statement)
                if not results.first():
                    tutorial = Tutorial(**t_data)
                    session.add(tutorial)
            await session.commit()
            return {"message": "Tutorials seeded successfully from external file"}
    except Exception as e:
        logger.error(f"Failed to seed tutorials: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize tutorial database.")
