import seriesPlanningPromptRaw from './skill/seriesPlanningPrompt.md?raw';
import seriesPlanGenerationPromptRaw from './skill/seriesPlanGenerationPrompt.md?raw';
import regenerateSingleScenePromptRaw from './skill/regenerateSingleScenePrompt.md?raw';
import expandEpisodeDetailsPromptRaw from './skill/expandEpisodeDetailsPrompt.md?raw';
import seriesGenerationUserPromptRaw from './skill/seriesGenerationUserPrompt.md?raw';
import episodeResponseContractRaw from './skill/episodeResponseContract.md?raw';
import sessionResponseContractRaw from './skill/sessionResponseContract.md?raw';
import sceneResponseContractRaw from './skill/sceneResponseContract.md?raw';
import imagePromptRequirementsRaw from './skill/imagePromptRequirements.md?raw';
import videoPromptRequirementsRaw from './skill/videoPromptRequirements.md?raw';
import audioPromptRequirementsRaw from './skill/audioPromptRequirements.md?raw';

export type SeriesRequest = {
  title?: string;
  targetAudience?: string;
  format?: 'TV' | 'OVA' | 'Movie' | 'Shorts' | string;
  seasons?: number;
  episodesPerSeason?: number;
  episodeRuntimeMinutes?: number;
  desiredTone?: string;
  themeKeywords?: string[];
  constraints?: { contentWarnings?: string[]; rating?: string };
  distributionNotes?: string;
};

export const SERIES_PLANNING_PROMPT = (placeholderNames = {
  world: 'world',
  characters: 'characters',
  seriesRequest: 'seriesRequest',
}) => {
  return seriesPlanningPromptRaw
    .replace(/{{WORLD_VAR}}/g, placeholderNames.world)
    .replace(/{{CHARACTERS_VAR}}/g, placeholderNames.characters)
    .replace(/{{SERIES_REQUEST_VAR}}/g, placeholderNames.seriesRequest);
};

import { validateSeriesPlanInputs, buildSeriesPlanPrompt, safeSeriesPlanGeneration } from './seriesUtils';

export const SERIES_PLAN_GENERATION_PROMPT = (
  contentType: string,
  episodeCount: number,
  worldLore: string,
  characterProfiles: string,
  numScenes: number = 18
) => safeSeriesPlanGeneration(contentType, episodeCount, worldLore, characterProfiles, numScenes);

// ==================== REFACTORED GENERATOR PROMPTS ====================

export const REGENERATE_SINGLE_SCENE_PROMPT = (
  worldLore: string,
  characterProfiles: string,
  episodeSummary: any,
  adjacentScenesContext: any,
  scene: any
) => {
  return regenerateSingleScenePromptRaw
    .replace(/{{WORLD_LORE}}/g, worldLore)
    .replace(/{{CHARACTER_PROFILES}}/g, characterProfiles)
    .replace(/{{EPISODE_SUMMARY}}/g, JSON.stringify(episodeSummary, null, 2))
    .replace(/{{PREV_SCENE}}/g, adjacentScenesContext?.prevScene ? JSON.stringify(adjacentScenesContext.prevScene, null, 2) : "None (Start of Episode/Act)")
    .replace(/{{NEXT_SCENE}}/g, adjacentScenesContext?.nextScene ? JSON.stringify(adjacentScenesContext.nextScene, null, 2) : "None (End of Episode/Act)")
    .replace(/{{SCENE}}/g, JSON.stringify(scene, null, 2))
    .replace(/{{SCENE_ID}}/g, scene.scene_id);
};

export const EXPAND_EPISODE_DETAILS_PROMPT = (
  episodeSummary: any,
  numScenes: number,
  act1Scenes: number,
  act2Scenes: number,
  act3Scenes: number,
  epId: string
) => {
  return expandEpisodeDetailsPromptRaw
    .replace(/{{EPISODE_SUMMARY}}/g, JSON.stringify(episodeSummary, null, 2))
    .replace(/{{NUM_SCENES}}/g, String(numScenes))
    .replace(/{{ACT1_SCENES}}/g, String(act1Scenes))
    .replace(/{{ACT2_SCENES}}/g, String(act2Scenes))
    .replace(/{{ACT3_SCENES}}/g, String(act3Scenes))
    .replace(/{{EP_ID}}/g, epId);
};

export const CREATE_SERIES_GENERATION_PROMPT = (
  prompt: string,
  contentType: string,
  episodeCount: number,
  worldContext: string,
  castContext: string,
  sessionsText: string | number,
  episodesPerSessionText: string | number,
  totalEpisodesText: string | number,
  scenesText: string | number,
  framesText: string,
  partialRequestNote: string,
  framesRule: string,
  sessionResponseContract: string,
  episodeResponseContract: string,
  imagePromptRequirements: string,
  videoPromptRequirements: string,
  audioPromptRequirements: string,
  episodeContext: string,
  targetScenesContext: string
) => {
  return seriesGenerationUserPromptRaw
    .replace(/{{CONTENT_TYPE}}/g, contentType)
    .replace(/{{PROMPT}}/g, prompt)
    .replace(/{{WORLD_CONTEXT}}/g, worldContext)
    .replace(/{{CAST_CONTEXT}}/g, castContext)
    .replace(/{{SESSIONS_TEXT}}/g, String(sessionsText))
    .replace(/{{EPISODES_PER_SESSION_TEXT}}/g, String(episodesPerSessionText))
    .replace(/{{TOTAL_EPISODES_TEXT}}/g, String(totalEpisodesText))
    .replace(/{{SCENES_TEXT}}/g, String(scenesText))
    .replace(/{{FRAMES_TEXT}}/g, framesText)
    .replace(/{{EPISODE_COUNT}}/g, String(episodeCount))
    .replace(/{{PARTIAL_REQUEST_NOTE}}/g, partialRequestNote)
    .replace(/{{FRAMES_RULE}}/g, framesRule)
    .replace(/{{SESSION_RESPONSE_CONTRACT}}/g, sessionResponseContract)
    .replace(/{{EPISODE_RESPONSE_CONTRACT}}/g, episodeResponseContract)
    .replace(/{{IMAGE_PROMPT_REQUIREMENTS}}/g, imagePromptRequirements)
    .replace(/{{VIDEO_PROMPT_REQUIREMENTS}}/g, videoPromptRequirements)
    .replace(/{{AUDIO_PROMPT_REQUIREMENTS}}/g, audioPromptRequirements)
    .replace(/{{EPISODE}}/g, episodeContext)
    .replace(/{{TARGET_SCENES}}/g, targetScenesContext);
};

export const CREATE_EPISODE_RESPONSE_CONTRACT = (
  episodeCount: number,
  sceneResponseContract: string
) => {
  return episodeResponseContractRaw
    .replace(/{{EPISODE_COUNT}}/g, String(episodeCount))
    .replace(/{{SCENE_RESPONSE_CONTRACT}}/g, sceneResponseContract);
};

export const CREATE_SESSION_RESPONSE_CONTRACT = (
  sessionCount: string | number,
  episodesPerSession: string | number,
  sceneCount: string | number,
  totalEpisodes: string | number
) => {
  return sessionResponseContractRaw
    .replace(/{{SESSION_COUNT}}/g, String(sessionCount))
    .replace(/{{EPISODES_PER_SESSION}}/g, String(episodesPerSession))
    .replace(/{{SCENE_COUNT}}/g, String(sceneCount))
    .replace(/{{TOTAL_EPISODES}}/g, String(totalEpisodes));
};

export const CREATE_SCENE_RESPONSE_CONTRACT = (
  sceneCount: string | number,
  framesRule: string
) => {
  return sceneResponseContractRaw
    .replace(/{{SCENE_COUNT}}/g, String(sceneCount))
    .replace(/{{FRAMES_RULE}}/g, framesRule);
};

export const CREATE_IMAGE_PROMPT_REQUIREMENTS = () => {
  return imagePromptRequirementsRaw;
};

export const CREATE_VIDEO_PROMPT_REQUIREMENTS = () => {
  return videoPromptRequirementsRaw;
};

export const CREATE_AUDIO_PROMPT_REQUIREMENTS = () => {
  return audioPromptRequirementsRaw;
};

export default SERIES_PLANNING_PROMPT;
