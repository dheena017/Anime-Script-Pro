from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class EpisodeCreate(BaseModel):
    title: str
    episode_number: int
    hook: Optional[str] = None
    summary: Optional[str] = None

class GenerationRequest(BaseModel):
    model: str
    prompt: str
    systemInstruction: Optional[str] = None

class GenerationResponse(BaseModel):
    text: str
    model_used: Optional[str] = None
    usage: Optional[Dict] = None
    latency_ms: Optional[float] = None
    fallbacks: Optional[List[str]] = None

class CinematicShot(BaseModel):
    id: str
    type: str
    action: str

class VocalProfile(BaseModel):
    name: str
    levels: int

class AnalysisRequest(BaseModel):
    script: str
    model: str = "gemini-2.5-flash"

class AnalysisResponse(BaseModel):
    shot_list: List[CinematicShot]
    lenses: List[str]
    energy_levels: List[float]
    tension_score: int
    vocal_profiles: List[VocalProfile]
    bgm_track: str


class TemplateIn(BaseModel):
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
