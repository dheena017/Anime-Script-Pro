from datetime import datetime
from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON

class WorldLore(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Modular Lore Data
    full_lore_blob: Optional[str] = Field(default=None) # The Master Manifest
    history_blob: Optional[str] = Field(default=None)   # Detailed Timeline
    powers_blob: Optional[str] = Field(default=None)    # Power Systems
    factions_blob: Optional[str] = Field(default=None)  # Factions & Politics
    
    # Modular Lore Data (Category Tabs)
    architecture: Optional[str] = Field(default=None)
    atlas: Optional[str] = Field(default=None)
    history: Optional[str] = Field(default=None)        # Legacy field
    systems: Optional[str] = Field(default=None)
    culture: Optional[str] = Field(default=None)
    
    # Modular Prompts (Neural Seeds)
    prompt_lore: Optional[str] = Field(default=None)
    prompt_powers: Optional[str] = Field(default=None)
    prompt_factions: Optional[str] = Field(default=None)
    prompt_architecture: Optional[str] = Field(default=None)
    prompt_atlas: Optional[str] = Field(default=None)
    prompt_culture: Optional[str] = Field(default=None)
    prompt_systems: Optional[str] = Field(default=None)

    # Metadata
    lore_metadata: Dict[str, Any] = Field(default_factory=dict, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CastMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    series_id: Optional[int] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    name: str = Field(index=True)
    role: str = Field(default="Character")
    archetype: Optional[str] = Field(default=None)
    personality: Optional[str] = Field(default=None)
    goal: Optional[str] = Field(default=None)
    flaw: Optional[str] = Field(default=None)
    conflict: Optional[str] = Field(default=None)
    appearance: Optional[str] = Field(default=None)
    speakingStyle: Optional[str] = Field(default=None)
    secret: Optional[str] = Field(default=None)
    visual_dna: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class NarrativeBeat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: Optional[int] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    title: str = Field(index=True)
    content: str
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ReusableCharacter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    name: str = Field(index=True)
    backstory: Optional[str] = None
    personality: Optional[str] = None
    visual_traits: Optional[str] = None
    visual_prompt: Optional[str] = None
    seed: int = Field(default=12345)
    reference_image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CharacterRelationship(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[int] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    source_character_id: Optional[int] = Field(default=None, index=True)
    target_character_id: Optional[int] = Field(default=None, index=True)
    source_name: str = Field(default="")
    target_name: str = Field(default="")
    type: str = Field(default="Ally") # Ally, Rival, Enemy, Love, Secret
    tension: int = Field(default=5) # 1-10
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
