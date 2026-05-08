# `backend/api/world.py`

Purpose
- Endpoints for world-building resources (lore, atlas, factions, history). These endpoints often delegate to the AI generator services.

Key endpoints (examples)
- `GET /api/world/{id}` — Fetch world lore.
- `POST /api/world/generate/manifest` — Generate a world manifest using AI.
- `POST /api/world/generate/history` — Generate world history.

Example request (manifest)
```json
{
  "title": "Eclipse Dominion",
  "description": "A world where the sun wanes and politics shift.",
  "tone": "Grim",
  "content_type": "Anime"
}
```

Example response (manifest)
```json
{
  "text": "...world manifest content...",
  "model_used": "gemini-2.5-flash"
}
```

Frontend mapping
- Called by world editor and world overview components: `src/pages/world`, `src/components/WorldEditor`.

Related files
- `backend/services/generators/world/*` — specific generator services (manifest, history, factions).
- `backend/services/ai_engine.py` — AI engine wrapper.
