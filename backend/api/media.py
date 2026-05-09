from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from typing import List, Optional
from loguru import logger
from backend.database.models import MediaAsset, UserFavorite
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Media"])

@router.get("/assets/{user_id}")
async def get_user_assets(user_id: str, asset_type: Optional[str] = None):
    async with async_session() as session:
        statement = select(MediaAsset).where(MediaAsset.user_id == user_id)
        if asset_type:
            statement = statement.where(MediaAsset.asset_type == asset_type)
        statement = statement.order_by(MediaAsset.created_at.desc())
        results = await session.execute(statement)
        return results.scalars().all()

@router.post("/assets")
async def create_asset(asset: MediaAsset):
    async with async_session() as session:
        session.add(asset)
        await session.commit()
        await session.refresh(asset)
        return asset

@router.get("/favorites/{user_id}")
async def get_favorites(user_id: str):
    async with async_session() as session:
        statement = select(MediaAsset).join(UserFavorite).where(UserFavorite.user_id == user_id)
        results = await session.execute(statement)
        return results.scalars().all()

@router.post("/favorites")
async def toggle_favorite(favorite: UserFavorite):
    async with async_session() as session:
        statement = select(UserFavorite).where(
            UserFavorite.user_id == favorite.user_id,
            UserFavorite.asset_id == favorite.asset_id
        )
        results = await session.execute(statement)
        existing = results.scalars().first()
        if existing:
            await session.delete(existing)
            await session.commit()
            return {"status": "removed"}
        else:
            session.add(favorite)
            await session.commit()
            return {"status": "added"}
