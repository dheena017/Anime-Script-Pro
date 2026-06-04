// ─────────────────────────────────────────────────────────────────────────────
// Prompt Library — barrel re-exports & PROMPT_REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

import * as worldPrompts from './world/worldGenerator';
import * as characterPrompts from './character/characterGenerator';
import * as seriesPrompts from './series/seriesGenerator';
import * as seoPromptsModule from './seo/seoGenerator';

export * from './world/worldGenerator';
export * from './character/characterGenerator';
export * from './series/seriesGenerator';
export * from './seo/seoGenerator';

export const PROMPT_REGISTRY = {
	worldPrompts,
	characterPrompts,
	seriesPrompts,
	seoPrompts: seoPromptsModule,
} as const;

export const PROMPT_MODULE_NAMES = Object.keys(PROMPT_REGISTRY) as Array<keyof typeof PROMPT_REGISTRY>;
