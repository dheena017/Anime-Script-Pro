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
            raise HTTPException(status_code=404, detail="Notification not found")
        notification.is_read = True
        session.add(notification)
        await session.commit()
        return {"status": "read"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: int):
    async with async_session() as session:
        notification = await session.get(Notification, notification_id)
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        await session.delete(notification)
        await session.commit()
        return {"ok": True}
