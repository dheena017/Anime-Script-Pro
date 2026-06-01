"""
Anime Script Pro — Image Generation Model Registries

This module lists supported model paths for graphic illustrations, storyboard sketching,
and visual synthesis.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ==============================================================================
# 1. REGISTRY DEFINITIONS
# ==============================================================================
IMAGE_MODEL_IDS = [
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
    "gemini-3-pro-image-preview",
    "gemini-3-pro-image",
    "imagen-4-ultra",
    "imagen-4-fast",
    "flux-1-schnell",
    "stable-diffusion-xl",
    "stable-diffusion-3.5",
    "stable-diffusion-3",
    "stable-diffusion-3-medium",
    "auraflow",
    "hunyuan-dit",
    "kolors",
    "kandinsky-3",
    "pixart-sigma",
    "tripo-sr",
    "sv3d",
    "unique3d",
    "instantmesh",
    "hugging-face-inference",
    "prism-ml/bonsai-image-ternary-4B-gemlite-2bit",
    "hugging-face-flux-schnell",
    "hugging-face-flux-dev",
    "hugging-face-sdxl",
    "hugging-face-sdxl-turbo",
    "hugging-face-sd35",
    "hugging-face-pixart",
    "hugging-face-anime",
    "hugging-face-anime-xl",
    "hugging-face-anime-dark",
    "hugging-face-realvis",
    "hugging-face-juggernaut",
    "hugging-face-portrait-plus",
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

FREE_IMAGE_MODEL_IDS = [
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
    "flux-1-schnell",
    "stable-diffusion-xl",
    "stable-diffusion-3.5",
    "stable-diffusion-3",
    "stable-diffusion-3-medium",
    "auraflow",
    "hunyuan-dit",
    "kolors",
    "kandinsky-3",
    "pixart-sigma",
    "tripo-sr",
    "sv3d",
    "unique3d",
    "instantmesh",
    "hugging-face-inference",
    "prism-ml/bonsai-image-ternary-4B-gemlite-2bit",
    "hugging-face-flux-schnell",
    "hugging-face-flux-dev",
    "hugging-face-sdxl",
    "hugging-face-sdxl-turbo",
    "hugging-face-sd35",
    "hugging-face-pixart",
    "hugging-face-anime",
    "hugging-face-anime-xl",
    "hugging-face-anime-dark",
    "hugging-face-realvis",
    "hugging-face-juggernaut",
    "hugging-face-portrait-plus",
    "deepai",
    "leonardo-ai",
]

PAID_IMAGE_MODEL_IDS = [
    "gemini-3-pro-image-preview",
    "imagen-4-ultra",
    "imagen-4-fast",
    "gemini-3-pro-image",
    "together-ai-replicate",
    "flux-2-pro",
    "gpt-image-1.5",
    "recraft-v4",
    "ideogram-3.0",
    "midjourney-v7",
    "fal-ai",
    "replicate",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_IMAGE_MODELS = FREE_IMAGE_MODEL_IDS

__all__ = [
    "IMAGE_MODEL_IDS",
    "FREE_IMAGE_MODEL_IDS",
    "PAID_IMAGE_MODEL_IDS",
    "DEFAULT_IMAGE_MODELS",
]
