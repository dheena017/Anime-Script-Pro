# `backend/generators/world/manifest.py`

Purpose
- Thin wrapper that exposes the `manifest_service` to higher-level generator flows and API routes. Delegates to `backend/services/ai_engine` for AI generation.

Key function
- `manifest_service.generate(title, prompt, tone, content_type, user_id)` — returns generated manifest text.

Frontend mapping
- Called by world creation UI when the user asks to auto-generate a world manifest.

Example request/response
- See `backend/docs/examples/generate_request.json` and `backend/docs/examples/generate_response.json`.

Related files
- `backend/services/generators/world/manifest.py` — alternative location of the same service wrapper.
- `backend/api/world.py`
