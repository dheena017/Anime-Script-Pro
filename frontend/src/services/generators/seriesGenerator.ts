import { generateText } from "./core";
import { SERIES_PLAN_GENERATION_PROMPT } from "../prompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";
import * as JSON5 from "json5";
import { cleanJson } from "../../lib/api-utils";

type SeriesPromptOptions = {
  episode?: string;
  numScenes?: number;
  numFrames?: number;
  session?: string | number;
  episodesPerSession?: number;
  totalEpisodes?: number;
};

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

// Validation helpers
function validateTextInput(
  value: unknown,
  fieldName: string,
  minimumLength = 1,
  ): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length < minimumLength) {
    throw new Error(
      `${fieldName} must be at least ${minimumLength} characters long.`,
    );
  }

  return trimmed;
}

function validatePositiveInteger(
  value: unknown,
  fieldName: string,
  maximumValue?: number,
  ): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  if (typeof maximumValue === "number" && (value as number) > maximumValue) {
    throw new Error(`${fieldName} must be ${maximumValue} or fewer.`);
  }

  return value as number;
}

function validateSeriesPromptInput(prompt: string): void {
  validateTextInput(prompt, "Series prompt", 20);
}

function validateSeriesContentTypeInput(contentType: string): void {
  validateTextInput(contentType, "Content type", 2);
}

function validateSeriesEpisodeCountInput(episodeCount: number): void {
  validatePositiveInteger(episodeCount, "Episode count");
}

function validateSeriesScaffoldingOptions(opts?: GenerateSeriesPlanOptions) {
  if (!opts) {
    throw new Error(
      "Series generation requires explicit Session Count, Episodes Per Session, and Scenes Per Episode.",
    );
  }

  const sessionCount = opts.session !== undefined ? Number(opts.session) : Number.NaN;
  const episodesPerSession = Number(opts.episodesPerSession);
  const sceneCount = Number(opts.numScenes);
  const frameCount = opts.numFrames !== undefined ? Number(opts.numFrames) : undefined;

  if (!Number.isFinite(sessionCount) || sessionCount <= 0) {
    throw new Error("Session Count is required and must be a positive integer.");
  }
  if (!Number.isFinite(episodesPerSession) || episodesPerSession <= 0) {
    throw new Error("Episodes Per Session is required and must be a positive integer.");
  }
  if (!Number.isFinite(sceneCount) || sceneCount <= 0) {
    throw new Error("Scenes Per Episode is required and must be a positive integer.");
  }
  if (frameCount !== undefined && (!Number.isFinite(frameCount) || frameCount <= 0)) {
    throw new Error("Frames Per Scene must be a positive integer when provided.");
  }
}

function extractJsonBlock(
  text: string,
  openChar: "{" | "[",
  closeChar: "}" | "]",
  ): string | null {
  const startIndex = text.indexOf(openChar);
  if (startIndex < 0) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let stringDelimiter: '"' | "'" | null = null;

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === stringDelimiter) {
        inString = false;
        stringDelimiter = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      inString = true;
      stringDelimiter = character;
      continue;
    }

    if (character === openChar) {
      depth += 1;
      continue;
    }

    if (character === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function stripMarkdownFences(text: string): string {
  return text
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function findWrappedObjectCandidate(
  value: unknown,
  ): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidateKeys = [
    "detailed_episode_spec",
    "result",
    "data",
    "payload",
    "output",
  ];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate as Record<string, unknown>;
    }
  }

  return value as Record<string, unknown>;
}

function findWrappedArrayCandidate(value: unknown): unknown[] | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  const candidateKeys = ["result", "data", "payload", "output", "items"];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

// JSON / AI response parsing helpers
function escapeJsonStringNewlines(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return typeof value === "object" && value !== null ? JSON.stringify(value) : "";
  }

  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString && (char === "\n" || char === "\r")) {
      result += "\\n";
      if (char === "\r" && value[i + 1] === "\n") {
        i += 1;
      }
      continue;
    }
    result += char;
  }

  return result;
}

function repairTruncatedJsonText(raw: string): string {
  if (!raw) return "";

  let content = raw.replace(/\r\n/g, "\n");
  let inString = false;
  let escaped = false;
  const stack: string[] = [];

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack.length > 0) {
        const last = stack[stack.length - 1];
        if ((char === "}" && last === "{") || (char === "]" && last === "[")) {
          stack.pop();
        }
      }
    }
  }

  if (escaped) {
    content = content.slice(0, -1);
  }

  if (inString) {
    content += '"';
  }

  content = content.trimEnd().replace(/[,:]\s*$/, "");

  for (let i = stack.length - 1; i >= 0; i -= 1) {
    content += stack[i] === "{" ? "}" : "]";
  }

  return content;
}

function parseStructuredJson<T>(
  text: string,
  expectedShape: "array" | "object",
  ): T | null {
  const tryParse = (value: string): any | null => {
    try {
      return JSON.parse(value);
    } catch {
      try {
        return JSON5.parse(value);
      } catch {
        return null;
      }
    }
  };

  const normalizeContent = (source: string): string => {
    const stripped = stripMarkdownFences(source);
    const extracted = extractJsonBlock(
      stripped,
      expectedShape === "array" ? "[" : "{",
      expectedShape === "array" ? "]" : "}",
    );
    const target = extracted ?? stripped;
    const cleaned = cleanJson(target);
    return escapeJsonStringNewlines(typeof cleaned === "string" ? cleaned : JSON.stringify(cleaned));
  };

  const parseCandidate = (candidate: string): any | null => {
    const parsed = tryParse(candidate);
    if (parsed) return parsed;

    try {
      const cleaned = cleanJson(candidate);
      const candidateString = typeof cleaned === "string" ? cleaned : JSON.stringify(cleaned);
      const cleanedParsed = tryParse(candidateString);
      if (cleanedParsed) return cleanedParsed;
    } catch {
      // fall through to repair fallback
    }

    const repaired = repairTruncatedJsonText(candidate);
    return tryParse(repaired);
  };

  try {
    const openChar = expectedShape === "array" ? "[" : "{";
    const closeChar = expectedShape === "array" ? "]" : "}";
    const stripped = stripMarkdownFences(text);
    const extracted = extractJsonBlock(stripped, openChar as "[" | "{", closeChar as "]" | "}");

    if (extracted) {
      const candidate = escapeJsonStringNewlines(cleanJson(extracted));
      const parsed = parseCandidate(candidate);
      if (parsed) {
        if (expectedShape === "array" && Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === "object" && parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === "array") {
          const wrappedArray = findWrappedArrayCandidate(parsed);
          if (wrappedArray) return wrappedArray as unknown as T;
        }
        if (expectedShape === "object") {
          const wrappedObject = findWrappedObjectCandidate(parsed);
          if (wrappedObject) return wrappedObject as unknown as T;
        }
      }
    }
  } catch {
  }

  try {
    const normalized = normalizeContent(text);
    const parsed = parseCandidate(normalized);
    if (expectedShape === "array") {
      if (Array.isArray(parsed)) return parsed as unknown as T;
      const potentialArray = findWrappedArrayCandidate(parsed);
      if (potentialArray) return potentialArray as unknown as T;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject && Array.isArray((nestedObject as any).items)) {
          return (nestedObject as any).items as unknown as T;
        }
      }
    } else {
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject) return nestedObject as unknown as T;
      }
    }
    return parsed as unknown as T;
  } catch (err) {
    console.error("parseLooseJson failed:", err);
    return null;
  }
}

function normalizeEpisodeDetailSpec(value: any): any | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  // 1. Check nested detailed_episode_spec
  const nestedSpec = value.detailed_episode_spec;
  if (
    nestedSpec &&
    typeof nestedSpec === "object" &&
    !Array.isArray(nestedSpec)
  ) {
    const normalizedNested = normalizeEpisodeDetailSpec(nestedSpec);
    if (normalizedNested) return normalizedNested;
  }

  // 2. Direct match: if acts array is present, this is our spec
  if (Array.isArray(value.acts) && value.acts.length > 0) {
    return value;
  }

  // 3. Fallback: search keys for any object containing 'acts' array
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

  // 4. Last resort: if value has cold_open, return it
  if (value.cold_open || value.coldOpen) {
    return value;
  }

  return null;
}

// Prompt requirement builders
function createImagePromptRequirements(): string {
  return `
  IMAGE PROMPT REQUIREMENTS:
  - Every session object, every episode object, every scene object, and every frame object (if present) must include an "image_prompt" field.
  - If a scene includes a "frames" array, do not duplicate image_prompt at the scene root; place image_prompt only inside each frame object.
  - The image prompt must describe, in order:
  - subject and action
  - environment and set dressing
  - camera framing and lens choice
  - composition and focal priority
  - lighting design and contrast direction
  - palette, texture, and material cues
  - mood, genre, and style references
  - For scene-level prompts, tie the image directly to the scene’s dramatic beat and blocking.
  - For episode-level prompts, describe the visual identity of the episode as a whole, not just one frame.
  - Mention aspect ratio, depth of field, and shot scale when they matter to the composition.
  - Include negative constraints to avoid extra limbs, unreadable text, wrong costumes, off-model characters, or stray objects.
  - Prefer concrete cinematic nouns and verbs over broad aesthetic adjectives.
  - If the frame is intended as a thumbnail, call that out explicitly.
`;
}

function createVideoPromptRequirements(): string {
  return `
  VIDEO PROMPT REQUIREMENTS:
  - Every session object, every episode object, every scene object, and every frame object (if present) must include a "video_prompt" field.
  - If a scene includes a "frames" array, do not duplicate video_prompt at the scene root; place video_prompt only inside each frame object.
  - The video prompt must describe, in order:
  - opening motion or initial state
  - subject movement and blocking
  - camera movement and shot evolution
  - pacing, rhythm, and transition language
  - continuity between beats or shots
  - any loop, hold, or ending motion
  - State whether the camera is static, handheld, dolly, crane, pan, tilt, tracking, push-in, pull-out, or rack-focus when relevant.
  - Explicitly note what must stay constant across frames: character wardrobe, prop placement, weather, lighting, and spatial geography.
  - For action scenes, define the beat-by-beat motion and impact timing.
  - For quiet scenes, define the stillness, restraint, and micro-movements that should remain visible.
  - If the shot is meant to stitch into a neighboring scene, describe the transition bridge.
  - Keep the prompt production-oriented rather than poetic.
`;
}

function createAudioPromptRequirements(): string {
  return `
  AUDIO PROMPT REQUIREMENTS:
  - Every session object, every episode object, every scene object, and every frame object (if present) must include an "audio_prompt" field.
  - If a scene includes a "frames" array, do not duplicate audio_prompt at the scene root; place audio_prompt only inside each frame object.
  - Every session object, every episode object, every scene object, and every frame object (if present) must include a "music_prompt" field.
  - If a scene includes a "frames" array, do not duplicate music_prompt at the scene root; place music_prompt only inside each frame object.
  - Every ai_prompts object and every session/episode/frame prompt group must include a "system_rules" field for downstream enforcement.
  - The audio prompt must describe, in order:
  - ambient bed and room tone
  - environmental texture and weather sound
  - foreground foley and movement detail
  - transitional hits, stingers, or risers
  - dialogue mix placement and intelligibility notes
  - silence, decay, or low-frequency tension when relevant
  - The music prompt must describe:
  - tempo or BPM range
  - instrumentation and timbral palette
  - emotional purpose
  - motif usage and recurrence
  - cue length or density when relevant
  - For scene-level prompts, the audio must be specific to the scene’s geography, action, and emotional beat.
  - For episode-level prompts, the audio must describe the full sonic identity of the episode, including recurring motifs and progression across acts.
  - The prompt should distinguish between diegetic sound, non-diegetic music, and hybrid layers whenever appropriate.
  - Mention spatial placement, distance, reverb, and mix depth when a sound source has narrative importance.
  - Include continuity cues so adjacent scenes can share or evolve the same sonic motif without contradiction.
  - Prefer concrete sound nouns and mix instructions over vague adjectives.
  - Do not use generic phrases like "epic sound" or "dramatic audio" unless they are immediately followed by precise implementation details.
  - If a scene is quiet or restrained, explicitly say so and explain what sonic elements are intentionally absent.
  - If the scene has action, explicitly call out impacts, transient peaks, cloth movement, footstep texture, and machine detail.
  - If the scene contains dialogue, the audio prompt must state how the dialogue sits against the ambient and musical layers.
  - If the scene includes a reveal, the audio prompt must specify how the sound design supports the reveal moment.
  - If the scene includes a transition, the audio prompt must describe the audio bridge into the next scene.
  - If the episode has recurring motifs, describe how those motifs evolve across acts or scenes.
  - If the music swells or drops out, state the exact dramatic purpose of the change.
  - The resulting audio direction must be immediately usable by sound design, music, and mix teams.
`;
}

function createSceneResponseContract(sceneCount?: number, frameCount?: number): string {
  return `
  SCENE GENERATOR RESPONSE CONTRACT:
  - Return only a single JSON object for detailed_episode_spec. Do not include markdown fences, commentary, or extra top-level wrappers.
  - detailed_episode_spec.cold_open must be present and contain 2-4 cinematic sentences.
  - detailed_episode_spec.acts must be a JSON array of exactly 3 act objects.
  - The act order must be Act 1, Act 2, Act 3 with no gaps, duplicates, or reordering.
  - Each act object must include:
    - act_number
    - act_name
    - act_summary
    - scenes
  - Each act must contain a scenes array with at least one scene.
  - The total scene count across all acts must match the episode-level scene target declared in the prompt.
  - The user-entered scene count is authoritative: if the prompt requests ${sceneCount} scenes, the combined act scenes must equal ${sceneCount} exactly.
  - Each scene object must be a self-contained production unit with deterministic, sequential IDs and explicit narrative continuity.
  - Every scene object must include all of the following fields:
    - scene_id
    - scene_name
    - location
    - summary
    - script_dialogue_teaser
    - conflict
    - psychological_stakes
    - character_focus
    - key_props
    - visual_direction
    - particle_effects
    - audio_direction
    - voice_acting_notes
    - dialogue_tone
    - shot_list_preview
    - transition
    - ai_prompts
    - production_stats
  - scene_id values must be deterministic, readable, zero-padded, and sequence-safe across the full episode.
  - scene_name must be short, cinematic, and distinct from the episode title.
  - summary must reveal scene purpose, action, subtext, and consequence in concrete terms.
  - character_focus must name the active characters and explain the function each one serves in the scene.
  - key_props must highlight objects that drive plot, blocking, symbolism, or continuity.
  - visual_direction must include camera language, lens guidance, framing style, lighting, and color notes.
  - particle_effects must describe environmental texture, motion debris, weather, or digital artifacts.
  - audio_direction must describe ambience, foley, transitional sound cues, and musical layering.
  - voice_acting_notes must specify emotional texture, rhythm, pacing, and intensity or restraint.
  - shot_list_preview must contain 5-7 concrete shot ideas in execution order.
  - transition must be one of Smash-cut, Cross-fade, Dissolve, Match-cut, Jump-cut.
  - ai_prompts must be an object containing separate fields:
    - image_prompt
    - video_prompt
    - audio_prompt
    - music_prompt
    - system_rules
  - Every ai_prompts field must be direct, model-ready, and free of filler language.
  - production_stats must be an object containing:
    - cast_count
    - extra_count
    - stunt_required
    - vfx_heavy
    - animation_difficulty_score
    - estimated_minutes
  - If a scene includes a "frames" array, do not include scene-level image_prompt, video_prompt, audio_prompt, music_prompt, or system_rules.
    - Every frame object must include its own image_prompt, video_prompt, audio_prompt, music_prompt, and system_rules.
  ${Number.isFinite(frameCount as number) ? `- Every scene MUST include a "frames" array containing exactly ${frameCount} frame objects.
    - Each frame object must include:
      - frame_number
      - frame_id
      - frame_description
      - image_prompt
      - video_prompt
      - audio_prompt
      - music_prompt
      - system_rules
    - Frame prompts must be production-ready, deterministic, and aligned to the scene’s cinematic action.` : ''}
  - Every scene must preserve continuity with the episode hook, emotional arc, theme mapping, and act progression.
  - The final act must either resolve the immediate scene objective or end on a deliberate cliffhanger.
  - Do not allow generic filler scenes, repeated beats, or non-causal scene ordering.
  - Keep the tone cinematic, production-ready, and grounded in the provided story logic.
`;
}

function createEpisodeResponseContract(
  episodeCount: number,
  sceneCount?: number,
  frameCount?: number,
  ): string {
  return `
  EPISODE SCHEMA (Your array MUST contain exactly ${episodeCount} episode objects. Do not return fewer or more objects.):
  Each episode object must include the following top-level fields:
  - episode: zero-padded episode number such as "01"
  - session: session number as an integer (e.g., 1)
  - title: evocative episode title
  - hook: 2-3 sentence cinematic hook
  - summary: 120-180 word narrative synopsis
  - setting: primary location name
  - runtime: always "30m"
  - focus_characters: array of key characters
  - session_name: short cinematic arc name
  - emotional_arc: internal character shift
  - arc_progression: narrative momentum object
  - theme_mapping: core theme and subtext goals object
  - engagement_matrix: pacing and hook object
  - production_palette: color, lighting, audio, and foley object
  - detailed_episode_spec: cold open, acts, scenes, and continuity structure
  - asset_matrix: sound, image, video, vfx, render priority, and scene count object
  - risk_matrix: continuity, production, and content risk object
  - neural_audit: logic, lore, and pacing validation object

  Episode hierarchy rules:
  - Episode count is the only top-level series count.
  - Every episode must carry the requested internal scene count through asset_matrix.scene_count.
  - Every episode should behave like one self-contained production unit in the season.

  Each episode object must include dedicated episode-level prompt fields:
  - episode_image_prompt
  - episode_video_prompt
  - episode_audio_prompt
  - episode_music_prompt
  - episode_system_rules

  Every scene inside detailed_episode_spec must include dedicated AI prompt fields unless that scene includes a "frames" array.
  - If a scene does not include a "frames" array, the scene must include:
    - image_prompt
    - video_prompt
    - audio_prompt
    - music_prompt
    - system_rules
  - If a scene includes a "frames" array, do not include scene-level image_prompt, video_prompt, audio_prompt, music_prompt, or system_rules.
    - Every frame object must include its own image_prompt, video_prompt, audio_prompt, music_prompt, and system_rules.

  ${createSceneResponseContract(sceneCount)}
  `;
}

function createSessionResponseContract(
  sessionCount?: number,
  episodesPerSession?: number,
  sceneCount?: number,
  ): string {
  return `
  SESSION GENERATION CONTRACT:
  - Total sessions requested: ${Number.isFinite(sessionCount as number) && sessionCount! > 0 ? sessionCount : "MISSING_SESSION_COUNT"}.
  - Episodes per session requested: ${Number.isFinite(episodesPerSession as number) && episodesPerSession! > 0 ? episodesPerSession : "MISSING_EPISODES_PER_SESSION"}.
  - Scenes per episode requested: ${Number.isFinite(sceneCount as number) && sceneCount! > 0 ? sceneCount : "MISSING_SCENES_PER_EPISODE"}.
  - Each returned episode MUST include a top-level "session" integer field and a "session_name" string field.
  - Episodes must be grouped into sessions conceptually; if the AI outputs a flat list, still populate "session" reliably.
  - Each session should feel like a coherent production arc with a distinct visual, audio, and narrative palette.
  - Do not output fewer than ${Number.isFinite(sessionCount as number) && Number.isFinite(episodesPerSession as number) ? sessionCount! * episodesPerSession! : "requested"} total episode objects when session scaffolding is requested.
  - Ensure session ordering is sequential and episode numbers remain zero-padded and unique across the full set.
`;
}

// Prompt generation helpers
function createSeriesGenerationPrompt(
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
  const framesText = Number.isFinite(resolvedFrameCount) && resolvedFrameCount > 0 ? resolvedFrameCount : "OPTIONAL";
  const sessionsText = normalizedSessionCount ?? "MISSING_SESSION_COUNT";
  const episodesPerSessionText = normalizedEpisodesPerSession ?? "MISSING_EPISODES_PER_SESSION";
  const totalEpisodesText = normalizedTotalEpisodes ?? episodeCount;
  const isPartialRequest = normalizedTotalEpisodes !== undefined && normalizedTotalEpisodes !== episodeCount;

  return `
  CONTENT TYPE: ${contentType}
  PROJECT PROMPT: ${prompt}
  WORLD BIBLE CONTEXT: ${worldContext}
  CAST DNA REGISTRY: ${castContext}

  PRODUCTION SCAFFOLDING:
  - Total sessions requested: ${sessionsText}.
  - Episodes per session requested: ${episodesPerSessionText}.
  - Total episodes requested: ${totalEpisodesText}.
  - Scenes per episode requested: ${scenesText}.
  - Frames per scene requested: ${framesText}.

  BLUEPRINT COUNT RULES:
  - Episode count = ${episodeCount}.
  - Treat episodeCount as the exact number of episode objects to return.
  - Keep internal scene structure consistent, but do not let it change the total episode count.
  ${isPartialRequest ? `- NOTE: This is a partial generation request within a ${totalEpisodesText}-episode roadmap.` : ''}

  SESSION RULES:
  - Each episode MUST declare a top-level "session" integer and a "session_name" string.
  - If the response is flat, still populate session fields so the UI can group episodes by session.
  - Session ordering must be sequential and stable.
  - Each session should maintain a coherent production arc and distinct palette.

  SEASON ORCHESTRATION RULES:
  1. PACE: Build a ${episodeCount}-episode arc with a 30-minute cinematic pacing per episode.
  2. CONTINUITY: Every scene must strictly obey the World Bible and Cast DNA.
  3. COMPLEXITY: Each episode must contain 3 Acts. The episode will be expanded to have exactly ${scenesText} scenes. Please set "scene_count" in "asset_matrix" to exactly ${scenesText}.
  4. DEPTH: Scene summaries must be dense (40-60 words), detailing character motivations, emotional subtext, and visual/audio cues.
  5. NAMING: Include a readable episode label and a scene_name for every scene so the series page can surface episode and scene labels clearly.

  REQUIRED OUTPUT CONTRACT:
  - Return ONLY a JSON array containing EXACTLY ${episodeCount} episode objects.
  - Do NOT include markdown code fences, backticks, or commentary.
  - Ensure all IDs are deterministic (e.g., E01_A1_S01).
  - Every episode object must include dedicated AI prompt fields for image, video, and audio generation.
  - Every scene object inside detailed_episode_spec must also include separate image, video, and audio prompt fields.
  ${Number.isFinite(resolvedFrameCount) && resolvedFrameCount > 0 ? `- Every scene object must include a "frames" array with exactly ${resolvedFrameCount} frames when frames per scene is requested.` : ''}
  - Every episode object must reflect the resolved scene count in asset_matrix.scene_count.

  ${createSessionResponseContract(normalizedSessionCount, normalizedEpisodesPerSession, Number.isFinite(resolvedSceneCount) ? resolvedSceneCount : undefined)}
  ${createEpisodeResponseContract(episodeCount, Number.isFinite(resolvedSceneCount) ? resolvedSceneCount : undefined, Number.isFinite(resolvedFrameCount) ? resolvedFrameCount : undefined)}
  ${createImagePromptRequirements()}
  ${createVideoPromptRequirements()}
  ${createAudioPromptRequirements()}

  AI PROMPT FIELD CONTRACT:
  - image_prompt: a highly specific visual prompt for still-image generation.
  - video_prompt: a motion-aware prompt for animated/video generation.
  - audio_prompt: a layered sound design prompt covering ambience and foley.
  - music_prompt: a music composition prompt with tempo and instrumentation.
  - system_rules: strict downstream instructions for consistency and safety.

  NEURAL LOGIC AUDIT INSTRUCTION:
  - Before finalizing the JSON, you must perform a "Neural Audit":
  - Ensure every character's motivation matches their Cast DNA.
  - Verify that no powers or locations contradict the World Bible.
  - Ensure the 30-minute pacing is mathematically consistent across the scene estimates.

  OPTIONAL SESSION CONTEXT:
  - episode: ${opts?.episode || "N/A"}
  - target_scenes: ${opts?.numScenes || "N/A"}
`;
}

// Exported generator services
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

  // Mathematically enforce the scene distribution to prevent hallucination
  const act1Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act3Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act2Scenes = Math.max(1, numScenes - act1Scenes - act3Scenes);
  const maxTokens =
    opts?.maxTokens ?? Math.min(24000, Math.max(8192, 9000 + numScenes * 350));

  const prompt = `
  EXPAND_EPISODE_DETAIL:
  Produce a JSON object named "detailed_episode_spec" for the following episode summary.
  You MUST base all generated scenes EXCLUSIVELY and EXHAUSTIVELY on the narrative, setting, plot points, emotional arc, and characters detailed in the provided Episode Summary below. Every scene must be a direct, high-fidelity dramatization of a specific segment of this exact episode's story. Do not invent generic, placeholder, or unrelated scenes.
  Return only the JSON object for "detailed_episode_spec" (no markdown, no commentary).

  Episode Summary:
  ${JSON.stringify(episodeSummary, null, 2)}

  PRODUCTION REQUIREMENTS:
  1. PACE: Target a high-fidelity 30-minute episode duration with complex narrative layering.
  2. STRUCTURE: Provide "cold_open" (2-4 cinematic sentences) and 3 "acts".
  3. DENSITY: The episode MUST contain EXACTLY ${numScenes} scenes in total. 
   You must distribute them EXACTLY as follows:
   - Act 1: Exactly ${act1Scenes} scenes.
   - Act 2: Exactly ${act2Scenes} scenes.
   - Act 3: Exactly ${act3Scenes} scenes.
   Total must perfectly equal ${numScenes}. Do not deviate.
  4. SCENE SCHEMA:
   - scene_id: E${epId}_A[ACT]_S[SCENE]
   - scene_name: A short cinematic title for the scene.
   - location: Specific setting with architectural and atmospheric notes.
   - summary: 60-100 word hyper-detailed narrative breakdown with specific dialogue beats and subtext.
   - script_dialogue_teaser: A sample exchange of 3-5 dialogue lines showing character voice.
   - conflict: The core physical and psychological struggle.
   - psychological_stakes: What the characters lose or gain internally in this scene.
   - character_focus: [Detailed list of character roles and motivations for this scene]
   - key_props: [Objects with specific visual or narrative significance]
   - visual_direction: Camera movement, lighting style, lensing (e.g. 35mm, 85mm), and color grading notes.
   - particle_effects: [E.g. floating dust, embers, heavy rain, digital glitches]
   - audio_direction: Layered soundscape (foley, ambient, music leitmotifs).
   - voice_acting_notes: Precise emotional, rhythmic, and tonal guidance for VAs.
   - dialogue_tone: The specific social dynamic and verbal energy of the scene.
   - shot_list_preview: [5-7 specific cinematic shots with framing and focus notes]
   - transition: Smash-cut / Cross-fade / Dissolve / Match-cut / Jump-cut
   - ai_prompts: { image_prompt: "...", video_prompt: "...", audio_prompt: "...", music_prompt: "...", system_rules: "..." } (Provide highly descriptive prompts to feed directly into downstream generative AI models)
   - production_stats: { cast_count, extra_count, stunt_required, vfx_heavy, animation_difficulty_score: "1-5", estimated_minutes: 2-4 }

  5. NARRATIVE LOGIC & CONTINUITY: 
   - Scenes MUST NOT BE RANDOM. Each scene MUST logically cause or lead into the next scene.
   - The overall progression of scenes MUST perfectly match the provided Episode Summary.
   - Act 1 must Setup the conflict, Act 2 must Escalate it, Act 3 must Resolve or Cliffhanger it.
   - Character actions MUST be strictly based on their Cast DNA and relationships. Do not invent out-of-character behavior.
   - Location jumps must make spatial and temporal sense.

  6. METADATA: Provide ultra-detailed continuity_dependencies, foreshadowing (long-term payoffs), payoffs (from previous beats), thumbnail_prompts, and video_prompts.

  7. NEURAL LOGIC AUDIT:
  - Verify that every scene advances the plot OR the character arc.
  - Ensure no dialogue contradicts the Cast DNA's primary motivation.
  - Confirm atmospheric notes match the World Bible's tone.
  `;

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
  // If requesting more than 15 episodes and not already in sequential mode, batch from the start
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
          true, // expandSequentially to prevent recursive batching
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

  // Scaled max tokens for larger generation targets
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

  // If the model returned fewer episodes than requested, attempt a chunked fallback
  if (result.length !== episodeCount) {
    console.warn(
      `[Series Lab] Expected ${episodeCount} episodes but received ${result.length}. Attempting chunked fallback generation.`,
    );

    // If we were already using the sequential expansion mode, return whatever we got
    if (expandSequentially) {
      console.warn(
        "[Series Lab] expandSequentially already enabled; returning partial result.",
      );
      return result;
    }

    // Try generating in smaller chunks to avoid truncation/token limits
    // For smaller episodeCounts, ensure we split into smaller batches instead of retrying the same size.
    const chunkSize = episodeCount > 12
      ? 12
      : Math.max(1, Math.floor(episodeCount / 2));
    const pieces: any[] = [];
    for (let i = 0; i < episodeCount; i += chunkSize) {
      const remaining = Math.min(chunkSize, episodeCount - i);
      try {
        // Request a focused chunk, mark expandSequentially to avoid recursive fallback
        // Pass an `episode` offset so the model can label episodes deterministically
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

/**
 * Normalizes episode array to fix:
 * 1. Global episode numbering (ensures sequential 01, 02, 03...)
 * 2. Missing frames in scenes (creates default frames if not present)
 * 3. Proper scene/frame IDs with global episode offset
 */


function normalizeEpisodeArray(
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

    // Ensure episode number fields are correct
    const normalized: any = {
      ...ep,
      episode: episodeNumStr,
      episode_number: globalEpisodeNum,
      __displayEpisodeNumber: episodeNumStr,
    };

    // Normalize detailed_episode_spec with proper scene/frame structure
    if (normalized.detailed_episode_spec) {
      const spec = normalized.detailed_episode_spec;

      // Ensure acts array exists
      if (!Array.isArray(spec.acts)) {
        spec.acts = [];
      }

      // Process each act
      spec.acts = spec.acts.map((act: any, actIdx: number) => {
        if (!Array.isArray(act.scenes)) {
          act.scenes = [];
        }

        // Process each scene
        act.scenes = act.scenes.map((scene: any, sceneIdx: number) => {
          const sceneNum = actIdx + 1;
          const sceneIdPrefix = `E${episodeNumStr}_A${sceneNum}_S${String(sceneIdx + 1).padStart(2, '0')}`;

          const normalizedScene: any = {
            ...scene,
            scene_id: scene.scene_id || `${sceneIdPrefix}`,
            scene_name: scene.scene_name || scene.name || `Scene ${sceneIdx + 1}`,
          };

          // Create proper frames with beat structure
          const createFramesFromScene = (sceneData: any, frameIdPrefix: string): any[] => {
            const frames: any[] = [];

            // Determine desired frame count: prefer explicit framesPerScene, then sceneData.frame_count, then default
            const defaultFrameCount = 3;
            const requested = typeof framesPerScene === 'number' && framesPerScene > 0 ? framesPerScene : (sceneData.frame_count || defaultFrameCount);
            const frameCount = Math.max(2, Number(requested) || defaultFrameCount);

            // Break scene into beats: opening, development, climax/resolution
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

              // Extract or generate prompts from scene data
              const baseDescription = beat.description || `${beat.name} - Frame ${frameNum}`;
              const visualDir = sceneData.visual_direction || sceneData.shot_list_preview?.[f] || 'Cinematic shot';
              const audioDir = sceneData.audio_direction || sceneData.dialogue_tone || 'Ambient background';

              frames.push({
                frame_id: frameId,
                frame_description: baseDescription,
                beat_type: beat.type,
                beat_name: beat.name,
                image_prompt: sceneData.image_prompt || 
                  sceneData.ai_prompts?.image_prompt || 
                  `${visualDir}. Frame ${frameNum} of scene: ${baseDescription}`,
                video_prompt: sceneData.video_prompt || 
                  sceneData.ai_prompts?.video_prompt || 
                  `Camera: ${visualDir}. Motion: ${beat.type} beat with ${beat.name.toLowerCase()}`,
                audio_prompt: sceneData.audio_prompt || 
                  sceneData.ai_prompts?.audio_prompt || 
                  `${audioDir}. Foley and ambient design for ${beat.name.toLowerCase()}: ${baseDescription}`,
                music_prompt: sceneData.music_prompt || 
                  sceneData.ai_prompts?.music_prompt || 
                  `Underscore for ${beat.name.toLowerCase()} beat. Emotional tone: ${sceneData.emotional_arc || 'dramatic'}`,
                system_rules: sceneData.system_rules || 
                  sceneData.ai_prompts?.system_rules || 
                  `Character continuity. Maintain established world rules. Frame ${frameNum}/${frameCount}`,
              });
            }

            return frames;
          };

          // Apply frames to the normalized scene
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

export async function regenerateSingleScene(
  scene: any,
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  characterProfiles: string,
  adjacentScenesContext?: { prevScene?: any; nextScene?: any },
): Promise<any> {
  const prompt = `
  REGENERATE_SINGLE_SCENE:
  You are an expert anime director and showrunner. Regenerate the following scene unit to make it more cinematic, detailed, and production-ready.
  You MUST strictly follow the world rules (World Bible) and character psychology (Cast DNA) provided.
  Ensure the scene maintains perfect continuity with its adjacent scenes.

  World Bible:
  ${worldLore}

  Cast DNA:
  ${characterProfiles}

  Episode Summary:
  ${JSON.stringify(episodeSummary, null, 2)}

  Adjacent Scenes for Continuity:
  - Previous Scene: ${adjacentScenesContext?.prevScene ? JSON.stringify(adjacentScenesContext.prevScene, null, 2) : "None (Start of Episode/Act)"}
  - Next Scene: ${adjacentScenesContext?.nextScene ? JSON.stringify(adjacentScenesContext.nextScene, null, 2) : "None (End of Episode/Act)"}

  Current Scene to Regenerate:
  ${JSON.stringify(scene, null, 2)}

  PRODUCTION AESTHETIC REQUIREMENTS:
  1. NARRATIVE DENSITY: The scene breakdown must be extremely descriptive, detailing character motivations, emotional tension, and subtle facial/body expressions.
  2. VISUALS: Provide precise camera lensing (e.g., 35mm wide, 85mm close-up), lighting (e.g., chiaroscuro, golden hour, neon highlights), camera motion, and color grading notes.
  3. AUDIO: Provide detailed sound cues (ambient tracks, foley, and score/leitmotifs).  
  4. SCRIPT DIALOGUE TEASER: Include 3-5 lines of sample dialogue capturing the character voices and subtext.
  5. GENERATIVE AI PROMPTS: Provide detailed prompts for image, video, audio, and music generator models.

  Return ONLY a valid JSON object matching the scene schema below (no markdown code blocks, no backticks, no extra text):
  {
  "scene_id": "${scene.scene_id}",
  "scene_name": "Evocative, cinematic scene title",
  "location": "Detailed specific setting",
  "summary": "Detailed 60-100 word narrative synopsis of the scene with character beats",
  "script_dialogue_teaser": "Sample exchange showing character voice",
  "conflict": "Core physical or psychological struggle",
  "psychological_stakes": "Internal stakes",
  "character_focus": ["character names and roles in this scene"],
  "key_props": ["narrative objects"],
  "visual_direction": "Camera framing, motion, lensing, and lighting direction",
  "particle_effects": ["visual particle layers like embers, digital glitch, mist"],
  "audio_direction": "Layered soundscape (foley, ambient, score energy)",
  "voice_acting_notes": "Emotional guidance for VAs",
  "dialogue_tone": "Verbal energy and tone",
  "shot_list_preview": ["Shot 1: close-up on eye...", "Shot 2: wide establishing..."],
  "transition": "Smash-cut / Cross-fade / Dissolve / Match-cut / Jump-cut",
  "ai_prompts": {
    "image_prompt": "Ultra-detailed Midjourney/Stable Diffusion prompt",
    "video_prompt": "Cinematic camera movement and action prompt for Sora/Runway",
    "audio_prompt": "SFX and environmental foley prompt",
    "music_prompt": "Instrumental tempo and emotional score prompt",
    "system_rules": "Downstream AI logic guidelines"
  },
  "production_stats": {
    "cast_count": 1,
    "extra_count": 0,
    "stunt_required": false,
    "vfx_heavy": false,
    "animation_difficulty_score": "1-5",
    "estimated_minutes": 2
  }
  `;

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
