import os
from typing import AsyncGenerator

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from loguru import logger

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/database/anime_script_pro.db")

# Calculate async DB URL
ASYNC_DB_URL = DATABASE_URL
if ASYNC_DB_URL.startswith("sqlite:///"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif ASYNC_DB_URL.startswith("postgresql://"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("postgresql://", "postgresql+asyncpg://")

# Create asynchronous engine
async_engine = create_async_engine(ASYNC_DB_URL, echo=False)

# Create async session factory with expire_on_commit disabled to avoid async instance reloads
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        logger.debug("DATABASE: New async session initialized.")
        yield session
