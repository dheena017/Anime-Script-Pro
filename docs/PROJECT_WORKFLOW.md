# 🌌 Anime-Script-Pro: The Master Guide & Workflow

Welcome, Architect. This document is the comprehensive "Source of Truth" for the **Anime-Script-Pro** production suite. It is designed for you and your team to navigate, build, and scale this AI-powered studio with confidence.

---

## 🏗️ 1. Architecture: The "Engine"
The system operates on a dual-engine architecture:

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + TS | The "Interface" (Nexus Studio) |
| **Backend** | FastAPI (Python) | The "Core" (AI Logic & Database) |
| **Database** | SQLModel + SQLite | The "Memory" (Persistent Lore & Projects) |
| **Styling** | Tailwind + Vanilla CSS | The "Aesthetic" (Glassmorphism & Glow) |

---

## 📁 2. Detailed Directory Map

### 🖥️ Frontend (`/src`)
*   `pages/`: Full-scale production modules (e.g., `Studio.tsx`, `Projects.tsx`).
*   `components/`:
    *   `ui/`: Atomic components (Buttons, Inputs, Cards).
    *   `studio/`: High-level production tools (e.g., `NeuralConsole`, `AITelemetry`).
*   `contexts/`: Global state management.
    *   `AppContext.tsx`: User profile, notifications, and core project state.
    *   `GeneratorContext.tsx`: AI generation state and live logs.
*   `services/`: The bridge to the backend.
    *   `api/`: Dedicated fetchers for each backend module (e.g., `projectService.ts`).
*   `lib/`: Logic utilities (e.g., `api-utils.ts`, `utils.ts` for styling).
*   `hooks/`: Custom React hooks for reusable logic (e.g., `useGenerator.ts`).

### ⚙️ Backend (`/backend`)
*   `fastapi_app.py`: Main entry point. Handles middleware (CORS, Logging, Auth).
*   `api/`: Route controllers. Each file corresponds to a production feature.
*   `models/`: Database schema definitions using SQLModel.
    *   `projects.py`: **Core Model.** Contains Projects, Sessions, Episodes, and Lore.
    *   `user.py`: Authentication and user settings.
*   `database.py`: Manages the SQLite connection and Async Sessions.
*   `deps.py`: Security layer. Extracts user identities from tokens.
*   `ai_engine.py`: The interface to the LLM (Gemini/OpenAI) for content generation.

---

## 🔄 3. The "Production Cycle" (Feature Flow)
When adding a new feature (e.g., "Narrative Beats"), follow this strict pattern to maintain system integrity:

### Step 1: Memory (Database Model)
Define the structure in `backend/models/projects.py`:
```python
class NarrativeBeat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="projects.id")
    content: str
```

### Step 2: Protocol (Backend API)
Expose the data in `backend/api/projects.py`:
```python
@router.post("/beats")
async def create_beat(beat: NarrativeBeat, session: async_session = Depends(get_async_session)):
    session.add(beat)
    await session.commit()
    return beat
```

### Step 3: Transmission (Frontend Service)
Map the API in `src/services/api/projectService.ts`:
```typescript
export const projectService = {
  createBeat: async (data: any) => apiRequest('/api/beats', { method: 'POST', body: data }),
};
```

### Step 4: Interface (UI Component)
Consume the data in a page using `framer-motion` and the `Nexus` design system.

---

## 🎨 4. The "Nexus" Design System
The studio uses a premium **Glassmorphism** aesthetic. Follow these tokens:

*   **Primary Glow**: `oklch(0.6 0.25 250)` (Cyan-Blue).
*   **Background**: `#080809` (Deep Charcoal).
*   **Glass Effect**: Use the `.glass` class for panels.
*   **Technical Cards**: Use the `.technical-card` class for AI-driven data displays.
*   **Animations**: Use `motion.div` with `initial={{ opacity: 0, y: 10 }}` for smooth entry.

---

## 🔑 5. Security & Auth
*   **Local Development**: Auth is managed by the FastAPI backend using JWT tokens stored in `localStorage`. 
*   **Database Persistence**: All data is stored locally in `anime_script_pro.db` (SQLite).
*   **User ID**: The `get_auth_user_id` dependency in the backend ensures data privacy by extracting user identity from the local JWT.

---

## 🛠️ 6. Common Commands & Troubleshooting

### Deployment
*   `npm run dev`: Starts the Vite studio.
*   `python backend/fastapi_app.py`: Starts the Neural Engine API.

### Database
*   **Reset DB**: Delete `anime_script_pro.db` and restart the backend. It will auto-seed.
*   **Manual Seed**: Run `python backend/seed_all.py` to restore core templates.

### Errors
*   **401 Unauthorized**: Ensure your `.env` has `ENV=development`.
*   **500 Internal Error**: Check the backend terminal; Loguru will show a detailed trace.
*   **CORS Error**: Ensure `fastapi_app.py` has `allow_origins=["*"]` during local dev.

---

## 🤖 7. AI Pairing Strategy (How to work with me)
When asking the AI (Antigravity) for help, use these keywords for better results:
*   "Follow the **Nexus** aesthetic" (For beautiful UI).
*   "Use the **Project Model** pattern" (For database changes).
*   "Check the **Service bridge**" (For API connectivity issues).

---

*Architected by Antigravity | v1.2.0 | 2026*
