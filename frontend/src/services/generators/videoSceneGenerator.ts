// ─────────────────────────────────────────────────────────────────────────────
// videoSceneGenerator.ts — Unified Scene + Video generation pipeline
// Merges the former sceneGenerator.ts and videoGenerator.ts into one cohesive
// module that owns:  Script → Scene Breakdown → Video Prompt → Render Proxy
// ─────────────────────────────────────────────────────────────────────────────

import { generateText } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { SCENE_GENERATION_PROMPT } from "../prompts";
import { VIDEO_PROMPT_GENERATION_PROMPT, SINGLE_SCENE_VIDEO_PROMPT } from "../prompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";
import { VIDEO_MODELS } from "@/lib/aiModels/videoModels";
import { generateImagePrompts } from "./imageGenerator";
import { generateMusicPrompts } from "./musicGenerator";

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Scene Generation (formerly sceneGenerator.ts)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ────────────────────────────────────────────────────────────────────

export type SceneOutput = {
  narration: string;
  visuals: string;
  sound: string;
  ai_prompts?: {
    image_prompt: string;
    video_prompt: string;
    music_prompt: string;
    audio_prompt: string;
  };
};

const FALLBACK_SCENE_OUTPUT: SceneOutput = {
  narration: "Failed to generate narration.",
  visuals: "Failed to generate visuals.",
  sound: "Failed to generate sound.",
};

// ── Scene JSON Parsing Helpers ───────────────────────────────────────────────

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

// ── Public: Scene Generation ─────────────────────────────────────────────────

/**
 * Generate a structured scene breakdown (narration + visuals + sound) from a
 * story beat description.  Accepts optional world-lore and cast-profile context
 * so the AI can maintain continuity across the series.
 */
export async function generateScene(
  prompt: string,
  beatDescription: string,
  model: string = TEXT_MODELS[0].id,
  worldLore: string | null = null,
  characterProfiles: string | null = null,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<SceneOutput> {
  const type = prompt.toLowerCase().includes("anime") ? "Anime" : "Screenplay";
  const systemInstruction = SCENE_GENERATION_PROMPT(type, worldLore, characterProfiles);

  try {
    const result = await generateText(
      model,
      `Overall Context: ${prompt}\nBeat: ${beatDescription}`,
      systemInstruction,
      options.temperature ?? 0.85,
      options.maxTokens ?? 2048,
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldLore,
      characterProfiles
    );

    if (!result) {
      throw new Error("No response from AI");
    }

    const sceneOutput = parseSceneOutput(result);

    // Auto-trigger the dedicated prompt generators in parallel
    try {
      const [imagePrompt, videoPrompt, musicPrompt] = await Promise.all([
        generateImagePrompts(sceneOutput.visuals, model),
        generateVideoPrompts(sceneOutput.visuals, model, { singleScene: true }),
        generateMusicPrompts(sceneOutput.sound, model)
      ]);

      sceneOutput.ai_prompts = {
        image_prompt: imagePrompt,
        video_prompt: videoPrompt,
        music_prompt: musicPrompt,
        audio_prompt: sceneOutput.sound // Fallback for audio as TTS uses the direct sound/narration text
      };
    } catch (err) {
      console.warn("Non-fatal: Failed to auto-generate AI prompts for scene:", err);
    }

    return sceneOutput;
  } catch (error) {
    console.error("AI Scene Generation failed:", error);
    return FALLBACK_SCENE_OUTPUT;
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Video Prompt Generation & Render Proxy (formerly videoGenerator.ts)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Validation & Helpers ─────────────────────────────────────────────────────

function validateVideoScript(script: string): void {
  if (!script || typeof script !== 'string' || script.trim().length < 20) {
    throw new Error('Video script must be at least 20 characters long.');
  }
}

function inferContentType(script: string): string {
  return script.toLowerCase().includes("anime") ? "Anime" : "Series";
}

function buildFallbackVideoPrompt(script: string, contentType: string): string {
  return [
    `Story Bible: ${MOCK_STORY_BIBLE.title}`,
    `Content Type: ${contentType}`,
    `Motion Language: ${MOCK_STORY_BIBLE.visualPalette}`,
    `Camera Rule: keep the motion cinematic, story-led, and continuity-safe.`,
    `Script Anchor: ${script.slice(0, 180).trim() || MOCK_STORY_BIBLE.script[0].narration}`,
  ].join("\n");
}

// ── Public: Video Prompt Generation ──────────────────────────────────────────

/**
 * Use a text model to convert a production script into precise, cinematic video
 * prompts ready for image-to-video or scene-animation workflows.
 */
export async function generateVideoPrompts(
  script: string,
  model: string = TEXT_MODELS[0].id,
  options?: { singleScene?: boolean }
) {
  validateVideoScript(script);
  const contentType = inferContentType(script);
  
  const isSingleScene = options?.singleScene ?? (script.length < 800 && !script.includes('|'));
  const systemInstruction = isSingleScene
    ? SINGLE_SCENE_VIDEO_PROMPT(contentType, script)
    : VIDEO_PROMPT_GENERATION_PROMPT(contentType, script);

  try {
    const prompt = isSingleScene ? `
Generate ONE cinematic video prompt for this scene.

CONTENT TYPE:
${contentType}

SCENE DATA:
${script}

PIPELINE REQUIREMENTS:
- The prompt must align with the scene, story, world, and character continuity.
- Prioritize camera movement, lighting, motion, mood, and production feasibility.
- Return ONLY the exact generated prompt string.
` : `
Generate cinematic video prompts for this production script.

CONTENT TYPE:
${contentType}

SCRIPT:
${script}

PIPELINE REQUIREMENTS:
- The prompts must align with the scene, story, world, and character continuity established elsewhere in the project.
- Prioritize camera movement, lighting, motion, mood, and production feasibility.
- Make the prompts specific enough for image-to-video or scene animation workflows.
`;

    const text = await generateText(
      model,
      prompt,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackVideoPrompt(script, contentType);
  } catch (error) {
    console.error("Error generating video prompts:", error);
    return buildFallbackVideoPrompt(script, contentType);
  }
}

// ── Public: Video Render ─────────────────────────────────────────────────────

/**
 * @deprecated Removed — the demo fallback clip is gone. Use `generateVideo` to
 * proxy to a real render backend instead.
 */
export async function simulateVideoRender(prompt: string) {
  validateVideoScript(prompt);
  throw new Error(
    `Video rendering is not available for "${prompt.slice(0, 50)}..." because the demo fallback clip has been removed and no live renderer is connected.`
  );
}

/**
 * Send a render request to the backend video proxy which delegates to the
 * configured provider (Runway, Pika, local moviepy, etc.).
 */
export async function generateVideo(
  prompt: string, 
  model: string = VIDEO_MODELS[0].id, 
  provider?: string, 
  imageUrl?: string,
  textModel: string = TEXT_MODELS[0].id
): Promise<string | null> {
  validateVideoScript(prompt);

  let optimizedPrompt = prompt;
  
  const needsOptimization = prompt.length < 250 || (!prompt.toLowerCase().includes('camera') && !prompt.toLowerCase().includes('lighting'));
  
  if (needsOptimization) {
    console.log("Optimizing short/raw scene description into a cinematic video prompt...");
    optimizedPrompt = await generateVideoPrompts(prompt, textModel, { singleScene: true });
  }

  const modelFallbacks = [
    model,
    ...VIDEO_MODELS.map(m => m.id).filter(id => id !== model)
  ];
  
  let lastError: Error | null = null;

  for (const currentModel of modelFallbacks) {
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: optimizedPrompt, model: currentModel, duration: 4, provider, image_url: imageUrl })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const detail = err?.detail || err?.message || err?.error || `Video rendering failed with status ${res.status}`;
        throw new Error(detail);
      }

      const body = await res.json();
      if (body && body.success && body.videoUrl) return body.videoUrl;

      const detail = body?.detail || body?.message || 'Video rendering did not return a usable video URL.';
      throw new Error(detail);
    } catch (error: any) {
      console.warn(`Error calling render proxy with model ${currentModel}:`, error.message || error);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All video generation models failed.");
}
