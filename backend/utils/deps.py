"""
Anime Script Pro — Dependency Injection Router Helpers

This module exposes dependency injection helpers for route endpoints, primarily managing
user authorization extraction from JWT headers or Supabase tokens.

Sections (in order):
  1. Standard Library Imports
  2. Third-Party Imports
  3. Local Imports
  4. Core Authorization Dependencies
"""

# ==============================================================================
# 1. STANDARD LIBRARY IMPORTS
# ==============================================================================
import os
from typing import Optional

# ==============================================================================
# 2. THIRD-PARTY IMPORTS
# ==============================================================================
from fastapi import Depends, HTTPException, Request
import httpx
from jose import jwt
from loguru import logger

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.utils.auth_utils import ALGORITHM, SECRET_KEY

# ==============================================================================
# 4. CORE AUTHORIZATION DEPENDENCIES
# ==============================================================================

async def get_auth_user_id(request: Request) -> str:
    """Dependency that extracts the authenticated user ID from the local JWT token.

    Supports local development mode, custom header authorization bypass flags,
    decoding standard application JWTs, and fallback checks via Supabase auth services.

    Args:
        request: The active FastAPI request object context.

    Returns:
        str: The authenticated user's ID.

    Raises:
        HTTPException(401): If authorization credentials are missing, invalid, or expired.
    """
    auth_header = request.headers.get("Authorization")
    
    try:
        logger.debug(f"AUTH DEP: Authorization={auth_header} x-bypass-auth={request.headers.get('x-bypass-auth')}")
    except Exception:
        pass
    
    # Handle development/bypass mode
    # Allow bypass via env or proxy header during development
    if os.getenv("BYPASS_AUTH") == "true" or request.headers.get('x-bypass-auth') == 'true':
        logger.debug("AUTH DEP: bypass active via env/header")
        return "local-dev-architect-id"
        
    if not auth_header:
        if os.getenv("ENV") == "development":
            logger.debug("AUTH DEP: Missing header, defaulting to dev user ID.")
            return "local-dev-architect-id"
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        
        try:
            # First, try to decode as a local JWT
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                logger.info(f"AUTH DEP: Decoded user ID successfully: {user_id}")
                return str(user_id)
        except Exception as jwt_err:
            logger.warning(f"AUTH DEP: Local JWT decoding failed ({jwt_err}), attempting Supabase fallback...")
            # If local decoding fails, try Supabase (for transition period/compatibility)
            supabase_url = os.getenv('VITE_SUPABASE_URL')
            supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
            
            if supabase_url and supabase_key:
                url = f"{supabase_url}/auth/v1/user"
                headers = {
                    "apikey": supabase_key,
                    "Authorization": auth_header
                }
                try:
                    async with httpx.AsyncClient() as client:
                        response = await client.get(url, headers=headers)
                        if response.status_code == 200:
                            user_data = response.json()
                            resolved_id = str(user_data["id"])
                            logger.info(f"AUTH DEP: Resolved user ID via Supabase service: {resolved_id}")
                            return resolved_id
                except Exception as e:
                    logger.error(f"Supabase auth check failed: {e}")

    # Final fallback for local development
    if os.getenv("ENV") == "development":
         logger.debug("AUTH DEP: Token validation failed, falling back to local dev credentials.")
         return "local-dev-architect-id"
         
    logger.error("AUTH DEP: No valid authentication schemes found in request context.")
    raise HTTPException(status_code=401, detail="Invalid authentication credentials")
