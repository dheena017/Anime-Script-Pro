from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from backend.database import get_async_session, AsyncSession, Tutorial
from backend.database.models import WorldLore, CastManifest, Project
from datetime import datetime
from loguru import logger

router = APIRouter(prefix="/api/diagnostic", tags=["Neural Admin"])

@router.get("/pulse")
async def get_system_pulse(session: AsyncSession = Depends(get_async_session)):
    """Diagnostic endpoint to check the health and scale of the production database."""
    try:
        # Get counts for various entities
        lore_count = (await session.execute(select(func.count(WorldLore.id)))).scalar() or 0
        cast_count = (await session.execute(select(func.count(CastManifest.id)))).scalar() or 0
        project_count = (await session.execute(select(func.count(Project.id)))).scalar() or 0
        tutorial_count = (await session.execute(select(func.count(Tutorial.id)))).scalar() or 0
        
        logger.info("[DIAGNOSTIC] System Pulse check initiated.")
        
        return {
            "status": "online",
            "environment": "development",
            "vitals": {
                "lore_records": lore_count,
                "cast_manifests": cast_count,
                "active_projects": project_count,
                "studio_assets": tutorial_count
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"[DIAGNOSTIC] Pulse check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Neural Engine Pulse Failure: {str(e)}")

@router.get("/db-sync")
async def check_db_sync(session: AsyncSession = Depends(get_async_session)):
    """Verifies that the database is responsive and synchronized."""
    try:
        await session.execute(select(1))
        return {"sync_status": "synchronized", "db_engine": "PostgreSQL (Async)"}
    except Exception as e:
        return {"sync_status": "disconnected", "error": str(e)}
