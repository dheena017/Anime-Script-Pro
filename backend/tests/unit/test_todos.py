import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from backend.fastapi_app import app
from backend.database import get_async_session
from backend.database.models.user import Todo
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Setup in-memory sqlite database for testing
DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def override_get_async_session():
    async with async_session_maker() as session:
        yield session

app.dependency_overrides[get_async_session] = override_get_async_session

@pytest.fixture
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

@pytest.mark.anyio
async def test_create_todo_unique_constraint(setup_database):
    client = TestClient(app)
    user_id = "test-user-123"
    todo_data = {"text": "Unique Task"}

    # Create the first todo
    response = client.post(f"/api/todos/{user_id}", json=todo_data)
    assert response.status_code == 200
    assert response.json()["text"] == "Unique Task"

    # Attempt to create a duplicate todo for the same user
    response = client.post(f"/api/todos/{user_id}", json=todo_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Task with this name already exists in your queue."

@pytest.mark.anyio
async def test_create_todo_different_users(setup_database):
    client = TestClient(app)
    todo_data = {"text": "Same Task Name"}

    # Create todo for user 1
    response = client.post("/api/todos/user1", json=todo_data)
    assert response.status_code == 200

    # Create todo with same text for user 2 (should be allowed)
    response = client.post("/api/todos/user2", json=todo_data)
    assert response.status_code == 200
    assert response.json()["text"] == "Same Task Name"
