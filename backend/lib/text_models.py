"""
Anime Script Pro — Text & Chat Model Registries

This module lists the supported text model IDs used by the app and separates
free-tier fallbacks from paid-tier options.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ======================================================================
# 1. REGISTRY DEFINITIONS
# Raw model IDs are used here so backend routing stays stable.
# ======================================================================
TEXT_MODEL_IDS = [
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.1-pro",
    "gemini-2.5-pro",
    "gemini-2.0-pro",
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4-turbo",
    "o1-mini",
    "llama-3.1-8b-instant",
]

FREE_TEXT_MODEL_IDS = [
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "llama-3.1-8b-instant",
    "gpt-4o-mini",
]

PAID_TEXT_MODEL_IDS = [
    model_id for model_id in TEXT_MODEL_IDS if model_id not in FREE_TEXT_MODEL_IDS
]

SUPPORTED_TEXT_MODEL_IDS = TEXT_MODEL_IDS

# ======================================================================
# 2. FALLBACK ASSIGNMENTS
# ======================================================================
DEFAULT_TEXT_MODELS = FREE_TEXT_MODEL_IDS

__all__ = [
    "TEXT_MODEL_IDS",
    "SUPPORTED_TEXT_MODEL_IDS",
    "FREE_TEXT_MODEL_IDS",
    "PAID_TEXT_MODEL_IDS",
    "DEFAULT_TEXT_MODELS",
]
