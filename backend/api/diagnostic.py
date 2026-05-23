from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from backend.database import get_async_session, AsyncSession, Tutorial
from backend.database.models import (
    WorldLore, CastManifest, Project, Script, Series, Storyboard, Prompt, SEOEntry, ScreeningRoomEntry
)
from datetime import datetime
from loguru import logger
import psutil
import os

router = APIRouter(prefix="/api/diagnostic", tags=["Neural Admin"])

# Track server start time for real uptime
SERVER_START_TIME = datetime.utcnow()

@router.get("/pulse")
async def get_system_pulse(include_db: bool = False, session: AsyncSession = Depends(get_async_session)):
    """Diagnostic endpoint to check the health and scale of the production database."""
    try:
        # ── DB Record Counts ────────────────────────────────────
        vitals = None
        if include_db:
            lore_count      = (await session.execute(select(func.count(WorldLore.id)))).scalar() or 0
            cast_count      = (await session.execute(select(func.count(CastManifest.id)))).scalar() or 0
            script_count    = (await session.execute(select(func.count(Script.id)))).scalar() or 0
            series_count    = (await session.execute(select(func.count(Series.id)))).scalar() or 0
            storyboard_count= (await session.execute(select(func.count(Storyboard.id)))).scalar() or 0
            project_count   = (await session.execute(select(func.count(Project.id)))).scalar() or 0
            prompt_count    = (await session.execute(select(func.count(Prompt.id)))).scalar() or 0
            seo_count       = (await session.execute(select(func.count(SEOEntry.id)))).scalar() or 0
            screening_count = (await session.execute(select(func.count(ScreeningRoomEntry.id)))).scalar() or 0
            tutorial_count  = (await session.execute(select(func.count(Tutorial.id)))).scalar() or 0

            vitals = {
                "lore_records":      lore_count,
                "cast_manifests":    cast_count,
                "script_count":      script_count,
                "series_count":      series_count,
                "storyboard_count":  storyboard_count,
                "active_projects":   project_count,
                "prompt_count":      prompt_count,
                "seo_count":         seo_count,
                "screening_count":   screening_count,
                "studio_assets":     tutorial_count,
            }
            logger.info("[DIAGNOSTIC] System Pulse check initiated with database metrics.")

        # ── Real System Metrics via psutil ───────────────────────
        proc = psutil.Process(os.getpid())
        cpu_percent   = psutil.cpu_percent(interval=0.1)
        mem           = psutil.virtual_memory()
        proc_mem_mb   = round(proc.memory_info().rss / 1024 / 1024, 1)
        proc_threads  = proc.num_threads()

        # CPU core temp (supported on Linux; None on Windows usually)
        sys_temp_c = None
        try:
            temps = psutil.sensors_temperatures()
            if temps:
                first_key = next(iter(temps))
                sys_temp_c = round(temps[first_key][0].current, 1)
        except Exception:
            pass

        # ── Server Uptime ────────────────────────────────────────
        uptime_seconds = int((datetime.utcnow() - SERVER_START_TIME).total_seconds())
        uptime_h = uptime_seconds // 3600
        uptime_m = (uptime_seconds % 3600) // 60
        uptime_s = uptime_seconds % 60

        return {
            "status": "online",
            "environment": "development",
            "vitals": vitals,
            "system": {
                "cpu_percent":       cpu_percent,
                "ram_percent":       mem.percent,
                "ram_used_gb":       round(mem.used / 1024**3, 2),
                "ram_total_gb":      round(mem.total / 1024**3, 2),
                "process_mem_mb":    proc_mem_mb,
                "process_threads":   proc_threads,
                "cpu_core_count":    psutil.cpu_count(),
                "sys_temp_c":        sys_temp_c,
                "uptime_seconds":    uptime_seconds,
                "uptime_formatted":  f"{uptime_h:02d}:{uptime_m:02d}:{uptime_s:02d}",
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        if include_db:
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


@router.post("/seed/{subsystem}")
async def seed_subsystem(subsystem: str, session: AsyncSession = Depends(get_async_session)):
    """Seed a specific subsystem with a test record."""
    try:
        if subsystem == "lore":
            session.add(WorldLore(module="Manifest", title="Galactic Empire Chronicles", content="Historical context.", status="Active"))
        elif subsystem == "cast":
            session.add(CastManifest(name="Aria Vance", role="Protagonist", status="Synchronized"))
        elif subsystem == "script":
            session.add(Script(title="Episode 1: The Spark", content="[SCENE 1] Space. Stars count..."))
        elif subsystem == "series":
            session.add(Series(user_id="anonymous", title="Stellar Frontier", summary="Sci-fi space opera."))
        elif subsystem == "assets":
            session.add(Tutorial(title="Dynamic Template Engine", description="Holographic node guide", icon_name="Cpu", duration="05:00", level="Beginner", category="Standard"))
        elif subsystem in ("storyboard", "screening"):
            existing = (await session.execute(select(Script))).first()
            if not existing:
                dummy = Script(title="Dummy Script", content="content")
                session.add(dummy)
                await session.flush()
                sid = dummy.id
            else:
                sid = existing[0].id
            if subsystem == "storyboard":
                session.add(Storyboard(script_id=sid, image_url="/static/images/mock.png", description="Motion blueprint"))
            else:
                session.add(ScreeningRoomEntry(script_id=sid, feedback="Excellent neural synthesis pacing."))
        elif subsystem == "prompts":
            session.add(Prompt(text="Generate highly aesthetic neon cyberpunk background"))
        elif subsystem == "seo":
            session.add(SEOEntry(keyword="Anime Script Pro SEO", description="Holographic SEO entry plan"))
        else:
            return {"success": False, "message": "Unknown subsystem."}
        await session.commit()
        return {"success": True, "message": f"{subsystem.title()} seeded successfully."}
    except Exception as e:
        logger.error(f"[DIAGNOSTIC] Seeding failed for {subsystem}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/security")
async def get_security_status():
    """Returns real security layer statuses by inspecting actual app configuration."""
    import os
    env = os.environ.get("ENV", os.environ.get("ENVIRONMENT", "development")).lower()
    cors_origins = os.environ.get("CORS_ORIGINS", "*")
    secret_key = os.environ.get("SECRET_KEY", "")
    supabase_url = os.environ.get("VITE_SUPABASE_URL", "")
    db_url = os.environ.get("DATABASE_URL", os.environ.get("ASYNC_DATABASE_URL", ""))

    # Auth Layer: real if SECRET_KEY is set and non-trivial
    auth_active = len(secret_key) > 16

    # Rate limiter: slowapi is always active (it's mounted unconditionally in fastapi_app.py)
    rate_limiter_active = True

    # CORS: check if wildcard origins are used (dev mode) vs. restricted
    cors_is_open = cors_origins.strip() == "*"

    # DB ORM Guard: SQLModel/SQLAlchemy ORM is always active when DB URL is present
    db_orm_active = len(db_url) > 0

    return {
        "auth_layer": {
            "active": auth_active,
            "label": "JWT Active" if auth_active else "No Secret Key",
            "mode": "active" if auth_active else "warning"
        },
        "rate_limiter": {
            "active": rate_limiter_active,
            "label": "SlowAPI Active",
            "mode": "active"
        },
        "cors_policy": {
            "active": True,
            "label": "Open (Dev)" if cors_is_open else "Restricted",
            "mode": "dev" if cors_is_open else "active"
        },
        "db_orm_guard": {
            "active": db_orm_active,
            "label": "SQLModel ORM" if db_orm_active else "No DB URL",
            "mode": "active" if db_orm_active else "warning"
        },
        "environment": {
            "active": True,
            "label": env.upper(),
            "mode": "dev" if env == "development" else "active"
        }
    }
