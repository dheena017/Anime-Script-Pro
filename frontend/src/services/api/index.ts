// ─────────────────────────────────────────────────────────────────────────────
// services/api — Master API barrel
// One-stop import for all backend API services and AI generators.
// ─────────────────────────────────────────────────────────────────────────────

// ── Studio Domain ─────────────────────────────────────────────────────────────
// Covers: AI generation, production pipeline, scenes, rendering, audio,
//         blueprint, characters, world-building, SEO, growth & AI engine.
export * from './studio';

// ── Projects ─────────────────────────────────────────────────────────────────
export { projectService, projectApi } from './projects';
export type { Project } from './projects';

// ── Library & Templates ───────────────────────────────────────────────────────
export { libraryApi } from './library';
export type { ScriptRecord, StoryboardRecord, LibraryRecentItem, LibraryOverviewData } from './library';

export { fetchCategories, fetchTemplates } from './templates';
export type { Category, ProductionTemplate } from './templates';

// ── Platform Services ─────────────────────────────────────────────────────────
export { settingsService } from './settings';
export type { UserProfile, UserBalance, MediaAsset, AIModelSettings, UserSettingsPayload } from './settings';

export { notificationService } from './notifications';
export type { Notification } from './notifications';

export { logsApi } from './logs';
export type { SystemLog } from './logs';


// ── Community & Discovery ─────────────────────────────────────────────────────
export { communityService } from './community';
export type { CommunityPost } from './community';

export { discoverService } from './discover';
export type { DiscoverItem } from './discover';

// ── Help & Onboarding ─────────────────────────────────────────────────────────
export { supportService } from './support';
export type { HelpCategory, FAQ, DocSection, DocArticle } from './support';

export { tutorialService } from './tutorials';
export type { Tutorial } from './tutorials';

