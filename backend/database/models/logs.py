from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class SystemLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source: str
    message: str
    level: str = "INFO" # INFO, WARNING, ERROR, CRITICAL

class GenerationLog(SQLModel, table=True):
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
