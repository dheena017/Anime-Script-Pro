import * as scriptPrompts from './scriptPrompts';
import * as worldPrompts from './worldPrompts';
import * as characterPrompts from './characterPrompts';
import * as imagePrompts from './imagePrompts';
import * as videoPrompts from './videoPrompts';
import * as scenePrompts from './scenePrompts';
import * as seriesPrompts from './seriesPrompts';
import * as seoPromptsModule from './seoPrompts';
import * as utilsPrompts from './utilsPrompts';
import * as uiPrompts from './uiPrompts';
import * as youtubeStrategyPrompts from './youtubeStrategyPrompts';

export * from './scriptPrompts';
export * from './worldPrompts';
export * from './characterPrompts';
export * from './imagePrompts';
export * from './videoPrompts';
export * from './scenePrompts';
export * from './seriesPrompts';
export * from './seoPrompts';
export * from './utilsPrompts';
export * from './uiPrompts';
export * from './youtubeStrategyPrompts';

export const PROMPT_REGISTRY = {
	scriptPrompts,
	worldPrompts,
	characterPrompts,
	imagePrompts,
	videoPrompts,
	scenePrompts,
	seriesPrompts,
	seoPrompts: seoPromptsModule,
	utilsPrompts,
	uiPrompts,
	youtubeStrategyPrompts,
} as const;

export const PROMPT_MODULE_NAMES = Object.keys(PROMPT_REGISTRY) as Array<keyof typeof PROMPT_REGISTRY>;
