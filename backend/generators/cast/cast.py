"""Cast Generation Service Implementations (Mirrored in /generators)."""

from backend.ai_engine import AIEngine
from backend.prompts.cast.cast import (
    CORE_GENERATION_PROMPT,
    ARCHETYPES_GENERATION_PROMPT,
    RELATIONSHIPS_GENERATION_PROMPT,
    DYNAMICS_GENERATION_PROMPT,
)
from loguru import logger


class CoreCastGenerator:
    """Generate core character DNA."""
    
    @staticmethod
    async def generate(
        world_lore: str,
        project_title: str,
        count: int = 3,
        tone: str = "Standard",
        content_type: str = "Anime",
        user_id: str = None
    ):
        """Generate core character profiles."""
        ai_engine = AIEngine()
        system_instruction = CORE_GENERATION_PROMPT(content_type)
        user_prompt = f"""
        Project: {project_title}
        World: {world_lore}
        Tone: {tone}
        Count: {count}
        """
        logger.info(f"[CAST-GEN] Generating {count} core characters")
        return await ai_engine.generate_content(user_prompt, system_instruction, user_id)


class ArchetypesGenerator:
    """Generate character archetypes."""
    
    @staticmethod
    async def generate(
        world_manifest: str,
        tone: str = "Standard",
        content_type: str = "Anime",
        user_id: str = None
    ):
        """Generate character archetypes."""
        ai_engine = AIEngine()
        system_instruction = ARCHETYPES_GENERATION_PROMPT(content_type)
        user_prompt = f"""
        World: {world_manifest}
        Tone: {tone}
        """
        logger.info(f"[CAST-GEN] Generating archetypes")
        return await ai_engine.generate_content(user_prompt, system_instruction, user_id)


class RelationshipsGenerator:
    """Generate character relationships."""
    
    @staticmethod
    async def generate(
        cast_dna: str,
        world_context: str = "",
        tone: str = "Standard",
        content_type: str = "Anime",
        user_id: str = None
    ):
        """Generate relationships."""
        ai_engine = AIEngine()
        system_instruction = RELATIONSHIPS_GENERATION_PROMPT(content_type)
        user_prompt = f"""
        Cast: {cast_dna}
        World: {world_context}
        Tone: {tone}
        """
        logger.info(f"[CAST-GEN] Generating relationships")
        return await ai_engine.generate_content(user_prompt, system_instruction, user_id)


class DynamicsGenerator:
    """Generate character dynamics."""
    
    @staticmethod
    async def generate(
        cast_dna: str,
        relationships: str,
        tone: str = "Standard",
        content_type: str = "Anime",
        user_id: str = None
    ):
        """Generate dynamics."""
        ai_engine = AIEngine()
        system_instruction = DYNAMICS_GENERATION_PROMPT(content_type)
        user_prompt = f"""
        Cast: {cast_dna}
        Relationships: {relationships}
        Tone: {tone}
        """
        logger.info(f"[CAST-GEN] Generating dynamics")
        return await ai_engine.generate_content(user_prompt, system_instruction, user_id)
