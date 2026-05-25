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

from backend.database.models import User, UserProfile, UserBalance, UserSettings, Notification
from backend.database import get_async_session, async_session
from loguru import logger
from fastapi import Depends, Request, Response
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
        logger.success(f"IDENTITY: New Architect '{user.email}' (ID: {user.id}) registered.")
        
        async with async_session() as session:
            try:
                # 1. Create Profile
                logger.debug(f"PROVISION: Initializing Profile for {user.id}...")
                display_name = user.name or "SHOGUN ARCHITECT"
                handle = f"architect_{str(uuid.uuid4())[:8]}"
                profile = UserProfile(
                    user_id=str(user.id),
                    display_name=display_name,
                    handle=handle
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
                        user_id=str(user.id),
                        title="Welcome to Anime Script Pro!",
                        message="Your production environment v2.4.0 is fully operational. Open the 'Directives Hub' to start architecting your series.",
                        type="SUCCESS",
                        is_read=False
                    ),
                    Notification(
                        user_id=str(user.id),
                        title="Neural Firewall Status",
                        message="Active security shield configured. Safe ORM and rate-limiting modules synchronized.",
                        type="INFO",
                        is_read=False
                    ),
                    Notification(
                        user_id=str(user.id),
                        title="Synapse Engine Ready",
                        message="Connected to Node Alpha-3 US-East-1. Latency nominal. Synthesizers online.",
                        type="INFO",
                        is_read=False
                    )
                ]
                for n in default_notifications:
                    session.add(n)
                
                await session.commit()
                logger.success(f"PROVISION: Full production workspace deployed for {user.id}")
            except Exception as e:
                logger.error(f"IDENTITY: Critical failure during workspace provisioning for {user.id}: {str(e)}")
                await session.rollback()

    async def on_after_login(self, user: User, request: Optional[Request] = None, response: Optional[Response] = None):
        client_ip = request.client.host if request and request.client else "unknown"
        logger.info(f"AUTH: Architect '{user.email}' session initiated (IP: {client_ip})")

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
