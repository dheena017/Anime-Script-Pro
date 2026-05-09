from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from typing import List
from backend.database.models import SEOEntry
from backend.database import async_session

router = APIRouter(prefix="/api", tags=["SEO"])

@router.get("/seo", response_model=List[SEOEntry])
@router.get("/seo_entries", response_model=List[SEOEntry])
async def get_seo_entries():
    async with async_session() as session:
        results = await session.execute(select(SEOEntry))
        return results.scalars().all()

@router.post("/seo", response_model=SEOEntry)
@router.post("/seo_entries", response_model=SEOEntry)
async def create_seo_entry(seo_entry: SEOEntry):
    async with async_session() as session:
        session.add(seo_entry)
        await session.commit()
        await session.refresh(seo_entry)
        return seo_entry

@router.get("/seo/{seo_id}", response_model=SEOEntry)
async def get_seo_entry(seo_id: int):
    async with async_session() as session:
        seo_entry = await session.get(SEOEntry, seo_id)
        if not seo_entry:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        return seo_entry

@router.put("/seo/{seo_id}", response_model=SEOEntry)
async def update_seo_entry(seo_id: int, seo_entry: SEOEntry):
    async with async_session() as session:
        db_seo = await session.get(SEOEntry, seo_id)
        if not db_seo:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        db_seo.keyword = seo_entry.keyword
        db_seo.description = seo_entry.description
        session.add(db_seo)
        await session.commit()
        await session.refresh(db_seo)
        return db_seo

@router.delete("/seo/{seo_id}")
async def delete_seo_entry(seo_id: int):
    async with async_session() as session:
        seo_entry = await session.get(SEOEntry, seo_id)
        if not seo_entry:
            raise HTTPException(status_code=404, detail="SEOEntry not found")
        await session.delete(seo_entry)
        await session.commit()
        return {"ok": True}
