// ─────────────────────────────────────────────────────────────────────────────
// Prompt Library — barrel re-exports & PROMPT_REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

import * as scriptPrompts from './scriptPrompts';
import * as worldPrompts from './worldPrompts';
import * as characterPrompts from './characterPrompts';
import * as imagePrompts from './imagePrompts';
import * as videoScenePrompts from './videoScenePrompts';
import * as seriesPrompts from './seriesPrompts';
import * as seoPromptsModule from './seoPrompts';
import * as utilsPrompts from './utilsPrompts';
import * as uiPrompts from './uiPrompts';
import * as youtubeStrategyPrompts from './youtubeStrategyPrompts';
import * as musicPrompts from './musicPrompts';
import * as audioPrompts from './audioPrompts';

export * from './scriptPrompts';
export * from './worldPrompts';
export * from './characterPrompts';
export * from './imagePrompts';
export * from './videoScenePrompts';
export * from './seriesPrompts';
export * from './seoPrompts';
export * from './utilsPrompts';
export * from './uiPrompts';
export * from './youtubeStrategyPrompts';
export * from './musicPrompts';
export * from './audioPrompts';

export const PROMPT_REGISTRY = {
	scriptPrompts,
	worldPrompts,
	characterPrompts,
	imagePrompts,
	videoScenePrompts,
	seriesPrompts,
	seoPrompts: seoPromptsModule,
	utilsPrompts,
	uiPrompts,
	youtubeStrategyPrompts,
	musicPrompts,
	audioPrompts,
} as const;

export const PROMPT_MODULE_NAMES = Object.keys(PROMPT_REGISTRY) as Array<keyof typeof PROMPT_REGISTRY>;
