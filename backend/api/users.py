from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import logging
from backend.database.models import UserProfile, UserSettings, UserBalance
from backend.database import async_session
from backend.utils.deps import get_auth_user_id
from backend.utils.notifications import notify_user

router = APIRouter(prefix="/api", tags=["Users"])
logger = logging.getLogger(__name__)


def ensure_authorized(path_user_id: str, auth_user_id: str) -> None:
    if path_user_id != auth_user_id:
        logger.warning(
            "[USERS] Unauthorized access attempt. path_user_id=%s auth_user_id=%s",
            path_user_id,
            auth_user_id,
        )
        raise HTTPException(status_code=403, detail="Unauthorized Access")


def validate_payload(payload: dict, allowed_keys: set[str]) -> None:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Payload must be a JSON object")

    unknown_keys = sorted(set(payload.keys()) - allowed_keys)
    if unknown_keys:
        raise HTTPException(status_code=400, detail=f"Unknown payload keys: {', '.join(unknown_keys)}")

    if not payload:
        raise HTTPException(status_code=400, detail="Payload must not be empty")

@router.get("/users/profile")
async def get_current_user(user_id: str = Depends(get_auth_user_id)):
    """
    Returns the current authenticated user's profile information.
    """
    try:
        async with async_session() as session:
            statement = select(UserProfile).where(UserProfile.user_id == user_id)
            result = await session.execute(statement)
            profile = result.scalars().first()

            if not profile:
                profile = UserProfile(user_id=user_id, handle=f"architect_{user_id[:5]}")
                session.add(profile)
                await session.commit()
                await session.refresh(profile)
                logger.info("[USERS] Created default profile for user_id=%s", user_id)

            logger.info("[USERS] Profile fetched for user_id=%s", user_id)
            return {
                "id": user_id,
                "email": f"{profile.handle}@studio.pro",  # Fallback email if not found
                "profile": profile,
            }
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while fetching current profile for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to load current user profile") from db_err
    except HTTPException:
        raise
    except Exception as err:
        logger.exception("[USERS] Unexpected error while fetching current profile for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while loading current user profile") from err

@router.get("/profiles/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str, auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    logger.info("[USERS] Fetching profile for user_id=%s", user_id)
    try:
        async with async_session() as session:
            statement = select(UserProfile).where(UserProfile.user_id == user_id)
            result = await session.execute(statement)
            profile = result.scalars().first()
            if not profile:
                profile = UserProfile(user_id=user_id, handle=f"architect_{user_id[:5]}")
                session.add(profile)
                await session.commit()
                await session.refresh(profile)
                logger.info("[USERS] Created default profile for user_id=%s", user_id)
            return profile
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while getting profile for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to retrieve user profile") from db_err
    except HTTPException:
        raise
    except Exception as err:
        logger.exception("[USERS] Unexpected error while getting profile for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while retrieving user profile") from err

@router.post("/profiles/{user_id}", response_model=UserProfile)
async def update_user_profile(user_id: str, payload: dict, auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    logger.warning("[USERS] Updating profile for user_id=%s", user_id)
    validate_payload(payload, {"display_name", "handle", "bio", "avatar_url", "banner_url"})
    try:
        async with async_session() as session:
            statement = select(UserProfile).where(UserProfile.user_id == user_id)
            result = await session.execute(statement)
            profile = result.scalars().first()
            if not profile:
                profile = UserProfile(user_id=user_id, handle=payload.get("handle", f"user_{user_id[:5]}"))
                session.add(profile)

            if "display_name" in payload:
                profile.display_name = payload["display_name"]
            if "handle" in payload:
                profile.handle = payload["handle"]
            if "bio" in payload:
                profile.bio = payload["bio"]
            if "avatar_url" in payload:
                profile.avatar_url = payload["avatar_url"]
            if "banner_url" in payload:
                profile.banner_url = payload["banner_url"]

            profile.updated_at = datetime.utcnow()
            session.add(profile)
            await session.commit()
            await session.refresh(profile)
            logger.info("[USERS] Profile updated for user_id=%s", user_id)
            await notify_user(user_id, "Profile Synchronized", "Your architectural identity has been successfully updated.", "SUCCESS")
            return profile
    except HTTPException:
        raise
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while updating profile for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to update user profile") from db_err
    except Exception as err:
        logger.exception("[USERS] Unexpected error while updating profile for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while updating user profile") from err

@router.get("/settings/{user_id}", response_model=UserSettings)
async def get_user_settings(user_id: str, auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    logger.info("[USERS] Fetching settings for user_id=%s", user_id)
    try:
        async with async_session() as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            result = await session.execute(statement)
            settings = result.scalars().first()
            if not settings:
                settings = UserSettings(user_id=user_id, profile={}, security={}, notifications={}, ai_models={}, storage={}, billing={})
                session.add(settings)
                await session.commit()
                await session.refresh(settings)
                logger.info("[USERS] Created default settings for user_id=%s", user_id)
            return settings
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while getting settings for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to retrieve user settings") from db_err
    except HTTPException:
        raise
    except Exception as err:
        logger.exception("[USERS] Unexpected error while getting settings for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while retrieving user settings") from err

@router.post("/settings/{user_id}", response_model=UserSettings)
async def update_user_settings(user_id: str, payload: dict, auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    logger.warning("[USERS] Updating settings for user_id=%s", user_id)
    validate_payload(payload, {"profile", "security", "notifications", "ai_models", "studio_defaults", "storage", "billing"})
    try:
        async with async_session() as session:
            statement = select(UserSettings).where(UserSettings.user_id == user_id)
            result = await session.execute(statement)
            settings = result.scalars().first()
            if not settings:
                settings = UserSettings(user_id=user_id, profile={}, security={}, notifications={}, ai_models={}, storage={}, billing={})
                session.add(settings)

            if "profile" in payload:
                settings.profile = payload["profile"]
            if "security" in payload:
                settings.security = payload["security"]
            if "notifications" in payload:
                settings.notifications = payload["notifications"]
            if "ai_models" in payload:
                settings.ai_models = payload["ai_models"]
            if "studio_defaults" in payload:
                settings.studio_defaults = payload["studio_defaults"]
            if "storage" in payload:
                settings.storage = payload["storage"]
            if "billing" in payload:
                settings.billing = payload["billing"]

            settings.updated_at = datetime.utcnow()
            session.add(settings)
            await session.commit()
            await session.refresh(settings)
            logger.info("[USERS] Settings updated for user_id=%s", user_id)
            await notify_user(user_id, "Settings Synchronized", "Production environment parameters have been updated.", "INFO")
            return settings
    except HTTPException:
        raise
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while updating settings for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to update user settings") from db_err
    except Exception as err:
        logger.exception("[USERS] Unexpected error while updating settings for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while updating user settings") from err

@router.get("/balances/{user_id}", response_model=UserBalance)
async def get_user_balance(user_id: str, auth_user_id: str = Depends(get_auth_user_id)):
    ensure_authorized(user_id, auth_user_id)
    logger.info("[USERS] Fetching balance for user_id=%s", user_id)
    try:
        async with async_session() as session:
            statement = select(UserBalance).where(UserBalance.user_id == user_id)
            result = await session.execute(statement)
            balance = result.scalars().first()
            if not balance:
                balance = UserBalance(user_id=user_id, credits=5000, current_tier="MASTER ARCHITECT", level=1, experience=0)
                session.add(balance)
                await session.commit()
                await session.refresh(balance)
                logger.info("[USERS] Created default balance for user_id=%s", user_id)
            return balance
    except SQLAlchemyError as db_err:
        logger.exception("[USERS] DB error while getting balance for user_id=%s: %s", user_id, db_err)
        raise HTTPException(status_code=500, detail="Failed to retrieve user balance") from db_err
    except HTTPException:
        raise
    except Exception as err:
        logger.exception("[USERS] Unexpected error while getting balance for user_id=%s: %s", user_id, err)
        raise HTTPException(status_code=500, detail="Unexpected error while retrieving user balance") from err
