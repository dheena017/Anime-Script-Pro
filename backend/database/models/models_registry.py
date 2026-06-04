"""
Anime Script Pro — AI Model Registry

Tracks the curated registry of available AI models across all providers,
including their display metadata, feature flags, and availability status.
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Dict, List, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from sqlmodel import Column, Field, JSON, SQLModel


# ==============================================================================
# 3. AI MODEL REGISTRY TABLE
# ==============================================================================

class AIModelRegistry(SQLModel, table=True):
    """
    Curated registry of AI models available across all configured providers.

    Stores display metadata, capability tags, context window sizes, and
    availability flags so the frontend can render accurate model selectors
    without hard-coding provider lists.
    """
    __tablename__ = "ai_model_registry"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Identity
    model_id: str = Field(unique=True, index=True, description="Provider model identifier, e.g. 'gpt-4o'")
    provider: str = Field(index=True, description="Provider slug: openai | anthropic | gemini | groq")
    display_name: str = Field(description="Human-readable name shown in the UI")

    # Capability metadata
    context_window: Optional[int] = Field(default=None, description="Max context window in tokens")
    max_output_tokens: Optional[int] = Field(default=None, description="Max output tokens")
    capabilities: List[str] = Field(
        sa_column=Column(JSON),
        default_factory=list,
        description="Feature tags, e.g. ['vision', 'function-calling', 'streaming']"
    )

    # Availability
    is_active: bool = Field(default=True, description="Whether this model is currently enabled")
    is_free: bool = Field(default=False, description="Whether this model is available on free tier")
    is_default: bool = Field(default=False, description="Whether this is the default model for its provider")

    # Pricing
    cost_per_1k_input_tokens: float = Field(default=0.0)
    cost_per_1k_output_tokens: float = Field(default=0.0)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
