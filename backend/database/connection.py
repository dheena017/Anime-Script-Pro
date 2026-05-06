import os
from sqlmodel import create_engine, SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession as SQLAlchemyAsyncSession
from typing import AsyncGenerator

from loguru import logger

from sqlalchemy.ext.asyncio import AsyncSession

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/database/anime_script_pro.db")

# Create synchronous engine
engine = create_engine(DATABASE_URL, echo=False)

# Calculate async DB URL
ASYNC_DB_URL = DATABASE_URL
if ASYNC_DB_URL.startswith("sqlite:///"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif ASYNC_DB_URL.startswith("postgresql://"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("postgresql://", "postgresql+asyncpg://")

# Create asynchronous engine
async_engine = create_async_engine(ASYNC_DB_URL, echo=False)

# Use a session factory with expire_on_commit disabled to avoid async instance reloads
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        logger.debug("DATABASE: New async session initialized.")
        yield session
