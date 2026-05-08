# `backend/api/scripts.py`

Purpose
- Script-level endpoints: manage screenplay scripts, export versions, and integrate generation with scenes/beats.

Key endpoints (examples)
- `GET /api/scripts/{id}` — Get script by ID.
- `POST /api/scripts` — Create or materialize a new script.
- `POST /api/scripts/{id}/export` — Export script to common formats.

Example request (create)
```json
{
  "project_id": "proj_1",
  "title": "Pilot Script",
  "content": "Scene 1: ..."
}
```

Example response
```json
{
  "id": "script_1",
  "title": "Pilot Script",
  "status": "draft"
}
```

Frontend mapping
- Called by script editor components and export buttons: `src/pages/scripts`, `src/components/ScriptEditor`.

Related files
- `backend/generators/series.py` — series-level generator helpers.
- `backend/services/ai_engine.py` — when using AI to draft script sections.
