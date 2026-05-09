# Backend Complete File Inventory & Extended API Reference

This document extends the architecture docs to cover **all 24 API routers**, complete database models, services, and utility files in the backend.

---

## 📊 Complete API Router Inventory (All 24)

| # | Router | File | Purpose | Key Models | Frontend UI |
|----|--------|------|---------|------------|------------|
| 1 | **Admin** | `api/admin.py` | User management, admin oversight | User | Admin dashboard |
| 2 | **Auth** | `api/auth.py` | Login, tokens, session mgmt | User (auth) | Login form |
| 3 | **AI** | `api/ai.py` | Unified AI generation | GenerationRequest/Response | Generation panel |
| 4 | **Cast** | `api/cast.py` | Character manifest, relationships | CastManifest, CastMember | Cast editor |
| 5 | **Community** | `api/community.py` | Collaboration, sharing | (shared projects) | Collab features |
| 6 | **Episodes** | `api/episodes.py` | Episode CRUD, scenes | Episode, Scene | Episode editor |
| 7 | **Growth** | `api/growth.py` | User progression, analytics | GrowthStrategy, UserBalance | Growth dashboard |
| 8 | **Help** | `api/help.py` | Help docs, FAQs, tutorials | HelpCategory, FAQ, DocArticle | Help center |
| 9 | **Library** | `api/library.py` | Saved prompts, reusable chars | SavedPrompt, ReusableCharacter | Prompt library |
| 10 | **Logs** | `api/logs.py` | System logs, audit trails | SystemLog | Logs viewer |
| 11 | **Media** | `api/media.py` | File uploads, asset mgmt | MediaAsset, UserFavorite | Media upload UI |
| 12 | **Notifications** | `api/notifications.py` | Real-time alerts, updates | Notification | Notification center |
| 13 | **Production** | `api/production.py` | Production state, content mgmt | ProjectContent | Production view |
| 14 | **Projects** | `api/projects.py` | Project/series CRUD | Project, ProductionSession | Projects list |
| 15 | **Scenes** | `api/scenes.py` | Scene CRUD, ordering | Scene, Episode | Scene editor |
| 16 | **Scripts** | `api/scripts.py` | Script mgmt, export, versions | Script, Storyboard, ScriptVersion | Script editor |
| 17 | **SEO** | `api/seo.py` | SEO metadata for content | SEOEntry | (backend only) |
| 18 | **Sessions** | `api/sessions.py` | Production sessions, workspaces | ProductionSession, Project | Session list |
| 19 | **Stats** | `api/stats.py` | Analytics, metrics, dashboards | Category, Scene | Analytics page |
| 20 | **Templates** | `api/templates.py` | Pre-built templates, presets | Template | Template gallery |
| 21 | **Todos** | `api/todos.py` | Task mgmt, progress tracking | Todo | Todo list |
| 22 | **Tutorials** | `api/tutorials.py` | Onboarding, learning content | Tutorial, Category | Tutorial flows |
| 23 | **Users** | `api/users.py` | Profile, settings, balance | UserProfile, UserSettings, UserBalance | Account page |
| 24 | **World** | `api/world.py` | Main world endpoint | WorldLore, CastManifest | World overview |

---

## 🌍 World Generation Subrouters (8 endpoints under `/api/world/`)

| File | Endpoint | Purpose | Prompt Source | Generator |
|------|----------|---------|---------------|-----------|
| `world/manifest.py` | `POST /generate/manifest` | World concept, visual palette | `MANIFEST_GENERATION_PROMPT` | `generators/world/manifest.py` |
| `world/history.py` | `POST /generate/history` | Timeline, historical ages, events | `HISTORY_GENERATION_PROMPT` | `generators/world/history.py` |
| `world/factions.py` | `POST /generate/factions` | Political groups, power dynamics | `FACTIONS_GENERATION_PROMPT` | `generators/world/factions.py` |
| `world/powers.py` | `POST /generate/powers` | Magic/power systems, progression | `POWERS_GENERATION_PROMPT` | `generators/world/powers.py` |
| `world/architecture.py` | `POST /generate/architecture` | Cities, buildings, urban design | `ARCHITECTURE_GENERATION_PROMPT` | `generators/world/architecture.py` |
| `world/atlas.py` | `POST /generate/atlas` | Geography, climate, regions, maps | `ATLAS_GENERATION_PROMPT` | `generators/world/atlas.py` |
| `world/culture.py` | `POST /generate/culture` | Customs, values, social norms | `CULTURE_GENERATION_PROMPT` | `generators/world/culture.py` |
| `world/systems.py` | `POST /generate/systems` | Magic rules, tech level, resources | `SYSTEMS_GENERATION_PROMPT` | `generators/world/systems.py` |

---

## 🗄️ Complete Database Models (8 files)

### `backend/database/models/user.py`
**Purpose:** User identity, authentication, settings, balance
- `User` (from `fastapi_users_db_sqlalchemy.sqlalchemyBaseUserDB`) — user account, email, password hash
- `UserProfile` — display name, avatar, bio
- `UserSettings` — preferences, AI API keys, features enabled
- `UserBalance` — credits, subscription tier, usage quotas
- `UserFavorite` — saved/favorited content (media, templates)

### `backend/database/models/projects.py`
**Purpose:** Project/series lifecycle and episodes
- `Project` — main series/show record (title, description, owner)
- `ProductionSession` — workspace session, timestamps
- `Episode` — episode metadata (number, title, beats)
- `Scene` — individual scene (description, characters, vfx)
- `Series` — alias/grouped projects
- `Script` — screenplay document
- `ScriptVersion` — version history of scripts
- `Storyboard` — visual breakdown of scenes
- `ProjectContent` — general content store for projects
- `Todo` — task tracking within projects
- `NarrativeBeat` — story beat/narrative unit
- `ScreeningRoomEntry` — screening/playback record

### `backend/database/models/world.py`
**Purpose:** World-building content and characters
- `WorldLore` — core world manifest (lore_text, atlas_json, meta)
- `CastManifest` — full cast for a project
- `CastMember` — individual character with DNA, relationships
- `Faction` — political groups
- `PowerSystem` — magic/ability mechanics
- `Culture` — social/cultural details
- `History` — timeline and historical events
- `Geography` — terrain, climate, regions

### `backend/database/models/assets.py`
**Purpose:** Media files and templates
- `Template` — pre-built project/episode templates
- `MediaAsset` — uploaded files (images, videos, audio)
- `UserFavorite` — user's bookmarked assets
- `GrowthStrategy` — preset growth plans for users

### `backend/database/models/engine.py`
**Purpose:** System-level config and telemetry
- `EngineConfig` — global app configuration
- `AITelemetry` — AI usage metrics, latency, tokens

### `backend/database/models/logs.py`
**Purpose:** Audit and system logs
- `SystemLog` — timestamped events (source, level, message)

### `backend/database/models/system.py`
**Purpose:** Platform-wide content and metadata
- `Category` — content categories (Action, Drama, etc.)
- `Tutorial` — learning content
- `HelpCategory` — help section grouping
- `FAQ` — frequently asked questions
- `DocSection` — documentation sections
- `DocArticle` — individual doc articles
- `SEOEntry` — SEO metadata for projects/content

### `backend/database/connection.py`
**Purpose:** Database initialization and session management
- `DATABASE_URL` — connection string (SQLite or Postgres)
- `engine` — synchronous SQLAlchemy engine (for one-off ops)
- `async_engine` — async engine for FastAPI
- `async_session` — async session factory
- `AsyncSession` — type hint for async DB sessions
- `get_async_session()` — dependency to inject DB session into routers

### `backend/database/postgres.py`
**Purpose:** Postgres-specific helpers
- `get_db_connection()` — raw DB connection helper

---

## 🛠️ Services & Core Logic

### Core AI & Auth
| File | Purpose | Key Classes/Functions |
|------|---------|----------------------|
| `services/ai_engine.py` | LLM abstraction (Gemini/Vertex) | `AIEngine`, `build_genai_client()`, `call_ai()` |
| `services/user_manager.py` | FastAPI-Users integration | `UserManager`, `fastapi_users`, `auth_backend` |

### Generators
| Folder | Purpose | Pattern |
|--------|---------|---------|
| `services/generators/series.py` | (empty, reserved) | Series-level orchestration |
| `services/generators/world/*` | 8 world generators | Each wraps `ai_engine.generate_*()` |

Example generator structure:
```python
from backend.services.ai_engine import ai_engine

class ManifestService:
    async def generate(self, title, prompt, tone, content_type, user_id):
        return await ai_engine.generate_manifest(title, prompt, tone, content_type, user_id)

manifest_service = ManifestService()
```

### Prompts & Validators
| File | Purpose | Key Functions |
|------|---------|----------------|
| `services/prompts/world/world.py` | System instructions for AI | `MANIFEST_GENERATION_PROMPT()`, `HISTORY_GENERATION_PROMPT()`, etc. (8 functions) |
| `services/validators/world/world.py` | Validation logic | `validate_world_prompt()`, `validate_content_type()` |

### Caching
| File | Purpose |
|------|---------|
| `services/cache/dataCache.py` | `WorldCache` class for caching generated world data |

---

## 🔧 Utilities

### `backend/utils/auth_utils.py`
- `pwd_context` — Argon2/bcrypt password hashing
- `SECRET_KEY` — JWT signing key (from env)
- `ALGORITHM` — HS256
- `verify_password(password, hashed)` — check password
- `get_password_hash(password)` — hash a password
- `create_access_token(data, expires_delta)` — create JWT
- `create_refresh_token(data)` — create refresh JWT

### `backend/utils/deps.py`
- `get_auth_user_id(request: Request)` — FastAPI dependency to extract user ID from JWT
- Used by all protected endpoints to verify authorization

### `backend/utils/neural_utils.py`
- `NeuralTracer` — middleware for request tracing
- `log_neural_event(message, category, level)` — structured logging
- `wrap_neural_response(data, signal_id)` — JSON response wrapper

---

## 📝 Additional Backend Files

### Scripts (`backend/scripts/`)
| File | Purpose |
|------|---------|
| `list_models.py` | List available Gemini models |
| `migrate_db.py` | SQLite → Postgres migration helper |
| `seeds/seed_all.py` | Initialize DB with demo data |
| `seeds/seed_cast_manifest.py` | Seed sample cast/characters |
| `seeds/seed_global.py` | Seed categories, templates |
| `seeds/seed_growth.py` | Seed growth strategies |
| `seeds/seed_templates.py` | Seed project templates |

### Tests (`backend/tests/`)
| Type | Files | Purpose |
|------|-------|---------|
| **Integration** | `test_production_workflow.py`, `test_template_api.py`, `test_world_modules.py` | End-to-end API workflows |
| **Unit** | `test_gemini_async_client.py`, `test_gemini_error_handling.py`, `test_gemini_rest_api.py`, `test_gemini_sync_client.py` | AI client & error handling |

### Frontend Docs (`backend/static/`)
| File | Purpose |
|------|---------|
| `swagger-custom.css` | Custom Swagger UI styling |
| `swagger-ui-bundle.js` | Swagger UI library |
| `swagger-ui.css` | Swagger UI styles |
| `redoc.standalone.js` | ReDoc library |
| `docs/*.css` | API documentation styles |

### Templates (`backend/templates/`)
| File | Purpose |
|------|---------|
| `index.html` | Server-side rendered landing page |

### Database Data (`backend/database/`)
| File | Purpose |
|------|---------|
| `seed.sql` | SQL seed data (categories, templates) |
| `user_storage.sql` | Production schema for user data |
| `website_content.sql` | Production schema for platform content |
| `tutorials.json` | Tutorial content as JSON |
| `anime_script_pro.db` | Current SQLite database |
| `backups/*.db.backup_*` | Database snapshots |

---

## 🔀 Complete Request Flow (End-to-End Example)

### Flow: User Creates a World, Generates Manifest, Saves to DB

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                        │
│  - User fills out "Create World" form                          │
│  - Submits POST /api/world/generate/manifest                   │
│  - Headers: Authorization: Bearer <jwt_token>                   │
│  - Body: { title, description, tone, content_type }             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASTAPI APP (backend/fastapi_app.py)                            │
│  - Middleware: CORSMiddleware, NeuralTracer, SlowAPI            │
│  - Routes request to /api/world router                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ API ROUTER (backend/api/world/manifest.py)                      │
│  - Handler: async def generate_manifest()                       │
│  - Dependency: get_auth_user_id() validates JWT                │
│  - Calls: manifest_service.generate(...)                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ GENERATOR SERVICE (backend/services/generators/world/manifest.py)
│  - Class: ManifestService                                        │
│  - Method: async def generate()                                 │
│  - Calls: ai_engine.generate_manifest(...)                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ AI ENGINE (backend/services/ai_engine.py)                        │
│  - Class: AIEngine                                              │
│  - Method: async def generate_manifest()                        │
│  - 1. Fetch system prompt from:                                 │
│      backend/services/prompts/world/world.py (MANIFEST_GENERATION_PROMPT)
│  - 2. Get API key from:                                         │
│      a) User settings (DB)                                      │
│      b) Environment variables                                   │
│  - 3. Build genai.Client (Gemini or Vertex AI)                 │
│  - 4. Call: client.aio.models.generate_content()              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ GOOGLE GENAI (External)                                         │
│  - Receives prompt + system instruction                         │
│  - Returns generated world manifest text                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ AI ENGINE (response parsing)                                     │
│  - Extract: text, finish_reason, usage_metadata                 │
│  - Check: safety filters                                        │
│  - Return: GenerationResponse (schema.py)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ API ROUTER (return response)                                     │
│  - Optionally save to DB (WorldLore model)                      │
│  - Return JSON: { text, model_used, usage, latency_ms }         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                        │
│  - Receives 200 OK + JSON response                              │
│  - Displays generated world manifest in UI                      │
│  - User can save/refine and proceed to next module              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 File Statistics

| Component | Count | Purpose |
|-----------|-------|---------|
| **API Routers** | 24 | HTTP endpoints organized by domain |
| **World Subrouters** | 8 | AI generation endpoints for world-building |
| **Database Models** | 50+ | sqlalchemy definitions across 8 model files |
| **Generator Services** | 8 | Wrapper services for world generation |
| **Prompt Templates** | 8 | System instructions for AI (MANIFEST, HISTORY, FACTIONS, etc.) |
| **Utility Modules** | 3 | Auth, deps, neural tracing |
| **Test Files** | 8 | Integration + unit tests |
| **Seed Scripts** | 5 | Database initialization |
| **Documentation Files** | 20+ | Generated docs in `backend/docs/components/` |

---

## 🎓 Where to Start (by Goal)

### Goal: Understand User Authentication
1. `backend/api/auth.py` — Login/token endpoints
2. `backend/services/user_manager.py` — FastAPI-Users setup
3. `backend/utils/auth_utils.py` — JWT and password utilities
4. `backend/database/models/user.py` — User schema
5. `backend/utils/deps.py` — Dependency injection for auth

### Goal: Build a New Generator
1. `backend/services/prompts/world/world.py` — Study existing prompts
2. `backend/services/generators/world/manifest.py` — Copy pattern
3. `backend/services/ai_engine.py` — Add new method
4. `backend/api/world/manifest.py` — Create new endpoint
5. Test with mock server or Postman

### Goal: Add a New CRUD Endpoint
1. `backend/database/models/projects.py` — Define schema
2. `backend/api/projects.py` — Create router and endpoints
3. `backend/utils/deps.py` — Use auth dependency
4. Test with Postman or curl

### Goal: Understand AI Pipeline
1. `backend/api/ai.py` — Entry point
2. `backend/services/ai_engine.py` — Core logic
3. `backend/services/generators/world/*.py` — Specific generators
4. `backend/services/prompts/world/world.py` — Prompt engineering
5. `backend/database/models/world.py` — Data persistence

---

## 🔗 Related Documentation

- **Main README:** `backend/ARCHITECTURE_FOR_LEARNERS.md` — Quick start
- **API Reference:** `backend/docs/COMPLETE_API_REFERENCE.md` — Previous comprehensive map
- **Per-File Docs:** `backend/docs/components/*.md` — Focused breakdown by file
- **Examples:** `backend/docs/examples/` — Sample payloads
- **Mock Server:** `backend/docs/mock_server/app.py` — Local testing on port 8082
