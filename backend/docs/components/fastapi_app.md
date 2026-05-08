# `backend/fastapi_app.py`

Purpose
- FastAPI application entry point. Sets up the app, middleware (CORS, rate limiting, tracing), exception handlers, logging, and mounts routers.

Key components
- FastAPI app initialization with OpenAPI docs and neural branding.
- Middleware stack: CORS, logging, SlowAPI rate limiter, NeuralTracer.
- Global exception handlers for validation errors, SQLAlchemy errors, and generic exceptions.
- Route mounts from `backend/api/*` routers.

Frontend mapping
- The frontend connects to the base URL where this app runs (e.g., `http://127.0.0.1:8000`). All API endpoints are exposed from this FastAPI app.
- Custom Swagger UI at `/docs` provides an interactive interface to try endpoints and test token flows.

Key takeaways
- Exception handlers convert errors to structured neural responses (JSON with signal IDs).
- Logging is centralized via `loguru` with both console and file sinks.
- Rate limiting is configured; check `app.state.limiter` for quota management.

Related files
- `backend/services/user_manager.py` — auth setup and JWT strategy.
- `backend/api/*` — all router modules imported and included.
- `backend/utils/neural_utils.py` — response wrapping and logging.
