"""
Anime Script Pro — Central Default Parameters & Model Mappings

This module maintains default values, hyperparameters, and model maps for visual templates,
generation processes, sound rendering, and pacing boundaries.

Sections (in order):
  1. Local Registry Imports
  2. Engine Model Aliasing & Fallbacks
  3. Domain Defaults (0-Index Resolvers)
  4. Generation Hyperparameters
  5. Manifestation Limits
"""

# ==============================================================================
# 1. LOCAL REGISTRY IMPORTS
# ==============================================================================
from backend.lib.agent_models import DEFAULT_AGENT_MODELS
from backend.lib.audio_models import DEFAULT_AUDIO_MODELS
from backend.lib.image_models import DEFAULT_IMAGE_MODELS
from backend.lib.text_models import DEFAULT_TEXT_MODELS, SUPPORTED_TEXT_MODEL_IDS
from backend.lib.video_models import DEFAULT_VIDEO_MODELS

# ==============================================================================
# 2. ENGINE MODEL ALIASING & FALLBACKS
# ==============================================================================
MODEL_MAP = {
    # Specialized local aliases
    "nano-banana": "gemini-2.5-flash", 
    "nano-banana-pro": "gemini-3-pro",

    # Groq API translations
    "llama-3-70b": "llama3-70b-8192",
    "llama-3-8b": "llama3-8b-8192",
    "mixtral-8x7b": "mixtral-8x7b-32768",
    "deepseek-r1": "deepseek-r1-distill-llama-70b",

    # NVIDIA endpoints
    "nvidia-llama": "nvidia/llama-3.1-nemotron-70b-instruct",
    "llama-3.1-70b": "meta/llama-3.1-70b-instruct",
    "nemotron-70b": "nvidia/llama-3.1-nemotron-70b-instruct"
}

STABLE_MODELS = list(dict.fromkeys(
    SUPPORTED_TEXT_MODEL_IDS
    + DEFAULT_TEXT_MODELS
    + DEFAULT_IMAGE_MODELS
    + DEFAULT_VIDEO_MODELS
    + DEFAULT_AGENT_MODELS
    + DEFAULT_AUDIO_MODELS
    + list(MODEL_MAP.values())
))

# ==============================================================================
# 3. DOMAIN DEFAULTS (0-INDEX RESOLVERS)
# ==============================================================================
DEFAULT_SCRIPT_MODEL: str = DEFAULT_TEXT_MODELS[0]
DEFAULT_IMAGE_MODEL: str = DEFAULT_IMAGE_MODELS[0]
DEFAULT_VIDEO_MODEL: str = DEFAULT_VIDEO_MODELS[0]
DEFAULT_AUDIO_MODEL: str = DEFAULT_AUDIO_MODELS[0]

# ==============================================================================
# 4. GENERATION HYPERPARAMETERS
# ==============================================================================
DEFAULT_CONTENT_TYPE: str = "Anime"
DEFAULT_TONE: str = "Hype/Energetic"
DEFAULT_AUDIENCE: str = "General Fans"
DEFAULT_SESSION: str = "1"
DEFAULT_EPISODE: str = "1"
DEFAULT_NUM_SCENES: str = "6"
DEFAULT_RECAPPER_PERSONA: str = ""

DEFAULT_TEMPERATURE: float = 0.85
DEFAULT_MAX_TOKENS: int = 2048
DEFAULT_TOP_P: float = 0.95
DEFAULT_TOP_K: int = 40

# ==============================================================================
# 5. MANIFESTATION LIMITS
# ==============================================================================
DEFAULT_SCENE_BATCH_LIMIT: int = 16  # max scenes per manifestation cycle

__all__ = [
    "MODEL_MAP",
    "STABLE_MODELS",
    "DEFAULT_SCRIPT_MODEL",
    "DEFAULT_IMAGE_MODEL",
    "DEFAULT_VIDEO_MODEL",
    "DEFAULT_AUDIO_MODEL",
    "DEFAULT_CONTENT_TYPE",
    "DEFAULT_TONE",
    "DEFAULT_AUDIENCE",
    "DEFAULT_SESSION",
    "DEFAULT_EPISODE",
    "DEFAULT_NUM_SCENES",
    "DEFAULT_RECAPPER_PERSONA",
    "DEFAULT_TEMPERATURE",
    "DEFAULT_MAX_TOKENS",
    "DEFAULT_TOP_P",
    "DEFAULT_TOP_K",
    "DEFAULT_SCENE_BATCH_LIMIT",
]
