"""
Anime Script Pro — Video Generation Model Registries

This module lists supported model paths for dynamic scene animating and video compilation.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ==============================================================================
# 1. REGISTRY DEFINITIONS
# ==============================================================================
VIDEO_MODEL_IDS = [
    "veo-3.1-fast-generate-preview",
    "veo-3-generate",
    "veo-3-fast-generate",
    "veo-3-lite-generate",
    "stable-video-diffusion",
    "cogvideox",
    "open-sora-plan",
    "easyanimate",
    "animatediff",
]

FREE_VIDEO_MODEL_IDS = [
    "veo-3.1-fast-generate-preview",
    "veo-3-fast-generate",
    "veo-3-lite-generate",
    "stable-video-diffusion",
    "cogvideox",
    "open-sora-plan",
    "easyanimate",
    "animatediff",
]

PAID_VIDEO_MODEL_IDS = [
    "veo-3-generate",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_VIDEO_MODELS = FREE_VIDEO_MODEL_IDS

__all__ = [
    "VIDEO_MODEL_IDS",
    "FREE_VIDEO_MODEL_IDS",
    "PAID_VIDEO_MODEL_IDS",
    "DEFAULT_VIDEO_MODELS",
]
