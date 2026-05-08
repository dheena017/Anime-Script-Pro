# `backend/api/auth.py`

Purpose
- Provides login and token endpoints for user authentication. Supports a development bypass for local testing.

Key endpoints
- `POST /api/auth/token` — OAuth2-compatible token endpoint (accepts form data or JSON credentials).
- `POST /api/auth/login` — Alternate login endpoint that sets a refresh cookie and returns access token.

Example request
```json
{
  "email": "email@gmail.com",
  "password": "password"
}
```

Example response
```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 900
}
```

Frontend mapping
- Called from login forms or automated dev flows: `src/pages/login`, `src/components/AuthForm`.
- The frontend must store the returned access token and send it in `Authorization` header for protected endpoints.

Notes
- The backend includes a development bypass when `ENV=development` or `BYPASS_AUTH=true`. Remove or guard this in production.
- `login` endpoint sets an HTTP-only `refresh_token` cookie.

Related files
- `backend/services/user_manager.py` — FastAPI Users integration and JWT strategy.
- `backend/utils/auth_utils.py` — helpers for token creation and password verification.
- `backend/docs/examples/login.json` — sample login payload.
