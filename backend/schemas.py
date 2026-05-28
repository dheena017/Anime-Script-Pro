"""
Anime Script Pro — Pydantic Shared Schemas

This module defines common request and response schemas used across endpoints to validate incoming
payload boundaries and format standard JSON responses.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Core Generation API Schemas
  4. Episode API Payload Schemas
  5. Visual Template Schemas
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Dict, List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from pydantic import BaseModel

# ==============================================================================
# 3. CORE GENERATION API SCHEMAS
# ==============================================================================

class GenerationRequest(BaseModel):
    """Unified AI text/image/agent generation request payload."""
    model: str
    prompt: str
    systemInstruction: Optional[str] = None


class GenerationResponse(BaseModel):
    """Unified AI text/image/agent generation response envelope."""
    text: str
    model_used: Optional[str] = None
    usage: Optional[Dict] = None
    latency_ms: Optional[float] = None
    fallbacks: Optional[List[str]] = None

# ==============================================================================
# 4. EPISODE API PAYLOAD SCHEMAS
# ==============================================================================

class EpisodeCreate(BaseModel):
    """Input payload for batch creating or initializing episode blueprints."""
    title: str
    episode_number: int
    hook: Optional[str] = None
    summary: Optional[str] = None

# ==============================================================================
# 5. VISUAL TEMPLATE SCHEMAS
# ==============================================================================

class TemplateIn(BaseModel):
    """Input parameters for establishing or modifying styling templates."""
    name: str
    description: Optional[str] = None
    category: str = "All"
    icon: str = "Sword"
    thumbnail: Optional[str] = None
    prompt: str = ""
    color: str = "text-cyan-500"
    border: str = "border-cyan-500/50"
    bg: str = "bg-cyan-500/10"
    shadow: str = "shadow-[0_0_15px_rgba(6,182,212,0.2)]"
    elements: List[str] = []
    vibe: str = "Standard"
    stats: Dict = {}


class TemplateOut(BaseModel):
    """Output descriptor returning full styling template records from database."""
    id: int
    name: str
    description: Optional[str] = None
    category: str
    icon: str
    thumbnail: Optional[str] = None
    prompt: str
    color: str
    border: str
    bg: str
    shadow: str
    elements: List[str]
    vibe: str
    stats: Dict
    created_at: datetime
    is_active: bool
