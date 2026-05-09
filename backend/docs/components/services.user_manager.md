# `backend/services/user_manager.py`

Purpose
- Integrates `fastapi-users` for user management and JWT authentication. Provides `fastapi_users`, `auth_backend`, and helper dependencies for the API.

Key classes / functions
- `UserRead`, `UserCreate`, `UserUpdate` — Pydantic schemas for users.
- `UserManager` — subclass of `BaseUserManager` for password reset and verification token secrets.
- `get_user_db(session)` — dependency to yield `sqlalchemyUserDatabase`.
- `get_user_manager(user_db)` — yields configured `UserManager`.
- `auth_backend` and `fastapi_users` — reusable auth objects for route dependencies.

Example usage (FastAPI dependency)
```py
from backend.services.user_manager import current_active_user

@router.get('/me')
async def read_me(user = Depends(current_active_user)):
    return user
```

Frontend mapping
- Called indirectly by auth endpoints in `backend/api/auth.py`. The frontend uses login pages (`/login`) to obtain tokens which are validated by this service.

Notes
- JWT strategy uses `SECRET_KEY` from `backend.utils.auth_utils`.
- The module contains a development-friendly setup; ensure `BYPASS_AUTH` or `ENV=development` is not enabled in production.

Related files
- `backend/api/auth.py` — login/token endpoints.
- `backend/utils/auth_utils.py` — token creation and password utilities.
- `backend/database/models/user.py` — user model definitions and `UserSettings`.
