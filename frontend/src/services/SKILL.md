# Anime-Script-Pro Service Layer Architecture

This document defines the architecture, rules, and guidelines for the `frontend/src/services` directory in the Anime-Script-Pro project. It serves as a skill documentation for AI agents and developers working on this codebase.

## Directory Structure

The `services` directory is organized into several key subdirectories, each with a specific responsibility:

- `api/`: Contains all client-side API calls to the backend. These files should be organized by domain (e.g., `community.ts`, `projects.ts`, `settings.ts`).
- `cache/`: Handles local caching mechanisms, ensuring the application remains performant and reduces unnecessary network requests.
- `prompts/`: Contains all the logic and templates for AI generation. This is the heart of the AI capabilities of Anime-Script-Pro.
  - `character/`: Prompts and logic for generating character DNA, dynamics, and relationships.
  - `world/`: Prompts and logic for generating comprehensive world bibles, including architecture, culture, factions, lore, and power systems.
  - `series/`: Prompts and logic for generating episode structures, scenes, and narrative arcs.
  - `engine/`: Core logic for interacting with AI models (e.g., prompt construction, model fallback logic).
  - `seo/`: Prompts for generating SEO metadata.

## Core Principles

1. **Separation of Concerns**: The service layer should only contain business logic, API calls, and AI prompt management. It should NOT contain UI components or React hooks.
2. **AI Telemetry & Fallbacks**: All AI generation must emit events via `AI_EVENTS` (located in `prompts/core.ts`) to provide telemetry to the UI (e.g., `AITelemetryOverlay`). Implement graceful fallbacks for model failures.
3. **Prompt Integrity**: Prompts should be maintained as distinct Markdown (`.md`) files within their respective `skill/` directories whenever possible, rather than inline strings. This allows for easier tuning and expansion.
4. **JSON Contracts**: When an AI prompt expects JSON output, the JSON structure must be rigidly defined in the prompt, and the service must validate the output before returning it to the application.

## Modifying AI Skills

When expanding the capabilities of the AI (e.g., adding a new world-building category or a new character trait generator):
1. Create a new `.md` prompt file in the appropriate `skill/` directory (e.g., `prompts/world/skill/newCategoryPrompt.md`).
2. Ensure the prompt clearly defines the expected output format (Markdown for human-readable content, JSON for structured data).
3. Update the corresponding generator utility (e.g., `worldGenerator.ts`) to read the new prompt and process the AI response.

## Development & Linting

Always run `npm run lint` and `npm run test` after modifying files in the `services` directory to ensure type safety and prevent broken imports.
