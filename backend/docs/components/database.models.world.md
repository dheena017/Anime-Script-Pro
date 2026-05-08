# `backend/database/models/world.py`

Purpose
- World-related models storing lore, atlas, factions, and other generated content pieces tied to a project.

Key fields
- `id`, `project_id`, `title`, `lore_text`, `atlas_json`, `meta`

Frontend mapping
- World editor and project overview pages fetch and display these fields (e.g., `src/pages/world` and `src/components/WorldView`).

Related files
- `backend/generators/world/*` and `backend/services/generators/world/*` for generation and persistence.
