from fastapi import APIRouter, Depends
from sqlmodel import select
from loguru import logger
from backend.database.models import User
from backend.database import async_session, async_engine

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/users")
async def admin_get_users():
    """Admin-only user listing."""
    logger.info("NEURAL SIGNAL: Accessing specialized user directory via Admin Protocol.")
    async with async_session() as session:
        statement = select(User)
        results = await session.execute(statement)
        return results.scalars().all()
