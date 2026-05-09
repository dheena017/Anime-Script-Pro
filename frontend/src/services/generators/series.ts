import { callAI, RateLimitError } from "./core";
import { MOCK_SERIES_PLAN, MOCK_WORLD, MOCK_CHARACTERS } from "./mockData";
import { SERIES_PLAN_GENERATION_PROMPT } from "../prompts";

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

function buildSeriesPrompt(
  prompt: string,
  contentType: string,
  episodeCount: number,
  worldLore?: string,
  castProfiles?: string
): string {
  const worldContext = worldLore || 'Standard genre rules.';
  const castContext = castProfiles || 'Generic archetypes.';

  return `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}

WORLD LORE CONTEXT:
${worldContext}

CAST REGISTRY:
${castContext}

SEASON DESIGN REQUIREMENTS:
- Build a ${episodeCount}-episode arc that escalates logically from setup to climax.
- Keep the season aligned with the established world lore, cast psychology, and faction dynamics.
- Make each episode feel distinct in purpose, emotional turn, and narrative function.
- Include episode titles, hooks, summary beats, and clear continuity from one episode to the next.
- Ensure the plan can feed directly into script, scene, metadata, and image prompt generation.

PIPELINE CONNECTION RULES:
- Reflect world-building details as season-level stakes and environmental pressure.
- Reflect cast details as episode-level relationship tension and character-driven turns.
- Reflect script logic as scene-ready episode summaries.
- Reflect metadata logic by creating memorable, keyword-friendly episode titles and hooks.

DETAILED EPISODE SPEC RULES:
- Each episode object MUST include a detailed_episode_spec object with:
  - cold_open: 2-4 cinematic sentences.
  - acts: an array of 3 acts, each with purpose, key_turn, and 3-5 scenes.
  - Scene schema: scene_id, location, summary, conflict, character_focus, visual_direction, audio_direction, estimated_minutes.
  - continuity_dependencies, foreshadowing, payoffs, thumbnail_prompts, video_prompts as string arrays.
- Each episode object MUST include risk_matrix with continuity_risks, production_risks, and content_risks arrays.
- Keep IDs deterministic and sortable (example: E01_A1_S01).

REQUIRED EPISODE JSON SHAPE:
{
  "episode": "01",
  "title": "Episode title",
  "hook": "2-3 sentence hook",
  "summary": "Full synopsis",
  "setting": "Primary setting",
  "runtime": "24m",
  "focus_characters": ["Character 1", "Character 2"],
  "emotional_arc": "Emotional turn",
  "detailed_episode_spec": {
    "cold_open": "...",
    "acts": [
      {
        "act": 1,
        "purpose": "...",
        "key_turn": "...",
        "scenes": [
          {
            "scene_id": "E01_A1_S01",
            "location": "...",
            "summary": "...",
            "conflict": "...",
            "character_focus": ["..."],
            "visual_direction": "...",
            "audio_direction": "...",
            "estimated_minutes": 3
          }
        ]
      }
    ],
    "continuity_dependencies": ["..."],
    "foreshadowing": ["..."],
    "payoffs": ["..."],
    "thumbnail_prompts": ["..."],
    "video_prompts": ["..."]
  },
  "asset_matrix": {
    "sound": "...",
    "image": "...",
    "video": "...",
    "scene_count": "..."
  },
  "risk_matrix": {
    "continuity_risks": ["..."],
    "production_risks": ["..."],
    "content_risks": ["..."]
  }
}

OUTPUT RULES:
- Return only a JSON array.
- Do not add markdown, commentary, or code fences.
- Keep each entry production-ready and easy to parse.
`;
}

function buildSeriesFallback(episodeCount: number) {
  const connectedFallback = MOCK_SERIES_PLAN.slice(0, episodeCount);

  if (connectedFallback.length >= episodeCount) {
    return connectedFallback;
  }

  return [
    ...connectedFallback,
    ...Array.from({ length: episodeCount - connectedFallback.length }, (_, index) => {
      const episodeNumber = connectedFallback.length + index + 1;
      return {
        episode: String(episodeNumber).padStart(2, '0'),
        title: `Episode ${episodeNumber}`,
        hook: `Fallback episode ${episodeNumber} built from the current world, cast, and project context.`,
        summary: `Episode ${episodeNumber} advances the season arc with escalating conflict and continuity-safe story beats.`,
        emotional_arc: 'Escalation and transition',
        setting: 'Derived from the established world context',
        runtime: '24m',
        focus_characters: [] as string[]
      };
    })
  ];
}

async function expandEpisodeDetails(
  episodeSummary: any,
  model: string,
  contentType: string,
  worldLore: string,
  castProfiles: string
): Promise<any> {
  const epId = episodeSummary?.episode || episodeSummary?.episode_number || '01';
  const prompt = `
EXPAND_EPISODE_DETAIL:
Produce a JSON object named "detailed_episode_spec" for the following episode summary.
Return only the JSON object for "detailed_episode_spec" (no markdown, no commentary).

Episode Summary:
${JSON.stringify(episodeSummary, null, 2)}

REQUIREMENTS:
- Provide "cold_open" (2-4 cinematic sentences).
- Provide "acts": array of 3 acts, each with "act", "purpose", "key_turn", and "scenes" (3-5 scenes).
- Each scene must include: scene_id, location, summary, conflict, character_focus, visual_direction, audio_direction, estimated_minutes.
- Provide continuity_dependencies, foreshadowing, payoffs, thumbnail_prompts, video_prompts as arrays.

Ensure scene IDs are deterministic (e.g., E${epId}_A1_S01).
`;

  try {
    const res = await callAI(
      model,
      prompt,
      SERIES_PLAN_GENERATION_PROMPT(contentType, 1, worldLore, castProfiles),
      0.8,
      1024,
      0.9,
      20,
      120000,
      worldLore,
      castProfiles
    );

    if (!res) return episodeSummary;

    const cleaned = res.replace(/```json|```/g, '').trim();
    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Attempt to extract the first object match
      const objMatch = cleaned.match(/\{[\s\S]*\}/);
      if (objMatch) parsed = JSON.parse(objMatch[0]);
    }

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
) {
  validateSeriesPrompt(prompt);
  validateSeriesContentType(contentType);
  validateSeriesEpisodeCount(episodeCount);

  const worldFallback = worldLore || MOCK_WORLD;
  const castFallback = castProfiles || MOCK_CHARACTERS;

  const systemInstruction = SERIES_PLAN_GENERATION_PROMPT(
    contentType,
    episodeCount,
    worldFallback,
    castFallback
  );

  const userPrompt = buildSeriesPrompt(prompt, contentType, episodeCount, worldFallback, castFallback);

  try {
    const text = await callAI(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldLore, // worldLore
      castProfiles // castDNA
    );
    if (!text) {
      return buildSeriesFallback(episodeCount);
    }

    const cleanJson = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    if (!Array.isArray(parsed)) {
      throw new Error('Series synthesis did not return a JSON array.');
    }

    // Optionally expand each episode sequentially into detailed_episode_spec
    if (expandSequentially) {
      const expanded: any[] = [];
      for (const ep of parsed) {
        try {
          // Try to expand only when detailed_episode_spec is missing
          if (!ep.detailed_episode_spec) {
            // expandEpisodeDetails will call the AI to produce scene-by-scene output for this episode
            // We pass minimal context to avoid heavy payloads
            // eslint-disable-next-line no-await-in-loop
            const full = await expandEpisodeDetails(ep, model, contentType, worldFallback, castFallback);
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
    console.warn("[Series Lab] Falling back to local season scaffold to preserve downstream prompt generation.");
    return buildSeriesFallback(episodeCount);
  }
}




