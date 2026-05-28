# 📡 Anime Script Pro: API Documentation

This document provides a comprehensive overview of the technical endpoints available in the **Anime Script Pro** ecosystem. The system follows a dual-layer architecture:
1.  **Orchestrator Layer (Node.js)**: Serves the frontend, exposes lightweight telemetry endpoints, and proxies production API traffic to the intelligence layer.
2.  **Intelligence Layer (FastAPI)**: Hosts the AI generation endpoints, authentication, and the primary business logic.

---

## 🏛️ 1. Orchestrator Endpoints (Node.js)

These endpoints are served directly by the Express orchestrator and are used for system monitoring and internal health checks. The orchestrator also proxies requests to the Python backend (default `http://127.0.0.1:3050`) — see Proxy Configuration below.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/_orchestrator/health` | `GET` | Returns high-level status of the orchestrator and the backend connectivity. |
| `/_orchestrator/ai` | `GET` | Reports the status of AI providers (OpenAI, Anthropic, Groq) and active count. |
| `/_orchestrator/traffic` | `GET` | Returns a list of the 20 most recent requests handled by the orchestrator. |

Notes:
- The orchestrator listens on the port defined by the `PORT` environment variable or `3000` by default.
- The orchestrator proxy forwards traffic to the FastAPI backend at `BACKEND_URL` (defaults to `http://127.0.0.1:3050`).

---

## 🧠 2. Intelligence Layer Endpoints (FastAPI)
All production API requests are proxied to the Python backend. The orchestrator proxy accepts both requests that already start with `/api` and requests without the `/api` prefix: it rewrites non-`/api` paths by prefixing `/api` before forwarding. The backend is 100% asynchronous and utilizes sqlalchemy for persistence.

### 🛠️ Core System
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Root greeting and system status. |
| `/health` | `GET` | Simple health check for the Python process. |
| `/docs` | `GET` | **Interactive Swagger UI** (Full API Reference). |
| `/redoc` | `GET` | ReDoc documentation interface. |
| `/api/debug-env` | `GET` | (Dev Only) Returns internal environment configuration. |

Note: These endpoints are exposed by the FastAPI backend and are reachable through the orchestrator proxy at `/api/*` (for example, `/api/health`, `/api/docs`).

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
| **Todos** | `/api/todos` | Personal production task queue management. |

---

## 🛠️ 4. Proxy Configuration
The Orchestrator uses `http-proxy-middleware` to route traffic to the Intelligence Layer.

- **Target / Default Backend URL**: `http://127.0.0.1:3050` (override with `BACKEND_URL` env var).
- **Path rewrite behavior**: Requests that already start with `/api` are forwarded unchanged. Requests that do not begin with `/api` are rewritten by prefixing `/api` before being forwarded. This allows both `/api/generate` and `/generate` to reach `/api/generate` on the backend.
- **Proxy mountpoints**:
  - `/api` → proxied to backend (primary API surface, includes generation, auth, projects, scripts, etc.)
  - `/outputs` → proxied to backend for static outputs and generated artifacts
  - `/ws` → proxied with `ws: true` for WebSocket upgrades (real-time telemetry and notifications)
- **Timeouts**: `proxyTimeout` and `timeout` are set large to accommodate heavy AI generation (600000ms by default).
- **Development bypass**: In non-production environments the proxy sets `x-bypass-auth: true` to help local login flows.

---

## 📊 5. Monitoring & Logs
For real-time observability, you can visit the following internal dashboards:
- **FastAPI Logs**: Check your terminal running `npm run backend`.
- **Orchestrator Logs**: Check your terminal running `npm run dev`.
- **Traffic Dashboard**: Access `/_orchestrator/traffic` via your browser.

Orchestrator endpoints:
- `/_orchestrator/health`
- `/_orchestrator/traffic`
- `/_orchestrator/ai`

To start services locally:
```bash
# Start the Node.js orchestrator/dev server (serves frontend + proxy)
npm run dev

# Start the FastAPI backend (default port 3050)
npm run backend
```

---
<div align="center">
  <sub>Anime Script Pro API Manifest v2.0 - Optimized for God Mode.</sub>
</div>
