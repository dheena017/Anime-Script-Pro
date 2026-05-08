# `backend/database/models/user.py`

Purpose
- User model definitions including `User`, `UserSettings`, and related fields. Stores per-user AI API keys and preferences.

Key fields
- `id`, `email`, `hashed_password`, `display_name`, `failed_login_attempts`, `locked_until`, `settings` (or `UserSettings`).

Frontend mapping
- Account pages use these fields. `UserSettings.ai_models` may contain `gemini_api_key` used by the AI engine.

Security note
- Ensure API keys in `UserSettings` are stored securely and not exposed to clients. Only return masked keys to the frontend if necessary.
