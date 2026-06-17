import sys
from unittest.mock import MagicMock
import random

# Mock loguru
mock_logger = MagicMock()
sys.modules["loguru"] = MagicMock()
sys.modules["loguru"].logger = mock_logger

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from backend.fastapi_app import app
from backend.database.models.user import Todo
from sqlmodel import select, SQLModel
from backend.database import async_engine

@pytest_asyncio.fixture
async def client():
    # Initialize DB tables for testing
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_duplicate_todo(client):
    # Create a user first (or use a dummy user_id)
    user_id = f"test-user-{random.randint(1, 1000000)}"
    task_text = f"Unique Task {random.randint(1, 1000000)}"

    # First creation
    response = await client.post(f"/api/todos/{user_id}", json={"text": task_text})
    assert response.status_code == 200

    # Duplicate creation
    response = await client.post(f"/api/todos/{user_id}", json={"text": task_text})
    assert response.status_code == 400
    assert response.json()["detail"] == "A task with this name already exists in your queue."
