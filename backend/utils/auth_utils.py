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
    logger.debug("AUTH CRYPTO: Verifying user password hash...")
    result = pwd_context.verify(plain_password, hashed_password)
    if result:
        logger.debug("AUTH CRYPTO: Password verified successfully.")
    else:
        logger.warning("AUTH CRYPTO: Password verification failed.")
    return result


def get_password_hash(password: str) -> str:
    """Generate a password hash from plain text.

    Args:
        password: The plain-text password to hash.

    Returns:
        str: Hashed string representation.
    """
    logger.debug("AUTH CRYPTO: Generating password hash context...")
    hashed = pwd_context.hash(password)
    logger.debug("AUTH CRYPTO: Password hash generated successfully.")
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
    logger.debug(f"AUTH JWT: Compiling access token for subject: {data.get('sub')}")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"AUTH JWT: Created access token (expires in {ACCESS_TOKEN_EXPIRE_MINUTES}m).")
    return token


def create_refresh_token(data: dict) -> str:
    """Generate a JWT refresh token.

    Args:
        data: The custom payload dict to encode.

    Returns:
        str: Encoded JWT token string.
    """
    logger.debug(f"AUTH JWT: Compiling refresh token for subject: {data.get('sub')}")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info(f"AUTH JWT: Created refresh token (expires in {REFRESH_TOKEN_EXPIRE_DAYS} days).")
    return token
