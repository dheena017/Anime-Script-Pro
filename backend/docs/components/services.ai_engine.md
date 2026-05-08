# `backend/services/ai_engine.py`

Purpose
- Provides the `AIEngine` wrapper that abstracts the Google Gemini / Vertex AI client. Centralizes API key resolution, model mapping/fallbacks, and prompt-based content generation used by generator services and API routes.

Key classes / functions
- `AIEngine` class — main entry point. Methods include:
  - `generate_manifest(...)` — wrap for manifest generation flow.
  - `generate_history(...)` — history generation.
  - `generate_characters(...)` — character synthesis.
  - `generate_content(prompt, system_instruction, user_id)` — low-level generation call.
- `build_genai_client(api_key)` — constructs a `genai.Client` for Vertex AI or API-key usage.
- `call_ai(model, prompt, system_instruction, user_id)` — convenience function to call the engine.

Example usage (server-side)
```py
from backend.services.ai_engine import ai_engine
result = await ai_engine.generate_manifest("Title", "Short desc", "Tone", "Anime", user_id="user_1")
```

Example response (from `generate_content`)
```json
{
  "text": "...generated content...",
  "model_used": "gemini-2.5-flash",
  "finish_reason": "STOP",
  "usage": {"total_tokens": 120}
}
```

Frontend mapping
- The frontend does not call this service directly; it's used by API endpoints in `backend/api/ai.py` and generator services (e.g., `backend/services/generators/world/*`) invoked when the UI requests generation.

Notes & learning points
- API key resolution order: per-user `UserSettings` → environment variables → Vertex AI fallback.
- Uses async `client.aio.models.generate_content` to avoid blocking the FastAPI event loop.
- Handles safety blocks and returns structured metadata for UI usage.

Related files
- `backend/api/ai.py` — exposes the `/api/generate` endpoint that uses this service.
- `backend/services/generators/world/*` — generator wrappers that call `ai_engine`.
- `backend/database/models/user.py` — `UserSettings` where user API keys may be stored.
