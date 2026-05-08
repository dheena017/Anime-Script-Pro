# `backend/api/projects.py`

Purpose
- Manage projects/series metadata, create new projects, list projects, and fetch project details for the frontend.

Key endpoints
- `GET /api/projects` — List projects for the user.
- `GET /api/projects/{id}` — Get project details.
- `POST /api/projects` — Create a new project/series.
- `PUT /api/projects/{id}` — Update project metadata.

Example request (create)
```json
{
  "title": "Neon Cities",
  "description": "A sci-fi drama about city-states powered by AI.",
  "content_type": "Anime"
}
```

Example response (list)
```json
[
  {
    "id": "proj_1",
    "title": "Neon Cities",
    "owner_id": "user_1"
  }
]
```

Frontend mapping
- Called by project dashboard and create-project form: e.g., `src/pages/projects`, `src/components/ProjectCard`.

Related files
- `backend/generators/series.py` — helper generation logic for series-level flows.
- `backend/database/models/projects.py` — project model definitions.
