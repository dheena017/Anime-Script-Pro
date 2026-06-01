import { generateText } from "./core";
import { SERIES_PLAN_GENERATION_PROMPT } from "../prompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";
import JSON5 from "json5";
import { cleanJson } from "../../lib/api-utils";

type SeriesPromptOptions = {
  episode?: string;
  numScenes?: number;
};

function validateTextInput(value: unknown, fieldName: string, minimumLength = 1): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length < minimumLength) {
    throw new Error(`${fieldName} must be at least ${minimumLength} characters long.`);
  }

  return trimmed;
}

function validatePositiveInteger(value: unknown, fieldName: string, maximumValue?: number): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  if (typeof maximumValue === 'number' && (value as number) > maximumValue) {
    throw new Error(`${fieldName} must be ${maximumValue} or fewer.`);
  }

  return value as number;
}

function validateSeriesPromptInput(prompt: string): void {
  validateTextInput(prompt, 'Series prompt', 20);
}

function validateSeriesContentTypeInput(contentType: string): void {
  validateTextInput(contentType, 'Content type', 2);
}

function validateSeriesEpisodeCountInput(episodeCount: number): void {
  validatePositiveInteger(episodeCount, 'Episode count', 100);
}

function extractJsonBlock(text: string, openChar: '{' | '[', closeChar: '}' | ']'): string | null {
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

      if (character === '\\') {
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
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

function findWrappedArrayCandidate(value: unknown): unknown[] | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const candidateKeys = ['series', 'episodes', 'plan', 'data', 'items', 'results'];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

function findWrappedObjectCandidate(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const candidateKeys = ['detailed_episode_spec', 'result', 'data', 'payload', 'output'];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate as Record<string, unknown>;
    }
  }

  return value as Record<string, unknown>;
}

function parseStructuredJson<T>(text: string, expectedShape: 'array' | 'object'): T | null {
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

  // Strategy 1: Use extractBalancedJsonBlock to grab only the valid JSON portion
  // This robustly handles cases where the AI appends explanatory text after the closing bracket
  try {
    const openChar = expectedShape === 'array' ? '[' : '{';
    const closeChar = expectedShape === 'array' ? ']' : '}';
    const stripped = stripMarkdownFences(text);
    const extracted = extractJsonBlock(stripped, openChar as '[' | '{', closeChar as ']' | '}');
    if (extracted) {
      const parsed = tryParse(extracted);
      if (parsed) {
        if (expectedShape === 'array' && Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === 'object' && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === 'array') {
          const wrappedArray = findWrappedArrayCandidate(parsed);
          if (wrappedArray) return wrappedArray as unknown as T;
        }
        if (expectedShape === 'object') {
          const wrappedObject = findWrappedObjectCandidate(parsed);
          if (wrappedObject) return wrappedObject as unknown as T;
        }
      }
    }
  } catch {
    // Fall through
  }

  // Strategy 2: cleanJson with repair
  try {
    const parsed = cleanJson(text);
    if (expectedShape === 'array') {
      if (Array.isArray(parsed)) return parsed as unknown as T;
      const potentialArray = findWrappedArrayCandidate(parsed);
      if (potentialArray) return potentialArray as unknown as T;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject && Array.isArray((nestedObject as any).items)) {
          return (nestedObject as any).items as unknown as T;
        }
      }
    } else {
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject) return nestedObject as unknown as T;
      }
    }
    return parsed as unknown as T;
  } catch (err) {
    console.error('parseLooseJson failed:', err);
    return null;
  }
}

function normalizeEpisodeDetailSpec(value: any): any | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  // 1. Check nested detailed_episode_spec
  const nestedSpec = value.detailed_episode_spec;
  if (nestedSpec && typeof nestedSpec === 'object' && !Array.isArray(nestedSpec)) {
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
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
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

function createImagePromptRequirements(): string {
  return `
IMAGE PROMPT REQUIREMENTS:
- Every episode object and every scene object must include an "image_prompt" field.
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
- Every episode object and every scene object must include a "video_prompt" field.
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
- Every episode object and every scene object must include an "audio_prompt" field.
- Every episode object and every scene object must include a "music_prompt" field.
- Every ai_prompts object must include a "system_rules" field for downstream enforcement.
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

function createSceneResponseContract(): string {
  return `
SCENE GENERATOR RESPONSE CONTRACT:
- detailed_episode_spec must be a single JSON object.
- detailed_episode_spec.cold_open must be present and contain 2-4 cinematic sentences.
- detailed_episode_spec.acts must be a JSON array of exactly 3 act objects.
- The act order must be Act 1, Act 2, Act 3 with no gaps, duplicates, or reordering.
- Each act must contain a scenes array with at least one scene.
- The total scene count across all acts must match the episode-level scene target declared in the prompt.
- The user-entered scene count is authoritative: if the blueprint says 18 scenes, the combined act scenes must equal 18 exactly.
- Each scene object must be a self-contained production unit with deterministic IDs and explicit narrative continuity.
- Each scene object must include:
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
- scene_id values must be deterministic, readable, and sequence-safe across the full episode.
- scene_name must be short, cinematic, and distinct from the episode title.
- summary must be specific enough to reveal scene purpose, action, subtext, and consequence.
- character_focus must list the active characters and describe the function each one serves in the scene.
- key_props must highlight objects that drive plot, blocking, symbolism, or continuity.
- visual_direction must include camera language, lens guidance, framing style, lighting, and color notes.
- particle_effects must describe environmental texture, motion debris, weather, or digital artifacts.
- audio_direction must describe ambience, foley, transitional sound cues, and musical layering.
- voice_acting_notes must specify emotional texture, rhythm, pacing, and restraint or intensity.
- shot_list_preview must contain 5-7 concrete shot ideas in execution order.
- transition must be one of Smash-cut, Cross-fade, Dissolve, Match-cut, or Jump-cut.
- ai_prompts must include separate fields:
  - image_prompt
  - video_prompt
  - audio_prompt
  - music_prompt
  - system_rules
- production_stats must include:
  - cast_count
  - extra_count
  - stunt_required
  - vfx_heavy
  - animation_difficulty_score
  - estimated_minutes
- Every ai_prompts field must be direct, model-ready, and free of filler language.
- Every scene must preserve continuity with the episode hook, emotional arc, theme mapping, and act progression.
- The final act must either resolve the immediate scene objective or end on a deliberate cliffhanger.
- Do not allow generic filler scenes, repeated beats, or non-causal scene ordering.
- Keep the tone cinematic, production-ready, and grounded in the provided story logic.
`;
}

function createEpisodeResponseContract(episodeCount: number, sceneCount: number): string {
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

Every scene inside detailed_episode_spec must include dedicated AI prompt fields:
- image_prompt
- video_prompt
- audio_prompt
- music_prompt
- system_rules

Every episode object must also include these separate AI prompt fields:
- episode_image_prompt
- episode_video_prompt
- episode_audio_prompt
- episode_music_prompt
- episode_system_rules

${createSceneResponseContract()}
`;
}

function createSeriesGenerationPrompt(
  prompt: string,
  contentType: string,
  episodeCount: number,
  worldLore?: string,
  characterProfiles?: string,
  opts?: SeriesPromptOptions
) {
  const worldContext = worldLore || 'Standard genre rules.';
  const castContext = characterProfiles || 'Generic archetypes.';
  const resolvedSceneCount = opts?.numScenes || 18;

  return `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}
WORLD BIBLE CONTEXT: ${worldContext}
CAST DNA REGISTRY: ${castContext}

BLUEPRINT COUNT RULES:
- Episode count = ${episodeCount}.
- Treat episodeCount as the exact number of episode objects to return.
- Keep internal scene structure consistent, but do not let it change the total episode count.

SEASON ORCHESTRATION RULES:
1. PACE: Build a ${episodeCount}-episode arc with a 30-minute cinematic pacing per episode.
2. CONTINUITY: Every scene must strictly obey the World Bible and Cast DNA.
3. COMPLEXITY: Each episode must contain 3 Acts. The episode will be expanded to have exactly ${resolvedSceneCount} scenes. Please set "scene_count" in "asset_matrix" to exactly ${resolvedSceneCount}.
4. DEPTH: Scene summaries must be dense (40-60 words), detailing character motivations, emotional subtext, and visual/audio cues.
5. NAMING: Include a readable episode label and a scene_name for every scene so the series page can surface episode and scene labels clearly.

REQUIRED OUTPUT CONTRACT:
- Return ONLY a JSON array containing EXACTLY ${episodeCount} episode objects.
- Do NOT include markdown code fences, backticks, or commentary.
- Ensure all IDs are deterministic (e.g., E01_A1_S01).
- Every episode object must include dedicated AI prompt fields for image, video, and audio generation.
- Every scene object inside detailed_episode_spec must also include separate image, video, and audio prompt fields.
- Every episode object must reflect the resolved scene count in asset_matrix.scene_count.

${createEpisodeResponseContract(episodeCount, resolvedSceneCount)}
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
- episode: ${opts?.episode || 'N/A'}
- target_scenes: ${opts?.numScenes || 'N/A'}
`;
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
  }
): Promise<any> {
  const epId = episodeSummary?.episode || episodeSummary?.episode_number || '01';
  
  // Mathematically enforce the scene distribution to prevent hallucination
  const act1Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act3Scenes = Math.max(1, Math.floor(numScenes * 0.25));
  const act2Scenes = Math.max(1, numScenes - act1Scenes - act3Scenes);
  const maxTokens = opts?.maxTokens ?? Math.min(24000, Math.max(8192, 9000 + numScenes * 350));

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

NEURAL LOGIC AUDIT:
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
      characterProfiles
    );

    if (!res) return episodeSummary;

    const parsed = parseStructuredJson<any>(res, 'object');

    const normalized = normalizeEpisodeDetailSpec(parsed);
    if (normalized) {
      return { ...episodeSummary, detailed_episode_spec: normalized };
    }
    return episodeSummary;
  } catch (err) {
    console.error('expandEpisodeDetails failed:', err);
    return episodeSummary;
  }
}

// Max episodes to request in a single AI call before batching
// Reduced to 4 to reduce likelihood of large malformed outputs and rate limits
const SERIES_BATCH_SIZE = 4;

function extractRetryDelay(error: any): number {
  const errStr = typeof error === 'string' ? error : JSON.stringify(error) || String(error);
  
  // 1. Try to find a pattern like "retry in X.Y s" or "retry in Xs" or "retryDelay': 'Xs'"
  const matchSeconds = errStr.match(/retry(?:ing|)\s+(?:in\s+|Delay['"]?:\s*['"]?)(\d+(?:\.\d+)?)\s*s/i);
  if (matchSeconds) {
    const seconds = parseFloat(matchSeconds[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  
  // 2. Fallback to generic 429 delay of 15 seconds
  if (errStr.toLowerCase().includes('429') || errStr.toLowerCase().includes('quota') || errStr.toLowerCase().includes('resource_exhausted') || errStr.toLowerCase().includes('rate limit')) {
    return 15000;
  }
  
  return 0;
}

/**
 * Generates a single batch of episodes (batchSize episodes starting at episodeOffset).
 * Uses a compact schema without full scene specs to keep output small and reliable.
 */
async function generateEpisodeBatch(
  prompt: string,
  model: string,
  contentType: string,
  batchStart: number,      // 1-indexed start
  batchEnd: number,        // 1-indexed end (inclusive)
  totalEpisodes: number,
  worldLore?: string,
  characterProfiles?: string,
  opts?: { session?: string; episodesPerSession?: number; numScenes?: number; temperature?: number; maxTokens?: number; topP?: number; topK?: number; }
  , attempt: number = 0
): Promise<any[]> {
  const batchSize = batchEnd - batchStart + 1;
  const batchTimeoutMs = Math.min(300000, 120000 + batchSize * 15000);

  const epsPerSession = opts?.episodesPerSession || (opts?.session ? Math.ceil(totalEpisodes / Number(opts.session)) : totalEpisodes);

  const episodeSessionMapping = Array.from({ length: batchSize }, (_, i) => {
    const epIdx = batchStart + i;
    const sessionNum = Math.floor((epIdx - 1) / epsPerSession) + 1;
    const epNumInSession = ((epIdx - 1) % epsPerSession) + 1;
    return `- Episode ${String(epIdx).padStart(2, '0')} belongs to Session ${sessionNum} (Episode ${epNumInSession} of Session ${sessionNum}). Ensure top-level "session" field is set to ${sessionNum}.`;
  }).join('\n');

  const systemInstruction = `You are an expert anime series planner. Your ONLY job is to return a valid JSON array.
Do NOT add any text, explanation, or commentary before or after the JSON.
Do NOT truncate the output or add notes explaining what you omitted.
Return ALL ${batchSize} episodes fully formed. No partial output is acceptable.`;

  const userPrompt = `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}
WORLD BIBLE: ${(worldLore || 'Standard genre rules.').slice(0, 3000)}
CAST DNA: ${(characterProfiles || 'Generic archetypes.').slice(0, 2000)}

INSTRUCTION: Generate episodes ${batchStart} through ${batchEnd} (of a ${totalEpisodes}-episode season).
Return ONLY a JSON array with EXACTLY ${batchSize} episode objects.
Do not include markdown fences, backticks, or any text outside the JSON array.

EACH episode object MUST have these fields:
- "episode": zero-padded number e.g. "${String(batchStart).padStart(2, '0')}"
- "session": session index as integer (e.g. 1)
- "title": evocative episode title
- "hook": 2-3 sentence cinematic hook
- "summary": 120-180 word narrative synopsis
- "setting": primary location name
- "runtime": "30m"
- "focus_characters": ["Character A", "Character B"]
- "session_name": short cinematic arc name
- "emotional_arc": internal character shift
- "arc_progression": { "narrative_momentum": "description" }
- "theme_mapping": { "core_theme": "...", "subtext_goals": "..." }
- "engagement_matrix": { "pacing_intensity": "High/Medium/Low", "tension_peak": "...", "marketing_hooks": ["..."] }
- "production_palette": { "dominant_colors": ["..."], "lighting_setup": "...", "audio_leitmotif": "...", "foley_focus": "..." }
- "detailed_episode_spec": { "cold_open": "...", "script_opening_line": "...", "acts": [] }
- "asset_matrix": { "sound": "...", "image": "...", "video": "...", "vfx_complexity": "High/Medium/Low", "render_priority": "Critical/Normal", "scene_count": ${opts?.numScenes || 18} }
- "risk_matrix": { "continuity_risks": [], "production_risks": [], "content_risks": [] }
- "neural_audit": { "logic_check": "...", "lore_validation": "...", "pacing_score": "High/Medium/Low" }

SESSION & EPISODE BINDING DETAILS:
${episodeSessionMapping}

Return the JSON array now. Start with [ and end with ]. Nothing else.`;

  // Wrap generateText with retries and exponential backoff to handle transient rate limits / empty responses
  let text: string | null = null;
  const MAX_TEXT_ATTEMPTS = 3;
  for (let t = 0; t < MAX_TEXT_ATTEMPTS; t++) {
    try {
      text = await generateText(
        model,
        userPrompt,
        systemInstruction,
        opts?.temperature ?? 0.82,
        opts?.maxTokens ?? 8192,
        opts?.topP ?? 0.92,
        opts?.topK ?? 35,
        batchTimeoutMs,
        worldLore,
        characterProfiles
      );

      if (text && text.trim().length > 0) break;
      console.warn(`[Series Lab] generateText returned empty for batch ${batchStart}-${batchEnd} attempt ${t}`);
    } catch (e: any) {
      console.warn(`[Series Lab] generateText error for batch ${batchStart}-${batchEnd} attempt ${t}:`, e?.message || e);
      const delayMs = extractRetryDelay(e);
      if (delayMs > 0 && t < MAX_TEXT_ATTEMPTS - 1) {
        console.warn(`[Series Lab] Rate limit detected. Waiting for ${(delayMs / 1000).toFixed(1)}s before retry...`);
        await new Promise(res => setTimeout(res, delayMs + 1000));
        continue;
      }
    }
    // backoff
    const backoffMs = 500 * Math.pow(2, t);
    await new Promise(res => setTimeout(res, backoffMs));
  }

  if (!text) throw new Error(`Batch ${batchStart}-${batchEnd} returned empty response after retries.`);

  try {
    const parsed = parseStructuredJson<any[]>(text, 'array');
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.error(`[Series Lab] Batch ${batchStart}-${batchEnd} failed. Raw:`, text.slice(0, 300));
      throw new Error(`Batch ${batchStart}-${batchEnd} did not return a valid episode array.`);
    }
    return parsed;
  } catch (err) {
    console.warn(`[Series Lab] Parsing batch ${batchStart}-${batchEnd} failed on attempt ${attempt}:`, (err as any)?.message || err);
    try {
      // Persist raw AI response to localStorage for debugging (dev only)
      const key = `ai_failed_batch_${batchStart}_${batchEnd}_${Date.now()}`;
      try { localStorage.setItem(key, text as string); console.info(`[Series Lab] Saved failed batch response to localStorage key: ${key}`); } catch(e) { /* ignore storage errors */ }
    } catch (e) {
      /* ignore */
    }
    // Retry strategy: if batch size > 1 and attempts left, split into two smaller batches
    if (batchSize > 1 && attempt < 2) {
      const mid = Math.floor((batchStart + batchEnd) / 2);
      console.info(`[Series Lab] Retrying by splitting batch ${batchStart}-${batchEnd} into ${batchStart}-${mid} and ${mid + 1}-${batchEnd}`);
      const left = await generateEpisodeBatch(prompt, model, contentType, batchStart, mid, totalEpisodes, worldLore, characterProfiles, opts, attempt + 1).catch(e => [] as any[]);
      const right = await generateEpisodeBatch(prompt, model, contentType, mid + 1, batchEnd, totalEpisodes, worldLore, characterProfiles, opts, attempt + 1).catch(e => [] as any[]);
      return [...left, ...right];
    }

    // No more retries, surface the error
    console.error(`[Series Lab] Batch ${batchStart}-${batchEnd} failed after retries.`);
    throw err;
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
  opts?: {
    session?: string;
    episodesPerSession?: number;
    episode?: string;
    numScenes?: number;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  }
) {
  validateSeriesPromptInput(prompt);
  validateSeriesContentTypeInput(contentType);
  validateSeriesEpisodeCountInput(episodeCount);

  let parsed: any[];

  const resolvedSceneCount = opts?.numScenes || 18;
  const shouldExpand = expandSequentially || (resolvedSceneCount * episodeCount > 20);
  const finalExpand = expandSequentially || shouldExpand;

  if (episodeCount <= SERIES_BATCH_SIZE && !shouldExpand) {
    // ── Small series: single call with full schema ────────────────────────────
    const systemInstruction = SERIES_PLAN_GENERATION_PROMPT(
      contentType,
      episodeCount,
      worldLore ?? '',
      characterProfiles ?? '',
      opts?.numScenes || 18
    );
    const userPrompt = createSeriesGenerationPrompt(prompt, contentType, episodeCount, worldLore, characterProfiles, opts);

    const text = await generateText(
      model,
      userPrompt,
      systemInstruction,
      opts?.temperature ?? 0.85,
      opts?.maxTokens ?? 8192,
      opts?.topP ?? 0.95,
      opts?.topK ?? 40,
      Math.min(600000, 300000 + episodeCount * 15000),
      worldLore,
      characterProfiles
    );

    if (!text) throw new Error('Series generation returned an empty response.');
    const result = parseStructuredJson<any[]>(text, 'array');
    if (!Array.isArray(result)) {
      console.error('[Series Lab] AI response was not an array. Raw start:', text.slice(0, 500));
      throw new Error('Series synthesis did not return a JSON array. Check browser console for raw output.');
    }
    parsed = result;
  } else {
    // ── Large series: batch into groups ──────────────────────────────────────
    console.info(`[Series Lab] ${episodeCount} episodes — batching into groups of ${SERIES_BATCH_SIZE}.`);
    parsed = [];

    // Run batches with a small concurrency limit (2 at a time) to avoid rate limits
    const CONCURRENCY = 2;
    for (let start = 1; start <= episodeCount; start += SERIES_BATCH_SIZE * CONCURRENCY) {
      const chunkPromises: Promise<any[]>[] = [];
      for (let c = 0; c < CONCURRENCY; c++) {
        const batchStart = start + c * SERIES_BATCH_SIZE;
        if (batchStart > episodeCount) break;
        const batchEnd = Math.min(batchStart + SERIES_BATCH_SIZE - 1, episodeCount);
        chunkPromises.push(
          generateEpisodeBatch(prompt, model, contentType, batchStart, batchEnd, episodeCount, worldLore, characterProfiles, opts)
        );
      }

      const results = await Promise.all(
        chunkPromises.map(p =>
          p.catch((err: any) => {
            console.warn('[Series Lab] Batch failed, will use empty episodes as placeholder:', err?.message);
            return [] as any[];
          })
        )
      );

      for (const batch of results) {
        parsed.push(...batch);
      }

      // Add a small cool-down delay between chunks to let the rate limit window clear
      if (start + SERIES_BATCH_SIZE * CONCURRENCY <= episodeCount) {
        console.info(`[Series Lab] Batch chunk complete. Cooling down for 2.5s to avoid rate limits...`);
        await new Promise(res => setTimeout(res, 2500));
      }
    }

    // Ensure we have at least 1 episode
    if (parsed.length === 0) {
      throw new Error('All episode batches failed. Series synthesis returned no data.');
    }

    // Sort by episode number and re-index to fill gaps from failed batches
    parsed.sort((a, b) => {
      const numA = parseInt(String(a.episode || a.episode_number || 0), 10);
      const numB = parseInt(String(b.episode || b.episode_number || 0), 10);
      return numA - numB;
    });
  }

  // ── Optional parallel expansion of scene specs ─────────────────────────
  if (finalExpand) {
    const expanded: any[] = [];
    const CONCURRENCY = 4;
    
    for (let i = 0; i < parsed.length; i += CONCURRENCY) {
      const chunk = parsed.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        chunk.map(async (ep) => {
          try {
            if (!ep.detailed_episode_spec?.acts?.length) {
              return await expandEpisodeDetails(
                ep, model, contentType,
                worldLore as any, characterProfiles as any,
                opts?.numScenes || 18, opts
              );
            }
            return ep;
          } catch (e) {
            console.warn(`Episode ${ep.episode} expansion failed, using summary:`, e);
            return ep;
          }
        })
      );
      expanded.push(...results);
    }
    return expanded;
  }
  return parsed;
}

function parseLooseJson<T>(text: string, expectedShape: 'array' | 'object'): T | null {
  const parsed = parseStructuredJson<T>(text, expectedShape);
  if (parsed) {
    return parsed;
  }

  try {
    const cleaned = cleanJson(text);
    if (expectedShape === 'array') {
      if (Array.isArray(cleaned)) return cleaned as T;
      const wrappedArray = findWrappedArrayCandidate(cleaned);
      if (wrappedArray) return wrappedArray as T;
    } else if (cleaned && typeof cleaned === 'object' && !Array.isArray(cleaned)) {
      const wrappedObject = findWrappedObjectCandidate(cleaned);
      if (wrappedObject) return wrappedObject as T;
    }
  } catch (error) {
    console.error('parseLooseJson fallback failed:', error);
  }

  return null;
}

export async function regenerateSingleScene(
  scene: any,
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  characterProfiles: string,
  adjacentScenesContext?: { prevScene?: any; nextScene?: any }
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
- Previous Scene: ${adjacentScenesContext?.prevScene ? JSON.stringify(adjacentScenesContext.prevScene, null, 2) : 'None (Start of Episode/Act)'}
- Next Scene: ${adjacentScenesContext?.nextScene ? JSON.stringify(adjacentScenesContext.nextScene, null, 2) : 'None (End of Episode/Act)'}

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
      characterProfiles
    );

    if (!res) return scene;
    const parsed = parseStructuredJson<any>(res, 'object');
    return normalizeEpisodeDetailSpec(parsed) || parsed || scene;
  } catch (err) {
    console.error('regenerateSingleScene failed:', err);
    return scene;
  }
}
