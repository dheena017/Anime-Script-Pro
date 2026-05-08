from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List, Optional, Dict, Any
from backend.database.models import SavedPrompt, ReusableCharacter, CastMember
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api", tags=["Creative Library"])

@router.get("/library/prompts/{user_id}")
async def get_saved_prompts(user_id: str):
    async with async_session() as session:
        statement = select(SavedPrompt).where(SavedPrompt.user_id == user_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/library/prompts")
@router.post("/prompts")
async def create_saved_prompt(prompt: Dict[str, Any], user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Adapt payload if it's from Orchestrator (text/context)
        text = prompt.get("text") or prompt.get("content")
        label = prompt.get("label") or prompt.get("context") or "Saved Prompt"
        
        db_prompt = SavedPrompt(
            user_id=user_id,
            label=label,
            prompt_text=text,
            category="Production"
        )
        session.add(db_prompt)
        await session.commit()
        await session.refresh(db_prompt)
        return db_prompt

@router.get("/library/characters/{user_id}")
@router.get("/characters/{user_id}")
async def get_characters(user_id: str):
    async with async_session() as session:
        statement = select(ReusableCharacter).where(ReusableCharacter.user_id == user_id)
        results = await session.exec(statement)
        return results.all()

@router.post("/library/characters")
@router.post("/characters")
async def create_character(payload: Dict[str, Any], user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        # Check if it's a batch from Orchestrator
        if "characters" in payload:
            project_id = payload.get("project_id")
            created = []
            for char_data in payload["characters"]:
                # Orchestrator characters are more like CastMembers
                cast_member = CastMember(
                    project_id=project_id,
                    name=char_data.get("name"),
                    role=char_data.get("role", "Character"),
                    description=char_data.get("personality") or char_data.get("appearance"),
                    visual_dna=char_data.get("visual_dna")
                )
                session.add(cast_member)
                created.append(cast_member)
            await session.commit()
            return {"status": "success", "count": len(created)}
        else:
            # Single character creation
            char = ReusableCharacter(**payload)
            char.user_id = user_id
            session.add(char)
            await session.commit()
            await session.refresh(char)
            return char
