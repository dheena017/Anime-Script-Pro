import { callAI } from "./core";
import { cleanJson } from "@/lib/api-utils";
import { 
  CHARACTER_GENERATION_PROMPT, 
  CHARACTER_RELATIONSHIP_PROMPT,
  CAST_DNA_PROMPT,
  CAST_DYNAMICS_PROMPT,
  CAST_INTEGRITY_PROMPT
} from "../prompts/characters";
import { studioLog, studioGroup, studioEnd } from "@/lib/studio-logger";

export type RelationshipType =
  | 'Ally'
  | 'Rival'
  | 'Enemy'
  | 'Love'
  | 'Secret'
  | 'Master/Apprentice'
  | 'Familial'
  | 'Betrayal'
  | 'Stalker';

export interface GeneratedCharacter {
  id?: string;
  name: string;
  tier?: string;
  archetype: string;
  age?: number;
  gender?: string;
  personality: string;
  psychologyProfile?: {
    coreWound: string;
    primaryFear: string;
    primaryDesire: string;
    copingMechanism: string;
  };
  appearance: any; // Can be rich object or string
  visualPrompt: string;
  speakingStyle: any; // Can be rich object or string
  powerSystem?: {
    powerType: string;
    powerTier: string;
    signatureAbility: string;
    limitations: string;
    weakness: string;
  };
  narrative?: {
    arcType: string;
    primaryFunction: string;
    emotionalPurpose: string;
  };
  secrets?: string[];
  conflict: string;
  goal: string;
  flaw: string;
  sceneFunction?: string[];
  worldAlignment?: {
    factionAffiliation: string;
    socialClass: string;
    geographicOrigin: string;
    culturalBackground: string;
  };
  relationship_vectors?: {
    targetCharacter: string;
    type: string;
    tension: number;
  }[];
  secret?: string; // Fallback for simple prompt format
}

export interface GeneratedCast {
  markdown: string;
  characters: GeneratedCharacter[];
  relationships: {
    id: string;
    source: string;
    target: string;
    type: RelationshipType;
    tension: number;
    description: string;
  }[];
}

// Internal helper for empty state
function getEmptyCast(): GeneratedCast {
  return {
    markdown: "# New Cast Manifest\nNo characters generated yet.",
    characters: [],
    relationships: []
  };
}

/**
 * generateCharacters
 * Synthesizes a cast of characters with deep psychological profiles and visual DNA.
 */
export async function generateCharacters(
  userRequest: string,
  model: string = "gemini-1.5-flash",
  contentType: string = "Anime",
  worldLore?: string,
  count: number = 8
): Promise<GeneratedCast | string> {

  const contextInjected = `
    ${worldLore ? `\nWORLD LORE CONTEXT: ${worldLore}\n` : ""}
    Characters MUST inhabit and reflect the above context's logic, history, and planned plot points.
  `;

  const systemInstruction = CHARACTER_GENERATION_PROMPT(contentType, contextInjected, count);

  try {
    const aiPrompt = `
      CRITICAL INSTRUCTION: You must determine the ideal size of the cast based on the world lore and production type.
      However, you ABSOLUTELY MUST generate AT LEAST ${count} characters. 
      YOUR OUTPUT WILL BE REJECTED IF THE "characters" ARRAY HAS FEWER THAN ${count} OBJECTS.
      Do NOT stop after generating just the core leads. You must populate the world with necessary Tier 2 (Support) and Tier 3 (Periphery) characters (e.g., mentors, villains, sleeper agents, mascots).
      
      User Request / Genre / Theme: ${userRequest}
      Production Type: ${contentType}
    `;
    studioGroup('CastEngine', 'Character Synthesis', 'anime');
    const text = await callAI(
      model,
      aiPrompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    if (!text) return getEmptyCast();

    try {
      const parsed = cleanJson(text) as GeneratedCast;
      studioLog('CastEngine', `Cast of ${parsed.characters?.length || 0} synthesized successfully.`, 'success');
      return parsed;
    } catch (e) {
      studioLog('CastEngine', 'AI returned unstructured cast data. Attempting recovery...', 'system');
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as GeneratedCast;
        } catch {
          return getEmptyCast();
        }
      }
      return getEmptyCast();
    }
  } catch (error: any) {
    studioLog('CastEngine', 'Failed to synthesize characters.', 'error', error);
    return getEmptyCast();
  } finally {
    studioEnd();
  }
}

/**
 * generateRelationships
 * Synthesizes a complex web of social friction and alliances between an existing cast.
 */
export async function generateRelationships(
  genre: string,
  cast: string,
  model: string = "gemini-2.0-flash",
  contentType: string = "Anime"
): Promise<GeneratedCast['relationships']> {
  const systemInstruction = CHARACTER_RELATIONSHIP_PROMPT;

  try {
    const prompt = `Generate a relationship matrix for the following characters in a ${genre} ${contentType}: ${cast}`;
    const text = await callAI(
      model,
      prompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );

    if (!text) return [];

    try {
      return cleanJson(text) as GeneratedCast['relationships'];
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
  } catch (error) {
    console.error("Error generating relationships:", error);
    return [];
  }
}
/**
 * generateCastDNA
 * Analyzes the archetypal resonance and narrative weight of the cast.
 */
export async function generateCastDNA(
  castData: string,
  worldContext: string,
  model: string = "gemini-1.5-flash"
): Promise<any> {
  try {
    const sysPrompt = CAST_DNA_PROMPT(castData, worldContext);
    const text = await callAI(
      model,
      "Provide deep narrative DNA analysis of this cast.",
      sysPrompt,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldContext // worldLore
    );
    return cleanJson(text);
  } catch (error) {
    console.error("Error generating Cast DNA:", error);
    return null;
  }
}

/**
 * generateCastDynamics
 * Synthesizes a complex dynamics map of growth arcs and tension points.
 */
export async function generateCastDynamics(
  relationships: string,
  cast: string,
  model: string = "gemini-1.5-flash"
): Promise<any> {
  try {
    const sysPrompt = CAST_DYNAMICS_PROMPT(relationships, cast);
    const text = await callAI(
      model,
      "Synthesize a complex dynamics map of growth arcs and tension points.",
      sysPrompt,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return cleanJson(text);
  } catch (error) {
    console.error("Error generating Cast Dynamics:", error);
    return null;
  }
}

/**
 * generateCastIntegrity
 * Audits the cast for consistency and logic gaps.
 */
export async function generateCastIntegrity(
  cast: string,
  model: string = "gemini-1.5-flash"
): Promise<any> {
  try {
    const sysPrompt = CAST_INTEGRITY_PROMPT(cast);
    const text = await callAI(
      model,
      "Audit the cast for consistency, logic gaps, and character depth.",
      sysPrompt,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return cleanJson(text);
  } catch (error) {
    console.error("Error generating Cast Integrity:", error);
    return null;
  }
}

