# `backend/schemas.py`

Purpose
- Central location for Pydantic schema definitions shared between API endpoints. Houses request/response models like `GenerationRequest`, `GenerationResponse`, etc.

Key classes (examples)
- `GenerationRequest` — input schema for `/api/generate` endpoint.
- `GenerationResponse` — output schema with `text`, `model_used`, `usage`, `latency_ms`, etc.

Frontend mapping
- The frontend should align its request JSON structure to `GenerationRequest` when calling `/api/generate`.
- Response shapes match `GenerationResponse` so the frontend can extract usage metadata and display latency.

Example from the schema (inferred)
```python
class GenerationRequest(BaseModel):
    model: str
    prompt: str
    systemInstruction: Optional[str] = None

class GenerationResponse(BaseModel):
    text: str
    model_used: str
    finish_reason: str
    usage: Dict
    latency_ms: float
```

Related files
- `backend/api/ai.py` — uses `GenerationRequest` and `GenerationResponse`.
- `backend/docs/examples/generate_request.json` — example request payload.
