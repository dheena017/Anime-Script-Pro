import { callAI, RateLimitError } from "./core";
import { SERIES_PLAN_GENERATION_PROMPT } from "../prompts";
import JSON5 from "json5";
import { cleanJson } from "../../lib/api-utils";

function validateSeriesPrompt(prompt: string): void {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 20) {
    throw new Error('Series prompt must be at least 20 characters long.');
  }
}

function validateSeriesContentType(contentType: string): void {
  if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
    throw new Error('Content type must be a non-empty string with at least 2 characters.');
  }
}

function validateSeriesEpisodeCount(episodeCount: number): void {
  if (!Number.isInteger(episodeCount) || episodeCount <= 0) {
    throw new Error('Episode count must be a positive integer.');
  }
  if (episodeCount > 100) {
    throw new Error('Episode count must be 100 or fewer.');
  }
}

function stripCodeFences(text: string): string {
  return text.replace(/```(?:json|JSON)?/g, '').replace(/```/g, '').trim();
}

function extractBalancedJsonBlock(text: string, openChar: '{' | '[', closeChar: '}' | ']'): string | null {
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

function parseLooseJson<T>(text: string, expectedShape: 'array' | 'object'): T | null {
  try {
    const parsed = cleanJson(text);
    
    if (expectedShape === 'array') {
      if (Array.isArray(parsed)) return parsed as unknown as T;
      if (parsed && typeof parsed === 'object') {
        // AI might wrap the array in a key
        const potentialArray = (parsed as any).series || (parsed as any).episodes || (parsed as any).plan || (parsed as any).data;
        if (Array.isArray(potentialArray)) return potentialArray as unknown as T;
      }
    } else {
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as unknown as T;
    }
    
    return parsed as unknown as T;
  } catch (err) {
    console.error('parseLooseJson failed:', err);
    return null;
  }
}

function buildSeriesPrompt(
  prompt: string,
  contentType: string,
  episodeCount: number,
  worldLore?: string,
  castProfiles?: string,
  opts?: { session?: string; episode?: string; numScenes?: number }
) {
  const worldContext = worldLore || 'Standard genre rules.';
  const castContext = castProfiles || 'Generic archetypes.';

  return `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}

WORLD BIBLE CONTEXT:
${worldContext}

CAST DNA REGISTRY:
${castContext}

SEASON ORCHESTRATION RULES:
1. PACE: Build a ${episodeCount}-episode arc with a 30-minute cinematic pacing per episode.
2. CONTINUITY: Every scene must strictly obey the World Bible and Cast DNA.
3. COMPLEXITY: Each episode must contain 3 Acts, with 5-8 detailed scenes per Act (approx. 15-24 scenes total per episode).
4. DEPTH: Scene summaries must be dense (40-60 words), detailing character motivations, emotional subtext, and visual/audio cues.

REQUIRED OUTPUT CONTRACT:
- Return ONLY a JSON array of episode objects.
- Do NOT include markdown code fences, backticks, or commentary.
- Ensure all IDs are deterministic (e.g., E01_A1_S01).

EPISODE SCHEMA:
{
  "episode": "01",
  "title": "Evocative Title",
  "hook": "2-3 sentence cinematic hook",
  "summary": "150-200 word narrative synopsis",
  "setting": "Primary location",
  "runtime": "30m",
  "focus_characters": ["Character A", "Character B"],
  "emotional_arc": "Deep internal character shift",
  "arc_progression": {
    "character_id": "progression_percentage (e.g. +15%)",
    "narrative_momentum": "Description of plot speed"
  },
  "theme_mapping": {
    "core_theme": "The specific series theme explored here",
    "subtext_goals": "Hidden narrative objectives for this episode"
  },
  "engagement_matrix": {
    "pacing_intensity": "1-10 rating",
    "tension_peak": "Description of the highest tension moment",
    "marketing_hooks": ["Key moments for trailer/social clips"]
  },
  "production_palette": {
    "dominant_colors": ["Hex or Color Name"],
    "lighting_setup": "Core lighting style",
    "audio_leitmotif": "Recurring musical theme for this episode",
    "foley_focus": "Key sound effects to emphasize"
  },
  "detailed_episode_spec": {
    "cold_open": "2-4 cinematic sentences",
    "script_opening_line": "The first line of dialogue to set the tone",
    "acts": [
      {
        "act": 1,
        "purpose": "Act objective",
        "key_turn": "The core dramatic turn of this act",
        "scenes": [
          {
            "scene_id": "E01_A1_S01",
            "location": "Specific setting",
            "summary": "40-60 word scene breakdown with dialogue beats",
            "conflict": "The core struggle",
            "character_focus": ["Character A"],
            "visual_direction": "Camera, lighting, and lensing notes",
            "audio_direction": "Soundscape and music cues",
            "dialogue_tone": "The specific vibe of character interactions in this scene",
            "shot_list_preview": ["Close-up: Character A's eyes", "Wide: The desolate city", "Pan: Tracking the movement"],
            "transition": "Smash-cut / Cross-fade / Dissolve / Match-cut",
            "production_stats": {
              "cast_count": 2,
              "extra_count": 10,
              "stunt_required": false,
              "vfx_heavy": true
            },
            "estimated_minutes": 2
          }
        ]
      }
    ],
    "continuity_dependencies": ["Strings"],
    "foreshadowing": ["Strings"],
    "payoffs": ["Strings"],
    "thumbnail_prompts": ["Strings"],
    "video_prompts": ["Strings"]
  },
  "asset_matrix": {
    "sound": "Atmospheric summary",
    "image": "Visual tone summary",
    "video": "Motion language summary",
    "vfx_complexity": "Low/Medium/High/Extreme",
    "render_priority": "High/Normal/Background",
    "scene_count": 18
  },
  "risk_matrix": {
    "continuity_risks": ["Strings"],
    "production_risks": ["Strings"],
    "content_risks": ["Strings"]
  },
  "neural_audit": {
    "logic_check": "AI's internal verification of narrative consistency",
    "lore_validation": "Confirmation of adherence to World Bible",
    "pacing_score": "1-10 rating of episodic flow"
  }
}

NEURAL LOGIC AUDIT INSTRUCTION:
- Before finalizing the JSON, you must perform a "Neural Audit":
- Ensure every character's motivation matches their Cast DNA.
- Verify that no powers or locations contradict the World Bible.
- Ensure the 30-minute pacing is mathematically consistent across the scene estimates.

OPTIONAL SESSION CONTEXT:
- session: ${opts?.session || 'N/A'}
- episode: ${opts?.episode || 'N/A'}
- target_scenes: ${opts?.numScenes || 'N/A'}
`;
}

// NOTE: Removed prototype fallback scaffolding to enforce strict production data integrity.

async function expandEpisodeDetails(
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  castProfiles: string,
  numScenes: number = 18,
  opts?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  }
): Promise<any> {
  const epId = episodeSummary?.episode || episodeSummary?.episode_number || '01';
  const prompt = `
EXPAND_EPISODE_DETAIL:
Produce a JSON object named "detailed_episode_spec" for the following episode summary.
Return only the JSON object for "detailed_episode_spec" (no markdown, no commentary).

Episode Summary:
${JSON.stringify(episodeSummary, null, 2)}

PRODUCTION REQUIREMENTS:
1. PACE: Target a high-fidelity 30-minute episode duration with complex narrative layering.
2. STRUCTURE: Provide "cold_open" (2-4 cinematic sentences) and 3 "acts".
3. DENSITY: The episode MUST contain exactly ${numScenes} dense scenes total across the 3 acts. Distribution should be balanced for a 30-minute pacing.
4. SCENE SCHEMA:
   - scene_id: E${epId}_A[ACT]_S[SCENE]
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
   - production_stats: { cast_count, extra_count, stunt_required, vfx_heavy, animation_difficulty_score: "1-5", estimated_minutes: 2-4 }

5. METADATA: Provide ultra-detailed continuity_dependencies, foreshadowing (long-term payoffs), payoffs (from previous beats), thumbnail_prompts, and video_prompts.

NEURAL LOGIC AUDIT:
- Verify that every scene advances the plot OR the character arc.
- Ensure no dialogue contradicts the Cast DNA's primary motivation.
- Confirm atmospheric notes match the World Bible's tone.
`;

  try {
    const res = await callAI(
      model,
      prompt,
      SERIES_PLAN_GENERATION_PROMPT(contentType, 1, worldLore ?? '', castProfiles ?? '', numScenes),
      opts?.temperature ?? 0.8,
      opts?.maxTokens ?? 2048,
      opts?.topP ?? 0.9,
      opts?.topK ?? 20,
      120000,
      worldLore,
      castProfiles
    );

    if (!res) return episodeSummary;

      const parsed = parseLooseJson<any>(res, 'object');

    if (parsed) {
      return { ...episodeSummary, detailed_episode_spec: parsed };
    }
    return episodeSummary;
  } catch (err) {
    console.error('expandEpisodeDetails failed:', err);
    return episodeSummary;
  }
}

export async function generateSeriesPlan(
  prompt: string,
  model: string = "gemini-1.5-flash-latest",
  contentType: string = "Anime",
  episodeCount: number = 5,
  worldLore?: string,
  castProfiles?: string,
  expandSequentially: boolean = false,
  opts?: { 
    session?: string; 
    episode?: string; 
    numScenes?: number;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  }
) {
  validateSeriesPrompt(prompt);
  validateSeriesContentType(contentType);
  validateSeriesEpisodeCount(episodeCount);

  const systemInstruction = SERIES_PLAN_GENERATION_PROMPT(
    contentType,
    episodeCount,
    worldLore ?? '',
    castProfiles ?? '',
    opts?.numScenes || 18,
    opts?.session ? parseInt(opts.session) : 1
  );

  const userPrompt = buildSeriesPrompt(prompt, contentType, episodeCount, worldLore, castProfiles, opts);

  try {
    const text = await callAI(
      model,
      userPrompt,
      systemInstruction,
      opts?.temperature ?? 0.85, // temperature
      opts?.maxTokens ?? 8192, // maxTokens
      opts?.topP ?? 0.95, // topP
      opts?.topK ?? 40,   // topK
      180000, // timeoutMs
      worldLore, // worldLore
      castProfiles // castDNA
    );
    if (!text) {
      throw new Error('Series generation returned an empty response.');
    }

    const parsed = parseLooseJson<any[]>(text, 'array');

    if (!Array.isArray(parsed)) {
      console.error('[Series Lab] AI response was not an array. Raw start:', text.slice(0, 500));
      throw new Error('Series synthesis did not return a JSON array. Check browser console for raw output.');
    }

    // Optionally expand each episode sequentially into detailed_episode_spec
    if (expandSequentially) {
      const expanded: any[] = [];
      for (const ep of (parsed as any[])) {
        try {
          // Try to expand only when detailed_episode_spec is missing
          if (!ep.detailed_episode_spec) {
            // expandEpisodeDetails will call the AI to produce scene-by-scene output for this episode
            // We pass minimal context to avoid heavy payloads
            // eslint-disable-next-line no-await-in-loop
            const full = await expandEpisodeDetails(
              ep, 
              model, 
              contentType, 
              worldLore as any, 
              castProfiles as any, 
              opts?.numScenes || 18,
              opts
            );
            expanded.push(full);
          } else {
            expanded.push(ep);
          }
        } catch (e) {
          console.warn('Episode expansion failed, falling back to original summary:', e);
          expanded.push(ep);
        }
      }

      return expanded;
    }

    return parsed;
  } catch (error: any) {
    const errorStr = error?.toString() || "";
    const errorMsg = error?.message || "";

    const isRateLimit = error instanceof RateLimitError ||
      errorStr.includes("429") ||
      errorMsg.includes("429") ||
      errorStr.includes("RESOURCE_EXHAUSTED") ||
      errorMsg.includes("RESOURCE_EXHAUSTED") ||
      error?.status === 429;

    if (isRateLimit) {
      console.warn("[Series Lab] API Quota Exceeded. Throwing error to UI.");
      throw new RateLimitError("Rate limit exceeded for series generation.", 25);
    }

    console.error("Error generating series plan:", error);
    console.warn("[Series Lab] Rethrowing error to UI for proper handling.");
    throw error;
  }
}




