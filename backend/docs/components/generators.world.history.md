# `backend/generators/world/history.py`

Purpose
- Generates historical timelines and lore for a world using the AI engine.

Key function
- `history_service.generate(project_prompt, module_prompt, context, user_id)`

Frontend mapping
- Called by `WorldEditor` when the user requests a history expansion for the world.

Related files
- `backend/services/ai_engine.py`
- `backend/api/world.py`
- `backend/docs/examples/generate_request.json`
