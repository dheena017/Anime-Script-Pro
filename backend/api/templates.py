from fastapi import APIRouter, Depends, Query, HTTPException, Request
from sqlmodel import select
from datetime import datetime
from typing import List, Optional, Dict
from backend.database.models import Template
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id
from backend.schemas import TemplateIn, TemplateOut

router = APIRouter(prefix="/api/templates", tags=["Templates"])

@router.post("/", response_model=TemplateOut, status_code=201)
async def create_template(template: TemplateIn, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        db_template = Template(**template.model_dump())
        session.add(db_template)
        await session.commit()
        await session.refresh(db_template)
        return db_template

@router.get("/", response_model=List[TemplateOut])
@router.get("/api/templates_public", response_model=List[TemplateOut])
async def get_templates(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    name: Optional[str] = Query(None)
):
    async with async_session() as session:
        query = select(Template).where(Template.is_active == True)
        if name:
            query = query.where(Template.name.contains(name))
        result = await session.execute(query.offset(offset).limit(limit))
        return result.scalars().all()

@router.get("/{template_id}", response_model=TemplateOut)
async def get_template(template_id: int):
    async with async_session() as session:
        template = await session.get(Template, template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template

@router.put("/{template_id}", response_model=TemplateOut)
async def update_template(template_id: int, template: TemplateIn, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        db_template = await session.get(Template, template_id)
        if not db_template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        data = template.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(db_template, key, value)
            
        db_template.updated_at = datetime.utcnow()
        session.add(db_template)
        await session.commit()
        await session.refresh(db_template)
        return db_template

@router.delete("/{template_id}")
async def delete_template(template_id: int, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        template = await session.get(Template, template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        await session.delete(template)
        await session.commit()
        return {"ok": True}
