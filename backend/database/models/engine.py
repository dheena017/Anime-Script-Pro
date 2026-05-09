from typing import Optional, Dict
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON

class EngineConfig(SQLModel, table=True):
    __tablename__ = "engine_configs"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    selected_model: str = Field(default="gemini-1.5-flash-latest")
    temperature: float = Field(default=0.85)
    max_tokens: int = Field(default=2048)
    top_p: float = Field(default=0.95)
    top_k: int = Field(default=40)
    vibe: str = Field(default="Hype/Energetic")
    audience: str = Field(default="General Fans")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AITelemetry(SQLModel, table=True):
    __tablename__ = "ai_telemetry"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(default=None, index=True)
    model: str = Field(index=True)
    latency_ms: float
    status: str = Field(default="SUCCESS") # SUCCESS, ERROR, FALLBACK
    endpoint: str # world, cast, script, etc.
    request_summary: Optional[str] = None
    error_message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    extra_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

class AIModel(SQLModel, table=True):
    __tablename__ = "ai_models"
    id: Optional[int] = Field(default=None, primary_key=True)
    model_id: str = Field(unique=True, index=True)
    provider: Optional[str] = None
    display_name: Optional[str] = None
    capabilities: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    is_active: bool = Field(default=True)
    cost_per_token: float = Field(default=0.0)
