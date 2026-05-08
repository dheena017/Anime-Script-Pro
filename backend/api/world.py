from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from backend.database import get_async_session, AsyncSession
from backend.database.models.world import WorldLore
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional, Any
from loguru import logger

router = APIRouter(prefix="/api/world", tags=["World Lore"])

# --- Neural Response Wrapper ---
def wrap_response(data: Any, message: str = "Success"):
    return {
        "status": "success",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }


def ensure_authorized(user_id: str, auth_user_id: str) -> None:
    if user_id != auth_user_id:
        logger.warning(f"[WORLD] Unauthorized access attempt. path_user={user_id}, auth_user={auth_user_id}")
        raise HTTPException(status_code=403, detail="Unauthorized Access")


def get_effective_project_id(project_id: Optional[int], payload: Optional[dict] = None) -> Optional[int]:
    payload_project_id = payload.get("project_id") if isinstance(payload, dict) else None
    return project_id or payload_project_id


def validate_update_payload(payload: dict) -> None:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Payload must be a JSON object")

    allowed_keys = {"content", "prompt", "project_id"}
    unknown_keys = sorted(set(payload.keys()) - allowed_keys)
    if unknown_keys:
        raise HTTPException(status_code=400, detail=f"Unknown payload keys: {', '.join(unknown_keys)}")

    if "content" not in payload and "prompt" not in payload:
        raise HTTPException(status_code=400, detail="Payload must include at least one of: content, prompt")


# --- Helper: Universal Lore Resolver ---
async def resolve_lore(session: AsyncSession, user_id: str, project_id: Optional[int]) -> WorldLore:
    """Finds existing lore or initializes a fresh record with defaults."""
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)
    
    result = await session.execute(statement)
    db_lore = result.scalars().first()
    
    if not db_lore:
        logger.info(f"[WORLD] Initializing fresh lore record for user: {user_id}")
        db_lore = WorldLore(user_id=user_id, project_id=project_id)
        session.add(db_lore)
        await session.flush() # Ensure ID is generated
    
    return db_lore


async def safe_get_lore(user_id: str, project_id: Optional[int], session: AsyncSession, section: str) -> WorldLore:
    try:
        db_lore = await resolve_lore(session, user_id, project_id)
        logger.info(f"[WORLD] {section} retrieved for user={user_id}, project={project_id}")
        return db_lore
    except SQLAlchemyError as db_err:
        logger.exception(f"[WORLD] DB error while getting {section} for user={user_id}: {db_err}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve {section}") from db_err
    except HTTPException:
        raise
    except Exception as err:
        logger.exception(f"[WORLD] Unexpected error while getting {section} for user={user_id}: {err}")
        raise HTTPException(status_code=500, detail=f"Unexpected error while retrieving {section}") from err


async def safe_update_lore(
    user_id: str,
    payload: dict,
    project_id: Optional[int],
    session: AsyncSession,
    section: str,
    content_field: str,
    prompt_field: str,
) -> WorldLore:
    try:
        validate_update_payload(payload)
        effective_project_id = get_effective_project_id(project_id, payload)
        db_lore = await resolve_lore(session, user_id, effective_project_id)

        if "content" in payload:
            setattr(db_lore, content_field, payload["content"])
        if "prompt" in payload:
            setattr(db_lore, prompt_field, payload["prompt"])

        db_lore.updated_at = datetime.utcnow()
        await session.commit()
        logger.success(f"[WORLD] {section} synchronized for user={user_id}, project={effective_project_id}")
        return db_lore
    except HTTPException:
        raise
    except SQLAlchemyError as db_err:
        await session.rollback()
        logger.exception(f"[WORLD] DB error while updating {section} for user={user_id}: {db_err}")
        raise HTTPException(status_code=500, detail=f"Failed to update {section}") from db_err
    except Exception as err:
        await session.rollback()
        logger.exception(f"[WORLD] Unexpected error while updating {section} for user={user_id}: {err}")
        raise HTTPException(status_code=500, detail=f"Unexpected error while updating {section}") from err

# --- 1. Manifest ---
@router.get("/manifest/{user_id}")
async def get_manifest(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Manifest")
    return wrap_response(db_lore)

@router.post("/manifest/{user_id}")
async def update_manifest(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Manifest", "manifest_blob", "prompt_history")
    return wrap_response(db_lore, "Manifest Updated")

# --- 2. History ---
@router.get("/history/{user_id}")
async def get_history(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "History")
    return wrap_response(db_lore)

@router.post("/history/{user_id}")
async def update_history(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "History", "history_blob", "prompt_history")
    return wrap_response(db_lore, "History Updated")

# --- 3. Factions ---
@router.get("/factions/{user_id}")
async def get_factions(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Factions")
    return wrap_response(db_lore)

@router.post("/factions/{user_id}")
async def update_factions(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Factions", "factions_blob", "prompt_factions")
    return wrap_response(db_lore, "Factions Updated")

# --- 4. Powers ---
@router.get("/powers/{user_id}")
async def get_powers(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Powers")
    return wrap_response(db_lore)

@router.post("/powers/{user_id}")
async def update_powers(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Powers", "powers_blob", "prompt_powers")
    return wrap_response(db_lore, "Powers Updated")

# --- 5. Architecture ---
@router.get("/architecture/{user_id}")
async def get_architecture(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Architecture")
    return wrap_response(db_lore)

@router.post("/architecture/{user_id}")
async def update_architecture(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Architecture", "architecture_blob", "prompt_architecture")
    return wrap_response(db_lore, "Architecture Updated")

# --- 6. Atlas ---
@router.get("/atlas/{user_id}")
async def get_atlas(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Atlas")
    return wrap_response(db_lore)

@router.post("/atlas/{user_id}")
async def update_atlas(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Atlas", "atlas_blob", "prompt_atlas")
    return wrap_response(db_lore, "Atlas Updated")

# --- 7. Culture ---
@router.get("/culture/{user_id}")
async def get_culture(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Culture")
    return wrap_response(db_lore)

@router.post("/culture/{user_id}")
async def update_culture(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Culture", "culture_blob", "prompt_culture")
    return wrap_response(db_lore, "Culture Updated")

# --- 8. Systems ---
@router.get("/systems/{user_id}")
async def get_systems(user_id: str, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_get_lore(user_id, project_id, session, "Systems")
    return wrap_response(db_lore)

@router.post("/systems/{user_id}")
async def update_systems(user_id: str, payload: dict, project_id: Optional[int] = None, session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Systems", "systems_blob", "prompt_systems")
    return wrap_response(db_lore, "Systems Updated")
