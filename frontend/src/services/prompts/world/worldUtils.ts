import { validateTextInput } from "../utils";

// ==================== GENERATOR UTILITIES ====================

export function validateWorldPrompt(prompt: string): void {
  validateTextInput(prompt, "World prompt", 20);
}

export function validateWorldModel(model: string): void {
  validateTextInput(model, "Model name", 2);
}

export function normalizeContentType(contentType: string): string {
  return contentType.trim() || 'Anime';
}

export function buildWorldPrompt(prompt: string, contentType: string): string {
  return `
CONTENT TYPE: ${contentType}
PROJECT PROMPT: ${prompt}

CONNECTION RULES:
- The world must support character generation, relationship mapping, series planning, scene breakdowns, image prompts, metadata packaging, and channel growth assets.
- Define the world's lore so it can produce consistent cast archetypes, faction politics, episode arcs, scene beats, and visual prompt language.
- Establish clear social hierarchies, power rules, sensory identity, and historical pressure that can be reused across the full prompt pipeline.
- Make the world strong enough to feed downstream prompts without needing reinterpretation.
- Ensure the lore can be translated directly into characters, series sessions, script scenes, thumbnail concepts, alt text, and marketing copy.

PIPELINE ALIGNMENT:
- Character prompts should be able to derive archetypes, flaws, secrets, and power logic from this world.
- Series prompts should be able to derive episode milestones, factions, and escalation from this world.
- Scene prompts should be able to derive blocking, mood, geography, sound, and continuity from this world.
- Image prompts should be able to derive composition, lighting, costume state, and environmental detail from this world.
- Metadata prompts should be able to derive keywords, hooks, and thumbnail concepts from this world.

SOURCE OF TRUTH:
- Treat the project prompt as the canonical story seed.
- Build a coherent world that can sustain long-form narrative, visual storytelling, and SEO packaging.
- Prefer specific, reusable lore elements over vague atmosphere.

CRITICAL DIRECTIVE:
Ensure the world-building is exceptionally accurate, highly logical, and deeply detailed. Every element must be intricately connected without plot holes or inconsistencies. Deliver the absolute best, most comprehensive and immersive world possible.
`;
}

export interface ParsedWorldLore {
  manifest: string;
}

export function parseWorldLore(fullBlob: string): ParsedWorldLore {
  return {
    manifest: fullBlob || ""
  };
}

// ==================== PROMPT UTILITIES ====================

export function validateContentType(contentType: string): void {
  if (!contentType) {
    throw new Error('Content type cannot be empty. Please specify: anime, manga, game, novel, etc.');
  }
  if (typeof contentType !== 'string') {
    throw new Error('Content type must be a string.');
  }
  if (contentType.trim().length < 2) {
    throw new Error('Content type must be at least 2 characters long.');
  }
}

export function validateWorldSpec(worldConcept: string, powerSystem: string): void {
  if (!worldConcept || !powerSystem) {
    throw new Error('Both world concept and power system are required for world generation.');
  }
  if (worldConcept.trim().length < 20) {
    throw new Error('World concept must be at least 20 characters for meaningful generation.');
  }
  if (powerSystem.trim().length < 5) {
    throw new Error('Power system description must be at least 5 characters.');
  }
}

export function safePromptGeneration(
  input: string | { worldConcept: string; powerSystem: string },
  validator: (input: any) => void,
  promptGenerator: (input: any) => string
): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate world prompt: ${errorMessage}`);
  }
}
