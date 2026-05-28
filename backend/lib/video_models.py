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
    "veo-3-generate",
    "veo-3-fast-generate",
    "veo-3-lite-generate",
    "stable-video-diffusion",
    "cogvideox",
    "open-sora-plan",
    "easyanimate",
    "animatediff",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_VIDEO_MODELS = VIDEO_MODEL_IDS

__all__ = ["VIDEO_MODEL_IDS", "DEFAULT_VIDEO_MODELS"]
