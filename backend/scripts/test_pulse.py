import asyncio
import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database import async_engine, async_session
from backend.database.models import WorldLore, CastManifest, Project, Tutorial
from sqlalchemy import select, func
from loguru import logger

async def run_pulse():
    logger.info("📡 SIGNAL: Initiating Neural Pulse Test...")
    try:
        async with async_session() as session:
            # Test 1: Database Handshake
            await session.execute(select(1))
            logger.success("DATABASE: Handshake successful.")

            # Test 2: Entity Counts
            lore_count = (await session.execute(select(func.count(WorldLore.id)))).scalar() or 0
            cast_count = (await session.execute(select(func.count(CastManifest.id)))).scalar() or 0
            project_count = (await session.execute(select(func.count(Project.id)))).scalar() or 0
            tutorial_count = (await session.execute(select(func.count(Tutorial.id)))).scalar() or 0

            logger.info(f"VITALS: Lore Records     | {lore_count}")
            logger.info(f"VITALS: Cast Manifests   | {cast_count}")
            logger.info(f"VITALS: Active Projects  | {project_count}")
            logger.info(f"VITALS: Studio Assets    | {tutorial_count}")

            logger.success("🚀 PULSE TEST COMPLETE: All systems are synchronized.")
    except Exception as e:
        logger.error(f"❌ PULSE TEST FAILED: {str(e)}")

if __name__ == "__main__":
    asyncio.run(run_pulse())
