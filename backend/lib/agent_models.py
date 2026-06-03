"""
Anime Script Pro — Agent Model Registries

This module lists supported model paths for autonomous orchestrating agent synthesis.

Sections (in order):
  1. Registry Definitions
  2. Fallback Assignments
"""

# ==============================================================================
# 1. REGISTRY DEFINITIONS
# ==============================================================================
AGENT_MODEL_IDS = [
    "antigravity",
    "deep-research-pro",
    "computer-use-preview",
]

FREE_AGENT_MODEL_IDS = [
    "antigravity",
    "computer-use-preview",
]

PAID_AGENT_MODEL_IDS = [
    "deep-research-pro",
]

# ==============================================================================
# 2. FALLBACK ASSIGNMENTS
# ==============================================================================
DEFAULT_AGENT_MODELS = FREE_AGENT_MODEL_IDS

__all__ = [
    "AGENT_MODEL_IDS",
    "FREE_AGENT_MODEL_IDS",
    "PAID_AGENT_MODEL_IDS",
    "DEFAULT_AGENT_MODELS",
]
