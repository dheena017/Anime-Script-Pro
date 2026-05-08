# `backend/database/models/projects.py`

Purpose
- Defines the `Project` model including title, description, owner relationships, and content_type.

Key fields (examples)
- `id`, `title`, `description`, `owner_id`, `created_at`, `updated_at`

Frontend mapping
- Populated and read by `backend/api/projects.py` for project listing and detail views.

Example usage
- `GET /api/projects/{id}` returns project metadata used in `src/pages/project/[id]`.
