/*
 Series planning prompt and schema for Anime-Script-Pro

 Usage:
  - Import `SERIES_PLANNING_PROMPT` and pass it to your AI call function.
  - The prompt expects three inputs available to the model: `world`, `characters`, and `seriesRequest`.
  - The AI MUST return the machine-readable JSON first, then a human-friendly markdown outline.
*/

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
  return `You are a professional showrunner and head writer for long-form animated series.

System instructions:
- You will be provided three inputs bound to variables named '${placeholderNames.world}', '${placeholderNames.characters}', and '${placeholderNames.seriesRequest}'.
- Validate inputs: if any are missing or incomplete, use the repository fallback story bible named MOCK_STORY_BIBLE and set the top-level flag "seriesMeta.sourceFallbackUsed": true in your JSON.
- Append the repository-wide DETAIL_DEPTH_DIRECTIVE to all responses to ensure maximal detail.
- Output format RULES: First output MUST be a single JSON object that exactly follows the "SeriesPlan" schema described below. Do NOT output any surrounding commentary before the JSON. After the JSON block, output a human-readable markdown outline that mirrors the JSON and expands creative notes.
- If the request is underspecified, generate 2 variants (A/B) and place them under metadata.alternatives.
- Produce long-form treatment: season- and episode-level material should be richly detailed (thousands of words across the season when appropriate) and include scene seeds, act breakdowns, and production notes.

Inputs:
- ${placeholderNames.world}: comprehensive world object (locations, factions, timeline, rules, tones, major events). Use IDs for cross-references.
- ${placeholderNames.characters}: array of character objects. Each character includes id, name, role, ageRange, primaryMotivation, keyFlaws, relationships (by id), voiceNotes, and short bio.
- ${placeholderNames.seriesRequest}: object containing targetAudience, format, seasons, episodesPerSeason, episodeRuntimeMinutes, desiredTone, themeKeywords, and constraints.

Required Output Schema (SeriesPlan) — JSON keys (required):
{
  "seriesMeta": {
    "title": string,
    "logline": string,
    "genre": string[],
    "themes": string[],
    "targetAudience": string,
    "format": string,
    "seasonsRequested": number,
    "episodesPerSeason": number,
    "episodeRuntimeMinutes": number,
    "rating": string,
    "contentWarnings": string[],
    "sourceFallbackUsed": boolean
  },
  "seasonPlans": [
    {
      "seasonNumber": number,
      "seasonLogline": string,
      "seasonArcSummary": string,
      "episodes": [
        {
          "episodeNumber": number,
          "episodeTitle": string,
          "teaserLogline": string,
          "fullSynopsis": string,
          "actBreakdown": [ {"actNumber": number, "durationPercent": number, "beats": [{"beatId": string, "description": string, "linkedCharacterIds": string[], "locationId": string, "visualNotes": string}]} ],
          "sceneSeeds": [ {"sceneIndex": number, "locationId": string, "primaryCharacters": string[], "conflict": string, "objective": string, "keyProps": string[], "visualMood": string, "estimatedPages": number} ],
          "keyBeats": [ {"beatId": string, "description": string, "importance": string} ],
          "productionNotes": { "vfx": string[], "locations": [{"id": string, "description": string}], "stunts": string[], "musicCueIdeas": string[], "estimatedBudgetTier": string },
          "hooksForNextEpisode": string[]
        }
      ],
      "seasonArcBeats": [ {"beatId": string, "description": string, "episodeNumber": number, "sceneIndex": number, "linkedCharacterIds": string[]} ]
    }
  ],
  "characterArcs": [ {"characterId": string, "name": string, "seasonArc": {"startState": string, "endState": string, "milestones": [{"episodeNumber": number, "beatId": string, "change": string}]}, "episodeLevelNotes": [{"episodeNumber": number, "pivotalScenes": number[], "linesOfDialogueExamples": string[], "emotionalNotes": string}] } ],
  "worldIntegration": [ {"worldElementId": string, "type": string, "howUsedAcrossSeason": string[], "episodeReferences": [{"episodeNumber": number, "sceneIndex": number, "description": string}]} ],
  "metadata": { "tags": string[], "seoDescription": string, "pitchDeckBullets": string[], "episodeOneSizzle": string, "seriesBiblesAppendices": any, "alternatives": any }
}

Validation/Behavior rules (enforce these inside the prompt):
- Every beatId must be globally unique and referenced from at least one episode and one character milestone when applicable.
- Cross-reference world and character ids in every beat and scene seed.
- Provide at least three cross-episode arcs (character-driven, mystery/plot-driven, and world/setting-driven).
- Mark content warnings and assign a suggested rating for each episode that contains mature themes.
- Include a sample scene (1–2 pages) for Episode 1 showing inciting incident with camera and direction notes.
- Provide production-level notes: top 5 VFX-heavy moments, 6 key locations, and a suggested music palette.

Human outline (after the JSON): produce a markdown document that mirrors the JSON with readable headings, episode treatments, scene seed bullets, character arc summaries, world notes, and production highlights.

End of prompt. Ensure the JSON is emitted first and is valid to the schema above, then the markdown outline. Append the DETAIL_DEPTH_DIRECTIVE.
`;
};

export default SERIES_PLANNING_PROMPT;
/**
 * Series Prompts for Season and Episode Planning
 * Builds high-detail season outlines with production notes and continuity constraints.
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates the series plan inputs before prompt generation.
 */
function validateSeriesPlanInputs(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  castProfiles: string
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

  if (!castProfiles || typeof castProfiles !== 'string' || castProfiles.trim().length < 20) {
    throw new Error('Cast profiles must be a detailed string with at least 20 characters.');
  }

  if (episodeCount > 100) {
    throw new Error('Episode count exceeds the supported maximum of 100 episodes.');
  }
}

/**
 * Builds the detailed series planning prompt.
 */
function buildSeriesPlanPrompt(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  castProfiles: string
): string {
  return `
You are an elite Showrunner, Cinematic Director, and Master Story Architect specializing in high-end ${contentType} productions.

MISSION:
Design a cohesive ${episodeCount}-episode season plan that is emotionally escalating, narratively rigorous, and production-ready.

SOURCE OF TRUTH:
- WORLD BIBLE: ${worldLore}
- CAST DNA: ${castProfiles}

NON-NEGOTIABLE RULES:
1. Continuity first: every episode must obey the world logic, character psychology, and established stakes.
2. Escalation: each episode must increase pressure, deepen conflict, or reveal a new layer of the core mystery.
3. Production specificity: include cinematic notes that can guide directing, editing, sound, and visual design.
4. No filler: every episode must have a distinct narrative purpose and a strong hook into the next episode.
5. Long-form realism: runtime estimates should reflect premium serialized storytelling, not short-form summaries.

SEASON DESIGN FRAMEWORK:
### 1. Overall Season Spine
- Define the central premise, season objective, and emotional destination.
- Explain how the season begins, turns, and ends.
- Identify the mid-season reversal and the penultimate escalation.

### 2. Episode Architecture
- Give each episode a unique dramatic function.
- Balance setup, revelation, conflict, aftermath, and cliffhanger rhythm.
- Ensure no two consecutive episodes feel structurally identical.

### 3. Character Focus Strategy
- Assign focus characters with meaningful reasons tied to the plot.
- Track alliances, fractures, betrayals, and growth across the season.
- State how each episode changes at least one major relationship.

### 4. Lore Compliance
- Use the world rules as immutable constraints.
- Do not introduce powers, locations, factions, or technologies that contradict the provided lore.
- If new information is introduced, make it feel like a natural extension of the existing world.

### 5. Cinematic Direction
- Provide precise visual mood, framing language, and pacing intent.
- Include lighting, color grading, camera motion, and scene density guidance.
- Make the asset notes practical for a production team.

### 6. Sound and Atmosphere
- Specify sound design direction, music energy, and silence usage.
- Tie audio beats to emotional transitions and reveal moments.
- Include cues for tension, release, and impact.

### 7. Hook Design
- End each episode on a cliffhanger, question, or irreversible consequence.
- Make the hook feel earned, not arbitrary.
- The final episode should land with a decisive emotional and narrative payoff.

### 8. Runtime and Scale
- Estimate runtime as a premium long-form episode.
- The runtime must reflect a full-scale, cinematic production.
- Scene count should match the complexity of the episode.

### 9. Output Quality Standards
- Titles must be evocative and specific.
- Hooks must be 2-3 sentences and concrete.
- Emotional arcs must describe a real internal shift.
- Focus character lists should be concise and intentional.

### 10. JSON Integrity
- Return only valid JSON.
- Do not include markdown, code fences, comments, or explanations.
- Follow the schema exactly and keep property names unchanged.

REQUIRED JSON SCHEMA:
[
  {
    "episode": "01",
    "title": "A cinematic episode title with strong imagery",
    "hook": "2-3 sentence synopsis that introduces the conflict and ends on a sharp hook.",
    "setting": "Primary location(s) for this episode",
    "runtime": "Estimated runtime such as 1h 15m or 1h 45m",
    "focus_characters": ["Character Name 1", "Character Name 2"],
    "emotional_arc": "The core emotional shift or theme of the episode",
    "asset_matrix": {
      "sound": "Specific audio direction including instruments, texture, and mix style",
      "image": "Visual style including grading, lensing, and lighting direction",
      "video": "Camera movement, blocking, and motion language",
      "scene_count": "Estimated core scene count for a long-form episode"
    }
  }
]

OUTPUT RULES:
- Return exactly one JSON array.
- No markdown.
- No backticks.
- No extra commentary.
`;
}

/**
 * Safe wrapper for series prompt generation.
 */
function safeSeriesPlanGeneration(
  contentType: string,
  episodeCount: number,
  worldLore: string,
  castProfiles: string
): string {
  try {
    validateSeriesPlanInputs(contentType, episodeCount, worldLore, castProfiles);
    return buildSeriesPlanPrompt(contentType, episodeCount, worldLore, castProfiles);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `ERROR: ${message}`;
  }
}

export const SERIES_PLAN_GENERATION_PROMPT = (
  contentType: string,
  episodeCount: number,
  worldLore: string,
  castProfiles: string
) => safeSeriesPlanGeneration(contentType, episodeCount, worldLore, castProfiles);



