from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON

class Project(SQLModel, table=True):
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
    episode_length: str = Field(default="FULL") # "SHORT" or "FULL"
    description: Optional[str] = None
    prompt: Optional[str] = None
    status: str = Field(default="draft")
    model_used: str = Field(default="God Mode Engine v2.0")
    prod_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Project(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class ProductionSession(SQLModel, table=True):
    __tablename__ = "sessions"
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(index=True)
    session_number: int
    title: str
    summary: str
    prod_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class Episode(SQLModel, table=True):
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
    asset_matrix: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class Scene(SQLModel, table=True):
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

class Series(SQLModel, table=True):
    __tablename__ = "series"
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Series(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class Script(SQLModel, table=True):
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
    def __repr__(self):
        return f"<Script(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class ScriptVersion(SQLModel, table=True):
    __tablename__ = "script_versions"
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class Storyboard(SQLModel, table=True):
    __tablename__ = "storyboards"
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    image_url: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<Storyboard(id={self.id}, script_id={self.script_id})>"
    def __str__(self):
        return self.image_url

class ProjectContent(SQLModel, table=True):
    __tablename__ = "project_content"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Cast & Character Data
    cast_profiles: Optional[str] = Field(default=None)
    cast_data: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    cast_relationships: Optional[str] = Field(default=None)
    
    # Narrative Data
    scenes: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    script_content: Optional[str] = Field(default=None)
    series_plan: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    
    # Production Data
    storyboard: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    seo_metadata: Optional[str] = Field(default=None)
    growth_strategy: Optional[str] = Field(default=None)
    distribution_plan: Optional[str] = Field(default=None)
    youtube_description: Optional[str] = Field(default=None)
    alt_texts: Optional[str] = Field(default=None)
    
    # Protocols & Prompts
    custom_prompts: Dict[str, str] = Field(default_factory=dict, sa_type=JSON)
    active_protocols: List[str] = Field(default_factory=list, sa_type=JSON)
    
    # Screening Room
    screening_logs: List[Dict[str, Any]] = Field(default_factory=list, sa_type=JSON)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

