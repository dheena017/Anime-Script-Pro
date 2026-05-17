import { callAI } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { VIDEO_PROMPT_GENERATION_PROMPT } from "../prompts";

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

function buildFallbackVideoUrl(): string {
  return "https://vjs.zencdn.net/v/oceans.mp4";
}

export async function generateVideoPrompts(script: string, model: string = "gemini-1.5-flash-latest") {
  validateVideoScript(script);
  const contentType = inferContentType(script);
  const systemInstruction = VIDEO_PROMPT_GENERATION_PROMPT(contentType, script);

  try {
    const prompt = `
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
    return text || buildFallbackVideoPrompt(script, contentType);
  } catch (error) {
    console.error("Error generating video prompts:", error);
    return buildFallbackVideoPrompt(script, contentType);
  }
}

export async function simulateVideoRender(prompt: string) {
  validateVideoScript(prompt);
  console.info(`%c[Video Lab] %cSimulating render for: %c${prompt.slice(0, 50)}...`, 'color: #8b5cf6; font-weight: bold;', 'color: #94a3b8;', 'color: #fff; font-weight: bold;');
  // Simulate a long-running video synthesis process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        videoUrl: "https://vjs.zencdn.net/v/oceans.mp4", // Mock video
        thumbnailUrl: "https://vjs.zencdn.net/v/oceans.png"
      });
    }, 5000); // 5 second simulation
  });
}

export async function generateSceneVideo(prompt: string, model: string = "veo-2.0-generate-001", provider?: string): Promise<string | null> {
  validateVideoScript(prompt);
  // Proxy the render request to the backend render endpoint which will call the configured provider
  try {
    const res = await fetch('/api/render/scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, duration: 4, provider })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Render proxy failed', err);
      return null;
    }

    const body = await res.json();
    if (body && body.success && body.videoUrl) return body.videoUrl;
    return null;
  } catch (error) {
    console.error('Error calling render proxy:', error);
    return null;
  }
}





