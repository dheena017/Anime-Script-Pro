export interface ContextTrace {
  worldLorePresent: boolean;
  worldLoreLength: number;
  characterDNAPresent: boolean;
  characterDNALength: number;
  episodePlanPresent: boolean;
  episodePlanLength: number;
  excerpts: {
    worldLore?: string;
    characterDNA?: string;
    episodePlan?: string;
  };
}

/**
 * Extracts and summarizes injected context blocks from a composed system instruction.
 */
export function traceContextFromInstruction(instruction: string): ContextTrace {
  const trace: ContextTrace = {
    worldLorePresent: false,
    worldLoreLength: 0,
    characterDNAPresent: false,
    characterDNALength: 0,
    episodePlanPresent: false,
    episodePlanLength: 0,
    excerpts: {}
  };

  if (!instruction || typeof instruction !== 'string') return trace;

  const worldMatch = instruction.match(/=== WORLD LORE SOURCE OF TRUTH ===\s*([\s\S]*?)(?====|$)/i);
  if (worldMatch && worldMatch[1]) {
    const txt = worldMatch[1].trim();
    trace.worldLorePresent = true;
    trace.worldLoreLength = txt.length;
    trace.excerpts.worldLore = txt.slice(0, 800);
  }

  const castMatch = instruction.match(/=== CHARACTER DNA REGISTRY ===\s*([\s\S]*?)(?====|$)/i);
  if (castMatch && castMatch[1]) {
    const txt = castMatch[1].trim();
    trace.characterDNAPresent = true;
    trace.characterDNALength = txt.length;
    trace.excerpts.characterDNA = txt.slice(0, 800);
  }

  const planMatch = instruction.match(/=== EPISODE MASTER BLUEPRINT ===\s*([\s\S]*?)(?====|$)/i);
  if (planMatch && planMatch[1]) {
    const txt = planMatch[1].trim();
    trace.episodePlanPresent = true;
    trace.episodePlanLength = txt.length;
    trace.excerpts.episodePlan = txt.slice(0, 800);
  }

  return trace;
}

export default { traceContextFromInstruction };
