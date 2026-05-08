# `backend/api/users.py`

Purpose
- User-related endpoints: profile fetch/update, user lists (admin), and user settings (including AI API keys stored per user).

Key endpoints (examples)
- `GET /api/users/me` — Fetch current user's profile.
- `PUT /api/users/me` — Update user profile or settings.
- `GET /api/users/{id}` — (Admin) fetch another user's profile.

Example request (update settings)
```json
{
  "display_name": "Ada",
  "ai_models": {"gemini_api_key": "user-key-xxxx"}
}
```

Example response
```json
{
  "id": "user_1",
  "email": "user@example.com",
  "display_name": "Ada"
}
```

Frontend mapping
- Called by account/settings pages: `src/pages/account`, `src/components/SettingsForm`.

Related files
- `backend/services/user_manager.py` — FastAPI Users integration (auth providers).
- `backend/database/models/user.py` — user model and `UserSettings` used to store API keys.
