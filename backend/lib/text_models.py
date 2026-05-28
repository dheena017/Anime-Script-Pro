"""
Anime Script Pro — Text & Chat Model Registries

This module lists supported model paths for screenwriting, narrative beat layouts,
and core dialog generations.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ==============================================================================
# 1. REGISTRY DEFINITIONS
# ==============================================================================
TEXT_MODEL_IDS = [
    "gemini-3.5-flash",
    "gemini-3.5-pro",
    "gemini-3.1-flash",
    "gemini-3.1-flash-lite",
    "gemini-3-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-1.5-flash",
    "gemini-3.1-pro",
    "gemini-3-pro",
    "gemini-2.5-pro",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-pro",
    "gemma-3-27b",
    "gemma-3-12b",
    "gemma-3-4b",
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4-turbo",
    "o1-preview",
    "o1-mini",
    "llama-3.1-8b-instant",
    "mistral-large-2",
    "gemma-2-27b-it",
    "phi-3.5-mini-instruct",
    "qwen-2.5-72b-instruct",
    "falcon-2-11b-instruct",
    "deepseek-v2.5",
    "jamba",
    "nemotron-3",
    "internlm-2.5",
    "command-r-plus",
    "deepseek-coder-v2",
    "codeqwen-1.5",
    "starcoder2",
    "florence-2",
    "paligemma",
    "llava-v1.6",
    "minicpm-v",
    "nvidia/llama-3.1-nemotron-70b-instruct",
    "meta/llama-3.1-70b-instruct",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_TEXT_MODELS = TEXT_MODEL_IDS

__all__ = ["TEXT_MODEL_IDS", "DEFAULT_TEXT_MODELS"]
