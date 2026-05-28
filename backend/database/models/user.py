"""
Anime Script Pro — User Profile & Settings Models

This module defines SQLModel database tables mapping user login accounts, user profiles,
virtual credit ledger balances, workspace settings, and todo lists.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Declarative SQLAlchemy Base
  4. Core User Login Account models
  5. User Profile & credit Balance models
  6. User Studio settings models
  7. user Todo checklists
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Dict, Optional
import uuid

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, declarative_base, mapped_column
from sqlmodel import Column, Field, JSON, SQLModel

# ==============================================================================
# 3. DECLARATIVE SQLALCHEMY BASE
# ==============================================================================
Base = declarative_base(metadata=SQLModel.metadata)

# ==============================================================================
# 4. CORE USER LOGIN ACCOUNT MODELS
# ==============================================================================

class User(SQLAlchemyBaseUserTable[str], Base):
    """Core FastAPI-Users security login account model holding authentication flags."""
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[Optional[str]] = mapped_column(nullable=True)
    failed_login_attempts: Mapped[int] = mapped_column(default=0, nullable=False)
    locked_until: Mapped[Optional[datetime]] = mapped_column(nullable=True)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"

# ==============================================================================
# 5. USER PROFILE & CREDIT BALANCE MODELS
# ==============================================================================

class UserProfile(SQLModel, table=True):
    """Stores user display handle, avatar URL links, bios, and join dates."""
    __tablename__ = "user_profiles"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    display_name: str = Field(default="SHOGUN ARCHITECT")
    handle: str = Field(unique=True, index=True)
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    bio: Optional[str] = None
    join_date: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserBalance(SQLModel, table=True):
    """Tracks virtual credit balance ledger, experience points, and membership levels."""
    __tablename__ = "user_balances"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    credits: int = Field(default=5000)
    current_tier: str = Field(default="MASTER ARCHITECT")
    level: int = Field(default=1)
    experience: int = Field(default=0)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 6. USER STUDIO SETTINGS MODELS
# ==============================================================================

class UserSettings(SQLModel, table=True):
    """Complex settings configurations (billing, preferred model presets, studio UI overrides)."""
    __tablename__ = "user_settings"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    profile: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    security: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    notifications: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    ai_models: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    studio_defaults: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    storage: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    billing: Dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<UserSettings(id={self.id}, user_id={self.user_id})>"

    def __str__(self) -> str:
        return self.user_id

# ==============================================================================
# 7. USER TODO CHECKLISTS
# ==============================================================================

class Todo(SQLModel, table=True):
    """A developer checklist item tracked on the studio workspace dashboard."""
    __tablename__ = "todos"
    __table_args__ = (UniqueConstraint("user_id", "text", name="uq_todo_user_text"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    text: str
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
