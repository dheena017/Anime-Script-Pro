"""
Anime Script Pro — Authentication Utilities

This module provides password hashing via Passlib (Argon2/Bcrypt) and JWT token generation
and verification workflows via python-jose.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Security Configuration
  4. Hashing Functions
  5. Token Utility Functions
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
from datetime import datetime, timedelta, timezone
import os
from typing import Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from jose import jwt
from loguru import logger
from passlib.context import CryptContext

# ==============================================================================
# 3. SECURITY CONFIGURATION
# ==============================================================================
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Production safety warning audit
if os.getenv("ENV", "development").lower() == "production" and SECRET_KEY == "your-super-secret-key":
    logger.opt(colors=True).error(
        "<red><b>[SECURITY CAUTION]</b></red> The default fallback JWT SECRET_KEY is active in a Production environment! "
        "Please configure an explicit JWT_SECRET_KEY in your .env file to protect user credentials."
    )

# ==============================================================================
# 4. HASHING FUNCTIONS
# ==============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a hashed value.

    Args:
        plain_password: The user's input password.
        hashed_password: The hashed password retrieved from persistence.

    Returns:
        bool: True if the passwords match, False otherwise.
    """
    logger.opt(colors=True).debug("<magenta>[AUTH CRYPTO]</magenta> Verifying user password hash...")
    result = pwd_context.verify(plain_password, hashed_password)
    if result:
        logger.opt(colors=True).debug("<magenta>[AUTH CRYPTO]</magenta> Password verified <green>successfully</green>.")
    else:
        logger.opt(colors=True).warning("<magenta>[AUTH CRYPTO]</magenta> <red><b>Password verification failed</b></red>.")
    return result


def get_password_hash(password: str) -> str:
    """Generate a password hash from plain text.

    Args:
        password: The plain-text password to hash.

    Returns:
        str: Hashed string representation.
    """
    logger.opt(colors=True).debug("<magenta>[AUTH CRYPTO]</magenta> Generating password hash context...")
    hashed = pwd_context.hash(password)
    logger.opt(colors=True).debug("<magenta>[AUTH CRYPTO]</magenta> Password hash generated <green>successfully</green>.")
    return hashed

# ==============================================================================
# 5. TOKEN UTILITY FUNCTIONS
# ==============================================================================

def create_access_token(data: dict) -> str:
    """Generate a JWT access token.

    Args:
        data: The custom payload dict to encode.

    Returns:
        str: Encoded JWT token string.
    """
    logger.opt(colors=True).debug(f"<magenta>[AUTH JWT]</magenta> Compiling access token for subject: <yellow>{data.get('sub')}</yellow>")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.opt(colors=True).info(f"<magenta>[AUTH JWT]</magenta> Created access token (expires in <cyan>{ACCESS_TOKEN_EXPIRE_MINUTES}m</cyan>).")
    return token


def create_refresh_token(data: dict) -> str:
    """Generate a JWT refresh token.

    Args:
        data: The custom payload dict to encode.

    Returns:
        str: Encoded JWT token string.
    """
    logger.opt(colors=True).debug(f"<magenta>[AUTH JWT]</magenta> Compiling refresh token for subject: <yellow>{data.get('sub')}</yellow>")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.opt(colors=True).info(f"<magenta>[AUTH JWT]</magenta> Created refresh token (expires in <cyan>{REFRESH_TOKEN_EXPIRE_DAYS} days</cyan>).")
    return token


def decode_and_verify_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token signature and expiration context.

    Args:
        token: The encoded JWT token string.

    Returns:
        Optional[dict]: The verified payload claims mapping, or None if invalid/expired.
    """
    try:
        # Decodes token and automatically validates 'exp' expiration claim
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.opt(colors=True).warning("<magenta>[AUTH JWT]</magenta> Token signature has <yellow>expired</yellow>.")
        return None
    except jwt.JWTError as e:
        logger.opt(colors=True).warning(f"<magenta>[AUTH JWT]</magenta> Token signature is <red>invalid</red>: {e}")
        return None
