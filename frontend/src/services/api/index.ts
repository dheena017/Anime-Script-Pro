// ─────────────────────────────────────────────────────────────────────────────
// services/api — Master API barrel
// One-stop import for all backend API services and AI generators.
// ─────────────────────────────────────────────────────────────────────────────

// ── AI Generation Pipeline (text, image, video, scene, audio, music) ─────────
export * from './gemini';

// ── Backend REST APIs ────────────────────────────────────────────────────────

// Production & Content
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

// Engine & Telemetry
export { engineApi } from './engine';
export type { EngineConfig, TelemetryData } from './engine';

// Characters & World
export { characterApi } from './characters';
export type { CharacterManifest } from './characters';

export { worldApi } from './world';
export type { WorldLore } from './world';

// Projects
export { projectService, projectApi } from './projects';
export type { Project } from './projects';

// SEO & Growth
export { seoApi } from './seo';
export type { SeoEntry } from './seo';

export { growthApi } from './growth';
export type { GrowthStrategy } from './growth';

// Library & Templates
export { libraryApi } from './library';
export type { ScriptRecord, StoryboardRecord, LibraryRecentItem, LibraryOverviewData } from './library';

export { fetchCategories, fetchTemplates } from './templates';
export type { Category, ProductionTemplate } from './templates';

// Platform Services
export { settingsService } from './settings';
export type { UserProfile, UserBalance, MediaAsset, AIModelSettings, UserSettingsPayload } from './settings';

export { notificationService } from './notifications';
export type { Notification } from './notifications';

export { logsApi } from './logs';
export type { SystemLog } from './logs';

export { todoService } from './todos';
export type { Todo } from './todos';

// Community & Discovery
export { communityService } from './community';
export type { CommunityPost } from './community';

export { discoverService } from './discover';
export type { DiscoverItem } from './discover';

// Support & Tutorials
export { supportService } from './support';
export type { HelpCategory, FAQ, DocSection, DocArticle } from './support';

export { tutorialService } from './tutorials';
export type { Tutorial } from './tutorials';

// Audio (re-export for backward compat with AudioTab)
export { generateAudio } from './audio';
export type { AudioRequest, AudioResponse } from './audio';
