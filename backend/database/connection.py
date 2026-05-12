import os
import time
from typing import AsyncGenerator

from sqlalchemy import create_engine, event
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

# --- Deep Database Tracing ---
@event.listens_for(async_engine.sync_engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    context._query_start_time = time.perf_counter()

@event.listens_for(async_engine.sync_engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time.perf_counter() - context._query_start_time
    # Truncate long statements for readability
    clean_stmt = " ".join(statement.split())
    if len(clean_stmt) > 80:
        clean_stmt = clean_stmt[:77] + "..."
    logger.debug(f"DATABASE: Query Executed -> {clean_stmt} | Time: {total:.4f}s")

# Create async session factory
async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
