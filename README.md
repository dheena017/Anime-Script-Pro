🌌 Anime Script Pro: God Mode Engine
</h1>
  <p><i>The Final Frontier of Autonomous Multimodal Production</i></p>
</div>

---

## 🎭 The Studio Core
Welcome to the most advanced AI-driven anime production suite. **Anime Script Pro** orchestrates a full-stack creative pipeline—from the initial spark of world lore to high-fidelity screening metadata—using a "God Mode" one-prompt construction loop.

### 🏛️ Engineering Manifest
For deep-dive technical documentation on our multimodal synthesis engine and cinematic design system, refer to the [Studio Architect Guide](./STUDIO_ARCHITECT_GUIDE.md) and our [API Documentation](./API_DOCUMENTATION.md).

---

## 🚀 Multimodal Synthesis Engine
The studio has been modernized to handle a complex **Image-to-Video** pipeline:
- **Neural DNA Synthesis**: Generates persistent visual storyboard frames.
- **Motion Engine Ignition**: Transforms static frames into cinematic 5s production clips.
- **Async Backend Protocols**: High-concurrency production handled via FastAPI + AsyncSession.

---

## 🛠️ Integrated Tech Stack
- **Frontend**: React + Vite + Cinematic Noir Design (Glassmorphism & Neural Pulse)
- **Intelligence Layer**: FastAPI + Python (100% Async / SQLModel)
- **Neural Models**: Multi-Model Swarm (Gemini 2.5 Pro / Flash, Imagen-3, Veo-2.0)
- **Verification**: Playwright E2E + Backend Unit/Integration Suite
- **Feature Docs**: See [FEATURES.md](./FEATURES.md) for a detailed feature catalog.

---

## ⚙️ Direct Deployment

### 0. Prerequisites - Python 3.11+ Installation
Before starting the backend, ensure Python 3.11 or higher is installed:

**Option A: Using Windows Package Manager (Recommended)**
```powershell
winget install Python.Python.3.11
```

**Option B: Direct Download**
Visit [python.org](https://www.python.org/downloads/) and download Python 3.11+ for Windows. **During installation, ensure "Add Python to PATH" is checked.**

> ⚠️ **Troubleshooting**: If you see `"Python was not found"` despite installation, disable the Microsoft Store Python alias at Settings > Apps > Advanced app settings > App execution aliases.

### 1. Unified Studio Start (Local Hybrid Mode)
Start the frontend and AI proxy in one single command:
```bash
npm run dev
```

### 2. Python AI Backend (Manual Start)

**Option A: Using Virtual Environment (Recommended)**
```powershell
# Create virtual environment (first time only)
python -m venv .\backend\venv

# Activate it
.\backend\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r .\backend\requirements.txt

# Run FastAPI server
python -m uvicorn backend.fastapi_app:app --reload --port 8080
```

**Option B: Using System Python (If venv has issues)**
```powershell
# Install dependencies globally
python -m pip install -r .\backend\requirements.txt

# Run FastAPI server directly
python -m uvicorn backend.fastapi_app:app --reload --port 8080
```

The backend will be available at `http://127.0.0.1:8080`

### 3. Environment Configuration (`.env`)
Ensure your environment is primed for autonomous generation:
```env
# AI Models
GEMINI_API_KEY=[GCP_API_KEY]
OPENAI_API_KEY=[ENCRYPTION_KEY]
ANTHROPIC_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db_name
MATHESAR_SECRET_KEY=long_random_string
```

---

## 🛡️ Sovereign Audit & Quality Assurance
Our validation suite is now organized into specialized technical sectors:

### Run Full Studio Audit
```bash
npm run test
```

### 🛡️ Test Manifest
| Sector | Purpose | Location |
| :--- | :--- | :--- |
| **Unit** | AI Connectivity & REST Protocols | `backend/tests/unit/` |
| **Integration** | Production Workflow Logic | `backend/tests/integration/` |
| **E2E** | User Production Flows (Playwright) | `tests/e2e/` |
| **Service** | Multi-Agent Orchestration | `tests/backend_services/` |

---

## 💻 Full Studio Command Reference

### Development & Live-Ops
| Command | Result |
| :--- | :--- |
| `npm run dev` | Start the Express server + Vite Frontend in hybrid mode. |
| `npm run build` | Generate the optimized production-grade bundle. |
| `npm run start` | Launch the production server bundle. |
| `npm run backend` | Start the FastAPI backend server on port 8080. |
| `python -m uvicorn backend.fastapi_app:app --reload --port 8080` | Start FastAPI with auto-reload on code changes. |
| `docker compose up -d` | Launch the entire 3-tier studio architecture. |

### 🛡️ Sovereign Audit (Testing)
| Command | Result |
| :--- | :--- |
| `npm run test` | Execute the full 49-test autonomous audit suite. |
| `npm run test:ui` | Open the Interactive Test Runner (Visual Debugging). |
| `npx playwright test tests/studio_phases` | Audit only the Phase 1–4 roadmap modules. |
| `npx playwright test tests/backend_services` | Verify API and AI Model integrity specifically. |
| `npx playwright show-report` | Launch the diagnostic portal with videos and traces. |

### 🐳 Infrastructure (Docker & Database)
| Command | Result |
| :--- | :--- |
| `docker compose up -d` | Launch Orchestrator, FastAPI, and Mathesar. |
| `docker compose ps` | Check the health of all studio containers. |
| `docker compose logs -f` | Stream real-time events from all services. |

---

## 🎨 Design Language: NOIR
The studio utilizes a high-contrast **Noir System** designed for focus and creative depth.
- **Glassmorphism**: Subtle backdrops for neural stream interactions.
- **Micro-Animations**: Real-time feedback on AI generation events.
- **Atomic Selectors**: Precision targeting for all studio interaction pins.

---

<div align="center">
  <sub>Built for the next generation of digital architects.</sub>
</div>


# Remove the broken venv
Remove-Item -Recurse -Force .\backend\venv

# Create a fresh venv
python -m venv .\backend\venv

# Activate it
.\backend\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r .\backend\requirements.txt

# Run FastAPI
python -m uvicorn backend.fastapi_app:app --reload --port 8080

