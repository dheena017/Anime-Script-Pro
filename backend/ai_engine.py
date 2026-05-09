import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from sqlalchemy import select
from backend.database import async_session, async_engine
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
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
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
