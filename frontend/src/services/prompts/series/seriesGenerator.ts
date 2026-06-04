import { generateText } from "../core";
import { validateTextInput, validatePositiveInteger, parseStructuredJson } from "../utils";
import { 
  normalizeEpisodeArray, 
  normalizeEpisodeDetailSpec, 
  createSeriesGenerationPrompt,
  SeriesPromptOptions,
  validateSeriesPromptInput,
  validateSeriesContentTypeInput,
  validateSeriesEpisodeCountInput,
  validateSeriesScaffoldingOptions
} from "./seriesUtils";

import {
  SERIES_PLAN_GENERATION_PROMPT,
  REGENERATE_SINGLE_SCENE_PROMPT,
  EXPAND_EPISODE_DETAILS_PROMPT
} from "./seriesPrompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";
import * as JSON5 from "json5";
import { cleanJson } from "@/lib/api-utils";

type ExpandEpisodeDetailsOptions = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
};

type GenerateSeriesPlanOptions = {
  session?: string;
  episodesPerSession?: number;
  totalEpisodes?: number;
  episode?: string;
  episodeOffset?: number;
  numScenes?: number;
  numFrames?: number;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
};

type AdjacentScenesContext = {
  prevScene?: any;
  nextScene?: any;
};

// ── PRIMARY EXPORTED APIs ────────────────────────────────────────────────────

export async function generateSeriesPlan(
  prompt: string,
  model: string = TEXT_MODELS[0].id,
  contentType: string = "Anime",
  episodeCount: number = 5,
  worldLore?: string,
  characterProfiles?: string,
  expandSequentially: boolean = false,
  opts?: GenerateSeriesPlanOptions,
) {
  validateSeriesPromptInput(prompt);
  validateSeriesContentTypeInput(contentType);
  validateSeriesEpisodeCountInput(episodeCount);
  validateSeriesScaffoldingOptions(opts);

  // PRE-BATCH for large episode counts to avoid overwhelming the model
  const BATCH_THRESHOLD = 15;
  if (episodeCount > BATCH_THRESHOLD && !expandSequentially) {
    console.info(
      `[Series Lab] Pre-batching: ${episodeCount} episodes requested. Splitting into batches of ${BATCH_THRESHOLD} to avoid truncation.`
    );
    const batchSize = BATCH_THRESHOLD;
    const batches: any[] = [];
    
    for (let i = 0; i < episodeCount; i += batchSize) {
      const remaining = Math.min(batchSize, episodeCount - i);
      try {
        console.info(`[Series Lab] Generating batch: episodes ${i + 1}-${i + remaining} of ${episodeCount}`);
        const batch = await generateSeriesPlan(
          prompt,
          model,
          contentType,
          remaining,
          worldLore,
          characterProfiles,
          true,
          {
            ...(opts || {}),
            episode: String(i + 1),
            episodeOffset: (opts?.episodeOffset ?? 0) + i,
            numScenes: opts?.numScenes,
            numFrames: opts?.numFrames,
          },
        );
        if (Array.isArray(batch) && batch.length > 0) {
          batches.push(...batch);
        }
      } catch (err) {
        console.error(
          `[Series Lab] Batch generation failed for episodes ${i + 1}-${i + remaining}:`,
          err,
        );
      }
    }
    
    if (batches.length === episodeCount) {
      console.info(`[Series Lab] Pre-batching succeeded: generated all ${episodeCount} episodes.`);
      return normalizeEpisodeArray(batches, opts?.episodeOffset ?? 0, opts?.numFrames);
    } else if (batches.length > 0) {
      console.warn(
        `[Series Lab] Pre-batching partial: generated ${batches.length} of ${episodeCount} episodes.`
      );
      return normalizeEpisodeArray(batches, opts?.episodeOffset ?? 0, opts?.numFrames);
    } else {
      console.error(
        `[Series Lab] Pre-batching failed: generated 0 episodes. Returning empty array.`
      );
      return [];
    }
  }

  const resolvedSceneCount = opts?.numScenes as number;
  const systemInstruction = SERIES_PLAN_GENERATION_PROMPT(
    contentType,
    episodeCount,
    worldLore ?? "",
    characterProfiles ?? "",
    resolvedSceneCount,
  );
  const userPrompt = createSeriesGenerationPrompt(
    prompt,
    contentType,
    episodeCount,
    worldLore,
    characterProfiles,
    opts,
  );

  const maxTokens =
    opts?.maxTokens ??
    Math.min(24000, Math.max(8192, 4000 + episodeCount * 1500));

  const text = await generateText(
    model,
    userPrompt,
    systemInstruction,
    opts?.temperature ?? 0.85,
    maxTokens,
    opts?.topP ?? 0.95,
    opts?.topK ?? 40,
    Math.min(600000, 300000 + episodeCount * 15000),
    worldLore,
    characterProfiles,
  );

  if (!text) throw new Error("Series generation returned an empty response.");
  const result = parseStructuredJson<any[]>(text, "array");
  if (!Array.isArray(result)) {
    console.error(
      "[Series Lab] AI response was not an array. Raw start:",
      text.slice(0, 500),
    );
    throw new Error(
      "Series synthesis did not return a JSON array. Check browser console for raw output.",
    );
  }

  if (result.length !== episodeCount) {
    console.warn(
      `[Series Lab] Expected ${episodeCount} episodes but received ${result.length}. Attempting chunked fallback generation.`,
    );

    if (expandSequentially) {
      console.warn(
        "[Series Lab] expandSequentially already enabled; returning partial result.",
      );
      return result;
    }

    const chunkSize = episodeCount > 12
      ? 12
      : Math.max(1, Math.floor(episodeCount / 2));
    const pieces: any[] = [];
    for (let i = 0; i < episodeCount; i += chunkSize) {
      const remaining = Math.min(chunkSize, episodeCount - i);
      try {
        const chunk = await generateSeriesPlan(
          prompt,
          model,
          contentType,
          remaining,
          worldLore,
          characterProfiles,
          true,
          {
            ...(opts || {}),
            episode: String(i + 1),
            episodeOffset: (opts?.episodeOffset ?? 0) + i,
            numScenes: opts?.numScenes,
            numFrames: opts?.numFrames,
          },
        );
        if (Array.isArray(chunk) && chunk.length > 0) {
          pieces.push(...chunk);
        }
      } catch (err) {
        console.error(
          `[Series Lab] Chunk generation failed for range ${i + 1}-${i + chunkSize}:`,
          err,
        );
      }
    }

    if (pieces.length === episodeCount) {
      console.info(
        "[Series Lab] Chunked generation succeeded with full episode set.",
      );
      return normalizeEpisodeArray(pieces, opts?.episodeOffset ?? 0, opts?.numFrames);
    }

    if (pieces.length > 0) {
      console.warn(
        `[Series Lab] Chunked generation produced ${pieces.length} episodes (requested ${episodeCount}). Returning best-effort result without further retries.`,
      );
      return normalizeEpisodeArray(pieces, opts?.episodeOffset ?? 0, opts?.numFrames);
    }

    console.warn(
      `[Series Lab] Chunked generation produced no usable episodes for ${episodeCount} requested. Returning the original partial result.`,
    );
    return normalizeEpisodeArray(result, opts?.episodeOffset ?? 0, opts?.numFrames);
  }

  return normalizeEpisodeArray(result, opts?.episodeOffset ?? 0);
}

export async function regenerateSingleScene(
  scene: any,
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  characterProfiles: string,
  adjacentScenesContext?: { prevScene?: any; nextScene?: any },
): Promise<any> {
  const prompt = REGENERATE_SINGLE_SCENE_PROMPT(
    worldLore,
    characterProfiles,
    episodeSummary,
    adjacentScenesContext,
    scene
  );

  try {
    const res = await generateText(
      model,
      prompt,
      "You are an expert anime director. Return ONLY a valid JSON object representing the single regenerated scene.",
      0.8,
      2048,
      0.9,
      20,
      60000,
      worldLore,
      characterProfiles,
    );
    if (!res) return scene;
    const parsed = parseStructuredJson<any>(res, "object");
    return normalizeEpisodeDetailSpec(parsed) || parsed || scene;
  } catch (err) {
    console.error("regenerateSingleScene failed:", err);
    return scene; 
  }
}

export async function expandEpisodeDetails(
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  characterProfiles: string,
  numScenes: number = 18,
  opts?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  },
): Promise<any> {
  const epId =
    episodeSummary?.episode || episodeSummary?.episode_number || "01";

  const act1Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act3Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act2Scenes = Math.max(1, numScenes - act1Scenes - act3Scenes);
  const maxTokens =
    opts?.maxTokens ?? Math.min(24000, Math.max(8192, 9000 + numScenes * 350));

  const prompt = EXPAND_EPISODE_DETAILS_PROMPT(
    episodeSummary,
    numScenes,
    act1Scenes,
    act2Scenes,
    act3Scenes,
    epId
  );

  try {
    const res = await generateText(
      model,
      prompt,
      "You are an expert anime showrunner and scriptwriter. You must strictly follow the user's output schema and return ONLY a valid JSON object.",
      opts?.temperature ?? 0.8,
      maxTokens,
      opts?.topP ?? 0.9,
      opts?.topK ?? 20,
      120000,
      worldLore,
      characterProfiles,
    );

    if (!res) return episodeSummary;

    const parsed = parseStructuredJson<any>(res, "object");

    const normalized = normalizeEpisodeDetailSpec(parsed);
    if (normalized) {
      return { ...episodeSummary, detailed_episode_spec: normalized };
    }
    return episodeSummary;
  } catch (err) {
    console.error("expandEpisodeDetails failed:", err);
    return episodeSummary;
  }
}

// ── INTERNAL HELPERS ─────────────────────────────────────────────

export * from "./seriesUtils";

export * from "./seriesPrompts";
