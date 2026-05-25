"""Audio / TTS model registry for backend routing."""
AUDIO_MODEL_IDS = [
    "gemini-2.5-flash-tts",
    "gemini-2.5-pro-tts",
    "gemini-3.1-flash-tts",
    "gemini-2.5-flash-native-audio",
    "gemini-3-flash-live",
    "elevenlabs-tts",
    "runway-tts",
    "aws-polly",
    "gcp-tts",
]

DEFAULT_AUDIO_MODELS = AUDIO_MODEL_IDS

__all__ = ["AUDIO_MODEL_IDS", "DEFAULT_AUDIO_MODELS"]
