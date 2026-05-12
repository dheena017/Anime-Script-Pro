import os
import json
import asyncio
from google import genai
from google.genai import types
try:
    import anthropic
except ImportError:
    anthropic = None

try:
    import openai
except ImportError:
    openai = None

try:
    import groq
except ImportError:
    groq = None

from dotenv import load_dotenv
from sqlalchemy import select
from backend.database import async_session, async_engine
from backend.database.models.user import UserSettings

from loguru import logger

# Global Client Cache to prevent connection pool exhaustion and reduce overhead
CLIENT_CACHE = {
    "gemini": {},    # api_key -> genai.Client
    "anthropic": {}, # api_key -> anthropic.AsyncAnthropic
    "openai": {},    # api_key -> openai.AsyncOpenAI
    "groq": {},      # api_key -> groq.AsyncGroq
    "nvidia": {}     # api_key -> openai.AsyncOpenAI (NVIDIA Integration)
}

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
        if api_key not in CLIENT_CACHE["gemini"]:
            CLIENT_CACHE["gemini"][api_key] = genai.Client(api_key=api_key)
        return CLIENT_CACHE["gemini"][api_key]

    return genai.Client()


class AIEngine:
    def __init__(self, model_name="gemini-1.5-flash-latest"):
        self.model_name = model_name

    async def _get_client(self, user_id: str = None):
        """Retrieves a genai.Client initialized with the best available API key."""
        api_key = None

        # 1. Try to get key from User Settings
        source = "User Settings"
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("gemini_api_key")
            except Exception as e:
                logger.warning(f"AI ENGINE: Failed to fetch user settings for {user_id}: {e}")

        # 2. Fallback to Env
        if not api_key:
            source = "Environment / VertexAI" if _use_vertexai() else "Environment Variables"
            api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")

        if not api_key and not _use_vertexai():
            raise ValueError("No Gemini API key found in user settings or environment.")

        logger.debug(f"AI ENGINE: Credential source identified as: {source}")

        if api_key not in CLIENT_CACHE["gemini"]:
            CLIENT_CACHE["gemini"][api_key] = build_genai_client(api_key=api_key)
        
        return CLIENT_CACHE["gemini"][api_key]

    async def _get_anthropic_client(self, user_id: str = None):
        if not anthropic:
            raise ImportError("Anthropic library not installed. Please install it with 'pip install anthropic'.")
        
        api_key = None
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("anthropic_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for {user_id}: {e}")
        
        if not api_key:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            
        if not api_key:
            raise ValueError("No Anthropic API key found.")
            
        if api_key not in CLIENT_CACHE["anthropic"]:
            CLIENT_CACHE["anthropic"][api_key] = anthropic.AsyncAnthropic(api_key=api_key)
            
        return CLIENT_CACHE["anthropic"][api_key]

    async def _get_openai_client(self, user_id: str = None):
        if not openai:
            raise ImportError("OpenAI library not installed.")
        
        api_key = None
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("openai_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for {user_id}: {e}")
        
        if not api_key:
            api_key = os.getenv("OPENAI_API_KEY")
            
        if not api_key:
            raise ValueError("No OpenAI API key found.")
            
        if api_key not in CLIENT_CACHE["openai"]:
            CLIENT_CACHE["openai"][api_key] = openai.AsyncOpenAI(api_key=api_key)
            
        return CLIENT_CACHE["openai"][api_key]

    async def _get_groq_client(self, user_id: str = None):
        if not groq:
            raise ImportError("Groq library not installed.")
        
        api_key = None
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("groq_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for {user_id}: {e}")
        
        if not api_key:
            api_key = os.getenv("GROQ_API_KEY")
            
        if not api_key:
            raise ValueError("No Groq API key found.")
            
        if api_key not in CLIENT_CACHE["groq"]:
            CLIENT_CACHE["groq"][api_key] = groq.AsyncGroq(api_key=api_key)
            
        return CLIENT_CACHE["groq"][api_key]

    async def _get_nvidia_client(self, user_id: str = None):
        if not openai:
            raise ImportError("OpenAI library not installed.")
        
        api_key = None
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("nvidia_api_key")
            except Exception as e:
                logger.warning(f"[AI Engine] Failed to fetch user settings for NVIDIA key {user_id}: {e}")
        
        if not api_key:
            api_key = os.getenv("NVIDIA_API_KEY")
            
        if not api_key:
            raise ValueError("No NVIDIA API key found in user settings or environment.")
            
        if api_key not in CLIENT_CACHE["nvidia"]:
            CLIENT_CACHE["nvidia"][api_key] = openai.AsyncOpenAI(
                api_key=api_key,
                base_url="https://integrate.api.nvidia.com/v1"
            )
            
        return CLIENT_CACHE["nvidia"][api_key]

    async def generate_content(self, prompt: str, system_instruction: str = None, user_id: str = None):
        import time
        start_time = time.perf_counter()
        
        logger.info(f"AI SYNTHESIS: Started synthesis with model: {self.model_name}")
        logger.debug(f"AI TELEMETRY: Prompt Context: {len(prompt)} chars | System Instruction: {'Active' if system_instruction else 'None'}")
        
        if "claude" in self.model_name.lower():
            client = await self._get_anthropic_client(user_id)
            response = await client.messages.create(
                model=self.model_name,
                max_tokens=4096,
                system=system_instruction or "",
                messages=[{"role": "user", "content": prompt}]
            )
            text = response.content[0].text
        elif "gpt-" in self.model_name.lower():
            client = await self._get_openai_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages
            )
            text = response.choices[0].message.content
        elif "llama" in self.model_name.lower() or "mixtral" in self.model_name.lower() or "deepseek" in self.model_name.lower():
            client = await self._get_groq_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages
            )
            text = response.choices[0].message.content
        elif "nvidia" in self.model_name.lower() or self.model_name.startswith("meta/") or "nemotron" in self.model_name.lower():
            client = await self._get_nvidia_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                response_format={"type": "json_object"} if "json" in prompt.lower() else None
            )
            text = response.choices[0].message.content
        else:
            client = await self._get_client(user_id)
            config = None
            if system_instruction:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    max_output_tokens=8192
                )
            else:
                config = types.GenerateContentConfig(max_output_tokens=8192)

            response = await client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config
            )
            text = response.text
            
            if text.strip().startswith("{") and not text.strip().endswith("}"):
                logger.warning(f"AI ENGINE: Detected truncated JSON. Attempting neural repair...")
                text = self._repair_json(text)
            
        elapsed = time.perf_counter() - start_time
        logger.info(f"AI PERFORMANCE: Synthesis complete in {elapsed:.2f}s | Output: {len(text)} chars")
        return text

    async def stream_content(self, prompt: str, system_instruction: str = None, user_id: str = None):
        logger.info(f"AI STREAM: Started streaming with model: {self.model_name}")
        
        if "claude" in self.model_name.lower():
            client = await self._get_anthropic_client(user_id)
            async with client.messages.stream(
                model=self.model_name,
                max_tokens=4096,
                system=system_instruction or "",
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        elif "gpt-" in self.model_name.lower():
            client = await self._get_openai_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        elif "llama" in self.model_name.lower() or "mixtral" in self.model_name.lower() or "deepseek" in self.model_name.lower():
            client = await self._get_groq_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        elif "nvidia" in self.model_name.lower() or self.model_name.startswith("meta/") or "nemotron" in self.model_name.lower():
            client = await self._get_nvidia_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        else:
            client = await self._get_client(user_id)
            config = None
            if system_instruction:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction
                )

            async for chunk in await client.aio.models.generate_content_stream(
                model=self.model_name,
                contents=prompt,
                config=config or types.GenerateContentConfig(max_output_tokens=8192)
            ):
                yield chunk.text

    def _repair_json(self, json_str: str) -> str:
        """Attempts to fix truncated JSON by backtracking to the last stable separator and closing open structures."""
        s = json_str.strip()
        if not s:
            return "{}"
            
        stack = []
        in_string = False
        escape = False
        last_separator_index = -1
        
        for i, char in enumerate(s):
            if escape:
                escape = False
                continue
            if char == '\\':
                escape = True
                continue
            if char == '"':
                in_string = not in_string
                continue
            if not in_string:
                if char in ("{", "["):
                    stack.append("}" if char == "{" else "]")
                    last_separator_index = i
                elif char in ("}", "]"):
                    if stack and stack[-1] == char:
                        stack.pop()
                    last_separator_index = i
                elif char == ",":
                    last_separator_index = i

        # If we're in an unstable state (mid-string or mid-key/value),
        # backtrack to the last stable separator.
        if in_string or (s and s[-1] not in ("}", "]", " ")):
            if last_separator_index != -1:
                logger.debug(f"AI ENGINE: JSON Repair - Backtracking to index {last_separator_index}")
                s = s[:last_separator_index + 1]
                # If we ended on a comma, strip it to avoid trailing comma error
                if s.strip().endswith(","):
                    s = s.strip()[:-1].strip()
                # Recalculate stack for the trimmed string
                return self._repair_json(s)

        # Close any remaining open structures
        if stack:
            logger.debug(f"AI ENGINE: JSON Repair - Closing {len(stack)} structures: {''.join(stack)}")
        while stack:
            s += stack.pop()
            
        return s

ai_engine = AIEngine()

async def call_ai(model: str, prompt: str, system_instruction: str = None, user_id: str = None):
    engine = AIEngine(model_name=model)
    return await engine.generate_content(prompt, system_instruction, user_id)

async def stream_ai(model: str, prompt: str, system_instruction: str = None, user_id: str = None):
    engine = AIEngine(model_name=model)
    async for chunk in engine.stream_content(prompt, system_instruction, user_id):
        yield chunk
