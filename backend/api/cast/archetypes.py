"""
Character Archetypes Generation Endpoint
Generates character type templates and role definitions for a world.
"""
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_async_session, AsyncSession
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import AIEngine
from backend.schemas import GenerationResponse
from loguru import logger

router = APIRouter(prefix="/api/cast/archetypes", tags=["Cast Generation"])

ai_engine = AIEngine()


@router.post("/generate", response_model=GenerationResponse)
async def generate_character_archetypes(
    project_id: int,
    world_manifest: str,
    tone: str = "Standard",
    content_type: str = "Anime",
    user_id: str = Depends(get_auth_user_id),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Generate character archetype templates for the world.
    
    **Inputs:**
    - `project_id`: Target project
    - `world_manifest`: World description/context
    - `tone`: Narrative tone (Standard, Dark, Comedy, etc.)
    - `content_type`: Media format (Anime, Manga, Novel, etc.)
    
    **Output:**
    - JSON array of archetype definitions with:
      - name: Archetype identifier
      - description: Role purpose in narrative
      - typical_traits: Common personality markers
      - story_role: How they function in narrative
      - visual_profile: Aesthetic guidelines
      - archetype_examples: 2-3 character examples
      - growth_potential: Character arc possibilities
    """
    try:
        prompt = f"""
        Role: Character Archetype Designer for {content_type}
        Task: Generate 8-12 distinct character archetypes that fit this world.
        World Context: {world_manifest}
        Tone: {tone}
        
        For each archetype, provide:
        - name: Archetype identifier (The Hero, The Shadow, The Mentor, etc.)
        - description: What this archetype represents
        - typical_traits: List of 4-6 core traits
        - story_role: Narrative function (protagonist, antagonist, catalyst, etc.)
        - visual_profile: Aesthetic guidelines
        - archetype_examples: 2-3 specific character types
        - growth_potential: How characters of this type can evolve
        - motivation_core: What drives them fundamentally
        - conflict_source: What creates their internal struggle
        
        Return only a JSON array of objects. No preamble.
        """
        
        logger.info(f"[CAST] Generating character archetypes for project {project_id}")
        
        client = await ai_engine._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=ai_engine.model_name,
            contents=prompt,
        )
        
        logger.success(f"[CAST] Archetypes generated")
        
        return GenerationResponse(
            text=response.text,
            model_used=ai_engine.model_name,
        )
    except Exception as e:
        logger.error(f"[CAST] Archetype generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Archetype generation failed: {str(e)}")
