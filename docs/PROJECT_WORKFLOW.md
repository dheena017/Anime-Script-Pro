# Anime Script Pro: Project Workflow (Source of Truth)

This document defines how Anime Script Pro is expected to behave in production,
especially around generation and persistence.

## 1. System Layers

| Layer | Stack | Responsibility |
| --- | --- | --- |
| Frontend | React + Vite + TypeScript | Studio UI, module flows, local generation state |
| Orchestrator | Node/Express (`server.ts`) | API proxying, health and traffic endpoints |
| Backend | FastAPI (Python) | Business logic, persistence endpoints, auth checks |
| Data | SQLModel/SQLAlchemy + SQLite/PostgreSQL | Projects, world, cast, scripts, production artifacts |

## 2. Studio Module Pipeline

Canonical module order in Anime Studio:

1. Engine
2. World
3. Cast
4. Series
5. Script
6. Storyboard
7. SEO
8. Prompts
9. Screening
10. Assets

Generation actions update local React state first. Cross-module values are read from
`GeneratorContext` and related context slices.

## 3. Persistence Contract (Critical)

The application follows a strict manual-save contract:

1. Generation must not write to backend automatically.
2. Timers (`setTimeout`, `setInterval`) must never trigger save APIs.
3. `useEffect` hooks must never trigger save APIs.
4. Database writes are allowed only when user explicitly clicks Save.

### Allowed Save Path

`syncCore` is the canonical save pipeline and should be reached from explicit Save
button handlers only.

### Disallowed Paths

Do not persist from:

1. `handleMasterGenerate`
2. `handleWorldGenerate`
3. Streaming/generation loops (for example full-series episode generation)
4. Route-change or tab-change effects
5. Auto materialization flows in blueprint/continue actions

## 4. Create vs Update Behavior

`syncCore` must follow this sequence:

1. Resolve current project id from state/override.
2. If no id exists, create project (POST) once.
3. Capture returned `project_id` and write it to local state (`currentScriptId`).
4. Persist module content using update APIs for that id.
5. On later saves, perform updates (PUT/PATCH-style backend update paths), not new creates.

Result: first save creates, subsequent saves update the same project.

## 5. URL and Identity Rules

Project identity should be reflected in routing:

1. No-id workspace routes start under `/studio/...`.
2. After first successful save, routes should promote to `/projects/:projectId/...`.
3. Query params and active sub-route should be preserved when promoting route.

This prevents duplicate project creation caused by id loss across module transitions.

## 6. Frontend Ownership Map

Key frontend files:

1. `frontend/src/contexts/GeneratorContext.tsx`
2. `frontend/src/contexts/generator/useGeneratorLifecycle.ts`
3. `frontend/src/hooks/useGenerator.ts`
4. `frontend/src/pages/studio/AnimeStudio/Layout.tsx`
5. `frontend/src/pages/studio/AnimeStudio/*/*Layout.tsx`

Ownership guidelines:

1. Context files own shared state and save orchestration.
2. Module layout files own generation UX and explicit save actions.
3. API services under `frontend/src/services/api/` own transport details.

## 7. Backend Ownership Map

Primary backend areas:

1. `backend/fastapi_app.py` for app wiring and middleware.
2. `backend/api/` modules for feature endpoints.
3. `backend/database/` and model layers for persistence logic.

Persistence endpoints should accept explicit project ids and avoid side effects when
project id is missing.

## 8. Safe Feature Development Pattern

When adding new generated content modules:

1. Add local state in context.
2. Add generation action that updates local state only.
3. Add explicit Save button integration that calls `syncCore`.
4. Extend `syncCore` payload mapping for new content.
5. Verify no effect/timer path writes to backend.

## 9. Ghost Save Prevention Checklist

Before merging, confirm:

1. No `syncCore` calls in effects.
2. No save API calls in generation handlers except explicit Save.
3. No auto-save timers.
4. First save returns and stores project id.
5. Second save updates same id (no duplicate project creation).

Recommended command checks:

```powershell
Get-ChildItem -Path frontend/src -Recurse -Include *.ts,*.tsx |
    Select-String -Pattern 'syncCore\s*\(|/api/projects|updateContent\(|updateProject\('
```

```powershell
Get-ChildItem -Path frontend/src -Recurse -Include *.ts,*.tsx |
    Select-String -Pattern 'useEffect\(|setInterval\(|setTimeout\('
```

## 10. Local Development Commands

Frontend:

```bash
npm run dev
```

Backend:

```bash
python backend/fastapi_app.py
```

Optional full stack scripts depend on project `package.json` commands and local env.

## 11. Troubleshooting

Duplicate projects still appearing:

1. Inspect generation handlers for hidden POST/PUT calls.
2. Inspect module-specific Save handlers for direct API writes bypassing `syncCore`.
3. Confirm `currentScriptId` persists after first save.
4. Confirm route promotion to `/projects/:projectId/...` happened.

Save button appears successful but no data persisted:

1. Verify auth/user id exists.
2. Check backend logs for validation failures.
3. Confirm payload keys align with backend schemas.

---

Version: 2.0
Last updated: 2026-05-12
