from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
from backend.database.models import User
from backend.database import async_session, async_engine
from backend.utils.auth_utils import verify_password, create_access_token, create_refresh_token
from backend.user_manager import auth_backend, fastapi_users
from loguru import logger
import os
from backend.database.models import User as UserTable # For pydantic schemas if needed

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

MAX_FAILED_ATTEMPTS = 3
LOCKOUT_MINUTES = 1

@router.post("/token")
async def login_for_access_token(
    response: Response,
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login. Supports real database users.
    """
    email = form_data.username
    password = form_data.password

    # Real DB Login Logic
    try:
        async with async_session() as db:
            statement = select(User).where(User.email == email)
            result = await db.execute(statement)
            user = result.scalars().first()

            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            user_id = str(user.id)
            access_token = create_access_token(data={"sub": user_id})
            return {
                "access_token": access_token,
                "token_type": "bearer"
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"TOKEN LOGIN ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login")
async def secure_login(
    request: Request,
    response: Response,
    login_data: LoginRequest
):
    try:
        async with async_session() as db:
            statement = select(User).where(User.email == login_data.email)
            result = await db.execute(statement)
            user = result.scalars().first()

            if not user:
                logger.warning(f"Login failed: User {login_data.email} not found")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            if user.locked_until and user.locked_until.replace(tzinfo=timezone.utc) > datetime.now(timezone.utc):
                logger.warning(f"Login failed: User {login_data.email} is locked until {user.locked_until}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account temporarily locked due to multiple failed login attempts."
                )

            if not verify_password(login_data.password, user.hashed_password):
                logger.warning(f"Login failed: Invalid password for user {login_data.email}")
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
                    user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
                db.add(user)
                await db.commit()
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )

            user_id = str(user.id)
            user.failed_login_attempts = 0
            user.locked_until = None
            db.add(user)
            await db.commit()

            access_token = create_access_token(data={"sub": user_id})
            refresh_token = create_refresh_token(data={"sub": user_id})

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="strict",
                max_age=7 * 24 * 60 * 60
            )

            logger.success(f"[AUTH] Architect Authorized: {login_data.email}")
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "expires_in": 15 * 60,
                "status": "Authorized"
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CRITICAL LOGIN ERROR: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
