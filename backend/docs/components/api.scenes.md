# `backend/api/scenes.py`

Purpose
- Scene-level management endpoints for creating, updating, reordering, and linking scenes to episodes.

Key endpoints (examples)
- `POST /api/scenes` — Create a scene.
- `GET /api/scenes/{id}` — Fetch scene detail.
- `PUT /api/scenes/{id}` — Update scene content.

Example request (create scene)
```json
{
  "episode_id": "ep_123",
  "title": "The Market Chase",
  "description": "A high-speed chase through neon alleys."
}
```

Example response
```json
{
  "id": "scene_1",
  "episode_id": "ep_123",
  "title": "The Market Chase"
}
```

Frontend mapping
- Called by scene editors and episode composers: `src/components/SceneEditor`, `src/pages/episode/[id]`.

Related files
- `backend/api/episodes.py` — scenes are attached to episodes.
- `backend/services/generators/world/*` — possible AI-assisted scene generation.
