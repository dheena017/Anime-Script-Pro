"""
Anime Script Pro — AI Engine Configuration & Telemetry Models

This module defines SQLModel database tables mapping global AI provider parameters,
real-time generation telemetry records, and individual model provider capability lists.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Core Engine Config蓝图
  5. Telemetry Tracking Records
  6. AI Providers & Model Blueprints
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Dict, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from sqlmodel import Column, Field, JSON, SQLModel

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.lib.defaults import (
    DEFAULT_AUDIENCE,
    DEFAULT_MAX_TOKENS,
    DEFAULT_SCRIPT_MODEL,
    DEFAULT_TEMPERATURE,
    DEFAULT_TONE,
    DEFAULT_TOP_K,
    DEFAULT_TOP_P,
)

# ==============================================================================
# 4. CORE ENGINE CONFIG
# ==============================================================================

class EngineConfig(SQLModel, table=True):
    """Stores user-specific global generation settings and hyperparameters."""
    __tablename__ = "engine_configs"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, unique=True)
    selected_model: str = Field(default=DEFAULT_SCRIPT_MODEL)
    temperature: float = Field(default=DEFAULT_TEMPERATURE)
    max_tokens: int = Field(default=DEFAULT_MAX_TOKENS)
    top_p: float = Field(default=DEFAULT_TOP_P)
    top_k: int = Field(default=DEFAULT_TOP_K)
    vibe: str = Field(default=DEFAULT_TONE)
    audience: str = Field(default=DEFAULT_AUDIENCE)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. TELEMETRY TRACKING RECORDS
# ==============================================================================

class AITelemetry(SQLModel, table=True):
    """Tracks latency metrics, API routing fallbacks, and execution success bounds."""
    __tablename__ = "ai_telemetry"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(default=None, index=True)
    model: str = Field(index=True)
    latency_ms: float
    status: str = Field(default="SUCCESS")  # SUCCESS, ERROR, FALLBACK
    endpoint: str  # world, cast, script, etc.
    request_summary: Optional[str] = None
    error_message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    extra_metadata: Dict = Field(sa_column=Column(JSON), default_factory=dict)

# ==============================================================================
# 6. AI PROVIDERS & MODEL BLUEPRINTS
# ==============================================================================

class AIModel(SQLModel, table=True):
    """Maintains capability records, provider targets, cost metrics, and pricing boundaries."""
    __tablename__ = "ai_models"

    id: Optional[int] = Field(default=None, primary_key=True)
    model_id: str = Field(unique=True, index=True)
    provider: Optional[str] = None
    display_name: Optional[str] = None
    capabilities: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    is_active: bool = Field(default=True)
    is_free: bool = Field(default=False)
    cost_per_token: float = Field(default=0.0)
