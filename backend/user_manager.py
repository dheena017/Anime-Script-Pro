import os
import sys
import warnings

# Ensure the project root is on sys.path when running this module directly.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Suppress all runtime user warnings during backend startup
warnings.filterwarnings(
    "ignore",
    category=UserWarning,
)

from typing import Optional, AsyncGenerator
from fastapi import Depends
from fastapi_users import BaseUserManager, FastAPIUsers, schemas as fa_schemas
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase

from backend.database.models import User, UserProfile, UserBalance, UserSettings
from backend.database import get_async_session, async_session
from loguru import logger
from fastapi import Depends, Request
import uuid

logger.info("AUTH: Initializing User Management System...")

# --- FastAPI Users Pydantic Schemas ---
class UserRead(fa_schemas.BaseUser):
    name: Optional[str] = None

class UserCreate(fa_schemas.BaseUserCreate):
    name: Optional[str] = None

class UserUpdate(fa_schemas.BaseUserUpdate):
    name: Optional[str] = None

from backend.utils.auth_utils import SECRET_KEY

class UserManager(BaseUserManager[User, str]):
    reset_password_token_secret = SECRET_KEY
    verification_token_secret = SECRET_KEY

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        logger.success(f"SIGNAL: New Architect '{user.email}' registered. Initializing production workspace...")
        
        async with async_session() as session:
            try:
                # 1. Create Profile
                display_name = user.name or "SHOGUN ARCHITECT"
                handle = f"architect_{str(uuid.uuid4())[:8]}"
                profile = UserProfile(
                    user_id=str(user.id),
                    display_name=display_name,
                    handle=handle
                )
                session.add(profile)
                
                # 2. Create Balance
                balance = UserBalance(user_id=str(user.id))
                session.add(balance)
                
                # 3. Create Settings
                settings = UserSettings(user_id=str(user.id))
                session.add(settings)
                
                await session.commit()
                logger.success(f"WORKSPACE: Production environment initialized for {user.id}")
            except Exception as e:
                logger.error(f"FATAL: Workspace initialization failed for {user.id}: {str(e)}")
                await session.rollback()

async def get_user_db(session: async_session = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET_KEY, lifetime_seconds=3600)

bearer_transport = BearerTransport(tokenUrl="/api/auth/token")

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
