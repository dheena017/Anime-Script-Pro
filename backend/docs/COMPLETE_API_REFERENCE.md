# Backend Architecture — Complete Reference

This document maps all `backend/api/` routers, services, generators, and databases for learning and understanding how the frontend connects to the backend.

## 📋 Complete API Router Map

| Router | File | Prefix | Key Endpoints | Frontend Domain |
|--------|------|--------|----------------|-----------------|
| **Admin** | `api/admin.py` | `/api/admin` | `GET /users` | Admin dashboard / user management |
| **Auth** | `api/auth.py` | `/api/auth` | `POST /token`, `POST /login` | Login, auth flows, token refresh |
| **AI Engine** | `api/ai.py` | `/api` | `POST /generate` | Content generation (unified endpoint) |
| **Cast** | `api/cast.py` | `/api/cast` | `GET /{user_id}`, `POST /{user_id}` | Character manifest, cast management |
| **Community** | `api/community.py` | `/api/community` | (social/collab features) | Collaboration, sharing |
| **Episodes** | `api/episodes.py` | `/api/episodes` | `GET`, `POST`, `PUT`, `DELETE /{id}` | Episode list, episode editor |
| **Growth** | `api/growth.py` | `/api/growth` | (user progression/analytics) | User stats, growth tracking |
| **Help** | `api/help.py` | `/api/help` | (support/docs) | Help center, documentation |
| **Library** | `api/library.py` | `/api/library` | `GET/POST /prompts`, `GET/POST /characters` | Saved prompts, reusable characters |
| **Logs** | `api/logs.py` | `/api/logs` | (audit/diagnostics) | System logs, debug traces |
| **Media** | `api/media.py` | `/api/media` | (file uploads/storage) | Image/video uploads |
| **Notifications** | `api/notifications.py` | `/api/notifications` | (alerts, updates) | Real-time notifications |
| **Production** | `api/production.py` | `/api/production` | `GET/{user_id}`, `POST/{user_id}` | Production state, project content |
| **Projects** | `api/projects.py` | `/api/projects` | `GET`, `POST`, `PUT /{id}` | Project list, project details |
| **Scenes** | `api/scenes.py` | `/api/scenes` | `GET`, `POST`, `PUT /{id}` | Scene editor, scene list |
| **Scripts** | `api/scripts.py` | `/api/scripts` | `GET`, `POST`, `PUT /{id}` | Script management, export |
| **Stats** | `api/stats.py` | `/api/stats` | (analytics endpoints) | Analytics dashboard |
| **Templates** | `api/templates.py` | `/api/templates` | (pre-built templates) | Template library |
| **Todos** | `api/todos.py` | `/api/todos` | (task management) | Task/todo tracking |
| **Tutorials** | `api/tutorials.py` | `/api/tutorials` | (onboarding/help) | Tutorial content |
| **Users** | `api/users.py` | `/api/users` | `GET /me`, `PUT /me` | Account settings, profile |
| **World** | `api/world.py` | `/api/world` | `GET`, `POST /generate/*` | World editor, world overview |
| **World Subrouters** | `api/world/*.py` | `/api/world` | `POST /generate/{type}` | Specific world generation (see below) |

## 🗺️ World Generation Subrouters (api/world/)

| File | Endpoint | Purpose | Generator |
|------|----------|---------|-----------|
| `manifest.py` | `POST /generate/manifest` | World name, concept, visual palette | `generators/world/manifest.py` |
| `history.py` | `POST /generate/history` | Historical timeline, ages, events | `generators/world/history.py` |
| `factions.py` | `POST /generate/factions` | Political groups, power dynamics | `generators/world/factions.py` |
| `powers.py` | `POST /generate/powers` | Magic/power systems, progression | `generators/world/powers.py` |
| `architecture.py` | `POST /generate/architecture` | Cities, structures, urban design | `generators/world/architecture.py` |
| `atlas.py` | `POST /generate/atlas` | Geography, climate, regions | `generators/world/atlas.py` |
| `culture.py` | `POST /generate/culture` | Customs, values, social structures | `generators/world/culture.py` |
| `systems.py` | `POST /generate/systems` | Magic systems, tech, resource rules | `generators/world/systems.py` |

## 🧠 Generator Services & AI Engine Flow

```
Frontend Request
    ↓
API Router (e.g., /api/world/generate/manifest)
    ↓
API Handler calls generator service
    ↓
Generator Service (backend/services/generators/world/*.py)
    ↓
AIEngine.generate_manifest() or similar
    ↓
AI Client (Google Gemini / Vertex AI)
    ↓
LLM returns generated text
    ↓
Save to Database (backend/database/models/)
    ↓
Return JSON response to Frontend
```

## 📂 Service Layer — Generators & Validators

### Generators (`backend/services/generators/`)
- `series.py` — (empty, reserved for series-level orchestration)
- `world/manifest.py` — wraps `ai_engine.generate_manifest()`
- `world/history.py` — wraps `ai_engine.generate_history()`
- `world/factions.py` — wraps `ai_engine.generate_factions()`
- `world/powers.py` — wraps `ai_engine.generate_powers()`
- `world/architecture.py` — wraps `ai_engine.generate_architecture()`
- `world/atlas.py` — wraps `ai_engine.generate_atlas()`
- `world/culture.py` — wraps `ai_engine.generate_culture()`
- `world/systems.py` — wraps `ai_engine.generate_systems()`

### Prompts (`backend/services/prompts/world/`)
- `world.py` — Contains `MANIFEST_GENERATION_PROMPT()`, `HISTORY_GENERATION_PROMPT()`, etc. (system instructions for AI)

### Validators (`backend/services/validators/world/`)
- `world.py` — Validates generated world content (schemas, constraints)

### Cache (`backend/services/cache/`)
- `dataCache.py` — In-memory caching for expensive operations (generated content, queries)

## 🗄️ Core Services

| Service | File | Purpose |
|---------|------|---------|
| **AI Engine** | `backend/services/ai_engine.py` | Abstracts Google Gemini / Vertex AI client |
| **User Manager** | `backend/services/user_manager.py` | FastAPI Users integration, JWT auth |
| **Auth Utils** | `backend/utils/auth_utils.py` | Token creation, password hashing |
| **Dependencies** | `backend/utils/deps.py` | Shared dependency injectors (auth, DB session) |
| **Neural Utils** | `backend/utils/neural_utils.py` | Logging, response wrapping, signal IDs |

## 📦 Database Models (backend/database/models/)

| Model | Purpose | Endpoint |
|-------|---------|----------|
| `user.py` | User, UserSettings (AI keys) | `/api/users` |
| `projects.py` | Project / Series metadata | `/api/projects` |
| `world.py` | WorldLore, CastManifest, other world data | `/api/world`, `/api/cast` |
| `logs.py` | Audit logs, event logs | `/api/logs` |
| `engine.py` | System state, engine config | `/api/production` |
| `assets.py` | Media files, uploads | `/api/media` |
| `system.py` | Global system settings | Admin only |

## 🔄 Request Flow Examples

### Example 1: User Creates a Project
```
Frontend: POST /api/projects
  ↓
api/projects.py: create_project()
  ↓
Save new Project model to DB
  ↓
Return Project { id, title, owner_id, ... }
  ↓
Frontend receives and displays project card
```

### Example 2: Generate World Manifest
```
Frontend: POST /api/world/generate/manifest
  Body: { title, description, tone, content_type, user_id }
  ↓
api/world/manifest.py: generate_manifest()
  ↓
services/generators/world/manifest.py: manifest_service.generate()
  ↓
services/ai_engine.py: AIEngine.generate_manifest()
  ↓
AI Client (Google Gemini) with system prompt from
    services/prompts/world/world.py: MANIFEST_GENERATION_PROMPT()
  ↓
AI returns generated world text
  ↓
Save to WorldLore model (database/models/world.py)
  ↓
Return GenerationResponse { text, model_used, usage, latency_ms }
  ↓
Frontend displays generated content
```

### Example 3: Fetch User Cast (Characters)
```
Frontend: GET /api/cast/{user_id}
  Header: Authorization: Bearer <token>
  ↓
api/cast.py: get_cast_manifest()
  ↓
Auth dependency validates user_id matches token
  ↓
Query CastManifest from DB where user_id matches
  ↓
Return CastManifest { id, user_id, characters: [...], relationships: [...] }
  ↓
Frontend displays cast in UI
```

## 🔐 Authentication & Authorization

| Component | File | Purpose |
|-----------|------|---------|
| JWT Strategy | `services/user_manager.py` | Creates/validates tokens (3600s lifetime) |
| Auth Dependency | `utils/deps.py` | `get_auth_user_id()` extracts user from token |
| Password Utils | `utils/auth_utils.py` | Hashing, verification, token creation |
| Login Endpoints | `api/auth.py` | `POST /token`, `POST /login` with dev bypass |

## 📊 Observability & Logging

| Component | File | Logs/Traces | Notes |
|-----------|------|------------|-------|
| **Request Tracing** | `fastapi_app.py` | NeuralTracer middleware | Signal IDs for correlation |
| **Structured Logging** | `utils/neural_utils.py` | loguru to console + file | JSON responses wrap errors |
| **Rate Limiting** | `fastapi_app.py` | SlowAPI configured | Per-endpoint quota management |
| **Exception Handling** | `fastapi_app.py` | Global handlers | Standardized error responses |

## 🎯 Quick Learning Paths

**Path 1: Authentication & User Management**
1. `backend/services/user_manager.py` — FastAPI Users setup
2. `backend/api/auth.py` — Login endpoints (dev bypass included)
3. `backend/utils/auth_utils.py` — Token/password utilities
4. `backend/database/models/user.py` — User schema and UserSettings

**Path 2: Content Generation (AI)**
1. `backend/api/ai.py` — `/api/generate` unified endpoint
2. `backend/services/ai_engine.py` — AI client abstraction
3. `backend/services/prompts/world/world.py` — System prompts
4. `backend/services/generators/world/*.py` — Specific generators

**Path 3: Project & Episode Management**
1. `backend/api/projects.py` — Project CRUD
2. `backend/api/episodes.py` — Episode CRUD
3. `backend/api/scenes.py` — Scene CRUD
4. `backend/database/models/projects.py` — Schema

**Path 4: World Building**
1. `backend/api/world.py` — Main world router
2. `backend/api/world/*.py` — World subrouters (manifest, history, etc.)
3. `backend/services/generators/world/*.py` — Generator implementations
4. `backend/database/models/world.py` — World schema

## 📚 All Docs Generated

Small per-file docs are in `backend/docs/components/`:
- `api.*.md` — All API routers
- `services.*.md` — Service layer
- `generators.*.md` — Generator services
- `database.*.md` — Database models
- `utils.md`, `schemas.md`, `fastapi_app.md`

See `backend/ARCHITECTURE_FOR_LEARNERS.md` for the entry point and quick-start guide.

---

**Mock Server:** `backend/docs/mock_server/app.py` (port 8082)  
**Example Payloads:** `backend/docs/examples/` (login.json, generate_request.json, generate_response.json)  
**Postman Collection:** `backend/docs/postman_collection.json`
