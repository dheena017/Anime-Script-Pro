// ─────────────────────────────────────────────────────────────────────────────
// Prompt Library — barrel re-exports & PROMPT_REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

import * as worldPrompts from './worldPrompts';
import * as characterPrompts from './characterPrompts';
import * as seriesPrompts from './seriesPrompts';
import * as seoPromptsModule from './seoPrompts';
import * as uiPrompts from './uiPrompts';
import * as youtubeStrategyPrompts from './youtubeStrategyPrompts';

export * from './worldPrompts';
export * from './characterPrompts';
export * from './seriesPrompts';
export * from './seoPrompts';
export * from './uiPrompts';
export * from './youtubeStrategyPrompts';

export const PROMPT_REGISTRY = {
	worldPrompts,
	characterPrompts,
	seriesPrompts,
	seoPrompts: seoPromptsModule,
	uiPrompts,
	youtubeStrategyPrompts,
} as const;

export const PROMPT_MODULE_NAMES = Object.keys(PROMPT_REGISTRY) as Array<keyof typeof PROMPT_REGISTRY>;
