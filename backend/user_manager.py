"""
Anime Script Pro — User Management
Configures FastAPI-Users with a SQLAlchemy backend and JWT authentication.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Pydantic Schemas (UserRead / UserCreate / UserUpdate)
  5. UserManager (lifecycle hooks)
  6. Database & Manager Dependencies
  7. Authentication Strategy & Backend
  8. FastAPI-Users Instance & Current-User Shortcut
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import os
import sys
import uuid
import warnings
from typing import AsyncGenerator, Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import Depends, Request, Response
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users import schemas as fa_schemas
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from loguru import logger

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================

# Ensure the project root is on sys.path when running this module directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Suppress runtime user warnings during backend startup
warnings.filterwarnings("ignore", category=UserWarning)

from backend.database import async_session, get_async_session
from backend.database.models import Notification, User, UserBalance, UserProfile, UserSettings
from backend.utils.auth_utils import SECRET_KEY

logger.info("AUTH: Initializing User Management System...")

# ==============================================================================
# 4. PYDANTIC SCHEMAS
# ==============================================================================

class UserRead(fa_schemas.BaseUser):
    """Schema for reading / returning user data from the API."""
    name: Optional[str] = None


class UserCreate(fa_schemas.BaseUserCreate):
    """Schema for registering a new user."""
    name: Optional[str] = None


class UserUpdate(fa_schemas.BaseUserUpdate):
    """Schema for updating an existing user."""
    name: Optional[str] = None

# ==============================================================================
# 5. USER MANAGER (lifecycle hooks)
# ==============================================================================

class UserManager(BaseUserManager[User, str]):
    """Handles user lifecycle events such as registration and login.

    Inherits from FastAPI-Users' BaseUserManager and extends it with
    automatic workspace provisioning on new user registration.
    """

    reset_password_token_secret = SECRET_KEY
    verification_token_secret   = SECRET_KEY

    async def on_after_register(self, user: User, request: Optional[Request] = None) -> None:
        """Runs after a new user registers.

        Provisions the user's full production workspace:
          1. UserProfile  — display name and unique handle
          2. UserBalance  — credit ledger initialised at zero
          3. UserSettings — default neural engine configuration
          4. Notifications — welcome messages for the new architect
        """
        logger.success(f"IDENTITY: New Architect '{user.email}' (ID: {user.id}) registered.")

        async with async_session() as session:
            try:
                # 1. Create Profile
                logger.debug(f"PROVISION: Initializing Profile for {user.id}...")
                display_name = user.name or "SHOGUN ARCHITECT"
                handle       = f"architect_{str(uuid.uuid4())[:8]}"
                profile      = UserProfile(
                    user_id      = str(user.id),
                    display_name = display_name,
                    handle       = handle,
                )
                session.add(profile)

                # 2. Create Balance
                logger.debug(f"PROVISION: Initializing Ledger for {user.id}...")
                balance = UserBalance(user_id=str(user.id))
                session.add(balance)

                # 3. Create Settings
                logger.debug(f"PROVISION: Initializing Neural Config for {user.id}...")
                settings = UserSettings(user_id=str(user.id))
                session.add(settings)

                # 4. Provision default welcome notifications
                logger.debug(f"PROVISION: Initializing Default Notifications for {user.id}...")
                default_notifications = [
                    Notification(
                        user_id  = str(user.id),
                        title    = "Welcome to Anime Script Pro!",
                        message  = (
                            "Your production environment v2.4.0 is fully operational. "
                            "Open the 'Directives Hub' to start architecting your series."
                        ),
                        type     = "SUCCESS",
                        is_read  = False,
                    ),
                    Notification(
                        user_id  = str(user.id),
                        title    = "Neural Firewall Status",
                        message  = "Active security shield configured. Safe ORM and rate-limiting modules synchronized.",
                        type     = "INFO",
                        is_read  = False,
                    ),
                    Notification(
                        user_id  = str(user.id),
                        title    = "Synapse Engine Ready",
                        message  = "Connected to Node Alpha-3 US-East-1. Latency nominal. Synthesizers online.",
                        type     = "INFO",
                        is_read  = False,
                    ),
                ]
                for notification in default_notifications:
                    session.add(notification)

                await session.commit()
                logger.success(f"PROVISION: Full production workspace deployed for {user.id}")

            except Exception as e:
                logger.error(f"IDENTITY: Critical failure during workspace provisioning for {user.id}: {e}")
                await session.rollback()

    async def on_after_login(
        self,
        user: User,
        request: Optional[Request]  = None,
        response: Optional[Response] = None,
    ) -> None:
        """Runs after a user logs in successfully. Logs the session initiation."""
        client_ip = request.client.host if request and request.client else "unknown"
        logger.info(f"AUTH: Architect '{user.email}' session initiated (IP: {client_ip})")

# ==============================================================================
# 6. DATABASE & MANAGER DEPENDENCIES
# ==============================================================================

async def get_user_db(session=Depends(get_async_session)) -> AsyncGenerator:
    """FastAPI dependency that yields a SQLAlchemy-backed user database adapter."""
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)) -> AsyncGenerator:
    """FastAPI dependency that yields a configured UserManager instance."""
    yield UserManager(user_db)

# ==============================================================================
# 7. AUTHENTICATION STRATEGY & BACKEND
# ==============================================================================

def create_jwt_auth_strategy() -> JWTStrategy:
    """Creates and returns a JWT authentication strategy with a 1-hour token lifetime."""
    return JWTStrategy(secret=SECRET_KEY, lifetime_seconds=3600)


bearer_transport = BearerTransport(tokenUrl="/api/auth/token")

auth_backend = AuthenticationBackend(
    name         = "jwt",
    transport    = bearer_transport,
    get_strategy = create_jwt_auth_strategy,
)

# ==============================================================================
# 8. FASTAPI-USERS INSTANCE & CURRENT-USER SHORTCUT
# ==============================================================================

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

# Reusable dependency — injects the currently authenticated active user into routes
current_active_user = fastapi_users.current_user(active=True)
