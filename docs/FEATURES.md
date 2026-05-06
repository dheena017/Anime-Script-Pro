# Anime Script Pro Features

This document summarizes the major features implemented across the Anime Script Pro website and studio experience.

## 0. Workflow Overview
- **User entry**: visitors arrive on the landing page, authenticate, and enter the studio.
- **Studio initiation**: users select a project, enter the studio interface, and choose production tools.
- **Data orchestration**: frontend routes requests through the Express orchestrator to the Python FastAPI backend.
- **AI execution**: FastAPI sends prompts and generation requests to AI providers (OpenAI, Anthropic, Groq, Gemini).
- **Live monitoring**: orchestrator health endpoints report status to Settings and System Status pages.
- **Production flow**: users iterate using world building, script generation, prompt tools, storyboard review, and screening.
- **Persistence & assets**: generated content, project metadata, and templates are stored and surfaced in the library.

## 1. Core Application Features
- **Landing / marketing page**: polished brand presentation for visitors, with high-level product messaging, feature teasers, and calls to action.
- **Authentication flows**: user onboarding via login, registration, and password recovery screens.
- **Profile & account management**: settings, profile updates, and account preferences accessible from the user dashboard.
- **Library browsing**: a searchable library interface for saved projects, templates, and assets.
- **Community hub**: shared spaces for creators to discover community projects, content, and collaboration opportunities.
- **Discover page**: curated trending and featured projects for inspiration.
- **Tutorials & help content**: guided learning resources to onboard new users into the AI studio workflow.
- **Notifications center**: centralized alerts for system updates, generation progress, and collaboration messages.
- **Pricing & billing**: subscription tier display, usage credits, and account plan management.
- **Contact / feedback**: user support pathways and direct feedback submission.
- **Terms & policy pages**: legal and compliance information for users and partners.

## 2. System & Monitoring Features
- **System health dashboard**: a dedicated `/status` page showing production readiness and overall system vitality.
- **Orchestrator telemetry**: runtime metrics, memory usage, platform details, and backend connectivity status.
- **Live AI provider status**: visibility into OpenAI, Anthropic, and Groq availability.
- **Traffic inspector**: runtime request logging and a historical traffic view for the orchestrator.
- **Request logging middleware**: detailed Express middleware captures request, status, and duration for diagnostics.
- **Settings sync status**: user-visible sync state and backend availability in the Settings page.
- **Backend health panels**: status cards that show FastAPI health and AI provider configuration at a glance.
- **Proxy-based `/api` integration**: all frontend API calls are forwarded through Express to the Python backend for unified routing.
- **Dedicated orchestrator endpoints**:
  - `/_orchestrator/health`: checks the orchestrator and backend health.
  - `/_orchestrator/ai`: reports AI provider connectivity and provider count.
  - `/_orchestrator/traffic`: returns recent request logs.

## 3. Anime Studio Production Features
- **Studio Hub**: central entrypoint for managing anime story production and creative sessions.
- **World building tools**: tools for creating world lore, geography, and setting details.
- **Character / cast management**: define characters, roles, and narrative relationships.
- **Series & episode management**: organize scripts and story arcs into series structure.
- **Script authoring**: AI-assisted script generation, editing, and storyboarding.
- **Storyboard creation**: visual planning space for scene composition and narrative flow.
- **SEO metadata planning**: generate and manage SEO content for each project.
- **Prompt generation**: tools for producing image or story prompts tailored to creative workflows.
- **Prompt library**: store, reuse, and refine prompt templates across projects.
- **Screening room**: review generated scenes, playback, and production notes.
- **Generation engine orchestration**: manage model choices, provider failover, and prompt execution flow.
- **Template library**: curated templates for common anime and storytelling structures.

## 4. Protocol & Production Modules
- **Script Architect**: high-level script generation and structure modeling.
- **Lore Oracle**: world lore synthesis and narrative continuity generation.
- **Soul Forge**: character concept generation and personality synthesis.
- **Visual Synthesizer**: image prompt generation for visuals and scene design.
- **Motion Choreographer**: motion-focused directives for camera and animation planning.
- **Showrunner**: production-level story planning, pacing, and episode sequencing.
- **SEO Master**: metadata and discoverability optimization for generated content.
- **Production Aide**: utility support for pipeline management, quick actions, and workflow acceleration.

## 5. AI / Backend Integration
- **Multi-model AI support**: built to integrate with OpenAI, Anthropic, Groq, Gemini, and other providers.
- **Python FastAPI intelligence layer**: backend core resides in `backend/fastapi_app.py` for AI orchestration and API handling.
- **Express proxy orchestrator**: `server.ts` proxies frontend requests to the backend, centralizing API behavior and health monitoring.
- **Supabase / vector DB**: architecture implies vector search and database support for world data and embeddings.
- **Stable generation fallback**: provider selection and failover logic intended for reliable AI generation.

## 6. Developer & Infrastructure Features
- **Frontend tech stack**: React, Vite, TypeScript, tailwind-style UI, and motion effects.
- **Express orchestrator**: Node server handles frontend hosting, proxy routing, and orchestrator endpoints.
- **Python backend**: `backend/` contains the AI backend, database access, and business logic.
- **Automated testing**: Playwright integration for E2E suites and validation.
- **Development commands**: `npm run dev`, `npm run studio`, and dedicated FastAPI startup scripts.
- **Production build**: `vite build` plus `esbuild` bundling for server output.
- **Docker support**: documented Docker compose workflows for multi-service local deployment.

## 7. Recommended Improvement Paths
- **Fix TypeScript build issues**: resolve compile errors, unused imports, and ESLint-style drift.
- **Standardize telemetry**: align `Settings`, `SystemStatus`, and orchestrator health data on shared service APIs.
- **Add public feature pages**: convert the feature list into a user-facing marketing and product page.
- **Document deployment**: expand environment setup, `.env` variables, and production deployment instructions.
- **Improve accessibility**: ensure pages meet responsive and accessible design best practices.
- **Strengthen backend error handling**: make proxy and FastAPI failures more robust and user-friendly.
