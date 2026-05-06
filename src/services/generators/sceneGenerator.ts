import { callAI } from "./core";
import { SCENE_GENERATION_PROMPT } from "../prompts";

type SceneOutput = {
  narration: string;
  visuals: string;
  sound: string;
};

const FALLBACK_SCENE_OUTPUT: SceneOutput = {
  narration: "Failed to generate narration.",
  visuals: "Failed to generate visuals.",
  sound: "Failed to generate sound.",
};

function extractJsonCandidate(result: string): string {
  const fencedMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const objectMatch = result.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    return objectMatch[0].trim();
  }

  return result.trim();
}

function toSceneOutput(value: unknown): SceneOutput {
  if (!value || typeof value !== "object") {
    return FALLBACK_SCENE_OUTPUT;
  }

  const candidate = value as Partial<SceneOutput>;

  return {
    narration:
      typeof candidate.narration === "string" && candidate.narration.trim().length > 0
        ? candidate.narration.trim()
        : FALLBACK_SCENE_OUTPUT.narration,
    visuals:
      typeof candidate.visuals === "string" && candidate.visuals.trim().length > 0
        ? candidate.visuals.trim()
        : FALLBACK_SCENE_OUTPUT.visuals,
    sound:
      typeof candidate.sound === "string" && candidate.sound.trim().length > 0
        ? candidate.sound.trim()
        : FALLBACK_SCENE_OUTPUT.sound,
  };
}

function parseSceneOutput(result: string): SceneOutput {
  const candidate = extractJsonCandidate(result);

  try {
    return toSceneOutput(JSON.parse(candidate));
  } catch (parseError) {
    console.warn("Direct JSON parse failed, attempting field extraction:", parseError);

    const narration = result.match(/"narration"\s*:\s*"([\s\S]*?)"/i)?.[1]?.trim();
    const visuals = result.match(/"visuals"\s*:\s*"([\s\S]*?)"/i)?.[1]?.trim();
    const sound = result.match(/"sound"\s*:\s*"([\s\S]*?)"/i)?.[1]?.trim();

    return {
      narration: narration || FALLBACK_SCENE_OUTPUT.narration,
      visuals: visuals || FALLBACK_SCENE_OUTPUT.visuals,
      sound: sound || FALLBACK_SCENE_OUTPUT.sound,
    };
  }
}

export async function generateScene(
  prompt: string, 
  beatDescription: string, 
  model: string = "gemini-1.5-flash-latest",
  worldLore: string | null = null,
  castProfiles: string | null = null,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<SceneOutput> {
  const type = prompt.toLowerCase().includes("anime") ? "Anime" : "Screenplay";
  const systemInstruction = SCENE_GENERATION_PROMPT(type, worldLore, castProfiles);

  try {
    const result = await callAI(
      model,
      `Overall Context: ${prompt}\nBeat: ${beatDescription}`,
      systemInstruction,
      options.temperature ?? 0.85,
      options.maxTokens ?? 2048,
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldLore,
      castProfiles
    );

    if (!result) {
      throw new Error("No response from AI");
    }

    return parseSceneOutput(result);
  } catch (error) {
    console.error("AI Scene Generation failed:", error);
    return FALLBACK_SCENE_OUTPUT;
  }
}
