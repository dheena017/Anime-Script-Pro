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
  castProfiles: string | null,
  episodePlan: string | null,
  prompt: string
): string {
  const sourceContext = [
    episodePlan ? `EPISODE PLAN:\n${episodePlan}` : "",
    worldBuilding ? `WORLD CONTEXT:\n${worldBuilding}` : "",
    castProfiles ? `CAST REGISTRY:\n${castProfiles}` : "",
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
    castProfiles,
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
  castProfiles: string | null = null,
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
    castProfiles,
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
      castProfiles,   // castDNA
      episodePlan     // episodePlan
    );

    if (text) {
      studioLog("ScriptEngine", `Script synthesized successfully (${text.length} chars).`, "success");
    }
    return text || "Failed to generate script.";
  } catch (error: any) {
    studioLog("ScriptEngine", "Failed to draft script. Falling back to MOCK_SCRIPT.", "error", error);
    return MOCK_SCRIPT;
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
  castProfiles: string | null = null,
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
    castProfiles,
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
        characterRelationships, worldBuilding, castProfiles, episodePlan
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
      worldBuilding, castProfiles, episodePlan
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

export async function generateEpisodeAssets(options: {
  prompt: string;
  script?: string;
  episode: string;
  session: string;
  numScenes: string;
  model: string;
}) {
  const { prompt, script, episode, session, numScenes, model } = options;

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
      model
    ));

  // 2. Episode-level image and video prompt summaries
  const episodeImagePrompts = `Episode ${episode} Image Prompt Matrix: High-fidelity, cinematic style, consistent with the script: ${finalScript.slice(0, 100)}...`;
  const episodeVideoPrompts = `Episode ${episode} Video Sequence Guidance: Dynamic camera work, story-led motion, consistent with: ${finalScript.slice(0, 100)}...`;

  // 3. Generate placeholder scene objects
  const scenes = Array.from({ length: parseInt(numScenes) }, (_, i) => ({
    index: i + 1,
    sceneOutput: {
      narration: `Narration for scene ${i + 1} of episode ${episode}.`,
      visuals: `Visual description for scene ${i + 1}.`,
      sound: `Ambient soundscape for scene ${i + 1}.`,
    },
    imagePrompts: `Image prompt for scene ${i + 1}`,
    videoPrompts: `Video prompt for scene ${i + 1}`,
  }));

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
