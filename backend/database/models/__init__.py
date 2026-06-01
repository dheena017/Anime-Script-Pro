"""
Anime Script Pro — Database Model Registry Index

This package index exposes and exports all SQLModel database schemas used throughout the
Anime Script Pro codebase, enabling consolidated imports.

Sections (in order):
  1. Base SQLModel Imports
  2. Model Imports by Domain Area
  3. Export Registry Configuration
"""

# ==============================================================================
# 1. BASE SQLMODEL IMPORTS
# ==============================================================================
from sqlmodel import SQLModel

# ==============================================================================
# 2. MODEL IMPORTS BY DOMAIN AREA
# ==============================================================================
# User Accounts & Profiles
from .user import User, UserProfile, UserBalance, UserSettings, Todo

# Projectblueprints & Creative Sessions
from .projects import Project, ProductionSession, Episode, Scene, Series, Script, ScriptVersion, Storyboard, ProjectContent

# Shared Media & Prompt Blueprints
from .assets import Template, MediaAsset, UserFavorite, SavedPrompt, PromptLibrary, Prompt, GrowthStrategy

# System Configurations & Support Guides
from .system import (
    Category, Tutorial, Notification, SEOEntry, HelpCategory, FAQ, 
    DocSection, DocArticle, ScreeningRoomEntry, CommunityPost, SiteConfig
)

# AI Models & Performance Metrics
from .engine import EngineConfig, AITelemetry, AIModel

# Narrative Lore & Character Blueprints
from .world import WorldLore, Character, NarrativeBeat, ReusableCharacter, CharacterRelationship, CharacterManifest

# Logging & Auditing Data Blueprints
from .logs import SystemLog, GenerationLog

# ==============================================================================
# 3. EXPORT REGISTRY CONFIGURATION
# ==============================================================================
__all__ = [
    "SQLModel",
    "User", "UserProfile", "UserBalance", "UserSettings", "Todo",
    "Project", "ProductionSession", "Episode", "Scene", "Series", "Script", "ScriptVersion", "Storyboard", "ProjectContent",
    "WorldLore", "Character", "NarrativeBeat", "ReusableCharacter", "CharacterRelationship", "CharacterManifest",
    "Template", "MediaAsset", "UserFavorite", "SavedPrompt", "PromptLibrary", "Prompt", "GrowthStrategy",
    "Category", "Tutorial", "Notification", "SEOEntry", "HelpCategory", "FAQ",
    "DocSection", "DocArticle", "ScreeningRoomEntry", "CommunityPost", "SiteConfig",
    "EngineConfig", "AITelemetry", "AIModel",
    "SystemLog", "GenerationLog"
]
