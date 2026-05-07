from datetime import datetime
from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, JSON

class WorldLore(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    
    # Modular Lore Data Blobs
    manifest_blob: Optional[str] = Field(default=None)
    history_blob: Optional[str] = Field(default=None)
    factions_blob: Optional[str] = Field(default=None)
    powers_blob: Optional[str] = Field(default=None)
    architecture_blob: Optional[str] = Field(default=None)
    atlas_blob: Optional[str] = Field(default=None)
    culture_blob: Optional[str] = Field(default=None)
    systems_blob: Optional[str] = Field(default=None)
    
    # Modular Neural Seeds (Prompts)
    prompt_manifest: Optional[str] = Field(default=None)
    prompt_history: Optional[str] = Field(default=None)
    prompt_factions: Optional[str] = Field(default=None)
    prompt_powers: Optional[str] = Field(default=None)
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


class CastManifest(SQLModel, table=True):
    """Unified cast manifest blob table — mirrors the frontend characterApi."""
    __tablename__ = "cast_manifests"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)

    # Core cast data (JSON blobs)
    cast_list_blob: Optional[str] = Field(default=None)      # Full character JSON array
    relationships_blob: Optional[str] = Field(default=None)  # Relationship graph JSON
    dna_config_blob: Optional[str] = Field(default=None)     # DNA analysis JSON
    dynamics_blob: Optional[str] = Field(default=None)       # Group dynamics analysis
    integrity_blob: Optional[str] = Field(default=None)      # Narrative integrity report

    # Neural Seeds (prompts used)
    prompt_cast: Optional[str] = Field(default=None)
    prompt_relationships: Optional[str] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
