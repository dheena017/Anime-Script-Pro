# `backend/generators/series.py`

Purpose
- Contains helper functions for series-level generation workflows (e.g., seeding a show, series-wide metadata).

Key functions
- `generate_series_manifest(...)` — orchestrates high-level series metadata and may call AI generators.
- `seed_default_series()` — helper to populate example data.

Example usage
- Called when the frontend creates a new project and requests initial world/series scaffolding.

Frontend mapping
- Triggered by `Create Project` form in `src/pages/projects` when user selects "Auto-generate world".

Related files
- `backend/services/ai_engine.py`
- `backend/docs/examples/generate_request.json`
