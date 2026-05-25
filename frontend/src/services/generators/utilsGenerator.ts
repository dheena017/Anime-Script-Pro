import { callAI } from "./core";
import { ENHANCE_NARRATION_PROMPT, SUGGEST_DURATION_PROMPT } from "../prompts";

function validateNarrationInput(narration: string): void {
  if (!narration || typeof narration !== 'string' || narration.trim().length < 2) {
    throw new Error('Narration must be a non-empty string.');
  }
}

function validateModelName(model: string): void {
  if (!model || typeof model !== 'string' || model.trim().length < 2) {
    throw new Error('Model name must be a non-empty string.');
  }
}

function buildNarrationEnhancementPrompt(narration: string): string {
  return `
Current Narration:
"${narration}"

CONTEXTUAL DIRECTION:
- Rewrite the narration so it feels cinematic, voice-ready, and emotionally precise.
- Preserve the original meaning while adding performance cues, rhythm, emphasis, and pacing guidance.
- Make the line compatible with downstream script, scene, and metadata generation.
- Prefer concrete sensory language over vague abstraction.

QUALITY BAR:
- The result should be usable by a narrator, voice actor, or recap editor immediately.
- Keep the enhanced narration aligned with the tone of the broader story pipeline.
`;
}

function buildDurationPrompt(narration: string): string {
  return `
Estimate a suitable duration for this narration.

NARRATION:
${narration}

CONSIDER:
- pace
- word density
- pauses
- emotional delivery
- clarity for voiceover timing
- how the line would sound in a cinematic recap or story readout
`;
}

export async function enhanceNarration(narration: string, model: string = "gemini-1.5-flash-latest") {
  validateNarrationInput(narration);
  validateModelName(model);
  const systemInstruction: string = ENHANCE_NARRATION_PROMPT(narration);

  try {
    const prompt = buildNarrationEnhancementPrompt(narration);
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
    return text || narration;
  } catch (error) {
    console.error("Error enhancing narration:", error);
    return narration;
  }
}

export async function suggestDuration(narration: string, model: string = "gemini-1.5-flash-latest") {
  validateNarrationInput(narration);
  validateModelName(model);
  const systemInstruction: string = SUGGEST_DURATION_PROMPT(narration);

  try {
    const prompt = buildDurationPrompt(narration);
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
    return text ? text.trim() : "5s";
  } catch (error) {
    console.error("Error suggesting duration:", error);
    return "5s";
  }
}




