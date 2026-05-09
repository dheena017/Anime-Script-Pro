from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from backend.database import get_async_session, AsyncSession
from backend.database.models.world import WorldLore
from backend.utils.deps import get_auth_user_id
from datetime import datetime
from typing import Optional, Any, Dict
from loguru import logger
from backend.database.models import Project
from backend.ai_engine import call_ai

router = APIRouter(prefix="/api/world", tags=["World Lore"])

FIELD_ALIASES = {
    "manifest_blob": "full_lore_blob",
}

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


def get_effective_project_id(project_id: Optional[int], x_project_id: Optional[int] = None, payload: Optional[dict] = None) -> Optional[int]:
    payload_project_id = payload.get("project_id") if isinstance(payload, dict) else None
    return project_id or x_project_id or payload_project_id


def validate_update_payload(payload: dict) -> None:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Payload must be a JSON object")

    allowed_keys = {"content", "prompt", "project_id"}
    unknown_keys = sorted(set(payload.keys()) - allowed_keys)
    if unknown_keys:
        raise HTTPException(status_code=400, detail=f"Unknown payload keys: {', '.join(unknown_keys)}")

    if "content" not in payload and "prompt" not in payload:
        raise HTTPException(status_code=400, detail="Payload must include at least one of: content, prompt")


def serialize_lore(db_lore: WorldLore) -> Dict[str, Any]:
    data = db_lore.model_dump()
    data["manifest_blob"] = data.get("full_lore_blob")
    return data


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
    x_project_id: Optional[int] = None,
) -> WorldLore:
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

# --- 1. Manifest ---
@router.get("/manifest/{user_id}")
async def get_manifest(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Manifest")
    return wrap_response(serialize_lore(db_lore))

@router.post("/manifest/{user_id}")
async def update_manifest(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Manifest", "manifest_blob", "prompt_lore", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Manifest Updated")

# --- 2. History ---
@router.get("/history/{user_id}")
async def get_history(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "History")
    return wrap_response(serialize_lore(db_lore))

@router.post("/history/{user_id}")
async def update_history(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "History", "history_blob", "prompt_history", x_project_id)
    return wrap_response(serialize_lore(db_lore), "History Updated")

# --- 3. Factions ---
@router.get("/factions/{user_id}")
async def get_factions(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Factions")
    return wrap_response(serialize_lore(db_lore))

@router.post("/factions/{user_id}")
async def update_factions(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Factions", "factions_blob", "prompt_factions", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Factions Updated")

# --- 4. Powers ---
@router.get("/powers/{user_id}")
async def get_powers(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Powers")
    return wrap_response(serialize_lore(db_lore))

@router.post("/powers/{user_id}")
async def update_powers(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Powers", "powers_blob", "prompt_powers", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Powers Updated")

# --- 5. Architecture ---
@router.get("/architecture/{user_id}")
async def get_architecture(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Architecture")
    return wrap_response(serialize_lore(db_lore))

@router.post("/architecture/{user_id}")
async def update_architecture(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Architecture", "architecture_blob", "prompt_architecture", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Architecture Updated")

# --- 6. Atlas ---
@router.get("/atlas/{user_id}")
async def get_atlas(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Atlas")
    return wrap_response(serialize_lore(db_lore))

@router.post("/atlas/{user_id}")
async def update_atlas(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Atlas", "atlas_blob", "prompt_atlas", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Atlas Updated")

# --- 7. Culture ---
@router.get("/culture/{user_id}")
async def get_culture(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Culture")
    return wrap_response(serialize_lore(db_lore))

@router.post("/culture/{user_id}")
async def update_culture(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Culture", "culture_blob", "prompt_culture", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Culture Updated")

# --- 8. Systems ---
@router.get("/systems/{user_id}")
async def get_systems(user_id: str, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    effective_project_id = get_effective_project_id(project_id, x_project_id)
    db_lore = await safe_get_lore(user_id, effective_project_id, session, "Systems")
    return wrap_response(serialize_lore(db_lore))

@router.post("/systems/{user_id}")
async def update_systems(user_id: str, payload: dict, project_id: Optional[int] = None, x_project_id: Optional[int] = Header(default=None, alias="X-Project-Id"), session: AsyncSession = Depends(get_async_session), auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    db_lore = await safe_update_lore(user_id, payload, project_id, session, "Systems", "systems_blob", "prompt_systems", x_project_id)
    return wrap_response(serialize_lore(db_lore), "Systems Updated")


    
# --- Generation Logic ---
PROMPTS = {
    "history": "Develop a comprehensive historical timeline and lore expansion. Establish the history and eras that led to the world described in the context.",
    "factions": "Develop a detailed faction and political system. Create factions, ideologies, and political tensions that feel like a natural consequence of the world.",
    "powers": "Develop a detailed power system. Design the power mechanics so they align perfectly with the established world context. Focus on mechanics, tiers, and limitations.",
    "architecture": "Develop a visual architectural style. Design the architectural and visual language of this world.",
    "atlas": "Develop a geographical atlas and climate system. Map out the physical geography and environmental logic.",
    "culture": "Develop a cultural profile and societal ethos. Design the rituals, daily life, and social hierarchies.",
    "systems": "Develop world systems, technology, and ecosystem. Architect the mechanical logic and technological infrastructure."
}

FIELD_MAP = {
    "history": ("history_blob", "prompt_history"),
    "factions": ("factions_blob", "prompt_factions"),
    "powers": ("powers_blob", "prompt_powers"),
    "architecture": ("architecture_blob", "prompt_architecture"),
    "atlas": ("atlas_blob", "prompt_atlas"),
    "culture": ("culture_blob", "prompt_culture"),
    "systems": ("systems_blob", "prompt_systems")
}

async def generate_modular_lore(
    module: str,
    user_id: str,
    project_id: int,
    session: AsyncSession
):
    if module not in PROMPTS:
        raise HTTPException(status_code=400, detail=f"Invalid module: {module}")

    # 1. Fetch Project for prompt context
    project = await session.get(Project, project_id)
    if not project or project.user_id != user_id:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")
    
    # 2. Get existing lore for context
    db_lore = await resolve_lore(session, user_id, project_id)
    world_context = db_lore.full_lore_blob or getattr(db_lore, "manifest_blob", None) or "No established world manifest yet."

    # 3. Call AI
    system_instruction = f"You are a master world builder for {project.content_type or 'Anime'} projects. Your task is to generate {module.capitalize()}."
    user_prompt = f"""
    CORE STORY SEED: {project.prompt}
    
    WORLD CONTEXT (MANIFEST):
    {world_context}
    
    TASK: {PROMPTS[module]}
    """
    
    try:
        content = await call_ai(
            model=project.model_used or "gemini-3.1-flash",
            prompt=user_prompt,
            system_instruction=system_instruction,
            user_id=user_id
        )
        
        # 4. Save to DB
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
    auth_user_id: str = Depends(get_auth_user_id)
):
    ensure_authorized(user_id, auth_user_id)
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required for generation")
    
    content = await generate_modular_lore(module, user_id, project_id, session)
    return wrap_response({"content": content}, f"{module.capitalize()} Generated")
