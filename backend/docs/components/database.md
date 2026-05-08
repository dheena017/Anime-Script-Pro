# `backend/database/` — Database overview

Purpose
- Houses database connection code, migrations (alembic), models, and seed data. Uses SQLModel/SQLAlchemy with async sessions.

Key files
- `backend/database/connection.py` — connection helpers.
- `backend/database/postgres.py` — Postgres-specific configuration.
- `backend/database/models/*` — model definitions for `projects`, `user`, `world`, etc.
- `backend/database/seed.sql` and `scripts/seeds/` — example seed data.

Frontend mapping
- Project and user endpoints rely on these models. For instance:
  - `projects` endpoints read/write `backend/database/models/projects.py`.
  - `users` endpoints use `backend/database/models/user.py` (including `UserSettings` for per-user AI keys).

Notes
- Uses `async_session` and `async_engine` in many services; the migration scripts use `alembic` under `backend/alembic/`.

Related docs
- `backend/docs/components/database.models.projects.md`
- `backend/docs/components/database.models.user.md`
- `backend/docs/components/database.models.world.md`
