# 📡 Anime Script Pro: API Documentation

This document provides a comprehensive overview of the technical endpoints available in the **Anime Script Pro** ecosystem. The system follows a dual-layer architecture:
1.  **Orchestrator Layer (Node.js)**: Handles frontend hosting, proxying, and system telemetry.
2.  **Intelligence Layer (FastAPI)**: Handles AI generation, database persistence, and business logic.

---

## 🏛️ 1. Orchestrator Endpoints (Node.js)
These endpoints are served directly by the Express orchestrator and are used for system monitoring and internal health checks.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/_orchestrator/health` | `GET` | Returns high-level status of the orchestrator and the backend connectivity. |
| `/_orchestrator/ai` | `GET` | Reports the status of AI providers (OpenAI, Anthropic, Groq) and active count. |
| `/_orchestrator/traffic` | `GET` | Returns a list of the 20 most recent requests handled by the orchestrator. |

---

## 🧠 2. Intelligence Layer Endpoints (FastAPI)
All frontend requests to `/api/*` are proxied to the Python backend. The backend is 100% asynchronous and utilizes SQLModel for persistence.

### 🛠️ Core System
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Root greeting and system status. |
| `/health` | `GET` | Simple health check for the Python process. |
| `/docs` | `GET` | **Interactive Swagger UI** (Full API Reference). |
| `/redoc` | `GET` | ReDoc documentation interface. |
| `/api/debug-env` | `GET` | (Dev Only) Returns internal environment configuration. |

### 🎭 Neural Engine (AI)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/generate` | `POST` | The primary entry point for AI content generation (World Lore, Scripts, etc.). |

### 🔐 Authentication & Identity
These endpoints are managed via `FastAPI Users`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/jwt/login` | `POST` | User login via JWT. |
| `/api/auth/register` | `POST` | New user registration. |
| `/api/identity/me` | `GET` | Retrieve the currently authenticated user's profile. |

---

## 📂 3. Production Modules (Proxied)
The following resource modules are proxied to the backend and handle the bulk of the studio's production logic.

| Module | Base Path | Description |
| :--- | :--- | :--- |
| **Projects** | `/api/projects` | Lifecycle management for anime projects. |
| **Scripts** | `/api/scripts` | Scene-by-scene script generation and editing. |
| **World Lore** | `/api/world` | Narrative continuity and world-building data. |
| **Characters** | `/api/characters` | Cast DNA and character profile management. |
| **Media** | `/api/media` | Image and video asset management. |
| **Production** | `/api/production` | Orchestration of the 10-state production cycle. |
| **Library** | `/api/library` | Global asset and prompt template discovery. |

---

## 🛠️ 4. Proxy Configuration
The Orchestrator uses `http-proxy-middleware` to route traffic.
- **Target**: `http://localhost:8080` (Default Backend URL)
- **Timeout**: 90 seconds (Optimized for heavy AI generation)
- **Bypass**: In development, requests include the `x-bypass-auth` header to facilitate local testing.

---

## 📊 5. Monitoring & Logs
For real-time observability, you can visit the following internal dashboards:
- **FastAPI Logs**: Check your terminal running `npm run backend`.
- **Orchestrator Logs**: Check your terminal running `npm run dev`.
- **Traffic Dashboard**: Access `/_orchestrator/traffic` via your browser.

---
<div align="center">
  <sub>Anime Script Pro API Manifest v2.0 - Optimized for God Mode.</sub>
</div>
