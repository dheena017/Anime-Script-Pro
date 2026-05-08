# `backend/api/episodes.py`

Purpose
- Endpoints around episode CRUD and episode-level resources (scenes, beats). Used by the frontend to manage episode drafts and production state.

Key endpoints (examples)
- `GET /api/episodes/{id}` — Fetch an episode by ID.
- `POST /api/episodes` — Create a new episode draft.
- `PUT /api/episodes/{id}` — Update an episode.
- `DELETE /api/episodes/{id}` — Remove an episode.

Example request (create)
```json
{
  "project_id": "proj_123",
  "title": "Pilot - Episode 1",
  "summary": "The protagonist wakes up in a strange city..."
}
```

Example response (fetch)
```json
{
  "id": "ep_123",
  "project_id": "proj_123",
  "title": "Pilot - Episode 1",
  "summary": "...",
  "scenes": []
}
```

Frontend mapping
- Called by episode list and episode editor UI: e.g., `src/pages/episodes`, `src/components/EpisodeEditor`.

Related files
- `backend/database/models/projects.py` — episode may reference project model.
- `backend/api/scenes.py` — scene-level endpoints tied to episodes.
- `backend/docs/mock_server/app.py` — mock examples for generation flows.
