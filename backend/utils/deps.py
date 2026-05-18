import os
import httpx
from fastapi import Request, HTTPException, Depends
from loguru import logger
from typing import Optional

from jose import jwt
from backend.utils.auth_utils import SECRET_KEY, ALGORITHM

async def get_auth_user_id(request: Request):
    """
    Dependency that extracts user ID from the local JWT token.
    Strictly verifies token presence and validity.
    """
    auth_header = request.headers.get("Authorization")

    # Removed all bypasses for security. Only valid tokens are allowed.

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing authorization header")

    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]

        try:
            # Decode the local JWT
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                return str(user_id)
        except Exception as e:
            logger.warning(f"JWT decode failed: {e}")

    raise HTTPException(status_code=401, detail="Invalid authentication credentials")
