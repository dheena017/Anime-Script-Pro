#!/usr/bin/env python3
"""
Quick database migration script to add missing columns
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from backend.database import engine
from backend.database.models import sqlalchemy
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    """Initialize database with current models"""
    async with engine.begin() as conn:
        # Create all tables based on current models
        await conn.run_sync(sqlalchemy.metadata.create_all)
        logger.info("✅ Database tables synced successfully")

if __name__ == "__main__":
    asyncio.run(init_db())
