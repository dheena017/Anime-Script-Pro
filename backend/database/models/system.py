"""
Anime Script Pro — System Configurations & Documentation Models

This module defines SQLModel database tables mapping app support guidelines, FAQ listings,
system configuration variables, user notification records, and user community posts.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Tutorials & Categorization
  4. Core System Alert Models
  5. Help Center & FAQs
  6. Documentation Guidelines Models
  7. screening room & Community Posts
  8. Global Site Configurations
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
# 3. TUTORIALS & CATEGORIZATION
# ==============================================================================

class Category(SQLModel, table=True):
    """Categorization tags mapped to system guides or assets."""
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    color: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Tutorial(SQLModel, table=True):
    """Tutorial guides, text blocks, video URLs, and difficulty levels."""
    __tablename__ = "tutorials"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    icon_name: str
    duration: str
    level: str
    category: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<Tutorial(id={self.id}, title={self.title})>"

    def __str__(self) -> str:
        return self.title

# ==============================================================================
# 4. CORE SYSTEM ALERT MODELS
# ==============================================================================

class Notification(SQLModel, table=True):
    """Encapsulates persistent system alerts, progress notifications, and warnings."""
    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    message: str
    type: str = Field(default="INFO")  # INFO, ALERT, SUCCESS, WARNING
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==============================================================================
# 5. HELP CENTER & FAQS
# ==============================================================================

class SEOEntry(SQLModel, table=True):
    """Auditable search keywords mapped to platform components."""
    __tablename__ = "seo_entries"

    id: Optional[int] = Field(default=None, primary_key=True)
    keyword: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<SEOEntry(id={self.id}, keyword={self.keyword})>"

    def __str__(self) -> str:
        return self.keyword


class HelpCategory(SQLModel, table=True):
    """Categorized slug structures organizing developer support overlays."""
    __tablename__ = "help_categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    label: str
    sub: str
    icon: str
    color: str
    order: int = Field(default=0)


class FAQ(SQLModel, table=True):
    """Preset list of questions and answers mapped to categories."""
    __tablename__ = "faqs"

    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    category_slug: Optional[str] = Field(default=None, index=True)
    is_frequent: bool = Field(default=True)
    order: int = Field(default=0)

# ==============================================================================
# 6. DOCUMENTATION GUIDELINES MODELS
# ==============================================================================

class DocSection(SQLModel, table=True):
    """Groups technical documentation pages under styled navigation sidebars."""
    __tablename__ = "doc_sections"

    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    label: str
    icon: str
    order: int = Field(default=0)


class DocArticle(SQLModel, table=True):
    """Markdown content articles containing system documentation and protocols."""
    __tablename__ = "doc_articles"

    id: Optional[int] = Field(default=None, primary_key=True)
    section_slug: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    title: str
    content: str  # Markdown text
    protocol_id: Optional[str] = None
    order: int = Field(default=0)
    article_metadata: Dict = Field(sa_column=Column(JSON), default_factory=dict)

# ==============================================================================
# 7. SCREENING ROOM & COMMUNITY POSTS
# ==============================================================================

class ScreeningRoomEntry(SQLModel, table=True):
    """Auditing lists mapped to final generated screenplay feedback loops."""
    __tablename__ = "screening_room_entries"

    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

    def __repr__(self) -> str:
        return f"<ScreeningRoomEntry(id={self.id}, script_id={self.script_id})>"

    def __str__(self) -> str:
        return f"ScreeningRoomEntry {self.id}"


class CommunityPost(SQLModel, table=True):
    """Social dashboard posts created by designers sharing blueprints or scripts."""
    __tablename__ = "community_posts"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    content: str
    project_id: Optional[int] = Field(default=None, foreign_key="projects.id")
    script_id: Optional[int] = Field(default=None, foreign_key="scripts.id")
    likes: int = Field(default=0)
    views: int = Field(default=0)
    tags: List[str] = Field(sa_column=Column(JSON), default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

# ==============================================================================
# 8. GLOBAL SITE CONFIGURATIONS
# ==============================================================================

class SiteConfig(SQLModel, table=True):
    """JSON key-value configuration overrides for application constants."""
    __tablename__ = "site_config"

    key: str = Field(primary_key=True)
    value: Dict = Field(sa_column=Column(JSON))
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
