"""
Anime Script Pro — Media & Creative Asset Models

This module defines SQLModel database tables mapped to styling templates, generated media files,
saved prompt libraries, and social growth strategies.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Creative Styling Templates
  4. Media & Favorite Assets
  5. Saved Prompts & prompt libraries
  6. Social Growth Strategies
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Dict, List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from sqlmodel import Column, Field, JSON, SQLModel

# ==============================================================================
# 3. CREATIVE STYLING TEMPLATES
# ==============================================================================

class Template(SQLModel, table=True):
    """Stores visual theme, style cards, and orchestration templates."""
    __tablename__ = "templates"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    category: str = Field(default="All")
    icon: str = Field(default="Sword")
    thumbnail: Optional[str] = None
    prompt: str = Field(default="")
    color: str = Field(default="text-cyan-500")
    border: str = Field(default="border-cyan-500/50")
    bg: str = Field(default="bg-cyan-500/10")
    shadow: str = Field(default="shadow-[0_0_15px_rgba(6,182,212,0.2)]")
    elements: List[str] = Field(sa_column=Column(JSON), default_factory=list)
    vibe: str = Field(default="Standard")
    stats: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Template(id={self.id}, name={self.name})>"

    def __str__(self) -> str:
        return self.name

# ==============================================================================
# 4. MEDIA & FAVORITE ASSETS
# ==============================================================================

class MediaAsset(SQLModel, table=True):
    """Tracks generated visual assets, backgrounds, music, and audio streams."""
    __tablename__ = "media_assets"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    asset_type: str = Field(default="IMAGE")  # IMAGE, VIDEO, AUDIO
    url: str
    prompt: Optional[str] = None
    prod_metadata: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserFavorite(SQLModel, table=True):
    """Maps custom favorite ratings to specific generated media assets."""
    __tablename__ = "user_favorites"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    asset_id: int = Field(foreign_key="media_assets.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. SAVED PROMPTS & PROMPT LIBRARIES
# ==============================================================================

class SavedPrompt(SQLModel, table=True):
    """Personal saved prompt templates designated for specific styling categories."""
    __tablename__ = "saved_prompts"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    label: str
    prompt_text: str
    category: Optional[str] = None  # e.g., Style, Lighting
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PromptLibrary(SQLModel, table=True):
    """System-level library storing prompt histories compiled for projects."""
    __tablename__ = "prompt_library"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    scen_id: Optional[int] = None
    prompt_text: str
    lighting_cues: Optional[str] = None
    visual_style: Optional[str] = None
    seed: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Prompt(SQLModel, table=True):
    """A single prompt block with context tags."""
    __tablename__ = "prompts"

    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    context: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Prompt(id={self.id}, text={self.text[:20]})>"

    def __str__(self) -> str:
        return self.text

# ==============================================================================
# 6. SOCIAL GROWTH STRATEGIES
# ==============================================================================

class GrowthStrategy(SQLModel, table=True):
    """Preset strategies detailing standard marketing, repurposing, and branding tips."""
    __tablename__ = "growth_strategies"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    track: str  # e.g., Educational, Influencer, Live, Engagement, Repurpose
    prompt: str
    description: Optional[str] = None
    icon: str = Field(default="TrendingUp")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
