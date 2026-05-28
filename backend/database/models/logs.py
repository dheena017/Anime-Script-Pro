"""
Anime Script Pro — System & Generation Logging Models

This module defines SQLModel database tables mapping raw system exceptions and audited
LLM generation transaction records.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. System Logging Blueprints
  4. Generation Logging Blueprints
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from sqlmodel import Field, SQLModel

# ==============================================================================
# 3. SYSTEM LOGGING BLUEPRINTS
# ==============================================================================

class SystemLog(SQLModel, table=True):
    """Tracks low-level framework exception stacks and server warnings."""
    __tablename__ = "system_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str
    message: str
    level: str = "INFO"  # INFO, WARNING, ERROR, CRITICAL

# ==============================================================================
# 4. GENERATION LOGGING BLUEPRINTS
# ==============================================================================

class GenerationLog(SQLModel, table=True):
    """Detailed audit logs for character, script, and image generation events."""
    __tablename__ = "generation_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(default=None, index=True)
    project_id: Optional[int] = Field(default=None, index=True)
    module: Optional[str] = None
    status: Optional[str] = None
    model_used: Optional[str] = None
    prompt: Optional[str] = None
    response: Optional[str] = None
    latency_ms: Optional[int] = None
    token_usage: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
