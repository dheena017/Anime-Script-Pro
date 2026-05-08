"""
Core Cast Generation Endpoint
Generates primary character DNA for a project.
"""
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_async_session, AsyncSession
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import AIEngine
from backend.schemas import GenerationResponse
from loguru import logger
from typing import Optional

router = APIRouter(prefix="/api/cast/core", tags=["Cast Generation"])

ai_engine = AIEngine()


@router.post("/generate", response_model=GenerationResponse)
async def generate_core_cast(
    project_id: int,
    lore: str,
    count: int = 3,
    tone: str = "Standard",
    content_type: str = "Anime",
    user_id: str = Depends(get_auth_user_id),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Generate primary character DNA for project.
    
    **Inputs:**
    - `project_id`: Target project
    - `lore`: World context/manifest
    - `count`: Number of core characters (default 3)
    - `tone`: Narrative tone (Standard, Dark, Comedy, etc.)
    - `content_type`: Media format (Anime, Manga, Novel, etc.)
    
    **Output:**
    - JSON array of character profiles with DNA
    
    **Character Fields:**
    - name, role, archetype, visual_dna, vfx_signature
    - lighting_logic, camera_choreography, hair_style, eye_details
    - clothing_materials, personality, goal, flaw, core_wound
    - moral_dilemma, secret, speaking_style
    """
    try:
        logger.info(f"[CAST] Generating {count} core characters for project {project_id}")
        
        characters_json = await ai_engine.generate_characters(
            lore=lore,
            count=count,
            tone=tone,
            content_type=content_type,
            user_id=user_id
        )
        
        logger.success(f"[CAST] Generated {count} core characters")
        
        return GenerationResponse(
            text=characters_json,
            model_used=ai_engine.model_name,
            usage={"characters_count": count},
        )
    except Exception as e:
        logger.error(f"[CAST] Core generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cast generation failed: {str(e)}")
