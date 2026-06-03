"""
Anime Script Pro — Project & Creative Blueprint Models

This module defines SQLModel database tables mapping production project manifests, creative
production sessions, active series outlines, narrative script variants, storyboards, and
compiled output archives.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Production Project blue prints
  4. Episode & Session Management Models
  5. Script & Storyboard Version control Models
  6. Consolidated Project Outputs Models
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Any, Dict, List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from sqlmodel import Column, Field, JSON, SQLModel

# ==============================================================================
# 3. PRODUCTION PROJECT BLUE PRINTS
# ==============================================================================

class Project(SQLModel, table=True):
    """Stores high-level settings, vibe prompts, and art style details for a production."""
    __tablename__ = "projects"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: Optional[str] = Field(default=None)
    name: Optional[str] = Field(default=None)
    vibe: Optional[str] = Field(default=None)
    content_type: str = Field(default="ANIME")
    genre: Optional[str] = None
    art_style: Optional[str] = None
    episode_length: str = Field(default="FULL")  # SHORT or FULL
    description: Optional[str] = None
    prompt: Optional[str] = None
    status: str = Field(default="draft")
    model_used: str = Field(default="God Mode Engine v2.0")
    prod_metadata: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, title={self.title})>"

    def __str__(self) -> str:
        return self.title or ""

# ==============================================================================
# 4. EPISODE & SESSION MANAGEMENT MODELS
# ==============================================================================

class ProductionSession(SQLModel, table=True):
    """Groups multiple generated scripts and scenes into active workspace sessions."""
    __tablename__ = "sessions"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    session_number: int
    title: str
    summary: str
    prod_metadata: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)


class Episode(SQLModel, table=True):
    """Tracks sequence blueprints mapping hooks, runtime indices, and generated asset matrices."""
    __tablename__ = "episodes"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    session_id: Optional[int] = Field(default=None, foreign_key="sessions.id")
    episode_number: int
    title: str
    hook: Optional[str] = None
    synopsis: Optional[str] = None
    runtime: Optional[str] = Field(default="24:00")
    asset_matrix: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)


class Scene(SQLModel, table=True):
    """Represents a single concrete scene description containing JSON visual directions."""
    __tablename__ = "scenes"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    episode_id: int = Field(foreign_key="episodes.id")
    scene_number: int
    status: str = Field(default="QUEUED")
    visual_variance_index: int = Field(default=0)
    prompt: Optional[str] = None
    content: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. SCRIPT & STORYBOARD VERSION CONTROL MODELS
# ==============================================================================

class Series(SQLModel, table=True):
    """Blueprints representing overarching series story guides."""
    __tablename__ = "series"
    __table_args__ = {"extend_existing": True}

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Series(id={self.id}, title={self.title})>"

    def __str__(self) -> str:
        return self.title


class Script(SQLModel, table=True):
    """Auditable screenplays tied to parent projects, episodes, or series outlines."""
    __tablename__ = "scripts"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    episode_id: Optional[int] = Field(default=None, foreign_key="episodes.id")
    series_id: Optional[int] = Field(default=None, foreign_key="series.id")
    project_id: Optional[int] = Field(default=None, foreign_key="projects.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Script(id={self.id}, title={self.title})>"

    def __str__(self) -> str:
        return self.title


class ScriptVersion(SQLModel, table=True):
    """Archival revision logs of script scriptwriting iterations."""
    __tablename__ = "script_versions"

    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)


class Storyboard(SQLModel, table=True):
    """Visual sequencing board containing generated keyframes and camera descriptors."""
    __tablename__ = "storyboards"

    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    image_url: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Storyboard(id={self.id}, script_id={self.script_id})>"

    def __str__(self) -> str:
        return self.image_url

# ==============================================================================
# 6. CONSOLIDATED PROJECT OUTPUTS MODELS
# ==============================================================================

class ProjectContent(SQLModel, table=True):
    """Stores full aggregated text compiles, plans, prompts, and distribution assets."""
    __tablename__ = "project_content"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Character Data
    character_profiles: Optional[str] = Field(default=None)
    character_data: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    character_relationships: Optional[str] = Field(default=None)
    
    # Narrative Data
    scenes: List[Dict[str, Any]] = Field(sa_column=Column(JSON), default_factory=list)
    script_content: Optional[str] = Field(default=None)
    series_plan: List[Dict[str, Any]] = Field(sa_column=Column(JSON), default_factory=list)
    
    # Production Data
    storyboard: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    seo_metadata: Optional[str] = Field(default=None)
    growth_strategy: Optional[str] = Field(default=None)
    distribution_plan: Optional[str] = Field(default=None)
    youtube_description: Optional[str] = Field(default=None)
    alt_texts: Optional[str] = Field(default=None)
    
    # Protocols & Prompts
    custom_prompts: Dict[str, str] = Field(sa_column=Column(JSON), default_factory=dict)
    active_protocols: List[str] = Field(sa_column=Column(JSON), default_factory=list)
    
    # Screening Room
    screening_logs: List[Dict[str, Any]] = Field(sa_column=Column(JSON), default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
