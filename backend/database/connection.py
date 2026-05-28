"""
Anime Script Pro — Database Engine and Connection Manager

This module initializes the SQLModel and SQLAlchemy asynchronous engines, session factories,
provides active session dependencies, and attaches deep statement cursor execution tracing listeners.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Connection Configuration
  4. Core Database Engines
  5. Statement Telemetry Event Listeners
  6. Session Dependency Generators
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
import os
import time
from typing import Any, AsyncGenerator

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from loguru import logger
from sqlalchemy import create_engine, event
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

# ==============================================================================
# 3. CONNECTION CONFIGURATION
# ==============================================================================
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/database/anime_script_pro.db")

# Calculate async DB URL
ASYNC_DB_URL = DATABASE_URL
if ASYNC_DB_URL.startswith("sqlite:///"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif ASYNC_DB_URL.startswith("postgresql://"):
    ASYNC_DB_URL = ASYNC_DB_URL.replace("postgresql://", "postgresql+asyncpg://")

# ==============================================================================
# 4. CORE DATABASE ENGINES
# ==============================================================================
logger.info(f"DATABASE: Connecting using async schema URI: {ASYNC_DB_URL.split('@')[-1]}")
async_engine = create_async_engine(ASYNC_DB_URL, echo=False)

# ==============================================================================
# 5. STATEMENT TELEMETRY EVENT LISTENERS
# ==============================================================================

@event.listens_for(async_engine.sync_engine, "before_cursor_execute")
def before_cursor_execute(
    conn: Any,
    cursor: Any,
    statement: str,
    parameters: Any,
    context: Any,
    executemany: bool,
) -> None:
    """Store statement execution start epoch timer context.

    Args:
        conn: DB connection mapping.
        cursor: Active db cursor.
        statement: Dispatched raw SQL string.
        parameters: Execution parameters.
        context: Context namespace mapping dict.
        executemany: Execution list indicator flag.
    """
    context._query_start_time = time.perf_counter()


@event.listens_for(async_engine.sync_engine, "after_cursor_execute")
def after_cursor_execute(
    conn: Any,
    cursor: Any,
    statement: str,
    parameters: Any,
    context: Any,
    executemany: bool,
) -> None:
    """Calculate query latency, output to engine logs, and broadcast to telemetry.

    Args:
        conn: DB connection mapping.
        cursor: Active db cursor.
        statement: Dispatched raw SQL string.
        parameters: Execution parameters.
        context: Context namespace mapping dict.
        executemany: Execution list indicator flag.
    """
    total = time.perf_counter() - context._query_start_time
    clean_stmt = " ".join(statement.split())
    if len(clean_stmt) > 80:
        clean_stmt = clean_stmt[:77] + "..."
    logger.debug(f"DATABASE: Query Executed -> {clean_stmt} | Latency: {total:.4f}s")
    
    # Broadcast to Developer Telemetry
    try:
        import asyncio
        from backend.utils.telemetry import telemetry_manager
        loop = asyncio.get_running_loop()
        log_data = {
            "id": f"db-{time.time()}",
            "module": "DATABASE",
            "status": "DEBUG",
            "message": f"SQL -> {clean_stmt}",
            "latency": f"{total:.4f}s",
            "created_at": datetime.now().isoformat()
        }
        loop.create_task(telemetry_manager.broadcast(log_data))
    except (RuntimeError, ImportError):
        pass
    except Exception:
        pass

# ==============================================================================
# 6. SESSION DEPENDENCY GENERATORS
# ==============================================================================

async_session = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency helper yielding thread-scoped async DB session contexts.

    Yields:
        AsyncGenerator[AsyncSession, None]: SQLModel session wrapper instance.
    """
    async with async_session() as session:
        yield session
