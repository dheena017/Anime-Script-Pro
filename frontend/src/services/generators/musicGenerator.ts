import { generateText } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { MUSIC_PROMPT_GENERATION_PROMPT } from "../prompts/musicPrompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";
import { apiRequest } from '@/lib/api-utils';
import { muteBadWords } from "./safety";

function validateMusicScript(script: string): void {
  if (!script || typeof script !== 'string' || script.trim().length < 20) {
    throw new Error('Screenplay script must be at least 20 characters long.');
  }
}

function inferMusicStyle(script: string): string {
  return script.toLowerCase().includes("anime") ? "Neon-Steampunk Anime Orchestral" : "Steampunk Ambient Score";
}

function buildFallbackMusicPrompt(script: string, style: string): string {
  return JSON.stringify([
    {
      scene_number: 1,
      audio_cue: "Episodic Opening Scene",
      music_prompt: `[Steampunk Foley], [Industrial Orchestral], [Dark Ambient], [Analog Warmth], style: ${style}`,
      sound_effects: ["steam venting pressure", "iron gear locking"],
      acoustic_vibe: "Industrial Tension"
    }
  ], null, 2);
}

/**
 * Generates dynamic music and sound effects prompts derived from screenplay scripts.
 */
export async function generateMusicPrompts(script: string, model: string = TEXT_MODELS[0].id): Promise<string> {
  const safeScript = muteBadWords(script);
  validateMusicScript(safeScript);
  const style = inferMusicStyle(safeScript);
  const systemInstruction = MUSIC_PROMPT_GENERATION_PROMPT(style, safeScript);

  try {
    const prompt = `
Generate cinematic music and sound effect prompts mapped scene-by-scene to this screenplay script.

ACOUSTIC THEMATIC STYLE:
${style}

SCRIPT DATA:
${safeScript}

PIPELINE REQUIREMENTS:
- Read narrative tension and specify exact musical vibes and instrumentations.
- Ensure prompts format strictly into the JSON array of objects specified in instructions.
`;

    const text = await generateText(
      model,
      prompt,
      systemInstruction,
      0.80, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackMusicPrompt(script, style);
  } catch (error) {
    console.error("Error generating music prompts:", error);
    return buildFallbackMusicPrompt(script, style);
  }
}

import { MUSIC_MODELS } from "@/lib/aiModels/musicModels";

/**
 * Trigger neural music compilation proxying request to backend API.
 */
export async function generateMusicTrack(prompt: string, model: string = "stable-audio-2.0"): Promise<string | null> {
  const modelFallbacks = [
    model,
    "stable-audio-2.0",
    ...MUSIC_MODELS.map(m => m.id).filter(id => id !== model && id !== "stable-audio-2.0")
  ];

  let lastError: Error | null = null;

  for (const currentModel of modelFallbacks) {
    try {
      const res = await apiRequest<any>('/api/audio', {
        method: 'POST',
        label: `Generate Music Track (${currentModel})`,
        body: JSON.stringify({ prompt, model: currentModel, duration: 15 })
      });
      if (res && res.success && res.audioUrl) {
        return res.audioUrl;
      }
      throw new Error(res?.message || "Generation failed without returning an audioUrl");
    } catch (error: any) {
      console.warn(`Failed to generate music track with model ${currentModel}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All music generation models failed:", lastError);
  return null;
}
