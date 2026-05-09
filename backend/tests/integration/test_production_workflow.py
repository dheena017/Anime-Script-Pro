import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from backend.fastapi_app import app
from backend.database import async_engine
import sqlalchemy


def assert_success(response, allowed=(status.HTTP_200_OK, status.HTTP_201_CREATED)):
    assert response.status_code in allowed, f"Expected success status, got {response.status_code}: {response.text}"


@pytest.mark.asyncio
async def test_production_creation_flow():
    """
    Test the full production data flow from Project creation to Scene scaffolding.
    Ensures that the backend correctly handles the data and persists it (to a test DB).
    """
    # Tables are created by the FastAPI app on startup, no need to do it manually
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create a Project (Initial Foundation)
        project_data = {
            "user_id": "local-dev-architect-id",
            "name": "E2E Test Production",
            "content_type": "Anime",
            "prompt": "Gravity controlled by music.",
            "vibe": "Shonen Catalyst",
            "prod_metadata": {"engine": "2.0"}
        }
        resp = await ac.post("/api/projects", json=project_data)
        if resp.status_code not in [200, 201]:
            print(f"Project Creation Failed: {resp.status_code} - {resp.text}")
        assert resp.status_code == status.HTTP_201_CREATED or resp.status_code == 200
        project = resp.json()
        project_id = project["id"]
        assert project["name"] == project_data["name"]

        # 2. Add World Lore
        lore_content = "The Umbra Realm coexists with the light."
        # Update manifest via world manifest endpoint
        user_id = project_data.get("user_id") if project_data.get("user_id") else "local-dev-architect-id"
        resp = await ac.post(f"/api/world/manifest/{user_id}", json={"content": lore_content, "project_id": project_id}, headers={"x-bypass-auth": "true"})
        assert_success(resp)
        assert resp.json()["data"]["manifest_blob"] == lore_content

        world_resp = await ac.get(f"/api/world/manifest/{user_id}?project_id={project_id}", headers={"x-bypass-auth": "true"})
        assert_success(world_resp)
        assert world_resp.json()["data"]["manifest_blob"] == lore_content
        
        # 3. Add Characters (Cast Profiles)
        cast_data = {
            "project_id": project_id,
            "characters": [
                {"name": "Shadow Weaver", "role": "Main", "archetype": "Anti-Hero"},
                {"name": "Lightbringer", "role": "Rival", "archetype": "Pure Soul"}
            ]
        }
        resp = await ac.post("/api/characters", json=cast_data)
        assert_success(resp)
        assert resp.json()["count"] == 2

        # 4. Add Sessions
        session_data = {
            "project_id": project_id,
            "sessions": [
                {"session_number": 1, "title": "Session 1", "summary": "Start"},
                {"session_number": 2, "title": "Session 2", "summary": "Middle"}
            ]
        }
        resp = await ac.post("/api/sessions", json=session_data)
        assert_success(resp)
        sessions = resp.json()
        assert len(sessions) == 2

        sessions_resp = await ac.get(f"/api/sessions?project_id={project_id}")
        assert_success(sessions_resp)
        assert len(sessions_resp.json()) == 2

        # 5. Add Episodes linked to a Session
        episode_data = {
            "project_id": project_id,
            "session_id": sessions[0]["id"],
            "episodes": [
                {"episode_number": 1, "title": "Ep 1", "hook": "The Shadow Awakens"},
                {"episode_number": 2, "title": "Ep 2", "hook": "First Note"}
            ]
        }
        resp = await ac.post("/api/episodes", json=episode_data)
        assert_success(resp)
        episodes = resp.json()
        assert len(episodes) == 2

        episodes_resp = await ac.get(f"/api/episodes?project_id={project_id}")
        assert_success(episodes_resp)
        assert len(episodes_resp.json()) >= 2

        # 6. Add Scenes linked to an Episode
        scene_data = {
            "project_id": project_id,
            "episode_id": episodes[0]["id"],
            "scenes": [
                {"scene_number": 1, "status": "QUEUED", "prompt": "Intro"},
                {"scene_number": 2, "status": "QUEUED", "prompt": "Conflict"}
            ]
        }
        resp = await ac.post("/api/scenes", json=scene_data)
        assert_success(resp)
        scenes = resp.json()
        assert len(scenes) == 2

        scenes_resp = await ac.get(f"/api/scenes?project_id={project_id}")
        assert_success(scenes_resp)
        assert any(scene["prompt"] == "Intro" for scene in scenes_resp.json())
        
        print(f"\n[Backend Audit] Full production lifecycle verified for Project {project_id}")
