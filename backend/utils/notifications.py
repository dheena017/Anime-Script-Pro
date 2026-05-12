from backend.database import async_session
from backend.database.models import Notification
from loguru import logger

async def notify_user(user_id: str, title: str, message: str, type: str = "INFO"):
    """
    Creates a persistent notification record in the database.
    Types: INFO, SUCCESS, WARNING, ALERT
    """
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
            logger.debug(f"SIGNAL [DB] -> Created notification for {user_id}: {title}")
            return notification
    except Exception as e:
        logger.error(f"SIGNAL [DB] !! Failed to create notification: {e}")
        return None
