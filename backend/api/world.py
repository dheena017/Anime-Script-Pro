"""
Anime Script Pro - World Lore Router

This router manages all world-building lore modules (Manifest, History, Factions, Powers,
Architecture, Atlas, Culture, Systems), providing get/update endpoints per module and
AI-powered generation for each domain.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Router Initialization and Constants
  5. Module-Level Utility Helpers
  6. Database Lore Helpers
  7. Lore Module CRUD Endpoints
  8. AI Lore Generation Logic and Endpoints
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime
from typing import Any, Dict, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import APIRouter, Depends, Header, HTTPException, Query
from loguru import logger
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.ai_engine import generate_ai_text
from backend.database import get_async_session, AsyncSession
from backend.database.models import Project
from backend.database.models.world import WorldLore
from backend.lib.defaults import DEFAULT_SCRIPT_MODEL
from backend.utils.deps import get_auth_user_id

# ==============================================================================
# 4. ROUTER INITIALIZATION AND CONSTANTS
# ==============================================================================
router = APIRouter(prefix="/api/world", tags=["World Lore"])

FIELD_ALIASES = {
    "manifest_blob": "full_lore_blob",
}

PROMPTS: Dict[str, str] = {
    "history": "Develop a comprehensive historical timeline and lore expansion. Establish the history and eras that led to the world described in the context.",
    "factions": "Develop a detailed faction and political system. Create factions, ideologies, and political tensions that feel like a natural consequence of the world.",
    "powers": "Develop a detailed power system. Design the power mechanics so they align perfectly with the established world context. Focus on mechanics, tiers, and limitations.",
    "architecture": "Develop a visual architectural style. Design the architectural and visual language of this world.",
    "atlas": "Develop a geographical atlas and climate system. Map out the physical geography and environmental logic.",
    "culture": "Develop a cultural profile and societal ethos. Design the rituals, daily life, and social hierarchies.",
    "systems": "Develop world systems, technology, and ecosystem. Architect the mechanical logic and technological infrastructure."
}

FIELD_MAP: Dict[str, tuple] = {
    "history": ("history_blob", "prompt_history"),
    "factions": ("factions_blob", "prompt_factions"),
    "powers": ("powers_blob", "prompt_powers"),
    "architecture": ("architecture_blob", "prompt_architecture"),
    "atlas": ("atlas_blob", "prompt_atlas"),
    "culture": ("culture_blob", "prompt_culture"),
    "systems": ("systems_blob", "prompt_systems")
}

# ==============================================================================
# 5. MODULE-LEVEL UTILITY HELPERS
# ==============================================================================

def wrap_response(data: Any, message: str = "Success") -> Dict[str, Any]:
    """Wrap a data payload in a standardised neural response envelope.

    Args:
        data: The core data to wrap.
        message: The status message string.

    Returns:
        dict: Envelope containing status, message, timestamp, and data.
    """
    return {
        "status": "success",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    }


def ensure_authorized(user_id: str, auth_user_id: str) -> None:
    """Assert that the path user ID matches the authenticated user ID.

    Args:
        user_id: The path user ID parameter.
        auth_user_id: The authenticated user ID from the JWT.

    Raises:
        HTTPException(403): If IDs do not match.
    """
    if user_id != auth_user_id:
        logger.warning(f"[WORLD] Unauthorized access attempt. path_user={user_id}, auth_user={auth_user_id}")
        raise HTTPException(status_code=403, detail="Unauthorized Access")


def get_effective_project_id(
    project_id: Optional[int],
    x_project_id: Optional[int] = None,
    payload: Optional[dict] = None,
) -> Optional[int]:
    """Resolve the effective project ID from multiple possible sources.

    Args:
        project_id: Query parameter project_id.
        x_project_id: Header X-Project-Id value.
        payload: Request body dict potentially containing project_id.

    Returns:
        Optional[int]: First non-null project ID found.
    """
    payload_project_id = payload.get("project_id") if isinstance(payload, dict) else None
    return project_id or x_project_id or payload_project_id


def validate_update_payload(payload: dict) -> None:
    """Validate a lore update payload ensuring correct structure.

    Args:
        payload: The raw update dict from the request body.

    Raises:
        HTTPException(422): If payload is not a dict.
        HTTPException(400): If unknown keys present or required keys missing.
    """
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Payload must be a JSON object")

    allowed_keys = {"content", "prompt", "project_id"}
    unknown_keys = sorted(set(payload.keys()) - allowed_keys)
    if unknown_keys:
        raise HTTPException(status_code=400, detail=f"Unknown payload keys: {', '.join(unknown_keys)}")

    if "content" not in payload and "prompt" not in payload:
        raise HTTPException(status_code=400, detail="Payload must include at least one of: content, prompt")


def serialize_lore(db_lore: WorldLore) -> Dict[str, Any]:
    """Serialize a WorldLore ORM model to a dict with field aliases applied.

    Args:
        db_lore: The WorldLore database instance.

    Returns:
        dict: The serialized lore data with aliases applied.
    """
    data = db_lore.model_dump()
    data["manifest_blob"] = data.get("full_lore_blob")
    return data

# ==============================================================================
# 6. DATABASE LORE HELPERS
# ==============================================================================

async def resolve_lore(session: AsyncSession, user_id: str, project_id: Optional[int]) -> WorldLore:
    """Finds existing lore or initializes a fresh record with defaults.

    Args:
        session: The active database session.
        user_id: The user ID.
        project_id: The project ID to scope lore lookup.

    Returns:
        WorldLore: Existing or newly created WorldLore instance.
    """
    statement = select(WorldLore).where(WorldLore.user_id == user_id)
    if project_id:
        statement = statement.where(WorldLore.project_id == project_id)

    result = await session.execute(statement)
    db_lore = result.scalars().first()

    if not db_lore:
        logger.info(f"[WORLD] Initializing fresh lore record for user: {user_id}")
        db_lore = WorldLore(user_id=user_id, project_id=project_id)
        session.add(db_lore)
        await session.flush()  # Ensure ID is generated

    return db_lore


async def safe_get_lore(
    user_id: str,
    project_id: Optional[int],
    session: AsyncSession,
    section: str,
) -> WorldLore:
    """Safely retrieve lore section with full database error handling.

    Args:
        user_id: The user ID.
        project_id: The project scope.
        session: The active database session.
        section: Human-readable section name for logging.

    Returns:
        WorldLore: The resolved lore instance.

    Raises:
        HTTPException(500): On database or unexpected errors.
    """
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
    x_project_id: Optional[int] = None,
) -> WorldLore:
    """Safely write a lore section update with full database error handling.

    Args:
        user_id: The user ID.
        payload: The validated payload containing content and/or prompt.
        project_id: The project scope.
        session: The active database session.
        section: Human-readable section name for logging.
        content_field: The DB column name for content.
        prompt_field: The DB column name for the prompt.
        x_project_id: Optional project ID from the request header.

    Returns:
        WorldLore: The updated WorldLore instance.

    Raises:
        HTTPException(500): On database or unexpected errors.
    """
    try:
        validate_update_payload(payload)
        effective_project_id = get_effective_project_id(project_id, x_project_id, payload)
        db_lore = await resolve_lore(session, user_id, effective_project_id)
        resolved_content_field = FIELD_ALIASES.get(content_field, content_field)

        if "content" in payload:
            setattr(db_lore, resolved_content_field, payload["content"])
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

# ==============================================================================
# 7. LORE MODULE CRUD ENDPOINTS
# ==============================================================================

@router.get("/manifest/{user_id}")
async def get_manifest(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the full world manifest lore blob for a user and project."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Manifest")
    return wrap_response(serialize_lore(db_lore))


@router.post("/manifest/{user_id}")
async def update_manifest(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the world manifest lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Manifest", "manifest_blob", "prompt_lore", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Manifest Updated")


@router.get("/history/{user_id}")
async def get_history(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the historical timeline lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "History")
    return wrap_response(serialize_lore(db_lore))


@router.post("/history/{user_id}")
async def update_history(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the world history lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "History", "history_blob", "prompt_history", x_project_id)
    return wrap_response(serialize_lore(db_lore), "History Updated")


@router.get("/factions/{user_id}")
async def get_factions(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the factions and political system lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Factions")
    return wrap_response(serialize_lore(db_lore))


@router.post("/factions/{user_id}")
async def update_factions(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the factions lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Factions", "factions_blob", "prompt_factions", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Factions Updated")


@router.get("/powers/{user_id}")
async def get_powers(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the power system lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Powers")
    return wrap_response(serialize_lore(db_lore))


@router.post("/powers/{user_id}")
async def update_powers(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the power system lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Powers", "powers_blob", "prompt_powers", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Powers Updated")


@router.get("/architecture/{user_id}")
async def get_architecture(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the visual architectural lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Architecture")
    return wrap_response(serialize_lore(db_lore))


@router.post("/architecture/{user_id}")
async def update_architecture(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the architectural lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Architecture", "architecture_blob", "prompt_architecture", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Architecture Updated")


@router.get("/atlas/{user_id}")
async def get_atlas(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the geographical atlas lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Atlas")
    return wrap_response(serialize_lore(db_lore))


@router.post("/atlas/{user_id}")
async def update_atlas(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the atlas lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Atlas", "atlas_blob", "prompt_atlas", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Atlas Updated")


@router.get("/culture/{user_id}")
async def get_culture(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the cultural profile lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Culture")
    return wrap_response(serialize_lore(db_lore))


@router.post("/culture/{user_id}")
async def update_culture(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the culture lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Culture", "culture_blob", "prompt_culture", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Culture Updated")


@router.get("/systems/{user_id}")
async def get_systems(
    user_id: str,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Retrieve the world systems and technology lore blob."""
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Systems")
    return wrap_response(serialize_lore(db_lore))


@router.post("/systems/{user_id}")
async def update_systems(
    user_id: str,
    payload: dict,
    project_id: Optional[int] = None,
    x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
):
    """Update the systems lore blob."""
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Systems", "systems_blob", "prompt_systems", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Systems Updated")

# ==============================================================================
# 8. AI LORE GENERATION LOGIC AND ENDPOINTS
# ==============================================================================

async def generate_modular_lore(
    module: str,
    user_id: str,
    project_id: int,
    session: AsyncSession,
) -> str:
    """Run AI synthesis for a specific lore module and persist results to the database.

    Args:
        module: One of the recognized lore module keys (e.g. "history", "factions").
        user_id: The user ID.
        project_id: The target project ID.
        session: The active database session.

    Returns:
        str: AI-generated lore content string.

    Raises:
        HTTPException(400): If module is not recognized.
        HTTPException(404): If project is not found or unauthorized.
        HTTPException(500): If AI synthesis fails.
    """
    if module not in PROMPTS:
        raise HTTPException(status_code=400, detail=f"Invalid module: {module}")

    project = await session.get(Project, project_id)
    if not project or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")

    db_lore = await resolve_lore(session, user_id, project_id)
    world_context = db_lore.full_lore_blob or getattr(db_lore, "manifest_blob", None) or "No established world manifest yet."

    system_instruction = f"You are a master world builder for {project.content_type or 'Anime'} projects. Your task is to generate {module.capitalize()}."
    user_prompt = f"""
    CORE STORY SEED: {project.prompt}

    WORLD CONTEXT (MANIFEST):
    {world_context}

    TASK: {PROMPTS[module]}
    """

    try:
        content = await generate_ai_text(
            model=project.model_used or DEFAULT_SCRIPT_MODEL,
            prompt=user_prompt,
            system_instruction=system_instruction,
            user_id=user_id
        )

        content_field, prompt_field = FIELD_MAP[module]
        setattr(db_lore, content_field, content)
        setattr(db_lore, prompt_field, PROMPTS[module])
        db_lore.updated_at = datetime.utcnow()
        await session.commit()

        return content
    except Exception as e:
        logger.error(f"[WORLD] Generation failed for {module}: {e}")
        raise HTTPException(status_code=500, detail=f"Neural synthesis failed: {str(e)}")


@router.post("/{module}/generate/{user_id}")
async def generate_endpoint(
    module: str,
    user_id: str,
    project_id: Optional[int] = Query(None),
    session: AsyncSession = Depends(get_async_session),
    auth_user_id: str = Depends(get_auth_user_id),
) -> Dict[str, Any]:
    """Dispatch AI generation for any lore module by name.

    Args:
        module: The lore module name (e.g. "history", "atlas").
        user_id: The user path ID.
        project_id: Required project scope for generation.
        session: Database session.
        auth_user_id: Authenticated user from JWT.

    Returns:
        dict: Neural response envelope containing generated content.

    Raises:
        HTTPException(400): If project_id is not provided.
    """
    ensure_authorized(user_id, auth_user_id)
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required for generation")

    content = await generate_modular_lore(module, user_id, project_id, session)
    return wrap_response({"content": content}, f"{module.capitalize()} Generated")
