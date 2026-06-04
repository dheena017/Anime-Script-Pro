// ─────────────────────────────────────────────────────────────────────────────
// studio/ — Anime Studio Domain Barrel
// Covers: production pipeline, scenes, rendering, audio,
//         cast/characters, world-building, SEO, growth, and AI engine.
// ─────────────────────────────────────────────────────────────────────────────

// ── AI Generation Pipeline ────────────────────────────────────────────────────
export * from './gemini';

// ── Production & Rendering ────────────────────────────────────────────────────
export { productionApi } from './production';
export type { ProjectContent } from './production';

export { seriesRenderService } from './seriesRender';
export type {
  ServerRenderJobRequest,
  ServerRenderJobCreateResponse,
  ServerRenderJobStatus,
  ServerRenderJobDeleteResponse
} from './seriesRender';

export { manifestScenes, getScenes } from './scenes';
export type { ManifestRequest } from './scenes';

// ── Audio ─────────────────────────────────────────────────────────────────────
export { generateAudio } from './audio';
export type { AudioRequest, AudioResponse } from './audio';

// ── Blueprint ─────────────────────────────────────────────────────────────────
export { generateBlueprintMarkdown, downloadBlueprintMarkdown } from './blueprintMarkdownGenerator';

// ── Cast & Characters ─────────────────────────────────────────────────────────
export { characterApi } from './characters';
export type { CharacterManifest } from './characters';

// ── World-Building ────────────────────────────────────────────────────────────
export { worldApi } from './world';
export type { WorldLore } from './world';

// ── SEO ───────────────────────────────────────────────────────────────────────
export { seoApi } from './seo';
export type { SeoEntry } from './seo';

// ── Growth & Strategy ─────────────────────────────────────────────────────────
export { growthApi } from './growth';
export type { GrowthStrategy } from './growth';

// ── AI Engine & Telemetry ─────────────────────────────────────────────────────
export { engineApi } from './engine';
export type { EngineConfig, TelemetryData } from './engine';
