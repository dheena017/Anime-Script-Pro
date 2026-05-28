"""
Anime Script Pro — Narrative World Lore & Character Models

This module defines SQLModel database tables mapping narrative world guides, faction details,
speaking styles, active cast rosters, relationship lattices, and modular group dynamics manifests.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Master World Lore & Timelines
  4. Cast Member Profiles
  5. Narrative Beats & Story Outlines
  6. Reusable Characters & Relationship Matrices
  7. Compiled Cast Manifest Archives
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
# 3. MASTER WORLD LORE & TIMELINES
# ==============================================================================

class WorldLore(SQLModel, table=True):
    """Stores master lore guides, historic timelines, factions, and power system limits."""
    __tablename__ = "world_lore"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    series_id: Optional[int] = Field(default=None, index=True)

    # Modular Lore Data
    full_lore_blob: Optional[str] = Field(default=None)  # The Master Manifest
    history_blob: Optional[str] = Field(default=None)    # Detailed Timeline
    powers_blob: Optional[str] = Field(default=None)     # Power Systems
    factions_blob: Optional[str] = Field(default=None)   # Factions & Politics
    
    # Modular Lore Data (Category Tabs)
    architecture: Optional[str] = Field(default=None)
    atlas: Optional[str] = Field(default=None)
    history: Optional[str] = Field(default=None)         # Legacy field
    systems: Optional[str] = Field(default=None)
    culture: Optional[str] = Field(default=None)
    
    prompt_lore: Optional[str] = Field(default=None)
    prompt_history: Optional[str] = Field(default=None)
    prompt_powers: Optional[str] = Field(default=None)
    prompt_factions: Optional[str] = Field(default=None)
    prompt_architecture: Optional[str] = Field(default=None)
    prompt_atlas: Optional[str] = Field(default=None)
    prompt_culture: Optional[str] = Field(default=None)
    prompt_systems: Optional[str] = Field(default=None)

    # Extended modular tab blobs
    architecture_blob: Optional[str] = Field(default=None)
    atlas_blob: Optional[str] = Field(default=None)
    culture_blob: Optional[str] = Field(default=None)
    systems_blob: Optional[str] = Field(default=None)

    # Metadata
    lore_metadata: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 4. CAST MEMBER PROFILES
# ==============================================================================

class CastMember(SQLModel, table=True):
    """Holds individual character bio, core flaws, visual styling traits, and speech logic."""
    __tablename__ = "cast_members"

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
    vfx_signature: Optional[str] = Field(default=None)
    lighting_logic: Optional[str] = Field(default=None)
    camera_choreography: Optional[str] = Field(default=None)
    hair_style: Optional[str] = Field(default=None)
    eye_details: Optional[str] = Field(default=None)
    clothing_materials: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. NARRATIVE BEATS & STORY OUTLINES
# ==============================================================================

class NarrativeBeat(SQLModel, table=True):
    """Tied beat milestones that guide pacing before scene manifestation."""
    __tablename__ = "narrative_beats"

    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: Optional[int] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    title: str = Field(index=True)
    content: str
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 6. REUSABLE CHARACTERS & RELATIONSHIP MATRICES
# ==============================================================================

class ReusableCharacter(SQLModel, table=True):
    """Pre-curated characters exported to user inventories for multi-series mapping."""
    __tablename__ = "reusable_characters"

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
    """Maps custom relationship matrices, core conflicts, and dramatic tensions."""
    __tablename__ = "character_relationships"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: Optional[int] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, index=True)
    source_character_id: Optional[int] = Field(default=None, index=True)
    target_character_id: Optional[int] = Field(default=None, index=True)
    source_name: str = Field(default="")
    target_name: str = Field(default="")
    type: str = Field(default="Ally")  # Ally, Rival, Enemy, Love, Secret
    subtype: Optional[str] = Field(default=None)  # Ideological Rivalry, Slow Burn, etc.
    tension: int = Field(default=5)  # 1-10
    description: Optional[str] = None
    dynamic_setup: Optional[str] = Field(default=None)
    escalation_path: Optional[str] = Field(default=None)
    betrayal_potential: Optional[str] = Field(default=None)
    arc_potential: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 7. COMPILED CAST MANIFEST ARCHIVES
# ==============================================================================

class CastManifest(SQLModel, table=True):
    """Consolidated JSON blobs mapping active cast and group dynamics reports."""
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
    num_characters: int = Field(default=8)
    prompt_cast: Optional[str] = Field(default=None)
    prompt_relationships: Optional[str] = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
