# Implementation Plan - Enhanced Single-Pass Series Generation

We will enhance the single-pass series generation to dynamically scale the generated schema's complexity depending on the requested episode count. When the count is small (<= 4 episodes), it will generate the full detailed scene specification. When the count is large (> 4 episodes), it will generate a compact episode outline (with an empty acts/scenes list), allowing downstream modules and user interaction to expand the episode details dynamically in the background or on-demand. This prevents the AI response from being truncated due to the model's output token limits.

## User Review Required

> [!IMPORTANT]
> **Dynamic Schema Complexity**: We will introduce a `compact` flag to prompt construction. 
> - If `episodeCount <= 4`, the full acts and scenes schema is generated.
> - If `episodeCount > 4`, the prompt requests an empty `acts: []` array, avoiding scene generation in the initial pass and keeping token usage small.

---

## Proposed Changes

### Prompts Subsystem

#### [MODIFY] [seriesPrompts.ts](file:///f:/Project/Anime-Script-Pro/frontend/src/services/prompts/seriesPrompts.ts)
- Modify `buildSeriesPlanPrompt` to accept a `compact?: boolean` parameter.
- If `compact` is true, change the required JSON schema output contract to return `"detailed_episode_spec"` with an empty `"acts": []` array, and adjust related scene instructions.
- Update `safeSeriesPlanGeneration` and the exported `SERIES_PLAN_GENERATION_PROMPT` helper to accept and pass the `compact` flag.

---

### Series Generator Service

#### [MODIFY] [seriesGenerator.ts](file:///f:/Project/Anime-Script-Pro/frontend/src/services/generators/seriesGenerator.ts)
- Add a new helper function `createCompactEpisodeResponseContract` that defines the compact episode schema (acts/scenes omitted).
- Update `createSeriesGenerationPrompt` to accept a `compact` flag and dynamically choose between the full and compact contracts.
- In `generateSeriesPlan`, pass `episodeCount > 4` as the `compact` flag to both `SERIES_PLAN_GENERATION_PROMPT` and `createSeriesGenerationPrompt`.

---

## Verification Plan

### Automated/Manual Verification
1. Configure a series with `Episodes = 2`. Confirm that a single-pass call is fired returning the full schema (episodes + full scene breakdowns).
2. Configure a series with `Episodes = 12`. Confirm that a single-pass call is fired returning the compact schema (episodes with `acts: []`).
3. Verify that the frontend compiles successfully using `tsc --noEmit`.
