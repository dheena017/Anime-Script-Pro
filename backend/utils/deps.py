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
from loguru import logger

# ==============================================================================
# 3. LOCAL IMPORTS
# ==============================================================================
from backend.utils.auth_utils import decode_and_verify_token

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
    
    masked_header = auth_header
    if auth_header and auth_header.startswith("Bearer "):
        token_parts = auth_header.split(" ")
        if len(token_parts) == 2 and len(token_parts[1]) > 20:
            masked_header = f"Bearer {token_parts[1][:10]}...{token_parts[1][-10:]}"
            
    try:
        logger.opt(colors=True).debug(
            f"<magenta>[AUTH DEP]</magenta> Authorization: <yellow>{masked_header}</yellow> | x-bypass-auth: <cyan>{request.headers.get('x-bypass-auth')}</cyan>"
        )
    except Exception:
        pass
    
    # Handle development/bypass mode
    # Allow bypass via env or proxy header during development
    if os.getenv("BYPASS_AUTH") == "true" or request.headers.get('x-bypass-auth') == 'true':
        logger.opt(colors=True).debug("<magenta>[AUTH DEP]</magenta> <cyan><b>Bypass Auth Active</b></cyan> via env/header")
        return "local-dev-architect-id"
        
    if not auth_header:
        if os.getenv("ENV") == "development":
            logger.opt(colors=True).debug("<magenta>[AUTH DEP]</magenta> Missing header, defaulting to dev ID: <yellow>local-dev-architect-id</yellow>")
            return "local-dev-architect-id"
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        
        # First, try to decode as a local JWT
        payload = decode_and_verify_token(token)
        if payload:
            user_id = payload.get("sub")
            if user_id:
                logger.opt(colors=True).info(f"<magenta>[AUTH DEP]</magenta> Decoded user ID <green>successfully</green>: <yellow>{user_id}</yellow>")
                return str(user_id)
        else:
            logger.opt(colors=True).warning(f"<magenta>[AUTH DEP]</magenta> Local JWT verification returned empty payload, attempting Supabase fallback...")
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
                            logger.opt(colors=True).info(f"<magenta>[AUTH DEP]</magenta> Resolved user ID via <cyan>Supabase</cyan> service: <yellow>{resolved_id}</yellow>")
                            return resolved_id
                except Exception as e:
                    logger.opt(colors=True).error(f"<magenta>[AUTH DEP]</magenta> Supabase auth check <red>failed</red>: {e}")
 
    # Final fallback for local development
    if os.getenv("ENV") == "development":
         logger.opt(colors=True).debug("<magenta>[AUTH DEP]</magenta> Token validation failed, falling back to local dev credentials.")
         return "local-dev-architect-id"
         
    logger.opt(colors=True).error("<magenta>[AUTH DEP]</magenta> <red><b>No valid authentication schemes found</b></red> in request context.")
    raise HTTPException(status_code=401, detail="Invalid authentication credentials")
