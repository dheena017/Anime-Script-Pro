import uuid

import pytest
from httpx import AsyncClient
from fastapi import status
from backend.fastapi_app import app

BASE_TEMPLATE = {
    "name": "Test Template",
    "description": "Integration test template",
    "category": "Test",
    "icon": "Sword",
    "prompt": "Test prompt",
    "elements": ["Intro", "Conflict"],
    "stats": {"power": 100},
}

async def register_and_login(client: AsyncClient, email: str, password: str):
    register_resp = await client.post("/api/auth", json={"email": email, "password": password})
    assert register_resp.status_code == status.HTTP_201_CREATED

    login_resp = await client.post(
        "/api/auth/jwt/login",
        data={"username": email, "password": password},
    )
    assert login_resp.status_code == status.HTTP_200_OK
    return login_resp.json()["access_token"]

@pytest.mark.asyncio
async def test_template_crud_and_public_access():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        email = f"testuser+{uuid.uuid4().hex}@example.com"
        password = "testpassword"
        token = await register_and_login(ac, email, password)
        headers = {"Authorization": f"Bearer {token}"}

        create_resp = await ac.post("/api/templates", json=BASE_TEMPLATE, headers=headers)
        assert create_resp.status_code == status.HTTP_201_CREATED
        template_data = create_resp.json()
        assert template_data["name"] == BASE_TEMPLATE["name"]
        assert template_data["is_active"] is True
        template_id = template_data["id"]

        get_resp = await ac.get(f"/api/templates/{template_id}")
        assert get_resp.status_code == status.HTTP_200_OK
        assert get_resp.json()["description"] == BASE_TEMPLATE["description"]

        public_list_resp = await ac.get("/api/templates_public")
        assert public_list_resp.status_code == status.HTTP_200_OK
        assert any(item["id"] == template_id for item in public_list_resp.json())

        update_payload = {"name": "Updated Test Template", "description": "Updated description"}
        update_resp = await ac.put(f"/api/templates/{template_id}", json=update_payload, headers=headers)
        assert update_resp.status_code == status.HTTP_200_OK
        assert update_resp.json()["name"] == update_payload["name"]

        delete_resp = await ac.delete(f"/api/templates/{template_id}", headers=headers)
        assert delete_resp.status_code == status.HTTP_200_OK
        assert delete_resp.json() == {"ok": True}

        not_found_resp = await ac.get(f"/api/templates/{template_id}")
        assert not_found_resp.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_template_requires_authentication():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        create_resp = await ac.post("/api/templates", json=BASE_TEMPLATE)
        assert create_resp.status_code in {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN}

        update_resp = await ac.put("/api/templates/1", json={"name": "Fail"})
        assert update_resp.status_code in {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN}

        delete_resp = await ac.delete("/api/templates/1")
        assert delete_resp.status_code in {status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN}
