"""Text model registry for backend routing."""
TEXT_MODEL_IDS = [
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
    "nvidia/llama-3.1-nemotron-70b-instruct",
    "meta/llama-3.1-70b-instruct",
]

DEFAULT_TEXT_MODELS = TEXT_MODEL_IDS

__all__ = ["TEXT_MODEL_IDS", "DEFAULT_TEXT_MODELS"]
