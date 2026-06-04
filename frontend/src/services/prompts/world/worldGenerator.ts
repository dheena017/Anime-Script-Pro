import { generateText, streamText } from "../core";
import { 
  validateWorldPrompt, 
  validateWorldModel, 
  normalizeContentType, 
  buildWorldPrompt
} from "./worldUtils";

import { MOCK_WORLD } from "../mockData";
import { 
  WORLD_GENERATION_PROMPT, 
  POWER_SYSTEM_PROMPT, 
  FACTION_SYSTEM_PROMPT, 
  LORE_GENERATION_PROMPT, 
  ARCHITECTURE_GENERATION_PROMPT, 
  ATLAS_GENERATION_PROMPT, 
  CULTURE_GENERATION_PROMPT, 
  SYSTEMS_GENERATION_PROMPT 
} from "./worldPrompts";
import { studioLog, studioGroup, studioEnd } from "@/lib/dev-console-logs";

let worldGenerateText: typeof generateText = generateText;

export function __setWorldCallAIForTests(mockGenerateText: typeof generateText | null) {
  worldGenerateText = mockGenerateText ?? generateText;
}

// ── PRIMARY GENERATOR FUNCTIONS ──────────────────────────────────────────────

export async function generateWorld(prompt: string, model: string = "gemini-2.5-flash", contentType: string = "Anime"): Promise<string> {
  validateWorldPrompt(prompt);
  validateWorldModel(model);

  const normalizedContentType = normalizeContentType(contentType);
  const enhancedPrompt = buildWorldPrompt(prompt, normalizedContentType);
  const systemInstruction = WORLD_GENERATION_PROMPT(normalizedContentType);

  try {
    const text = await worldGenerateText(
      model,
      enhancedPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    if (!text) throw new Error("Synthesis produced no data.");
    if (text.startsWith("ERROR:")) throw new Error(text);
    return text;
  } catch (error: any) {
    console.error("Error generating world:", error);
    throw error;
  }
}

export async function streamWorld(
  prompt: string, 
  onChunk: (chunk: string) => void,
  model: string = "gemini-3.1-flash", 
  contentType: string = "Anime"
): Promise<string> {
  validateWorldPrompt(prompt);
  const normalizedContentType = normalizeContentType(contentType);
  const enhancedPrompt = buildWorldPrompt(prompt, normalizedContentType);
  const systemInstruction = WORLD_GENERATION_PROMPT(normalizedContentType);

  let fullText = "";
  try {
    const stream = streamText(model, enhancedPrompt, systemInstruction);
    for await (const chunk of stream) {
      fullText += chunk;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("World streaming failed:", error);
    throw error;
  }
}

// ── SUB-COMPONENT GENERATOR FUNCTIONS ────────────────────────────────────────

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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most structured power system possible.
`;
  
  try {
    const text = await worldGenerateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-powers' // requestLabel
    );
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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most realistic factional design possible.
`;
  
  try {
    const text = await generateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-factions' // requestLabel
    );
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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most cohesive historical timeline possible.
`;
  
  try {
    const text = await generateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-lore-history' // requestLabel
    );
    if (!text) throw new Error("Lore synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating lore history:", error);
    throw error;
  }
}

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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most immersive architectural design possible.
`;
  studioGroup('WorldEngine', 'Architectural Synthesis', 'anime');
  try {
    const text = await worldGenerateText(
      model, 
      userPrompt, 
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-architecture' // requestLabel
    );
    if (!text) throw new Error("Architecture synthesis produced no data.");
    studioLog('WorldEngine', 'Architectural language synthesized successfully.', 'success');
    return text;
  } catch (error: any) {
    studioLog('WorldEngine', 'Failed to synthesize architecture.', 'error', error);
    throw error;
  } finally {
    studioEnd();
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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most immersive geographical design possible.
`;
  studioGroup('WorldEngine', 'Atlas Cartography', 'anime');
  try {
    const text = await worldGenerateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-atlas' // requestLabel
    );
    if (!text) throw new Error("Atlas synthesis produced no data.");
    studioLog('WorldEngine', 'Geographical atlas mapped successfully.', 'success');
    return text;
  } catch (error: any) {
    studioLog('WorldEngine', 'Failed to map atlas.', 'error', error);
    throw error;
  } finally {
    studioEnd();
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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most immersive cultural design possible.
`;
  studioGroup('WorldEngine', 'Cultural Ethos Design', 'anime');
  try {
    const text = await worldGenerateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-culture' // requestLabel
    );
    if (!text) throw new Error("Culture synthesis produced no data.");
    studioLog('WorldEngine', 'Societal ethos designed successfully.', 'success');
    return text;
  } catch (error: any) {
    studioLog('WorldEngine', 'Failed to design culture.', 'error', error);
    throw error;
  } finally {
    studioEnd();
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

CRITICAL DIRECTIVE:
Ensure the output is highly accurate, logically consistent, and deeply detailed. The result must be the absolute best and most cohesive systems design possible.
`;
  try {
    const text = await worldGenerateText(
      model,
      userPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext, // worldLore
      null, // characterDNA
      null, // episodePlan
      'world-systems' // requestLabel
    );
    if (!text) throw new Error("Systems synthesis produced no data.");
    return text;
  } catch (error: any) {
    console.error("Error generating systems:", error);
    throw error;
  }
}

// ── INTERNAL HELPERS & VALIDATORS ───────────────────────────────────────────

export * from "./worldUtils";
export * from "./worldPrompts";
