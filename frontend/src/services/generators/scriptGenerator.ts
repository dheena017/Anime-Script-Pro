import { generateText } from "./core";
import { MOCK_SCRIPT } from "./mockData";
import {
  SCRIPT_GENERATION_PROMPT,
  SCRIPT_CONTINUATION_PROMPT,
  SCRIPT_REWRITE_TENSION_PROMPT,
} from "../prompts";
import { studioLog, studioGroup, studioEnd } from "@/lib/studio-logger";
import {
  DEFAULT_SCRIPT_MODEL,
  DEFAULT_CONTENT_TYPE,
  DEFAULT_TONE,
  DEFAULT_AUDIENCE,
  DEFAULT_SESSION,
  DEFAULT_EPISODE,
  DEFAULT_NUM_SCENES,
  DEFAULT_RECAPPER_PERSONA,
} from "@/lib/scriptDefaults";

// ─────────────────────────────────────────────────────────────────────────────
// Internal Validators
// ─────────────────────────────────────────────────────────────────────────────

function validateScriptInput(
  value: string,
  fieldName: string,
  minimumLength = 2
): void {
  if (!value || typeof value !== "string" || value.trim().length < minimumLength) {
    throw new Error(
      `${fieldName} must be a non-empty string with at least ${minimumLength} characters.`
    );
  }
}

function validateScriptSceneCount(numScenes: string): void {
  validateScriptInput(numScenes, "Scene count", 1);
  const parsed = Number(numScenes);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Scene count must be a positive integer provided as a string.");
  }
  if (parsed < 6) {
    throw new Error("Scene count must be at least 6 scenes per episode.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Prompt Builder
// ─────────────────────────────────────────────────────────────────────────────

function buildScriptSystemPrompt(
  contentType: string,
  tone: string,
  audience: string,
  session: string,
  episode: string,
  numScenes: string,
  recapperPersona: string,
  characterRelationships: string | null,
  worldBuilding: string | null,
  characterProfiles: string | null,
  episodePlan: string | null,
  prompt: string
): string {
  const sourceContext = [
    episodePlan ? `EPISODE PLAN:\n${episodePlan}` : "",
    worldBuilding ? `WORLD CONTEXT:\n${worldBuilding}` : "",
    characterProfiles ? `CAST REGISTRY:\n${characterProfiles}` : "",
    characterRelationships ? `RELATIONSHIP MAP:\n${characterRelationships}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const baseInstruction = SCRIPT_GENERATION_PROMPT(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    episodePlan,
    worldBuilding,
    characterProfiles,
    characterRelationships,
    recapperPersona
  );

  return `${baseInstruction}

ADDITIONAL PIPELINE CONTEXT:
${sourceContext || "No extended pipeline context provided."}

PROJECT PROMPT SEED:
${prompt}

SCRIPT RULES:
- The script must feel like a direct downstream translation of the world, series, cast, and relationship prompts.
- Scene progression should respect the episode plan and the established emotional arc.
- Narration should be compatible with later metadata, image, and video packaging.
- If the context is sparse, preserve canon and infer only what is logically supported.
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// generateScript — Batch (non-streaming) version
// ─────────────────────────────────────────────────────────────────────────────

export async function generateScript(
  prompt: string,
  tone: string = DEFAULT_TONE,
  audience: string = DEFAULT_AUDIENCE,
  session: string = DEFAULT_SESSION,
  episode: string = DEFAULT_EPISODE,
  numScenes: string = DEFAULT_NUM_SCENES,
  model: string = DEFAULT_SCRIPT_MODEL,
  contentType: string = DEFAULT_CONTENT_TYPE,
  recapperPersona: string = DEFAULT_RECAPPER_PERSONA,
  characterRelationships: string | null = null,
  worldBuilding: string | null = null,
  characterProfiles: string | null = null,
  episodePlan: string | null = null
) {
  validateScriptInput(prompt, "Script prompt", 20);
  validateScriptInput(tone, "Tone");
  validateScriptInput(audience, "Audience");
  validateScriptInput(session, "Session", 1);
  validateScriptInput(episode, "Episode", 1);
  validateScriptSceneCount(numScenes);
  validateScriptInput(contentType, "Content type");

  const systemInstruction = buildScriptSystemPrompt(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    recapperPersona,
    characterRelationships,
    worldBuilding,
    characterProfiles,
    episodePlan,
    prompt
  );

  studioGroup("ScriptEngine", `Script Drafting: S${session} E${episode}`, "anime");
  try {
    const callPrompt = `
WRITE A ${contentType.toUpperCase()} SCRIPT.
Tone: ${tone}
Audience: ${audience}
Session: ${session}
Episode: ${episode}
Scene Count: ${numScenes}

Project Prompt:
${prompt}

CRITICAL DIRECTIVE:
Ensure the script is highly accurate, logically consistent, and deeply detailed. Focus on realistic pacing, coherent character motivations, rich dialogue, and vivid scene descriptions. The output must be the absolute best, most compelling script possible, seamlessly tying together the world lore and cast profiles without any logical gaps.
`;

    const text = await generateText(
      model,
      callPrompt,
      systemInstruction,
      0.85,    // temperature
      8192,    // maxTokens — scripts can be long
      0.95,    // topP
      40,      // topK
      240000,  // timeoutMs
      worldBuilding,  // worldLore
      characterProfiles,   // characterDNA
      episodePlan     // episodePlan
    );

    if (!text) {
      throw new Error("Failed to generate script: Empty response returned from AI model.");
    }
    studioLog("ScriptEngine", `Script synthesized successfully (${text.length} chars).`, "success");
    return text;
  } catch (error: any) {
    studioLog("ScriptEngine", "Failed to draft script.", "error", error);
    throw error;
  } finally {
    studioEnd();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// generateScriptStream — Streaming (SSE) version
// Calls /api/generate/stream and invokes onChunk(text) with each token.
// Falls back to generateScript() if the stream endpoint is unavailable.
// Returns the full accumulated script string when done.
// ─────────────────────────────────────────────────────────────────────────────

export async function generateScriptStream(
  prompt: string,
  tone: string = DEFAULT_TONE,
  audience: string = DEFAULT_AUDIENCE,
  session: string = DEFAULT_SESSION,
  episode: string = DEFAULT_EPISODE,
  numScenes: string = DEFAULT_NUM_SCENES,
  model: string = DEFAULT_SCRIPT_MODEL,
  contentType: string = DEFAULT_CONTENT_TYPE,
  recapperPersona: string = DEFAULT_RECAPPER_PERSONA,
  characterRelationships: string | null = null,
  worldBuilding: string | null = null,
  characterProfiles: string | null = null,
  episodePlan: string | null = null,
  onChunk?: (partial: string) => void
): Promise<string> {
  validateScriptInput(prompt, "Script prompt", 20);
  validateScriptSceneCount(numScenes);

  const systemInstruction = buildScriptSystemPrompt(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    recapperPersona,
    characterRelationships,
    worldBuilding,
    characterProfiles,
    episodePlan,
    prompt
  );

  const callPrompt = `WRITE A ${contentType.toUpperCase()} SCRIPT.
Tone: ${tone}
Audience: ${audience}
Session: ${session}
Episode: ${episode}
Scene Count: ${numScenes}

Project Prompt:
${prompt}`;

  const authToken =
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    "";
  const streamUrl = "/api/generate/stream";

  studioGroup("ScriptEngine", `Streaming Script: S${session} E${episode}`, "anime");
  try {
    const response = await fetch(streamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ model, prompt: callPrompt, systemInstruction }),
    });

    if (!response.ok || !response.body) {
      studioLog("ScriptEngine", "Stream endpoint unavailable, falling back to batch.", "warn");
      return generateScript(
        prompt, tone, audience, session, episode, numScenes,
        model, contentType, recapperPersona,
        characterRelationships, worldBuilding, characterProfiles, episodePlan
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;
        try {
          const evt = JSON.parse(jsonStr);
          if (evt.error) {
            studioLog("ScriptEngine", `Stream error: ${evt.error}`, "error");
            break;
          }
          const chunk = evt.text || evt.chunk || "";
          if (chunk) {
            accumulated += chunk;
            onChunk?.(accumulated);
          }
        } catch {
          /* malformed SSE line — skip */
        }
      }
    }

    return accumulated || "Failed to generate script.";
  } catch (error: any) {
    studioLog("ScriptEngine", "Stream failed, falling back to batch.", "warn", error);
    return generateScript(
      prompt, tone, audience, session, episode, numScenes,
      model, contentType, recapperPersona,
      worldBuilding, characterProfiles, episodePlan
    );
  } finally {
    studioEnd();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// continueScript — Appends 3 more scenes to an existing script
// ─────────────────────────────────────────────────────────────────────────────

export async function continueScript(
  currentScript: string,
  model: string = DEFAULT_SCRIPT_MODEL,
  contentType: string = DEFAULT_CONTENT_TYPE
) {
  validateScriptInput(currentScript, "Current script", 20);
  validateScriptInput(contentType, "Content type");

  const systemInstruction = SCRIPT_CONTINUATION_PROMPT(contentType);

  try {
    const prompt = `
Continue this ${contentType} script with 3 more scenes.

CURRENT SCRIPT:
${currentScript}

CONTINUITY RULES:
- Preserve world logic, cast behavior, and emotional momentum.
- Build on the existing scene rhythm instead of restarting the story.
- Keep the new scenes usable for later storyboard, metadata, and image generation.
`;

    const text = await generateText(
      model,
      prompt,
      systemInstruction,
      0.85,    // temperature
      2048,    // maxTokens
      0.95,    // topP
      40,      // topK
      180000   // timeoutMs
    );
    return text || "Failed to continue script.";
  } catch (error) {
    console.error("Error continuing script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rewriteForTension — Rewrites a scene description for maximum dramatic tension
// ─────────────────────────────────────────────────────────────────────────────

export async function rewriteForTension(
  sceneDescription: string,
  model: string = DEFAULT_SCRIPT_MODEL
) {
  validateScriptInput(sceneDescription, "Scene description", 10);

  const systemInstruction = SCRIPT_REWRITE_TENSION_PROMPT;

  try {
    const prompt = `
Rewrite this scene for maximum tension.

SCENE DESCRIPTION:
${sceneDescription}

TENSION RULES:
- Increase urgency without changing the core meaning.
- Add sharper verbs, more pressure, and more immediate stakes.
- Keep the rewrite cinematic and production-friendly.
`;

    const text = await generateText(
      model,
      prompt,
      systemInstruction,
      0.85,    // temperature
      2048,    // maxTokens
      0.95,    // topP
      40,      // topK
      180000   // timeoutMs
    );
    return text || sceneDescription;
  } catch (error) {
    console.error("Error rewriting for tension:", error);
    return sceneDescription;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// generateEpisodeAssets — Bundles script + scene + prompt data for an episode
// ─────────────────────────────────────────────────────────────────────────────

function parseScenesJson(text: string, numScenes: number, episode: string): any[] {
  let cleanText = text.trim();
  const firstBracket = cleanText.indexOf('[');
  const lastBracket = cleanText.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleanText = cleanText.slice(firstBracket, lastBracket + 1);
  }

  try {
    const parsed = JSON.parse(cleanText);
    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => {
        const index = typeof item.index === 'number' ? item.index : idx + 1;
        const sceneOutput = item.sceneOutput || {};
        return {
          index,
          sceneOutput: {
            narration: typeof sceneOutput.narration === 'string' && sceneOutput.narration.trim()
              ? sceneOutput.narration.trim()
              : `Narration for scene ${index} of episode ${episode}.`,
            visuals: typeof sceneOutput.visuals === 'string' && sceneOutput.visuals.trim()
              ? sceneOutput.visuals.trim()
              : `Visual description for scene ${index}.`,
            sound: typeof sceneOutput.sound === 'string' && sceneOutput.sound.trim()
              ? sceneOutput.sound.trim()
              : `Ambient soundscape for scene ${index}.`,
          },
          imagePrompts: typeof item.imagePrompts === 'string' && item.imagePrompts.trim()
            ? item.imagePrompts.trim()
            : `Image prompt for scene ${index}`,
          videoPrompts: typeof item.videoPrompts === 'string' && item.videoPrompts.trim()
            ? item.videoPrompts.trim()
            : `Video prompt for scene ${index}`,
        };
      });
    }
  } catch (err) {
    console.warn("Failed to parse scenes JSON from LLM response:", err);
  }

  // Fallback to placeholders if parsing completely fails
  return Array.from({ length: numScenes }, (_, i) => ({
    index: i + 1,
    sceneOutput: {
      narration: `Narration for scene ${i + 1} of episode ${episode}.`,
      visuals: `Visual description for scene ${i + 1}.`,
      sound: `Ambient soundscape for scene ${i + 1}.`,
    },
    imagePrompts: `Image prompt for scene ${i + 1}`,
    videoPrompts: `Video prompt for scene ${i + 1}`,
  }));
}

export async function generateEpisodeAssets(options: {
  prompt: string;
  script?: string;
  episode: string;
  session: string;
  numScenes: string;
  model: string;
  worldLore?: string | null;
  characterProfiles?: string | null;
}) {
  const { prompt, script, episode, session, numScenes, model, worldLore, characterProfiles } = options;

  // 1. Generate or use existing script
  const finalScript =
    script ||
    (await generateScript(
      prompt,
      DEFAULT_TONE,
      DEFAULT_AUDIENCE,
      session,
      episode,
      numScenes,
      model,
      undefined,
      undefined,
      undefined,
      worldLore,
      characterProfiles
    ));

  // 2. Episode-level image and video prompt summaries
  const episodeImagePrompts = `Episode ${episode} Image Prompt Matrix: High-fidelity, cinematic style, consistent with the script: ${finalScript.slice(0, 100)}...`;
  const episodeVideoPrompts = `Episode ${episode} Video Sequence Guidance: Dynamic camera work, story-led motion, consistent with: ${finalScript.slice(0, 100)}...`;

  // 3. Generate high-fidelity scene objects using the LLM instead of static placeholders
  let scenes: any[] = [];
  try {
    const scenesCount = parseInt(numScenes) || 6;
    const systemInstruction = `You are a professional Screenplay and Anime Scene Director. Your task is to break down a full production script into exactly ${scenesCount} sequential, high-fidelity scenes.
For each scene, you must provide highly descriptive and customized details including narration/dialogue, cinematic visual descriptions, ambient soundscapes, and AI prompts.

You MUST respond with a strict, valid JSON array of objects, and absolutely nothing else. Do not include markdown formatting, code block fences, or any trailing/leading explanation text.

Each object in the JSON array must follow this exact schema:
{
  "index": 1,
  "sceneOutput": {
    "narration": "The narration, dialogue, or voiceover lines heard in this scene.",
    "visuals": "Cinematic visual description, including camera angles, lighting, characters, and actions.",
    "sound": "Atmospheric sound direction, background music, or foley sound effects."
  },
  "imagePrompts": "A detailed, descriptive AI text-to-image prompt to generate a keyframe for this scene.",
  "videoPrompts": "A motion-focused AI text-to-video prompt describing the camera movement and character actions for this scene."
}`;

    const breakdownPrompt = `Read the following script and break it down into exactly ${scenesCount} detailed, sequential scenes.
Each scene must represent a consecutive dramatic beat of the script. Make the descriptions highly specific, cinematic, and faithful to the story.

SCRIPT:
${finalScript}

Generate exactly ${scenesCount} JSON scene objects in a flat array.`;

    const response = await generateText(
      model,
      breakdownPrompt,
      systemInstruction,
      0.75, // temperature
      4096, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldLore,
      characterProfiles
    );

    if (response) {
      scenes = parseScenesJson(response, scenesCount, episode);
    } else {
      throw new Error("Empty response from AI when generating scenes");
    }
  } catch (error) {
    console.error("Failed to generate scenes for episode assets, falling back to placeholders:", error);
    scenes = Array.from({ length: parseInt(numScenes) || 6 }, (_, i) => ({
      index: i + 1,
      sceneOutput: {
        narration: `Narration for scene ${i + 1} of episode ${episode}.`,
        visuals: `Visual description for scene ${i + 1}.`,
        sound: `Ambient soundscape for scene ${i + 1}.`,
      },
      imagePrompts: `Image prompt for scene ${i + 1}`,
      videoPrompts: `Video prompt for scene ${i + 1}`,
    }));
  }

  return {
    script: finalScript,
    scenes,
    episodeImagePrompts,
    episodeVideoPrompts,
    meta: {
      title: `Episode ${episode} Synthesis`,
      episode,
      session,
    },
  };
}
