import pytest
from fastapi import status
from httpx import AsyncClient, ASGITransport
from sqlmodel import SQLModel

from backend.fastapi_app import app
from backend.database import async_engine


TEST_HEADERS = {"x-bypass-auth": "true"}


def assert_success(response, allowed=(status.HTTP_200_OK, status.HTTP_201_CREATED)):
    assert response.status_code in allowed, f"Expected success status, got {response.status_code}: {response.text}"


@pytest.mark.asyncio
async def test_production_content_is_scoped_by_project_id():
    """Production content should persist independently per project."""
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_payload_one = {
            "name": "Project One",
            "content_type": "Anime",
            "prompt": "A star-powered academy.",
            "vibe": "Energetic",
            "model_used": "Test Model",
        }
        project_payload_two = {
            "name": "Project Two",
            "content_type": "Anime",
            "prompt": "A shadow kingdom in collapse.",
            "vibe": "Dramatic",
            "model_used": "Test Model",
        }

        project_one_resp = await ac.post("/api/projects", json=project_payload_one, headers=TEST_HEADERS)
        assert_success(project_one_resp)
        project_one = project_one_resp.json()

        project_two_resp = await ac.post("/api/projects", json=project_payload_two, headers=TEST_HEADERS)
        assert_success(project_two_resp)
        project_two = project_two_resp.json()

        user_id = "local-dev-architect-id"
        assert project_one["id"] != project_two["id"]

        first_update = {
            "script_content": "Project One Script",
            "series_plan": [{"episode": 1, "title": "Pilot One"}],
            "seo_metadata": "Project One SEO",
            "growth_strategy": "Launch fast",
            "distribution_plan": "Weekly rollout",
        }
        first_update_resp = await ac.post(
            f"/api/production/{user_id}",
            json=first_update,
            headers={**TEST_HEADERS, "X-Project-Id": str(project_one["id"])}
        )
        assert_success(first_update_resp)
        assert first_update_resp.json()["project_id"] == project_one["id"]
        assert first_update_resp.json()["script_content"] == first_update["script_content"]

        second_update = {
            "script_content": "Project Two Script",
            "series_plan": [{"episode": 1, "title": "Pilot Two"}],
            "seo_metadata": "Project Two SEO",
            "growth_strategy": "Steady build",
            "distribution_plan": "Binge release",
        }
        second_update_resp = await ac.post(
            f"/api/production/{user_id}",
            json=second_update,
            headers={**TEST_HEADERS, "X-Project-Id": str(project_two["id"])}
        )
        assert_success(second_update_resp)
        assert second_update_resp.json()["project_id"] == project_two["id"]
        assert second_update_resp.json()["script_content"] == second_update["script_content"]

        read_first_resp = await ac.get(
            f"/api/production/{user_id}",
            headers={**TEST_HEADERS, "X-Project-Id": str(project_one["id"])}
        )
        assert_success(read_first_resp)
        first_content = read_first_resp.json()
        assert first_content["project_id"] == project_one["id"]
        assert first_content["script_content"] == first_update["script_content"]
        assert first_content["seo_metadata"] == first_update["seo_metadata"]

        read_second_resp = await ac.get(
            f"/api/production/{user_id}",
            headers={**TEST_HEADERS, "X-Project-Id": str(project_two["id"])}
        )
        assert_success(read_second_resp)
        second_content = read_second_resp.json()
        assert second_content["project_id"] == project_two["id"]
        assert second_content["script_content"] == second_update["script_content"]
        assert second_content["seo_metadata"] == second_update["seo_metadata"]

        assert first_content["script_content"] != second_content["script_content"]
