from fastapi import APIRouter, Depends, Query, HTTPException, Request
from sqlalchemy import select
from datetime import datetime, timezone
from typing import List, Optional
from backend.database.models import Template
from backend.database import async_session
from backend.utils.deps import get_auth_user_id
from backend.schemas import TemplateIn, TemplateOut

router = APIRouter(prefix="/api/templates", tags=["Templates"])

@router.post("", response_model=TemplateOut, status_code=201)
async def create_template(template: TemplateIn, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Assuming Template model has a user_id field to track ownership
        template_data = template.model_dump()
        template_data["user_id"] = user_id 
        
        db_template = Template(**template_data)
        session.add(db_template)
        await session.commit()
        await session.refresh(db_template)
        return db_template

# Renamed to just "/" for cleaner RESTful design (e.g., GET /api/templates)
@router.get("", response_model=List[TemplateOut])
async def get_templates(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    name: Optional[str] = Query(None)
):
    async with async_session() as session:
        query = select(Template).where(Template.is_active == True)
        if name:
            # ilike is better here for case-insensitive searching!
            query = query.where(Template.name.ilike(f"%{name}%"))
            
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
            
        # SECURITY PATCH: Verify the user owns this template before updating
        if str(db_template.user_id) != str(user_id):
            raise HTTPException(status_code=403, detail="Not authorized to update this template")
        
        data = template.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(db_template, key, value)
            
        # PATCH: Use modern timezone-aware UTC
        db_template.updated_at = datetime.now(timezone.utc)
        
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
            
        # SECURITY PATCH: Verify the user owns this template before deleting
        if str(template.user_id) != str(user_id):
            raise HTTPException(status_code=403, detail="Not authorized to delete this template")
            
        await session.delete(template)
        await session.commit()
        return {"ok": True}