from typing import Optional, List, Dict
from datetime import datetime
from sqlmodel import SQLModel, Field, Column, JSON

class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    color: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Tutorial(SQLModel, table=True):
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
    def __repr__(self):
        return f"<Tutorial(id={self.id}, title={self.title})>"
    def __str__(self):
        return self.title

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    message: str
    type: str = Field(default="INFO") # INFO, ALERT, SUCCESS, WARNING
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SEOEntry(SQLModel, table=True):
    __tablename__ = "seo_entries"
    id: Optional[int] = Field(default=None, primary_key=True)
    keyword: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<SEOEntry(id={self.id}, keyword={self.keyword})>"
    def __str__(self):
        return self.keyword

class HelpCategory(SQLModel, table=True):
    __tablename__ = "help_categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    label: str
    sub: str
    icon: str
    color: str
    order: int = Field(default=0)

class FAQ(SQLModel, table=True):
    __tablename__ = "faqs"
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    category_slug: Optional[str] = Field(default=None, index=True)
    is_frequent: bool = Field(default=True)
    order: int = Field(default=0)

class DocSection(SQLModel, table=True):
    __tablename__ = "doc_sections"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    label: str
    icon: str
    order: int = Field(default=0)

class DocArticle(SQLModel, table=True):
    __tablename__ = "doc_articles"
    id: Optional[int] = Field(default=None, primary_key=True)
    section_slug: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    title: str
    content: str # Markdown content
    protocol_id: Optional[str] = None
    order: int = Field(default=0)
    article_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))

class ScreeningRoomEntry(SQLModel, table=True):
    __tablename__ = "screening_room_entries"
    id: Optional[int] = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="scripts.id")
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)
    def __repr__(self):
        return f"<ScreeningRoomEntry(id={self.id}, script_id={self.script_id})>"
    def __str__(self):
        return f"ScreeningRoomEntry {self.id}"

class CommunityPost(SQLModel, table=True):
    __tablename__ = "community_posts"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str
    content: str
    project_id: Optional[int] = Field(default=None, foreign_key="projects.id")
    script_id: Optional[int] = Field(default=None, foreign_key="scripts.id")
    likes: int = Field(default=0)
    views: int = Field(default=0)
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True, index=True)

class SiteConfig(SQLModel, table=True):
    __tablename__ = "site_config"
    key: str = Field(primary_key=True)
    value: Dict = Field(sa_column=Column(JSON))
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)
