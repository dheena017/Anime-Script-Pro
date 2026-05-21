from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from sqlalchemy.exc import IntegrityError
from backend.database import get_async_session, async_session, AsyncSession
from backend.database.models.user import Todo
from pydantic import BaseModel

router = APIRouter(prefix="/api/todos", tags=["Production Queue"])

class TodoCreate(BaseModel):
    text: str

class TodoUpdate(BaseModel):
    completed: bool

@router.get("/{user_id}", response_model=List[Todo])
async def get_todos(user_id: str, session: AsyncSession = Depends(get_async_session)):
    statement = select(Todo).where(Todo.user_id == user_id).order_by(Todo.created_at)
    result = await session.execute(statement)
    return result.scalars().all()

@router.post("/{user_id}", response_model=Todo)
async def create_todo(user_id: str, todo_in: TodoCreate, session: AsyncSession = Depends(get_async_session)):
    try:
        todo = Todo(user_id=user_id, text=todo_in.text)
        session.add(todo)
        await session.commit()
        await session.refresh(todo)
        return todo
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=400, detail="A task with this name already exists in your production queue.")

@router.patch("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_in: TodoUpdate, session: AsyncSession = Depends(get_async_session)):
    todo = await session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.completed = todo_in.completed
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int, session: AsyncSession = Depends(get_async_session)):
    todo = await session.get(Todo, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    await session.delete(todo)
    await session.commit()
    return {"ok": True}
