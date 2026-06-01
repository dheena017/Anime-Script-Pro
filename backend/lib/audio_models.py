"""
Anime Script Pro — Audio & Voice Model Registries

This module lists supported model paths for text-to-speech, transcription, and sound design.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ==============================================================================
# 1. REGISTRY DEFINITIONS
# ==============================================================================
AUDIO_MODEL_IDS = [
    "gemini-2.5-flash-tts",
    "gemini-2.5-pro-tts",
    "gemini-3.1-flash-tts",
    "gemini-2.5-flash-native-audio",
    "gemini-3-flash-live",
    "whisper-1",
    "fish-speech",
    "gpt-sovits",
    "chattts",
    "stable-audio-open",
    "musicgen",
    "bark",
    "elevenlabs-tts",
    "runway-tts",
    "aws-polly",
    "gcp-tts",
]

FREE_AUDIO_MODEL_IDS = [
    "gemini-2.5-flash-tts",
    "gemini-3.1-flash-tts",
    "gemini-2.5-flash-native-audio",
    "gemini-3-flash-live",
    "whisper-1",
    "stable-audio-open",
    "musicgen",
    "bark",
    "gcp-tts",
]

PAID_AUDIO_MODEL_IDS = [
    "gemini-2.5-pro-tts",
    "fish-speech",
    "gpt-sovits",
    "chattts",
    "elevenlabs-tts",
    "runway-tts",
    "aws-polly",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_AUDIO_MODELS = FREE_AUDIO_MODEL_IDS

__all__ = [
    "AUDIO_MODEL_IDS",
    "FREE_AUDIO_MODEL_IDS",
    "PAID_AUDIO_MODEL_IDS",
    "DEFAULT_AUDIO_MODELS",
]
