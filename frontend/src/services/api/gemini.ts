// ─────────────────────────────────────────────────────────────────────────────
// AI Generation Pipeline — barrel re-exports from all generators
// This is the single entry-point for all AI-powered generation functions.
// ─────────────────────────────────────────────────────────────────────────────

// ── Core & Script ────────────────────────────────────────────────────────────
export * from "../generators/core";

// ── SEO (named exports to avoid collisions) ──────────────────────────────────
export {
  generateMetadata,
  generateYouTubeDescription,
  generateAltTexts,
  generateGrowthStrategy,
  generateDistributionStrategy
} from "../generators/seoGenerator";

// ── Visual & Media Generators ────────────────────────────────────────────────
export * from "../generators/legacyAI";

// ── Story & World Generators ─────────────────────────────────────────────────
export * from "../generators/seriesGenerator";
export * from "../generators/characterGenerator";
export * from "../generators/worldGenerator";

// ── Utilities ────────────────────────────────────────────────────────────────
export * from "../generators/legacyAI";
