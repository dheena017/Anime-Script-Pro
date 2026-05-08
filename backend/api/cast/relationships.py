"""
Character Relationships Generation Endpoint
Generates social networks, family ties, and relational dynamics.
"""
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_async_session, AsyncSession
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import AIEngine
from backend.schemas import GenerationResponse
from loguru import logger

router = APIRouter(prefix="/api/cast/relationships", tags=["Cast Generation"])

ai_engine = AIEngine()


@router.post("/generate", response_model=GenerationResponse)
async def generate_character_relationships(
    project_id: int,
    cast_dna: str,
    world_context: str = "",
    tone: str = "Standard",
    content_type: str = "Anime",
    user_id: str = Depends(get_auth_user_id),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Generate character relationships and social networks.
    
    **Inputs:**
    - `project_id`: Target project
    - `cast_dna`: Character list (from core generation)
    - `world_context`: World setting/hierarchy context (optional)
    - `tone`: Narrative tone (Standard, Dark, Comedy, etc.)
    - `content_type`: Media format (Anime, Manga, Novel, etc.)
    
    **Output:**
    - JSON object with:
      - relationships: Array of character pair connections
      - family_trees: Hierarchical family structures
      - social_networks: Group associations
      - conflict_pairs: Characters destined for conflict
      - ally_groups: Natural alliance formations
    """
    try:
        prompt = f"""
        Role: Relationship Architect for {content_type}
        Task: Map character relationships and social networks.
        Cast: {cast_dna}
        World Context: {world_context}
        Tone: {tone}
        
        For each significant relationship, provide:
        - character_1: First character name
        - character_2: Second character name
        - relationship_type: (romance, rivalry, mentorship, family, alliance, etc.)
        - connection_strength: (weak, moderate, intense)
        - shared_history: How they know each other
        - tension_level: Current conflict scale (0-10)
        - potential_arc: How this relationship evolves
        - defining_moment: Critical event that shaped them
        
        Also provide:
        - family_structures: Bloodline hierarchies
        - power_dynamics: Who holds social power
        - faction_memberships: Which groups/factions they belong to
        - mentor_relationships: Learning/growth connections
        
        Return JSON with 'relationships', 'family_trees', 'social_networks', 'conflict_pairs', 'ally_groups' keys.
        """
        
        logger.info(f"[CAST] Generating relationships for project {project_id}")
        
        client = await ai_engine._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=ai_engine.model_name,
            contents=prompt,
        )
        
        logger.success(f"[CAST] Relationships mapped")
        
        return GenerationResponse(
            text=response.text,
            model_used=ai_engine.model_name,
        )
    except Exception as e:
        logger.error(f"[CAST] Relationship generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Relationship generation failed: {str(e)}")
