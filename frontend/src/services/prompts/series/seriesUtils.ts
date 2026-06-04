import { validateTextInput, validatePositiveInteger } from "../utils";
import {
  CREATE_SERIES_GENERATION_PROMPT,
  CREATE_EPISODE_RESPONSE_CONTRACT,
  CREATE_SESSION_RESPONSE_CONTRACT,
  CREATE_SCENE_RESPONSE_CONTRACT,
  CREATE_IMAGE_PROMPT_REQUIREMENTS,
  CREATE_VIDEO_PROMPT_REQUIREMENTS,
  CREATE_AUDIO_PROMPT_REQUIREMENTS
} from "./seriesPrompts";
import seriesPlanGenerationPromptRaw from './skill/seriesPlanGenerationPrompt.md?raw';

export type SeriesPromptOptions = {
  episode?: string;
  numScenes?: number;
  numFrames?: number;
  session?: string | number;
  episodesPerSession?: number;
  totalEpisodes?: number;
};

// ==================== GENERATOR UTILITIES ====================

export function normalizeEpisodeArray(
  episodes: any[],
  episodeOffset: number = 0,
  framesPerScene?: number,
): any[] {
  if (!Array.isArray(episodes) || episodes.length === 0) {
    return episodes;
  }

  return episodes.map((ep: any, batchIndex: number) => {
    const globalEpisodeNum = episodeOffset + batchIndex + 1;
    const episodeNumStr = String(globalEpisodeNum).padStart(2, '0');

    const normalized: any = {
      ...ep,
      episode: episodeNumStr,
      episode_number: globalEpisodeNum,
      __displayEpisodeNumber: episodeNumStr,
    };

    if (normalized.detailed_episode_spec) {
      const spec = normalized.detailed_episode_spec;

      if (!Array.isArray(spec.acts)) {
        spec.acts = [];
      }

      spec.acts = spec.acts.map((act: any, actIdx: number) => {
        if (!Array.isArray(act.scenes)) {
          act.scenes = [];
        }

        act.scenes = act.scenes.map((scene: any, sceneIdx: number) => {
          const sceneNum = actIdx + 1;
          const sceneIdPrefix = `E${episodeNumStr}_A${sceneNum}_S${String(sceneIdx + 1).padStart(2, '0')}`;

          const normalizedScene: any = {
            ...scene,
            scene_id: scene.scene_id || `${sceneIdPrefix}`,
            scene_name: scene.scene_name || scene.name || `Scene ${sceneIdx + 1}`,
          };

          const createFramesFromScene = (sceneData: any, frameIdPrefix: string): any[] => {
            const frames: any[] = [];
            const defaultFrameCount = 3;
            const requested = typeof framesPerScene === 'number' && framesPerScene > 0 ? framesPerScene : (sceneData.frame_count || defaultFrameCount);
            const frameCount = Math.max(2, Number(requested) || defaultFrameCount);

            const beats = [
              {
                name: 'Opening Beat',
                type: 'establishment',
                description: sceneData.summary?.split('.')[0] || sceneData.cold_open || 'Scene opens',
              },
              {
                name: 'Development',
                type: 'action',
                description: sceneData.conflict || 'Main action unfolds',
              },
              {
                name: 'Resolution',
                type: 'climax',
                description: sceneData.transition || 'Scene concludes',
              },
            ];

            for (let f = 0; f < frameCount; f += 1) {
              const beat = beats[Math.min(f, beats.length - 1)];
              const frameNum = String(f + 1).padStart(2, '0');
              const frameId = `${frameIdPrefix}_F${frameNum}`;

              const baseDescription = beat.description || `${beat.name} - Frame ${frameNum}`;
              const visualDir = sceneData.visual_direction || sceneData.shot_list_preview?.[f] || 'Cinematic shot';
              const audioDir = sceneData.audio_direction || sceneData.dialogue_tone || 'Ambient background';

              frames.push({
                frame_id: frameId,
                frame_description: baseDescription,
                beat_type: beat.type,
                beat_name: beat.name,
                image_prompt: sceneData.image_prompt || 
                  `${visualDir}. Frame ${frameNum} of scene: ${baseDescription}`,
                video_prompt: sceneData.video_prompt || 
                  `Camera: ${visualDir}. Motion: ${beat.type} beat with ${beat.name.toLowerCase()}`,
                audio_prompt: sceneData.audio_prompt || 
                  `${audioDir}. Foley and ambient design for ${beat.name.toLowerCase()}: ${baseDescription}`,
                music_prompt: sceneData.music_prompt || 
                  `Underscore for ${beat.name.toLowerCase()} beat. Emotional tone: ${sceneData.emotional_arc || 'dramatic'}`,
                system_rules: sceneData.system_rules || 
                  `Character continuity. Maintain established world rules. Frame ${frameNum}/${frameCount}`,
              });
            }

            return frames;
          };

          if (framesPerScene || scene.frame_count) {
            normalizedScene.frames = createFramesFromScene(normalizedScene, sceneIdPrefix);
          }

          return normalizedScene;
        });

        return act;
      });

      normalized.detailed_episode_spec = spec;
    }

    return normalized;
  });
}

export function createSeriesGenerationPrompt(
  prompt: string,
  contentType: string,
  episodeCount: number,
  worldLore?: string,
  characterProfiles?: string,
  opts?: SeriesPromptOptions,
): string {
  const worldContext = worldLore || "Standard genre rules.";
  const castContext = characterProfiles || "Generic archetypes.";
  const resolvedSceneCount = Number(opts?.numScenes);
  const resolvedFrameCount = Number(opts?.numFrames);
  const sessionCount = opts?.session !== undefined ? Number(opts.session) : Number.NaN;
  const episodesPerSession = Number(opts?.episodesPerSession);
  const resolvedTotalEpisodes = Number(opts?.totalEpisodes);
  const normalizedSessionCount = Number.isFinite(sessionCount) && sessionCount > 0 ? sessionCount : undefined;
  const normalizedEpisodesPerSession = Number.isFinite(episodesPerSession) && episodesPerSession > 0 ? episodesPerSession : undefined;
  const normalizedTotalEpisodes = Number.isFinite(resolvedTotalEpisodes) && resolvedTotalEpisodes > 0 ? resolvedTotalEpisodes : undefined;
  const scenesText = Number.isFinite(resolvedSceneCount) && resolvedSceneCount > 0 ? resolvedSceneCount : "MISSING_SCENES_PER_EPISODE";
  const framesText = Number.isFinite(resolvedFrameCount) && resolvedFrameCount > 0 ? String(resolvedFrameCount) : "OPTIONAL";
  const sessionsText = normalizedSessionCount ?? "MISSING_SESSION_COUNT";
  const episodesPerSessionText = normalizedEpisodesPerSession ?? "MISSING_EPISODES_PER_SESSION";
  const totalEpisodesText = normalizedTotalEpisodes ?? episodeCount;
  const isPartialRequest = normalizedTotalEpisodes !== undefined && normalizedTotalEpisodes !== episodeCount;

  const partialRequestNote = isPartialRequest ? `- NOTE: This is a partial generation request within a ${totalEpisodesText}-episode roadmap.` : '';
  const framesRule = Number.isFinite(resolvedFrameCount) && resolvedFrameCount > 0 ? `- Every scene object must include a "frames" array with exactly ${resolvedFrameCount} frames when frames per scene is requested.` : '';
  const framesRuleScene = Number.isFinite(resolvedFrameCount) && resolvedFrameCount > 0 ? `- Every scene MUST include a "frames" array containing exactly ${resolvedFrameCount} frame objects.
    - Each frame object must include:
      - frame_number
      - frame_id
      - frame_description
      - image_prompt
      - video_prompt
      - audio_prompt
      - music_prompt
      - system_rules
    - Frame prompts must be production-ready, deterministic, and aligned to the scene’s cinematic action.` : '';

  const sessionResponseContract = CREATE_SESSION_RESPONSE_CONTRACT(
    normalizedSessionCount ?? "MISSING_SESSION_COUNT",
    normalizedEpisodesPerSession ?? "MISSING_EPISODES_PER_SESSION",
    Number.isFinite(resolvedSceneCount) ? resolvedSceneCount : "MISSING_SCENES_PER_EPISODE",
    normalizedTotalEpisodes ?? episodeCount
  );

  const sceneResponseContract = CREATE_SCENE_RESPONSE_CONTRACT(
    Number.isFinite(resolvedSceneCount) ? resolvedSceneCount : "MISSING_SCENES_PER_EPISODE",
    framesRuleScene
  );

  const episodeResponseContract = CREATE_EPISODE_RESPONSE_CONTRACT(
    episodeCount,
    sceneResponseContract
  );

  const imagePromptRequirements = CREATE_IMAGE_PROMPT_REQUIREMENTS();
  const videoPromptRequirements = CREATE_VIDEO_PROMPT_REQUIREMENTS();
  const audioPromptRequirements = CREATE_AUDIO_PROMPT_REQUIREMENTS();

  return CREATE_SERIES_GENERATION_PROMPT(
    prompt,
    contentType,
    episodeCount,
    worldContext,
    castContext,
    sessionsText,
    episodesPerSessionText,
    totalEpisodesText,
    scenesText,
    framesText,
    partialRequestNote,
    framesRule,
    sessionResponseContract,
    episodeResponseContract,
    imagePromptRequirements,
    videoPromptRequirements,
    audioPromptRequirements,
    opts?.episode || "N/A",
    String(opts?.numScenes ?? "N/A")
  );
}

export function normalizeEpisodeDetailSpec(value: any): any | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const nestedSpec = value.detailed_episode_spec;
  if (
    nestedSpec &&
    typeof nestedSpec === "object" &&
    !Array.isArray(nestedSpec)
  ) {
    const normalizedNested = normalizeEpisodeDetailSpec(nestedSpec);
    if (normalizedNested) return normalizedNested;
  }

  if (Array.isArray(value.acts) && value.acts.length > 0) {
    return value;
  }

  for (const key of Object.keys(value)) {
    const candidate = value[key];
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      if (Array.isArray(candidate.acts) && candidate.acts.length > 0) {
        return candidate;
      }
    }
  }

  if (value.cold_open || value.coldOpen) {
    return value;
  }

  return null;
}

// ==================== PROMPT UTILITIES ====================

export function validateSeriesPromptInput(prompt: string) {
  validateTextInput(prompt, "Series prompt", 20);
}

export function validateSeriesContentTypeInput(contentType: string) {
  validateTextInput(contentType, "Content type", 2);
}

export function validateSeriesEpisodeCountInput(episodeCount: number) {
  validatePositiveInteger(episodeCount, "Episode count");
}

export function validateSeriesScaffoldingOptions(opts: any) {}

export function validateSeriesPlanInputs(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  characterProfiles: string
): void {
  if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
    throw new Error('Content type must be a non-empty string with at least 2 characters.');
  }

  if (!Number.isInteger(episodeCount) || episodeCount <= 0) {
    throw new Error('Episode count must be a positive integer.');
  }

  if (!worldLore || typeof worldLore !== 'string' || worldLore.trim().length < 20) {
    throw new Error('World lore must be a detailed string with at least 20 characters.');
  }

  if (!characterProfiles || typeof characterProfiles !== 'string' || characterProfiles.trim().length < 20) {
    throw new Error('Cast profiles must be a detailed string with at least 20 characters.');
  }

  if (episodeCount > 100) {
    throw new Error('Episode count exceeds the supported maximum of 100 episodes.');
  }
}

export function buildSeriesPlanPrompt(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  characterProfiles: string,
  numScenes: number = 18,
): string {
  return seriesPlanGenerationPromptRaw
    .replace(/{{CONTENT_TYPE}}/g, contentType)
    .replace(/{{EPISODE_COUNT}}/g, String(episodeCount))
    .replace(/{{NUM_SCENES}}/g, String(numScenes));
}

export function safeSeriesPlanGeneration(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  characterProfiles: string,
  numScenes: number = 18
): string {
  try {
    validateSeriesPlanInputs(contentType, episodeCount, worldLore, characterProfiles);
    return buildSeriesPlanPrompt(contentType, episodeCount, worldLore, characterProfiles, numScenes);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `ERROR: ${message}`;
  }
}
