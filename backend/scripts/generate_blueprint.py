import asyncio
import os
import sys
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.ai_engine import AIEngine
from loguru import logger

async def run_blueprint_generation():
    # Initialize engine with the confirmed stable model
    engine = AIEngine(model_name="gemini-2.5-flash")
    
    # Simulation Parameters (Combining World + Cast Tabs)
    prompt = "A cyberpunk noir where memories are traded as currency."
    content_type = "Anime"
    episode_count = 3
    
    # SIMULATED STORY BIBLE (Combining 8 World Modules)
    world_bible = """
    MANIFEST: High-tech, low-life aesthetic. Rain-slicked streets of Neo-Kyoto.
    HISTORY: The Great Deletion of 2088 erased all digital backups, making biological memory the only source of truth.
    FACTIONS: 'The Archivists' (Memory hoarders) vs 'The Blank Slates' (Anarchists).
    POWERS: 'Neural Siphoning' - the ability to pull a memory out as a glowing data-vial.
    ARCHITECTURE: Stacked container-housing, neon-tube lighting, holographic ads that touch you.
    ATLAS: Sector 7 (Slums), The Spire (Elite), The Ghost Docks.
    CULTURE: People trade memories of childhood for a night's meal. Nostalgia is a luxury.
    """
    
    # SIMULATED CAST DNA
    cast_dna = """
    CHARACTERS: [
        {"name": "Kaito", "role": "Protagonist", "goal": "Find his sister's stolen memory"},
        {"name": "Eris", "role": "Archivist", "goal": "Control the flow of information"}
    ]
    RELATIONSHIPS: Kaito used to work for Eris. Now he is her most hunted thief.
    """
    
    logger.info(f"🚀 INITIALIZING COMPREHENSIVE RUN: {content_type} // {episode_count} Episodes")
    logger.info(f"INJECTING STORY BIBLE: Context length: {len(world_bible)} chars")
    
    system_instruction = f"""
    You are a Series Architect. Generate a {episode_count}-episode production blueprint.
    USE THE PROVIDED WORLD BIBLE AND CAST DNA TO MAKE SCENES HIGHLY SPECIFIC.
    
    WORLD BIBLE:
    {world_bible}
    
    CAST DNA:
    {cast_dna}
    
    Return ONLY a raw JSON array of episode objects.
    """
    
    user_prompt = f"PROMPT: {prompt}\nEPISODE COUNT: {episode_count}"
    
    try:
        response_text = await engine.generate_content(user_prompt, system_instruction)
        clean_json = response_text.replace("```json", "").replace("```", "").strip()
        blueprint = json.loads(clean_json)
        
        print("\n" + "="*80)
        print("COMPREHENSIVE BLUEPRINT SYNTHESIZED")
        print("="*80 + "\n")
        
        for ep in blueprint:
            print(f"EPISODE {ep.get('episode', '??')}: {ep.get('title', 'Untitled').upper()}")
            print(f"HOOK: {ep.get('hook')}")
            print(f"SUMMARY: {ep.get('summary')}")
            
            # Show how the AI used the context
            spec = ep.get('detailed_episode_spec', {})
            acts = spec.get('acts', [])
            if acts:
                print("SAMPLE SCENE DETAIL:")
                first_scene = acts[0].get('scenes', [{}])[0]
                print(f"   - LOCATION: {first_scene.get('location')}")
                print(f"   - ACTION: {first_scene.get('summary')}")
            print("-" * 40)
            
        print("\n" + "="*80)
        print("SUCCESS: Full context synthesis complete.")
        print("="*80)
        
    except Exception as e:
        logger.error(f"SYNTHESIS CRASHED: {e}")

if __name__ == "__main__":
    asyncio.run(run_blueprint_generation())
