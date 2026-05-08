"""
Character Dynamics Generation Endpoint
Generates interaction patterns, conflict matrices, and behavioral dynamics.
"""
from fastapi import APIRouter, Depends, HTTPException
from backend.database import get_async_session, AsyncSession
from backend.utils.deps import get_auth_user_id
from backend.ai_engine import AIEngine
from backend.schemas import GenerationResponse
from loguru import logger

router = APIRouter(prefix="/api/cast/dynamics", tags=["Cast Generation"])

ai_engine = AIEngine()


@router.post("/generate", response_model=GenerationResponse)
async def generate_character_dynamics(
    project_id: int,
    cast_dna: str,
    relationships_map: str,
    narrative_tone: str = "Standard",
    content_type: str = "Anime",
    user_id: str = Depends(get_auth_user_id),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Generate character interaction dynamics and behavior patterns.
    
    **Inputs:**
    - `project_id`: Target project
    - `cast_dna`: Character profiles (from core generation)
    - `relationships_map`: Relationship data (from relationships generation)
    - `narrative_tone`: Narrative tone (Standard, Dark, Comedy, etc.)
    - `content_type`: Media format (Anime, Manga, Novel, etc.)
    
    **Output:**
    - JSON object with:
      - interaction_patterns: How characters communicate
      - conflict_dynamics: How characters clash
      - resolution_patterns: How conflicts resolve
      - dialogue_matrices: Communication styles between pairs
      - group_dynamics: Multi-character interaction rules
      - behavioral_triggers: What causes character reactions
    """
    try:
        prompt = f"""
        Role: Behavioral Dynamics Specialist for {content_type}
        Task: Generate character interaction patterns and behavioral dynamics.
        Cast: {cast_dna}
        Relationships: {relationships_map}
        Tone: {narrative_tone}
        
        Provide:
        
        **Interaction Patterns:**
        - How each character communicates with others
        - Speech quirks and verbal tics unique to each pairing
        - Emotional temperature (warm, cold, tense, playful)
        
        **Conflict Dynamics:**
        - How characters argue or disagree
        - Escalation triggers (what causes fights?)
        - De-escalation strategies (what calms them?)
        - Unresolved tensions
        
        **Group Dynamics:**
        - How the group behaves when assembled
        - Leadership structures
        - Coalition formations
        - Exclusion/outsider roles
        
        **Behavioral Triggers:**
        - What makes each character angry/sad/joyful/afraid
        - Trauma responses and coping mechanisms
        - Vulnerability moments
        - Healing/redemption pathways
        
        **Dialogue Matrices:**
        For key character pairs:
        - comfortable_exchanges: Natural, easy dialogue
        - confrontational_exchanges: Conflict dialogue patterns
        - intimate_moments: Vulnerable conversation styles
        - comedic_timing: How they banter
        
        Return JSON with keys: interaction_patterns, conflict_dynamics, group_dynamics, 
        behavioral_triggers, dialogue_matrices.
        """
        
        logger.info(f"[CAST] Generating dynamics for project {project_id}")
        
        client = await ai_engine._get_client(user_id)
        response = await client.aio.models.generate_content(
            model=ai_engine.model_name,
            contents=prompt,
        )
        
        logger.success(f"[CAST] Dynamics generated")
        
        return GenerationResponse(
            text=response.text,
            model_used=ai_engine.model_name,
        )
    except Exception as e:
        logger.error(f"[CAST] Dynamics generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Dynamics generation failed: {str(e)}")
