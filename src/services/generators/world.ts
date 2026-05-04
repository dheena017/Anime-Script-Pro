import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";
import { 
  WORLD_GENERATION_PROMPT, 
  POWER_SYSTEM_PROMPT, 
  FACTION_SYSTEM_PROMPT, 
  LORE_GENERATION_PROMPT, 
  ARCHITECTURE_GENERATION_PROMPT, 
  ATLAS_GENERATION_PROMPT, 
  CULTURE_GENERATION_PROMPT, 
  SYSTEMS_GENERATION_PROMPT 
} from "../prompts";

export async function generateArchitecture(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = ARCHITECTURE_GENERATION_PROMPT(contentType);
  const userPrompt = `
Develop a visual architectural style for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (EXISTING MANIFEST):
${worldContext || 'No established rules.'}

TASK:
Design the architectural and visual language of this world. Ensure it connects logically to the geography and culture described in the context above.
`;
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Architecture synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating architecture:", error);
    throw error;
  }
}

export async function generateAtlas(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = ATLAS_GENERATION_PROMPT(contentType);
  const userPrompt = `
Develop a geographical atlas and climate system for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (EXISTING MANIFEST):
${worldContext || 'No established rules.'}

TASK:
Map out the physical geography and environmental logic. The atlas must support the geopolitical tensions described in the world context above.
`;
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Atlas synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating atlas:", error);
    throw error;
  }
}

export async function generateCulture(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = CULTURE_GENERATION_PROMPT(contentType);
  const userPrompt = `
Develop a cultural profile and societal ethos for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (EXISTING MANIFEST):
${worldContext || 'No established rules.'}

TASK:
Design the rituals, daily life, and social hierarchies. Ensure the culture reflects the history and power systems established in the context above.
`;
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Culture synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating culture:", error);
    throw error;
  }
}

export async function generateSystems(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = SYSTEMS_GENERATION_PROMPT(contentType);
  const userPrompt = `
Develop world systems, technology, and ecosystem for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (EXISTING MANIFEST):
${worldContext || 'No established rules.'}

TASK:
Architect the mechanical logic and technological infrastructure. Ensure the technology level and biological rules align with the world manifest provided above.
`;
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Systems synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating systems:", error);
    throw error;
  }
}

function validateWorldPrompt(prompt: string): void {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 20) {
    throw new Error('World prompt must be at least 20 characters long.');
  }
}

function validateWorldModel(model: string): void {
  if (!model || typeof model !== 'string' || model.trim().length < 2) {
    throw new Error('Model name must be a non-empty string.');
  }
}

function normalizeContentType(contentType: string): string {
  return contentType.trim() || 'Anime';
}

function buildWorldPrompt(prompt: string, contentType: string): string {
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
`;
}

export interface ParsedWorldLore {
  manifest: string;
}

/**
 * Preservation wrapper for the AI World Bible.
 * We no longer split into 6 tabs, preserving the full narrative continuity.
 */
export function parseWorldLore(fullBlob: string): ParsedWorldLore {
  return {
    manifest: fullBlob || ""
  };
}

export async function generateWorld(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime"): Promise<string> {
  validateWorldPrompt(prompt);
  validateWorldModel(model);

  const normalizedContentType = normalizeContentType(contentType);
  const enhancedPrompt = buildWorldPrompt(prompt, normalizedContentType);
  const systemInstruction = WORLD_GENERATION_PROMPT(normalizedContentType);

  try {
    const text = await callAI(model, enhancedPrompt, systemInstruction);
    if (!text) throw new Error("Synthesis produced no data.");
    if (text.startsWith("ERROR:")) throw new Error(text);
    return text;
  } catch (error: any) {
    console.error("Error generating world:", error);
    return MOCK_WORLD;
  }
}

export async function generatePowerSystem(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = POWER_SYSTEM_PROMPT(prompt, "Universal System");
  const userPrompt = `
Develop a detailed power system for a ${contentType} project.

CORE SEED: 
${prompt}

WORLD CONTEXT (EXISTING RULES):
${worldContext || 'No established world rules yet.'}

TASK:
Design the power mechanics so they align perfectly with the established world context above. Focus on mechanics, tiers, and limitations.
`;
  
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Power synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating power system:", error);
    throw error;
  }
}

export async function generateFactionSystem(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = FACTION_SYSTEM_PROMPT(contentType);
  const userPrompt = `
Develop a detailed faction and political system for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (EXISTING LAWS & GEOGRAPHY):
${worldContext || 'No established world rules yet.'}

TASK:
Create factions, ideologies, and political tensions that feel like a natural consequence of the world described above.
`;
  
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Faction synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating faction system:", error);
    throw error;
  }
}

export async function generateLoreHistory(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime", worldContext?: string): Promise<string> {
  validateWorldPrompt(prompt);
  const systemInstruction = LORE_GENERATION_PROMPT(contentType);
  const userPrompt = `
Develop a comprehensive historical timeline and lore expansion for a ${contentType} project.

CORE SEED:
${prompt}

WORLD CONTEXT (CURRENT STATE OF REALITY):
${worldContext || 'No established world rules yet.'}

TASK:
Establish the history and eras that led to the world described in the context above. Ensure the timeline explains the origins of current geography and social rules.
`;
  
  try {
    const text = await callAI(model, userPrompt, systemInstruction);
    if (!text) throw new Error("Lore synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating lore history:", error);
    throw error;
  }
}
