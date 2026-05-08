# `backend/api/ai.py`

Purpose
- Exposes AI generation endpoints used by the frontend to request text/world/character generation.

Key endpoints
- `POST /api/generate` — Main unified generation endpoint. Accepts a `GenerationRequest` JSON and returns `GenerationResponse`.

Example request (minimal)
```json
{
  "model": "gemini-2.5-flash",
  "prompt": "Create a short anime pilot outline for a sci-fi world.",
  "systemInstruction": "You are a helpful narrative engine."
}
```

Example response (minimal)
```json
{
  "text": "...generated content...",
  "model_used": "gemini-2.5-flash",
  "finish_reason": "STOP",
  "usage": {"total_tokens": 120},
  "latency_ms": 123.45,
  "fallbacks": []
}
```

Frontend mapping
- Called from UI components that trigger content generation: e.g., `src/components/GenerationPanel`, `src/pages/create` (frontend paths may vary). The frontend should send an authenticated request with `Authorization: Bearer <token>`.

Notes
- The endpoint implements model mapping and fallbacks, inspects AI safety results, and returns structured usage metadata. For learning, use the mock server in `backend/docs/mock_server` to try example calls without real API keys.

Related files
- `backend/services/ai_engine.py` — AI client wrapper and prompt orchestration.
- `backend/docs/examples/generate_request.json` — sample request payload.
- `backend/docs/examples/generate_response.json` — sample response payload.
