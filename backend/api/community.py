from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import List, Optional
from backend.database.models import CommunityPost
from backend.database import async_session, async_engine
from backend.utils.deps import get_auth_user_id   

router = APIRouter(prefix="/api/community", tags=["Community"])

@router.get("/", response_model=List[CommunityPost])
async def get_community_posts():
    async with async_session() as session:
        statement = select(CommunityPost).where(CommunityPost.is_active == True).order_by(CommunityPost.created_at.desc())
        results = await session.exec(statement)
        return results.all()

@router.post("/", response_model=CommunityPost)
async def create_community_post(post: CommunityPost, user_id: str = Depends(get_auth_user_id)):
    async with async_session() as session:
        post.user_id = user_id
        session.add(post)
        await session.commit()
        await session.refresh(post)
        return post

@router.post("/{post_id}/like")
async def like_community_post(post_id: int):
    async with async_session() as session:
        post = await session.get(CommunityPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.likes += 1
        session.add(post)
        await session.commit()
        await session.refresh(post)
        return {"likes": post.likes}
