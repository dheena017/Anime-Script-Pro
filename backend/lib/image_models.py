"""Image model registry for backend routing."""
IMAGE_MODEL_IDS = [
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
    "gemini-3-pro-image-preview",
    "imagen-4-ultra",
    "imagen-4-fast",
    "gemini-3-pro-image",
    "flux-1-schnell",
    "stable-diffusion-xl",
    "stable-diffusion-3.5",
    "hugging-face-inference",
    "deepai",
    "together-ai-replicate",
    "leonardo-ai",
    "civitai",
    "flux-2-pro",
    "gpt-image-1.5",
    "recraft-v4",
    "ideogram-3.0",
    "midjourney-v7",
    "fal-ai",
    "replicate",
]

DEFAULT_IMAGE_MODELS = IMAGE_MODEL_IDS

__all__ = ["IMAGE_MODEL_IDS", "DEFAULT_IMAGE_MODELS"]
