import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from sqlmodel import select
from backend.database import AsyncSession, async_engine
from backend.database.models.user import UserSettings
from backend.services.prompts.world.world import (
    MANIFEST_GENERATION_PROMPT,
    HISTORY_GENERATION_PROMPT,
    FACTIONS_GENERATION_PROMPT,
    POWERS_GENERATION_PROMPT,
    ARCHITECTURE_GENERATION_PROMPT,
    ATLAS_GENERATION_PROMPT,
    CULTURE_GENERATION_PROMPT,
    SYSTEMS_GENERATION_PROMPT
)

from loguru import logger

# Load .env from root directory
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

def _use_vertexai() -> bool:
    return os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "").strip().lower() in ("1", "true", "yes")


def build_genai_client(api_key: str | None = None) -> genai.Client:
    use_vertexai = _use_vertexai()
    if use_vertexai:
        client_kwargs = {
            "vertexai": True,
        }
        project = os.getenv("GOOGLE_CLOUD_PROJECT")
        location = os.getenv("GOOGLE_CLOUD_LOCATION")
        if project:
            client_kwargs["project"] = project
        if location:
            client_kwargs["location"] = location
        if api_key:
            client_kwargs["api_key"] = api_key
        return genai.Client(**client_kwargs)

    if api_key:
        return genai.Client(api_key=api_key)

    return genai.Client()


class AIEngine:
    def __init__(self, model_name="gemini-1.5-flash-latest"):
        self.model_name = model_name

    async def _get_client(self, user_id: str = None):
        """Retrieves a genai.Client initialized with the best available API key."""
        api_key = None

        # 1. Try to get key from User Settings
        if user_id:
            try:
                async with AsyncSession(async_engine) as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    result = await session.exec(statement)
                    settings = result.first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("gemini_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for {user_id}: {e}")

        # 2. Fallback to Env
        if not api_key:
            api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

        if not api_key and not _use_vertexai():
            raise ValueError("No Gemini API key found in user settings or environment.")

        return build_genai_client(api_key=api_key)

    async def generate_lore(self, title: str, description: str, tone: str = "Standard", content_type: str = "Anime", user_id: str = None):
        """Legacy method for God Mode - generates initial manifest."""
        return await self.generate_manifest(title, description, tone, content_type, user_id)

    async def generate_manifest(self, title: str, description: str, tone: str = "Standard", content_type: str = "Anime", user_id: str = None):
        system_instruction = MANIFEST_GENERATION_PROMPT(content_type)
        user_prompt = f"Title: {title}\nDescription: {description}\nTone: {tone}"

        logger.info(f"PROCESS: [🗺️] Architecting World Manifest: <cyan>{title}</cyan>")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_history(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = HISTORY_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [📜] Synthesizing World History...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_factions(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = FACTIONS_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [⚖️] Drafting Faction Politics...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_powers(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = POWERS_GENERATION_PROMPT(context, "Universal System")
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}"
        logger.info(f"PROCESS: [⚡] Architecting Power Mechanics...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_architecture(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = ARCHITECTURE_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [🏛️] Visualizing Architecture...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_atlas(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = ATLAS_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [🗺️] Mapping World Atlas...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_culture(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = CULTURE_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [🎭] Designing Cultural Ethos...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_systems(self, project_prompt: str, module_prompt: str = "", context: str = "", content_type: str = "Anime", user_id: str = None):
        system_instruction = SYSTEMS_GENERATION_PROMPT(content_type)
        user_prompt = f"Core Seed: {project_prompt}\nModular Prompt: {module_prompt}\nContext: {context}"
        logger.info(f"PROCESS: [⚙️] Configuring World Systems...")
        return await self.generate_content(user_prompt, system_instruction, user_id)

    async def generate_characters(self, lore: str, count=3, tone: str = "Standard", content_type: str = "Anime", user_id: str = None):
        prompt = f"""
        Role: Lead Character Designer and Production Architect for {content_type}
        Task: Create {count} core characters for this world that are production-ready.
        World Lore: {lore}
        Tone: {tone}

        For EACH character, provide a HYPER-DETAILED profile:
        - name: Unique character name
        - role: (Tier 1: Core | Tier 2: Support | Tier 3: Tertiary)
        - archetype: Specific class/archetype
        - visual_dna: Technical description for visual consistency
        - vfx_signature: Particle effects, glowing nodes, or energy signatures
        - lighting_logic: How they should be lit (rim lighting, high contrast shadow, etc.)
        - camera_choreography: How the camera moves for them (fast tracking, low-angle static)
        - hair_style: Hyper-detailed description
        - eye_details: Color, shape, and emotional "catchlight"
        - clothing_materials: Weathered fabric, iridescent plates, etc.
        - personality: Psychological summary
        - goal: What they crave
        - flaw: Defining limitation
        - core_wound: Specific trauma shaping them
        - moral_dilemma: The impossible choice they must make
        - secret: Hidden truth
        - speaking_style: Vocabulary, syntax, and verbal tics

        Return only a JSON array of objects matching these keys. No preamble.
        """
        logger.info(f"PROCESS: [🧬] Sequencing Character DNA for {count} targets... (User: {user_id})")
        client = await self._get_client(user_id)

        import time
        start_time = time.perf_counter()

        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )

        duration = time.perf_counter() - start_time
        logger.success(f"SYNTHESIS: {count} Characters sequenced. Latency: {duration:.2f}s | Engine: {self.model_name}")

        return response.text

    async def generate_script_beats(self, title: str, lore: str, characters: str, tone: str = "Standard", content_type: str = "Anime", user_id: str = None):
        prompt = f"""
        Role: Narrative Director for {content_type}
        Task: Outline the first 10 narrative beats for the pilot episode.
        Series: {title}
        World: {lore}
        Cast: {characters}
        Tone: {tone}

        For each beat, provide:
        - Label
        - Description (Maintain {tone} pacing)
        - Visual Cue ({content_type} cinematic language)
        - Est. Duration

        Return only a JSON array of objects.
        """
        logger.info(f"PROCESS: [🎬] Scripting Pilot Beats... (User: {user_id})")
        client = await self._get_client(user_id)

        import time
        start_time = time.perf_counter()

        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )

        duration = time.perf_counter() - start_time
        logger.success(f"SYNTHESIS: 10 Script Beats materialized. Latency: {duration:.2f}s")

        return response.text

    async def generate_content(self, prompt: str, system_instruction: str = None, user_id: str = None):
        logger.info(f"PROCESS: [🧠] Neural Synthesis triggered. Instruction length: {len(system_instruction or '')}")
        client = await self._get_client(user_id)

        config = None
        if system_instruction:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction
            )

        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config
        )
        return response.text

ai_engine = AIEngine()

async def call_ai(model: str, prompt: str, system_instruction: str = None, user_id: str = None):
    engine = AIEngine(model_name=model)
    return await engine.generate_content(prompt, system_instruction, user_id)
