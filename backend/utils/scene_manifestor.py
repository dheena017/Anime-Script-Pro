import json
import asyncio
from typing import List, Optional
from sqlalchemy import select, update
from backend.database import async_session
from backend.database.models import Scene, Project
from backend.database.models.world import WorldLore, CastManifest
from backend.ai_engine import call_ai
from backend.utils.telemetry import telemetry_manager
from loguru import logger

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

async def manifest_scene(scene_id: int, user_id: str, model: str = "gemini-2.0-flash", bypass_status_check: bool = False):
    async with async_session() as session:
        # 1. Fetch Scene
        scene = await session.get(Scene, scene_id)
        if not scene:
            logger.error(f"Scene {scene_id} not found.")
            return False
        
        if not bypass_status_check and scene.status == "MANIFESTED":
            logger.info(f"Scene {scene_id} already manifested. Skipping.")
            return True

        # 2. Fetch Project & Lore
        project = await session.get(Project, scene.project_id)
        if not project:
            logger.error(f"Project {scene.project_id} not found for scene {scene_id}.")
            return False
            
        # SECURITY: Double check ownership
        if project.user_id != user_id:
            logger.error(f"SECURITY: Unauthorized manifestation attempt by user {user_id} for scene {scene_id}")
            return False

        # 3. Fetch Lore & Cast Manifest
        world_lore_stmt = select(WorldLore).where(WorldLore.project_id == project.id).order_by(WorldLore.created_at.desc())
        cast_manifest_stmt = select(CastManifest).where(CastManifest.project_id == project.id).order_by(CastManifest.created_at.desc())
        
        lore_res = await session.execute(world_lore_stmt)
        cast_res = await session.execute(cast_manifest_stmt)
        
        world_lore = lore_res.scalars().first()
        cast_manifest = cast_res.scalars().first()
        
        world_lore_text = world_lore.full_lore_blob if world_lore else ""
        cast_text = cast_manifest.cast_list_blob if cast_manifest else ""
        session_index = ((scene.scene_number - 1) // 16) + 1 if scene.scene_number and scene.scene_number > 0 else 1
        scene_index = ((scene.scene_number - 1) % 16) + 1 if scene.scene_number and scene.scene_number > 0 else 1
        
        # 3.1. Fetch Continuity Context (Previous Scenes)
        prev_scenes_stmt = select(Scene).where(
            Scene.project_id == project.id,
            Scene.scene_number < scene.scene_number,
            Scene.status == "MANIFESTED"
        ).order_by(Scene.scene_number.desc()).limit(3)
        prev_res = await session.execute(prev_scenes_stmt)
        prev_scenes = prev_res.scalars().all()

        continuity_context = ""
        if prev_scenes:
            continuity_context = "PREVIOUS SCENES CONTINUITY:\n"
            for ps in reversed(prev_scenes):
                try:
                    ps_data = json.loads(ps.content)
                    continuity_context += f"- Scene #{ps.scene_number}: {ps_data.get('narration', '')[:200]}...\n"
                except:
                    pass

        source_sections = []
        if world_lore_text: source_sections.append(f"WORLD LORE SOURCE OF TRUTH:\n{world_lore_text}")
        if cast_text: source_sections.append(f"CHARACTER DNA REGISTRY:\n{cast_text}")
        if continuity_context: source_sections.append(continuity_context)
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

        logger.info(f"AI MANIFEST: Synthesizing Scene #{scene.scene_number} for Project {project.id} using {model}")

        try:
            response = await call_ai(model, user_prompt, system_instruction, user_id)
            
            # Repair JSON if needed
            clean_json = response.replace("```json", "").replace("```", "").strip()
            
            # Try to parse to validate
            try:
                scene_data = json.loads(clean_json)
            except json.JSONDecodeError:
                logger.warning(f"AI MANIFEST: Truncated JSON detected for Scene {scene_id}. Attempting manual fix.")
                # Basic fix for common truncation
                if not clean_json.endswith("}"):
                    clean_json += "}"
                scene_data = json.loads(clean_json)
            
            # 4. Update Scene
            scene.content = json.dumps(scene_data)
            scene.status = "MANIFESTED"
            session.add(scene)
            await session.commit()
            
            logger.success(f"AI MANIFEST: Scene {scene_id} manifested successfully.")
            return True
        except Exception as e:
            logger.error(f"AI MANIFEST: Failed to manifest scene {scene_id}: {e}")
            return False

async def manifest_all_queued_scenes(project_id: int, user_id: str, limit: int = 16, model: str = "gemini-2.0-flash"):
    """
    Manifests a batch of queued scenes for a project.
    Default limit is 16 (roughly one episode's worth).
    """
    async with async_session() as session:
        # SECURITY: Verify project ownership first
        project = await session.get(Project, project_id)
        if not project or project.user_id != user_id:
            logger.error(f"SECURITY: Unauthorized bulk manifestation attempt by user {user_id} for project {project_id}")
            return 0

        stmt = select(Scene).where(
            Scene.project_id == project_id,
            Scene.status == "QUEUED"
        ).order_by(Scene.scene_number).limit(limit)
        
        res = await session.execute(stmt)
        queued_scenes = res.scalars().all()
        
        if not queued_scenes:
            logger.info(f"NEURAL SYNC: No queued scenes found for project {project_id}.")
            return 0
            
        logger.info(f"NEURAL SYNC: Starting bulk manifestation for {len(queued_scenes)} scenes in project {project_id} using {model}...")
        
        total = len(queued_scenes)
        success_count = 0
        for i, scene in enumerate(queued_scenes):
            # Broadcast progress before starting each scene
            progress = (i / total) * 100
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
            
            # Progressive delay to respect rate limits (longer for free tier)
            await asyncio.sleep(2.0)
            
        # Final broadcast
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

        logger.success(f"NEURAL SYNC: Completed batch manifestation. {success_count}/{len(queued_scenes)} succeeded.")
        return success_count
