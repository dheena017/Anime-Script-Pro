"""
Anime Script Pro — Scene Manifestation Subsystem

This module orchestrates individual and batch generative manifestation cycles, pulling from
active projects and narrative lore documents to synthesize production-ready scene scripts.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Core System Prompts
  5. Scene Manifestation Operations
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
import json
from typing import List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from loguru import logger
from sqlalchemy import select, update

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import generate_ai_text
from backend.database import async_session
from backend.database.models import Project, Scene, Episode
from backend.database.models.world import CharacterManifest, WorldLore
from backend.lib.defaults import DEFAULT_SCENE_BATCH_LIMIT, DEFAULT_SCRIPT_MODEL
from backend.utils.telemetry import telemetry_manager

# ==============================================================================
# 4. CORE SYSTEM PROMPTS
# ==============================================================================
SCENE_MANIFEST_SYSTEM_PROMPT = """
You are an expert Anime Writer, Scene Architect, and Production Planner.

MISSION:
Generate one production-ready scene as a strict JSON object with narration, visuals, sound direction, and production notes.

Naming requirements:
- Include a readable "session_name" for the current production session or episode block.
- Include a readable "scene_name" for the specific scene so the blueprint can surface it directly.

{source_sections}

JSON Schema:
{{
    "narration": "One to three sentences of scene narration.",
    "visuals": "Production-ready visual direction with camera, lighting, color, lensing, blocking, and motion specifics.",
    "sound": "Production-ready sound direction with ambience, foley, music, silence, and intensity.",
    "scene_purpose": "Short description of the dramatic function of the scene.",
    "session_name": "Readable label for the session or episode block.",
    "scene_name": "Readable label for the scene itself.",
    "continuity_notes": "Key continuity elements that must remain unchanged.",
    "emotional_key": "The dominant emotional beat of the scene.",
    "camera_notes": "Optional but concrete camera grammar, if useful for the scene.",
    "performance_notes": "Optional acting and body-language direction for the characters involved.",
    "production_notes": "Optional editorial or staging notes that make the scene easier to execute."
}}

Return ONLY JSON. No markdown.
"""

# ==============================================================================
# 5. SCENE MANIFESTATION OPERATIONS
# ==============================================================================

async def manifest_scene(
    scene_id: int,
    user_id: str,
    model: str = DEFAULT_SCRIPT_MODEL,
) -> bool:
    """Manifest a single scene blueprint via neural narrative generation models.

    Args:
        scene_id: The specific database key of the target Scene to manifest.
        user_id: The active authorized user initiating orchestration.
        model: Target text-model path or identifier override.

    Returns:
        bool: True if synthesis succeeded and was saved to persistence, False otherwise.
    """
    logger.info(f"AI MANIFEST: Initiating synthesis routine for Scene #{scene_id}...")
    async with async_session() as session:
        # 1. Fetch Scene
        scene = await session.get(Scene, scene_id)
        if not scene:
            logger.error(f"AI MANIFEST: Target Scene ID {scene_id} not found in database records.")
            return False
        
        if scene.status == "MANIFESTED":
            logger.info(f"AI MANIFEST: Scene ID {scene_id} is already in MANIFESTED status. Skipping.")
            return True

        # 2. Fetch Project & Lore
        project = await session.get(Project, scene.project_id)
        if not project:
            logger.error(f"AI MANIFEST: Project blueprint #{scene.project_id} not resolved for Scene {scene_id}.")
            return False
            
        # 3. Fetch Lore & Character Manifest
        world_lore_stmt = select(WorldLore).where(WorldLore.project_id == project.id).order_by(WorldLore.created_at.desc())
        character_manifest_stmt = select(CharacterManifest).where(CharacterManifest.project_id == project.id).order_by(CharacterManifest.created_at.desc())
        
        lore_res = await session.execute(world_lore_stmt)
        character_res = await session.execute(character_manifest_stmt)
        
        world_lore = lore_res.scalars().first()
        character_manifest = character_res.scalars().first()
        
        world_lore_text = world_lore.full_lore_blob if world_lore else ""
        cast_text = character_manifest.character_list_blob if character_manifest else ""
        
        # Fetch Episode to determine custom scene counts per episode
        episode = await session.get(Episode, scene.episode_id)
        scenes_per_episode = 16
        if episode and episode.asset_matrix:
            scenes_per_episode = int(episode.asset_matrix.get("scene_count", 16))

        session_index = ((scene.scene_number - 1) // scenes_per_episode) + 1 if scene.scene_number and scene.scene_number > 0 else 1
        scene_index = ((scene.scene_number - 1) % scenes_per_episode) + 1 if scene.scene_number and scene.scene_number > 0 else 1
        
        source_sections = []
        if world_lore_text: 
            source_sections.append(f"WORLD LORE SOURCE OF TRUTH:\n{world_lore_text}")
        if cast_text: 
            source_sections.append(f"CHARACTER DNA REGISTRY:\n{cast_text}")
            
        source_sections.append(
            f"SESSION / SCENE LABELS:\nSession Name: Session {session_index}\nScene Name: Scene {scene_index}\nScene Number: {scene.scene_number}"
        )
        
        system_instruction = SCENE_MANIFEST_SYSTEM_PROMPT.format(source_sections="\n\n".join(source_sections))
        
        user_prompt = f"""
Overall Context: {project.prompt}
Vibe/Theme: {project.vibe}
Target Scene Beat: Scene #{scene.scene_number} (Current Status: {scene.status})
Additional Context: {scene.prompt or "Generate an appropriate scene following the narrative arc."}
"""

        logger.info(f"AI MANIFEST: Dispatched LLM request using model '{model}' for Scene #{scene.scene_number}...")

        try:
            response = await generate_ai_text(model, user_prompt, system_instruction, user_id)
            
            # Repair JSON formatting structure if minor artifacts exist
            clean_json = response.replace("```json", "").replace("```", "").strip()
            
            # Attempt parsing to validate JSON compliance
            try:
                scene_data = json.loads(clean_json)
            except json.JSONDecodeError:
                logger.warning(f"AI MANIFEST: Malformed/Truncated output block for Scene ID {scene_id}. Attempting suffix patch.")
                if not clean_json.endswith("}"):
                    clean_json += "}"
                scene_data = json.loads(clean_json)
            
            # 4. Save and Update persistent Scene status
            scene.content = json.dumps(scene_data)
            scene.status = "MANIFESTED"
            session.add(scene)
            await session.commit()
            
            logger.success(f"AI MANIFEST: Scene ID {scene_id} successfully parsed, validated, and updated in database.")
            return True
        except Exception as e:
            logger.error(f"AI MANIFEST: Engine failure during manifestation cycle of Scene ID {scene_id}: {e}")
            return False


async def manifest_all_queued_scenes(
    project_id: int,
    user_id: str,
    limit: int = DEFAULT_SCENE_BATCH_LIMIT,
    model: str = DEFAULT_SCRIPT_MODEL,
) -> int:
    """Iterate and manifest all queued scene blueprints associated with a project.

    Args:
        project_id: Target project ID.
        user_id: Active authenticated user ID.
        limit: Max batch count to manifest in this cycle.
        model: Override target narrative model to invoke.

    Returns:
        int: Number of successfully manifested scene models in this run.
    """
    logger.info(f"NEURAL SYNC: Initiating sequential manifestation query for Project {project_id}...")
    async with async_session() as session:
        stmt = select(Scene).where(
            Scene.project_id == project_id,
            Scene.status == "QUEUED"
        ).order_by(Scene.scene_number).limit(limit)
        
        res = await session.execute(stmt)
        queued_scenes = res.scalars().all()
        
        if not queued_scenes:
            logger.info(f"NEURAL SYNC: Zero pending queued scenes found for Project ID {project_id}.")
            return 0
            
        logger.info(f"NEURAL SYNC: Beginning active loop for {len(queued_scenes)} scenes in Project {project_id}...")
        
        total = len(queued_scenes)
        success_count = 0
        for i, scene in enumerate(queued_scenes):
            progress = (i / total) * 100
            
            logger.info(f"NEURAL SYNC: Processing item [{i + 1}/{total}] (Scene Number: {scene.scene_number}). Progress: {progress:.1f}%")
            
            await telemetry_manager.broadcast_event(
                event_type="PROGRESS",
                module="MANIFEST",
                message=f"Synthesizing Scene {i+1} of {total}...",
                payload={
                    "project_id": project_id,
                    "progress": progress,
                    "current": i + 1,
                    "total": total,
                    "scene_number": scene.scene_number
                }
            )

            success = await manifest_scene(scene.id, user_id, model=model)
            if success:
                success_count += 1
            
            # Rate-limiting pause to prevent API endpoint degradation
            await asyncio.sleep(2.0)
            
        # Final status sync broadcast
        await telemetry_manager.broadcast_event(
            event_type="PROGRESS",
            module="MANIFEST",
            message=f"Manifestation Cycle Complete: {success_count}/{total} succeeded.",
            payload={
                "project_id": project_id,
                "progress": 100,
                "current": total,
                "total": total
            }
        )

        logger.success(f"NEURAL SYNC: Manifestation cycle complete. Successfully compiled {success_count} out of {total} items.")
        return success_count
