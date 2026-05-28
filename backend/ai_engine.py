"""
AI Engine — Core Multi-Provider Inference Engine

This module is the central neural execution layer for Anime Script Pro.
It handles model resolution, client management, content generation (batch + streaming),
and image synthesis across Gemini, Anthropic, OpenAI, Groq, and NVIDIA providers.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Global Client Cache & Environment Bootstrap
  5. Model Resolution & Error Classification
  6. Multi-Provider Client Factory Utilities
  7. AIEngine (Core Multi-Provider Inference Class)
  8. Shared Default Instance & Public Convenience Wrappers
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import asyncio
import base64
import json
import os
import re
import sys
import time
from typing import AsyncGenerator, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
import aiohttp
from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai import types
from loguru import logger
from sqlalchemy import select

# Optional provider SDKs — gracefully degrade if not installed
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

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.database import async_engine, async_session
from backend.database.models.user import UserSettings
from backend.lib.defaults import DEFAULT_SCRIPT_MODEL, MODEL_MAP, STABLE_MODELS

# ==============================================================================
# 4. GLOBAL CLIENT CACHE & ENVIRONMENT BOOTSTRAP
# ==============================================================================

# Load .env from the project root directory
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

# Prevents connection pool exhaustion by reusing authenticated client instances
# keyed by their API key across requests.
CLIENT_CACHE: dict = {
    "gemini":    {},  # api_key → genai.Client
    "anthropic": {},  # api_key → anthropic.AsyncAnthropic
    "openai":    {},  # api_key → openai.AsyncOpenAI
    "groq":      {},  # api_key → groq.AsyncGroq
    "nvidia":    {},  # api_key → openai.AsyncOpenAI (NVIDIA NIM endpoint)
}

# ==============================================================================
# 5. MODEL RESOLUTION & ERROR CLASSIFICATION
# ==============================================================================

def resolve_engine_model(requested_model: str) -> str:
    """Resolve a user-supplied model name to a stable, SDK-compatible model ID.

    Performs three resolution steps in order:
      1. Regex downgrade — any Gemini model >= 2.5 is mapped back to its
         gemini-2.0-* stable equivalent (e.g., "gemini-3.5-flash" → "gemini-2.0-flash").
      2. Alias lookup — translates friendly aliases and Groq/NVIDIA shorthand
         via MODEL_MAP (e.g., "nano-banana" → "gemini-2.5-flash").
      3. Registry guard — if the final model ID is not in STABLE_MODELS, falls
         back to DEFAULT_SCRIPT_MODEL and logs a warning.

    Args:
        requested_model: The raw model string provided by the user or caller.

    Returns:
        A stable, SDK-safe model ID string (without "models/" prefix).

    Raises:
        HTTPException(400): If an Imagen model is passed to a text endpoint.
    """
    raw_model = requested_model.lower().strip().replace(" ", "-")

    # Step 1 — Downgrade futuristic/preview Gemini versions to stable 2.0 engines
    match = re.match(r"^gemini-(\d+(?:\.\d+)?)-(.*)$", raw_model)
    if match:
        try:
            version = float(match.group(1))
            suffix = match.group(2)
            if version >= 2.5:
                raw_model = f"gemini-2.0-{suffix.replace('-preview', '')}"
        except ValueError:
            pass

    # Step 2 — Guard against Imagen on text endpoints
    if "imagen" in raw_model:
        raise HTTPException(
            status_code=400,
            detail=(
                "Imagen models are not supported on the text generation endpoint. "
                "If you are in Demo mode, please enable the local fallback registry."
            ),
        )

    # Step 3 — Resolve via MODEL_MAP (supports double-hop aliases)
    target_model = MODEL_MAP.get(raw_model, raw_model)
    if target_model in MODEL_MAP:
        target_model = MODEL_MAP[target_model]

    # Step 4 — Registry guard: fall back to default if unrecognized
    if target_model not in STABLE_MODELS and not any(
        target_model.startswith(m) for m in STABLE_MODELS
    ):
        logger.warning(
            f"Resolved model '{target_model}' not in stable registry. "
            f"Falling back to {DEFAULT_SCRIPT_MODEL}."
        )
        target_model = DEFAULT_SCRIPT_MODEL

    return target_model.replace("models/", "")


def is_retryable_gemini_error(exc: Exception) -> bool:
    """Return True if the given exception is a transient Gemini error worth retrying.

    Classifies as transient based on HTTP status codes (429, 500, 503),
    gRPC status strings, and common rate-limit / overload message markers.

    Args:
        exc: The exception raised during a Gemini API call.

    Returns:
        True if the error is likely transient and a retry is safe.
    """
    message = str(exc).lower()
    status = str(getattr(exc, "status", "")).lower()
    code = getattr(exc, "code", None)

    if code in {429, 500, 503}:
        return True

    if status in {"unavailable", "resource_exhausted"}:
        return True

    transient_markers = (
        "503",
        "unavailable",
        "high demand",
        "rate limit",
        "resource exhausted",
        "temporarily unavailable",
    )
    return any(marker in message for marker in transient_markers)

# ==============================================================================
# 6. MULTI-PROVIDER CLIENT FACTORY UTILITIES
# ==============================================================================

def is_vertexai_enabled() -> bool:
    """Check if VertexAI mode is enabled via environment variables.

    Returns:
        bool: True if GOOGLE_GENAI_USE_VERTEXAI is set to '1', 'true', or 'yes'.
    """
    return os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "").strip().lower() in ("1", "true", "yes")


def create_gemini_client(api_key: Optional[str] = None) -> genai.Client:
    """Build and return a Google GenAI client, either VertexAI or standard API-key mode.

    In VertexAI mode, reads GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION from env.
    In standard mode, caches clients by API key to avoid creating duplicate connections.

    Args:
        api_key: Optional Gemini API key. If None in standard mode, uses ADC / env defaults.

    Returns:
        An initialized genai.Client instance.
    """
    if is_vertexai_enabled():
        client_kwargs: dict = {"vertexai": True}
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

# ==============================================================================
# 7. AIENGINE (CORE MULTI-PROVIDER INFERENCE CLASS)
# ==============================================================================

class AIEngine:
    """Multi-provider AI inference engine for Anime Script Pro.

    Handles generation and streaming across Gemini, Anthropic, OpenAI,
    Groq, and NVIDIA providers. Model names are automatically resolved
    to stable SDK equivalents on initialization via resolve_engine_model().

    Attributes:
        model_name (str): The resolved, SDK-safe model identifier.

    Usage:
        engine = AIEngine("gemini-3.5-flash")
        text = await engine.generate_text("Write a scene...")

        # Or use the convenience wrappers:
        text = await generate_ai_text("gemini-3.5-flash", "Write a scene...")
    """

    def __init__(self, model_name: str = DEFAULT_SCRIPT_MODEL) -> None:
        """Initialize the engine with a model name, resolving it to a stable SDK ID.

        Args:
            model_name: The model to use. Futuristic aliases (e.g., "gemini-3.5-flash")
                        are automatically resolved to stable equivalents.
        """
        self.model_name = resolve_engine_model(model_name)

    async def generate_stability_image(
        self,
        prompt: str,
        model_name: str = "stable-image/generate/core",
        user_id: Optional[str] = None,
    ) -> str:
        """Generate an image using Stability AI and return it as a Base64 JPEG data URI.

        Resolves the Stability AI API key from user settings first,
        then falls back to the STABILITY_API_KEY environment variable.

        Args:
            prompt:     The image generation prompt.
            model_name: The Stability AI model path (default: stable-image/generate/core).
            user_id:    Optional user ID for key lookup from UserSettings.

        Returns:
            A Base64-encoded JPEG data URI string: "data:image/jpeg;base64,...".

        Raises:
            ValueError:  If no Stability AI API key is found.
            Exception:   If the Stability AI API returns a non-200 response.
        """
        logger.info(f"AI IMAGE SYNTHESIS: Started with model {model_name}")

        api_key = None
        if user_id:
            try:
                async with async_session() as session:
                    statement = select(UserSettings).where(UserSettings.user_id == user_id)
                    res = await session.execute(statement)
                    settings = res.scalars().first()
                    if settings and settings.ai_models:
                        api_key = settings.ai_models.get("stability_api_key")
            except Exception as e:
                logger.warning(f"Failed to fetch user settings for {user_id}: {e}")

        if not api_key:
            api_key = os.getenv("STABILITY_API_KEY")

        if not api_key:
            raise ValueError("No Stability AI API key found in settings or .env")

        url = f"https://api.stability.ai/v2beta/{model_name}"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "image/*",
        }
        data = {
            "prompt": prompt,
            "output_format": "jpeg",
            "aspect_ratio": "16:9",
        }

        async with aiohttp.ClientSession() as http_session:
            async with http_session.post(url, headers=headers, data=data) as response:
                if response.status == 200:
                    img_bytes = await response.read()
                    base64_encoded = base64.b64encode(img_bytes).decode("utf-8")
                    logger.success("AI IMAGE SYNTHESIS: Successfully generated image.")
                    return f"data:image/jpeg;base64,{base64_encoded}"

                error_text = await response.text()
                logger.error(f"Stability AI Error: {error_text}")
                raise Exception(f"Image generation failed: {error_text}")

    async def _get_gemini_client(self, user_id: Optional[str] = None) -> genai.Client:
        """Retrieve a Gemini genai.Client initialized with the best available API key.

        Resolution order:
          1. User's gemini_api_key from UserSettings (database).
          2. Environment variables: GOOGLE_API_KEY → VITE_GEMINI_API_KEY → GEMINI_API_KEY.
          3. VertexAI Application Default Credentials (if GOOGLE_GENAI_USE_VERTEXAI=true).

        Args:
            user_id: Optional user ID for per-user key resolution.

        Returns:
            An authenticated genai.Client instance (cached by API key).

        Raises:
            ValueError: If no API key is found and VertexAI is not enabled.
        """
        api_key = None
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

        if not api_key:
            source = "Environment / VertexAI" if is_vertexai_enabled() else "Environment Variables"
            api_key = (
                os.getenv("GOOGLE_API_KEY")
                or os.getenv("VITE_GEMINI_API_KEY")
                or os.getenv("GEMINI_API_KEY")
            )

        if not api_key and not is_vertexai_enabled():
            raise ValueError("No Gemini API key found in user settings or environment.")

        logger.debug(f"AI ENGINE: Credential source identified as: {source}")

        if api_key not in CLIENT_CACHE["gemini"]:
            CLIENT_CACHE["gemini"][api_key] = create_gemini_client(api_key=api_key)

        return CLIENT_CACHE["gemini"][api_key]

    async def _get_anthropic_client(self, user_id: Optional[str] = None):
        """Retrieve an Anthropic AsyncAnthropic client for Claude models.

        Resolves the API key from user settings first, then falls back
        to the ANTHROPIC_API_KEY environment variable.

        Args:
            user_id: Optional user ID for per-user key resolution.

        Returns:
            An authenticated anthropic.AsyncAnthropic instance (cached by API key).

        Raises:
            ImportError: If the anthropic package is not installed.
            ValueError:  If no Anthropic API key is found.
        """
        if not anthropic:
            raise ImportError("Anthropic library not installed. Run: pip install anthropic")

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
                logger.warning(f"AI ENGINE: Failed to fetch user settings for {user_id}: {e}")

        if not api_key:
            api_key = os.getenv("ANTHROPIC_API_KEY")

        if not api_key:
            raise ValueError("No Anthropic API key found in settings or environment.")

        if api_key not in CLIENT_CACHE["anthropic"]:
            CLIENT_CACHE["anthropic"][api_key] = anthropic.AsyncAnthropic(api_key=api_key)

        return CLIENT_CACHE["anthropic"][api_key]

    async def _get_openai_client(self, user_id: Optional[str] = None):
        """Retrieve an OpenAI AsyncOpenAI client for GPT / o1 models.

        Resolves the API key from user settings first, then falls back
        to the OPENAI_API_KEY environment variable.

        Args:
            user_id: Optional user ID for per-user key resolution.

        Returns:
            An authenticated openai.AsyncOpenAI instance (cached by API key).

        Raises:
            ImportError: If the openai package is not installed.
            ValueError:  If no OpenAI API key is found.
        """
        if not openai:
            raise ImportError("OpenAI library not installed. Run: pip install openai")

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
                logger.warning(f"AI ENGINE: Failed to fetch user settings for {user_id}: {e}")

        if not api_key:
            api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise ValueError("No OpenAI API key found in settings or environment.")

        if api_key not in CLIENT_CACHE["openai"]:
            CLIENT_CACHE["openai"][api_key] = openai.AsyncOpenAI(api_key=api_key)

        return CLIENT_CACHE["openai"][api_key]

    async def _get_groq_client(self, user_id: Optional[str] = None):
        """Retrieve a Groq AsyncGroq client for LLaMA, Mixtral, and DeepSeek models.

        Resolves the API key from user settings first, then falls back
        to the GROQ_API_KEY environment variable.

        Args:
            user_id: Optional user ID for per-user key resolution.

        Returns:
            An authenticated groq.AsyncGroq instance (cached by API key).

        Raises:
            ImportError: If the groq package is not installed.
            ValueError:  If no Groq API key is found.
        """
        if not groq:
            raise ImportError("Groq library not installed. Run: pip install groq")

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
                logger.warning(f"AI ENGINE: Failed to fetch user settings for {user_id}: {e}")

        if not api_key:
            api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("No Groq API key found in settings or environment.")

        if api_key not in CLIENT_CACHE["groq"]:
            CLIENT_CACHE["groq"][api_key] = groq.AsyncGroq(api_key=api_key)

        return CLIENT_CACHE["groq"][api_key]

    async def _get_nvidia_client(self, user_id: Optional[str] = None):
        """Retrieve an NVIDIA NIM client (OpenAI-compatible) for Nemotron and LLaMA models.

        Resolves the API key from user settings first, then falls back
        to the NVIDIA_API_KEY environment variable. Uses the NVIDIA NIM
        base URL (https://integrate.api.nvidia.com/v1).

        Args:
            user_id: Optional user ID for per-user key resolution.

        Returns:
            An authenticated openai.AsyncOpenAI instance pointed at NVIDIA NIM (cached by API key).

        Raises:
            ImportError: If the openai package is not installed.
            ValueError:  If no NVIDIA API key is found.
        """
        if not openai:
            raise ImportError("OpenAI library not installed. Run: pip install openai")

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
                logger.warning(f"AI ENGINE: Failed to fetch NVIDIA key for {user_id}: {e}")

        if not api_key:
            api_key = os.getenv("NVIDIA_API_KEY")

        if not api_key:
            raise ValueError("No NVIDIA API key found in settings or environment.")

        if api_key not in CLIENT_CACHE["nvidia"]:
            CLIENT_CACHE["nvidia"][api_key] = openai.AsyncOpenAI(
                api_key=api_key,
                base_url="https://integrate.api.nvidia.com/v1",
            )

        return CLIENT_CACHE["nvidia"][api_key]

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> str:
        """Run a full (non-streaming) inference and return the complete text response.

        Routes to the correct provider based on the resolved model name:
          - "claude"               → Anthropic
          - "gpt-"                 → OpenAI
          - "nvidia" / "meta/" / "nemotron" → NVIDIA NIM
          - "llama" / "mixtral" / "deepseek" → Groq
          - everything else        → Google Gemini (with auto-retry on transient errors)

        Gemini calls include up to 3 automatic retries with exponential backoff
        on 429/500/503 transient errors.

        If the Gemini response appears to be truncated JSON, repair_truncated_json() is
        automatically invoked to patch and close the incomplete structure.

        Args:
            prompt:             The user message / generation instruction.
            system_instruction: Optional system-level prompt context.
            user_id:            Optional user ID for per-user API key resolution.

        Returns:
            The complete generated text string from the model.
        """
        start_time = time.perf_counter()

        logger.info(f"AI SYNTHESIS: Started synthesis with model: {self.model_name}")
        logger.debug(
            f"AI TELEMETRY: Prompt Context: {len(prompt)} chars | "
            f"System Instruction: {'Active' if system_instruction else 'None'}"
        )

        # ── Anthropic (Claude) ──────────────────────────────────────────────
        if "claude" in self.model_name.lower():
            client = await self._get_anthropic_client(user_id)
            response = await client.messages.create(
                model=self.model_name,
                max_tokens=4096,
                system=system_instruction or "",
                messages=[{"role": "user", "content": prompt}],
            )
            text = response.content[0].text

        # ── OpenAI (GPT / o1) ───────────────────────────────────────────────
        elif "gpt-" in self.model_name.lower():
            client = await self._get_openai_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
            )
            text = response.choices[0].message.content

        # ── NVIDIA NIM (Nemotron / LLaMA via meta/) ─────────────────────────
        elif (
            "nvidia" in self.model_name.lower()
            or self.model_name.startswith("meta/")
            or "nemotron" in self.model_name.lower()
        ):
            client = await self._get_nvidia_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                response_format={"type": "json_object"} if "json" in prompt.lower() else None,
            )
            text = response.choices[0].message.content

        # ── Groq (LLaMA / Mixtral / DeepSeek) ──────────────────────────────
        elif any(
            kw in self.model_name.lower()
            for kw in ("llama", "mixtral", "deepseek")
        ):
            client = await self._get_groq_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            response = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
            )
            text = response.choices[0].message.content

        # ── Google Gemini (default, with auto-retry) ────────────────────────
        else:
            client = await self._get_gemini_client(user_id)
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                max_output_tokens=8192,
            ) if system_instruction else types.GenerateContentConfig(max_output_tokens=8192)

            response = None
            last_error = None
            max_attempts = 3

            for attempt in range(1, max_attempts + 1):
                try:
                    response = await client.aio.models.generate_content(
                        model=self.model_name,
                        contents=prompt,
                        config=config,
                    )
                    break
                except Exception as exc:
                    last_error = exc
                    if attempt < max_attempts and is_retryable_gemini_error(exc):
                        delay_seconds = 2 ** (attempt - 1)
                        logger.warning(
                            f"AI ENGINE: Gemini transient error on attempt {attempt}/{max_attempts}; "
                            f"retrying in {delay_seconds}s: {exc}"
                        )
                        await asyncio.sleep(delay_seconds)
                        continue
                    raise

            if response is None:
                raise last_error

            text = response.text

            # Auto-repair truncated JSON responses
            if text.strip().startswith("{") and not text.strip().endswith("}"):
                logger.warning("AI ENGINE: Detected truncated JSON. Attempting neural repair...")
                text = self.repair_truncated_json(text)

        elapsed = time.perf_counter() - start_time
        logger.info(f"AI PERFORMANCE: Synthesis complete in {elapsed:.2f}s | Output: {len(text)} chars")
        return text

    async def stream_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Stream generated text in real-time, yielding chunks as they arrive.

        Routes to the correct provider's streaming API based on the resolved model name,
        using the same provider routing logic as generate_text().

        This is an async generator — iterate with `async for chunk in engine.stream_text(...)`.

        Args:
            prompt:             The user message / generation instruction.
            system_instruction: Optional system-level prompt context.
            user_id:            Optional user ID for per-user API key resolution.

        Yields:
            str: Successive text chunks from the model as they are produced.
        """
        logger.info(f"AI STREAM: Started streaming with model: {self.model_name}")

        # ── Anthropic (Claude) ──────────────────────────────────────────────
        if "claude" in self.model_name.lower():
            client = await self._get_anthropic_client(user_id)
            async with client.messages.stream(
                model=self.model_name,
                max_tokens=4096,
                system=system_instruction or "",
                messages=[{"role": "user", "content": prompt}],
            ) as stream:
                async for text in stream.text_stream:
                    yield text

        # ── OpenAI (GPT / o1) ───────────────────────────────────────────────
        elif "gpt-" in self.model_name.lower():
            client = await self._get_openai_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        # ── NVIDIA NIM (Nemotron / LLaMA via meta/) ─────────────────────────
        elif (
            "nvidia" in self.model_name.lower()
            or self.model_name.startswith("meta/")
            or "nemotron" in self.model_name.lower()
        ):
            client = await self._get_nvidia_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        # ── Groq (LLaMA / Mixtral / DeepSeek) ──────────────────────────────
        elif any(
            kw in self.model_name.lower()
            for kw in ("llama", "mixtral", "deepseek")
        ):
            client = await self._get_groq_client(user_id)
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            stream = await client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        # ── Google Gemini (default) ─────────────────────────────────────────
        else:
            client = await self._get_gemini_client(user_id)
            config = (
                types.GenerateContentConfig(system_instruction=system_instruction)
                if system_instruction
                else types.GenerateContentConfig(max_output_tokens=8192)
            )
            async for chunk in await client.aio.models.generate_content_stream(
                model=self.model_name,
                contents=prompt,
                config=config,
            ):
                yield chunk.text

    def repair_truncated_json(self, json_str: str) -> str:
        """Attempt to fix a truncated JSON string returned by an LLM.

        Uses a character-by-character stack parser to track open braces/brackets
        and locate the last stable structural separator (comma, closing brace/bracket).
        If the string ends mid-token or mid-string, it backtracks to that separator
        and closes all remaining open structures.

        This handles the common case where a model hits its token limit mid-JSON,
        leaving the response as an invalid, unclosed object.

        Args:
            json_str: The raw, potentially truncated JSON string from the model.

        Returns:
            A repaired JSON string that is valid and parseable, or "{}" on empty input.
        """
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
            if char == "\\":
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

        # If mid-string or mid-key/value, backtrack to last stable separator
        if in_string or (s and s[-1] not in ("}", "]", " ")):
            if last_separator_index != -1:
                logger.debug(f"AI ENGINE: JSON Repair - Backtracking to index {last_separator_index}")
                s = s[:last_separator_index + 1]
                # Strip trailing comma to avoid invalid JSON
                if s.strip().endswith(","):
                    s = s.strip()[:-1].strip()
                # Recurse on the trimmed string to recalculate the stack
                return self.repair_truncated_json(s)

        # Close any remaining open structures
        if stack:
            logger.debug(f"AI ENGINE: JSON Repair - Closing {len(stack)} structures: {''.join(stack)}")
        while stack:
            s += stack.pop()

        return s

# ==============================================================================
# 8. SHARED DEFAULT INSTANCE & PUBLIC CONVENIENCE WRAPPERS
# ==============================================================================

# Pre-initialized engine using the default model from backend/lib/defaults.py.
# Used by endpoints that don't need per-request model selection.
ai_engine = AIEngine()


async def generate_ai_text(
    model: str,
    prompt: str,
    system_instruction: Optional[str] = None,
    user_id: Optional[str] = None,
) -> str:
    """Convenience wrapper — create a per-request AIEngine and run a single inference.

    Preferred entry point for background tasks, scene manifestors, and
    any caller that needs a one-shot, non-streaming generation.

    Args:
        model:              The model name (aliases and futuristic names are resolved automatically).
        prompt:             The user message / generation instruction.
        system_instruction: Optional system-level prompt context.
        user_id:            Optional user ID for per-user API key resolution.

    Returns:
        The complete generated text string.
    """
    engine = AIEngine(model_name=model)
    return await engine.generate_text(prompt, system_instruction, user_id)


async def stream_ai_text(
    model: str,
    prompt: str,
    system_instruction: Optional[str] = None,
    user_id: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """Convenience wrapper — create a per-request AIEngine and stream the inference.

    Async generator — iterate with `async for chunk in stream_ai_text(...)`.
    Preferred entry point for SSE streaming endpoints.

    Args:
        model:              The model name (aliases and futuristic names are resolved automatically).
        prompt:             The user message / generation instruction.
        system_instruction: Optional system-level prompt context.
        user_id:            Optional user ID for per-user API key resolution.

    Yields:
        str: Successive text chunks from the model as they are produced.
    """
    engine = AIEngine(model_name=model)
    async for chunk in engine.stream_text(prompt, system_instruction, user_id):
        yield chunk
