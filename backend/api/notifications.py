from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from typing import List
from backend.database.models import Notification
from backend.database import async_session
from backend.utils.deps import get_auth_user_id

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/{user_id}", response_model=List[Notification])
async def get_notifications(user_id: str):
    async with async_session() as session:
        statement = select(Notification).where(Notification.user_id == user_id)
        result = await session.execute(statement)
        return result.scalars().all()

@router.post("/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    async with async_session() as session:
        notification = await session.get(Notification, notification_id)
        if not notification:
            # Resilient fallback: if the notification doesn't exist, treat it as read/cleared
            return {"status": "read", "already_deleted": True}
        notification.is_read = True
        session.add(notification)
        await session.commit()
        return {"status": "read"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: int):
    async with async_session() as session:
        notification = await session.get(Notification, notification_id)
        if not notification:
            # Resilient fallback: return success even if already deleted to cleanly synchronize frontend state
            return {"ok": True, "already_deleted": True}
        await session.delete(notification)
        await session.commit()
        return {"ok": True}

@router.post("/{user_id}/simulate")
async def simulate_notification(user_id: str):
    import random
    from backend.utils.notifications import notify_user
    simulations = [
        ("Synapse Sync Complete", "Lore matrices compiled for 'Solo Leveling: Reborn'.", "SUCCESS"),
        ("Creative Threat Blocked", "Rate-limit threshold bypassed. Core engine stabilized.", "WARNING"),
        ("Prompt Refined", "AI model Gemini 3.5 Flash completed detailed scene script translation.", "SUCCESS"),
        ("Neural Shield Activated", "Active session secure. SQLite database encrypted.", "INFO"),
        ("Cluster load warning", "GPU cluster US-East-1 load exceeds 85%. Secondary server activated.", "ALERT"),
        ("Community transmission", "User Creator_99 liked your shared project blueprint.", "INFO")
    ]
    title, message, n_type = random.choice(simulations)
    notification = await notify_user(user_id, title, message, n_type)
    if not notification:
        raise HTTPException(status_code=500, detail="Failed to synthesize neural transmission.")
    return {"status": "dispatched", "notification": notification}
