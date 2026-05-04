import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from sqlmodel import select
from backend.database import AsyncSession, async_engine
from backend.database.models.user import UserSettings

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
        prompt = f"""
        Role: Master World Architect for {content_type}
        Task: Initialize World Lore for a new production.
        Title: {title}
        Core Concept: {description}
        Narrative Tone: {tone}

        Generate a detailed world setting including:
        1. Setting Name
        2. Era/Tone (Strictly following: {tone})
        3. Core Conflict
        4. Unique World Mechanics compatible with {content_type} production.

        Return only a JSON object.
        """
        logger.info(f"PROCESS: [🗺️] Architecting World Lore: <cyan>{title}</cyan> (User: {user_id})")
        client = await self._get_client(user_id)
        
        import time
        start_time = time.perf_counter()
        
        response = await client.aio.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        
        duration = time.perf_counter() - start_time
        char_count = len(response.text)
        logger.success(f"SYNTHESIS: World Lore solidified. Metrics: {char_count} chars synthesized in {duration:.2f}s using {self.model_name}")
        
        return response.text

    async def generate_characters(self, lore: str, count=3, tone: str = "Standard", content_type: str = "Anime", user_id: str = None):
        prompt = f"""
        Role: Lead Character Designer for {content_type}
        Task: Create {count} core characters for this world.
        World Lore: {lore}
        Tone: {tone}

        For each character, provide:
        - Name
        - Role (Main, Rival, Support)
        - Archetype (Aligned with {tone} {content_type} tropes)
        - Visual DNA (detailed prompt for {content_type} style)
        - Core Motivation
        - Secret

        Return only a JSON array of objects.
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
