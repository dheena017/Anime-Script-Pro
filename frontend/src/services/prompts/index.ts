import * as scriptPrompts from './script';
import * as worldPrompts from './world';
import * as charactersPrompts from './characters';
import * as imagePrompts from './image';
import * as videoPrompts from './video';
import * as scenePrompts from './scene';
import * as seriesPrompts from './series';
import * as metadataPrompts from './metadata';
import * as utilsPrompts from './utils';
import * as uiPrompts from './ui';
import * as youtubeStrategiesPrompts from './youtube_strategies';

export * from './script';
export * from './world';
export * from './characters';
export * from './image';
export * from './video';
export * from './scene';
export * from './series';
export * from './metadata';
export * from './utils';
export * from './ui';
export * from './youtube_strategies';

export const PROMPT_REGISTRY = {
	script: scriptPrompts,
	world: worldPrompts,
	characters: charactersPrompts,
	image: imagePrompts,
	video: videoPrompts,
	scene: scenePrompts,
	series: seriesPrompts,
	metadata: metadataPrompts,
	utils: utilsPrompts,
	ui: uiPrompts,
	youtubeStrategies: youtubeStrategiesPrompts,
} as const;

export const PROMPT_MODULE_NAMES = Object.keys(PROMPT_REGISTRY) as Array<keyof typeof PROMPT_REGISTRY>;



