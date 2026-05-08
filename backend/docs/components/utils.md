# `backend/utils/` — Utilities overview

Purpose
- Houses shared utility functions for authentication, dependency injection, neural tracing/logging, and validation.

Key files
- `auth_utils.py` — password hashing, token creation (`create_access_token`, `create_refresh_token`), and `SECRET_KEY`.
- `deps.py` — FastAPI dependency helpers like `get_auth_user_id` (used to extract user ID from JWT).
- `neural_utils.py` — logging helpers (`wrap_neural_response`, `log_neural_event`) for neural tracing and structured responses.

Frontend mapping
- These are backend-internal utilities. The frontend observes their effects through:
  - Structured error/response JSON from `wrap_neural_response`.
  - Signal IDs in logs for correlating requests.

Related files
- `backend/services/user_manager.py` — uses `SECRET_KEY` from auth_utils.
- `backend/api/auth.py` — uses token creation functions.
- `backend/fastapi_app.py` — uses `wrap_neural_response` for error handling.
