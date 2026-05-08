🌌 Anime Script Pro: God Mode Engine
</h1>
  <p><i>The Final Frontier of Autonomous Multimodal Production</i></p>
</div>

---

## 🎭 The Studio Core
Welcome to the most advanced AI-driven anime production suite. **Anime Script Pro** orchestrates a full-stack creative pipeline—from the initial spark of world lore to high-fidelity screening metadata—using a "God Mode" one-prompt construction loop.

### 🏛️ Engineering Manifest
For deep-dive technical documentation on our multimodal synthesis engine and cinematic design system, refer to the [Studio Architect Guide](./docs/STUDIO_ARCHITECT_GUIDE.md) and our [API Documentation](./docs/API_DOCUMENTATION.md).


---

## 🎨 Studio Core Modules

Anime Script Pro is divided into 11 specialized production modules, each managed by a dedicated AI protocol.

*   **🌍 World Builder**: 10-tab foundation for architecting Lore, Powers, Factions, Architecture, Atlas, Culture, and Systems.
*   **👥 Cast System**: Comprehensive Character Registry with DNA profiles, relationship matrices, and dynamic growth tracking.
*   **🎬 Series Manager**: Production-level planning for episode arcs, timelines, and season roadmaps.
*   **✍️ Script Editor**: 11-column high-fidelity screenplay format with integrated dialogue and metadata synthesis.
*   **🖼️ Storyboard**: Visual composition engine for camera angles, scene framing, and animatic sequences.
*   **📈 SEO Manager**: Built-in optimization for YouTube, Netflix, and streaming platform metadata.
*   **⌨️ Prompts Manager**: Advanced prompt engineering for Image, Motion, Style, and Negative constraints.
*   **📽️ Screening Room**: 9-phase automated render and QA workflow for final production review.
*   **🧠 Engine**: Central command for AI model configuration and generation orchestration.
*   **📦 Assets Manager**: Centralized library for Audio, Moodboards, Images, and Video assets.
*   **🛡️ Protocols**: 8 Specialized AI Agents (Lore Oracle, Soul Forge, Script Architect, etc.).

---

## 🚀 Multimodal Synthesis Engine
The studio has been modernized to handle a complex **Image-to-Video** pipeline:
- **Neural DNA Synthesis**: Generates persistent visual storyboard frames.
- **Motion Engine Ignition**: Transforms static frames into cinematic 5s production clips.
- **Async Backend Protocols**: High-concurrency production handled via FastAPI + async_session.

---

## 🛠️ Integrated Tech Stack
- **Frontend**: React + Vite + Cinematic Noir Design (Glassmorphism & Neural Pulse)
- **Intelligence Layer**: FastAPI + Python (100% Async / SQLModel)
- **Neural Models**: Multi-Model Swarm (Gemini 2.5 Pro / Flash, Imagen-3, Veo-2.0)
- **Verification**: Playwright E2E + Backend Unit/Integration Suite
- **Feature Docs**: See [FEATURES.md](./docs/FEATURES.md) for a detailed feature catalog.

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

.venv/Scripts/python.exe -m uvicorn backend.fastapi_app:app --reload --port 8080

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
- **Micro-Animations**: Real-time feedback on AI generation events.
- **Atomic Selectors**: Precision targeting for all studio interaction pins.

---

<div align="center">
  <sub>Built for the next generation of digital architects.</sub>
</div>





## 🏛️ Neural Blueprint Gallery

The following blueprints document the high-fidelity architecture and production logic of the Anime Script Pro ecosystem.

### 📡 System & Flow
![Architecture Diagram](docs/flow-images/anime_script_pro_architecture_1778054153988.png)
![System Flowchart](docs/flow-images/anime_script_pro_flowchart_cinematic_1778054550386.png)
![Production Pipeline](docs/flow-images/anime_script_pro_production_pipeline_ultra_detailed_1778055343002.png)

### 🏗️ Studio Infrastructure
![Master Infographic](docs/flow-images/anime_script_pro_master_infographic_1778055093056.png)
![Full UI Sitemap](docs/flow-images/anime_script_pro_full_sitemap_ui_map_1778055257341.png)
![Anime Studio Deep Dive](docs/flow-images/anime_studio_deep_dive_sitemap_1778055541066.png)

### 🧠 Module Blueprints
![World Architect Deep Dive](docs/flow-images/world_architect_deep_dive_blueprint_1778055694454.png)
![Cast Forge Deep Dive](docs/flow-images/cast_dna_deep_dive_blueprint_1778055859963.png)
![Series Blueprint Deep Dive](docs/flow-images/series_blueprint_deep_dive_1778055886671.png)
![Script Architect Deep Dive](docs/flow-images/script_architect_deep_dive_blueprint_1778055910858.png)
![Storyboard Visualizer Deep Dive](docs/flow-images/storyboard_visual_deep_dive_blueprint_1778055942261.png)
![SEO Master Deep Dive](docs/flow-images/seo_master_deep_dive_blueprint_1778055965823.png)


### ⚙️ Backend Core
![Neural Engine Deep Dive](docs/flow-images/neural_engine_deep_dive_blueprint_final_1778055992557.png)
![Backend Infrastructure Flow](docs/flow-images/backend_neural_infrastructure_flow_1778056103418.png)

#   A n i m e - S c r i p t - P r o 
 
 