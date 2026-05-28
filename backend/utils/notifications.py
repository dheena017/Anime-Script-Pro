"""
Anime Script Pro — Notifications Utility

This module manages the creation of persistent system alerts and real-time broadcasts
to connected developer clients via WebSocket overlays.

Sections (in order):
  1. Third-Party Imports
  2. Local Imports
  3. Core Notification Helpers
"""

# ==============================================================================
# 1. THIRD-PARTY IMPORTS
# ==============================================================================
import json
from typing import Optional

from loguru import logger

# ==============================================================================
# 2. LOCAL IMPORTS
# ==============================================================================
from backend.database import async_session
from backend.database.models import Notification

# ==============================================================================
# 3. CORE NOTIFICATION HELPERS
# ==============================================================================

async def notify_user(
    user_id: str,
    title: str,
    message: str,
    type: str = "INFO",
) -> Optional[Notification]:
    """Creates a persistent notification record in the database and broadcasts it in real-time.

    Supported Types: INFO, SUCCESS, WARNING, ALERT

    Args:
        user_id: Unique identifier for target user receipt.
        title: Short bolded header summary.
        message: Detailed body content of the notification.
        type: Category tag determining display severity.

    Returns:
        Optional[Notification]: Database record if successfully committed, otherwise None.
    """
    logger.debug(f"SIGNAL [DB]: Processing notification request for user '{user_id}'...")
    try:
        async with async_session() as session:
            notification = Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=type.upper(),
                is_read=False
            )
            session.add(notification)
            await session.commit()
            await session.refresh(notification)
            
            # Real-time Broadcast via WebSocket
            try:
                from backend.fastapi_app import manager
                await manager.broadcast(json.dumps({
                    "type": "NEW_NOTIFICATION",
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "category": notification.type
                }))
                logger.info(f"SIGNAL [DB]: Successfully broadcasted notification event #{notification.id} to active sockets.")
            except Exception as broadcast_err:
                logger.warning(f"SIGNAL [DB] !! Failed to broadcast notification: {broadcast_err}")

            logger.debug(f"SIGNAL [DB] -> Saved notification record for '{user_id}': '{title}'")
            return notification
    except Exception as commit_err:
        logger.error(f"SIGNAL [DB] !! Database transaction failed for notification creation: {commit_err}")
        return None
