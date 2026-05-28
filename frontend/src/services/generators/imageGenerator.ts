import { generateText, generateImage } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { 
  IMAGE_PROMPT_GENERATION_PROMPT, 
  ENHANCE_SCENE_VISUALS_PROMPT
} from "../prompts";

function buildFallbackImagePrompt(script: string): string {
  return [
    `Story Bible: ${MOCK_STORY_BIBLE.title}`,
    `World: ${MOCK_STORY_BIBLE.worldName}`,
    `Visual Language: ${MOCK_STORY_BIBLE.visualPalette}`,
    `Core Frame: ${MOCK_STORY_BIBLE.logline}`,
    `Script Anchor: ${script.slice(0, 180).trim() || MOCK_STORY_BIBLE.script[0].visualDirection}`,
  ].join("\n");
}

function buildFallbackSceneImageData(prompt: string): string {
  const safePrompt = prompt.slice(0, 140).replace(/[<&>]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1020" />
          <stop offset="55%" stop-color="#1a2340" />
          <stop offset="100%" stop-color="#3a184f" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)" />
      <rect width="1280" height="720" fill="url(#glow)" />
      <circle cx="1060" cy="150" r="120" fill="#f472b6" fill-opacity="0.18" />
      <circle cx="220" cy="560" r="170" fill="#38bdf8" fill-opacity="0.14" />
      <rect x="90" y="560" width="1100" height="6" rx="3" fill="#e2e8f0" fill-opacity="0.35" />
      <text x="90" y="120" fill="#f8fafc" font-size="36" font-family="Arial, sans-serif" font-weight="700">Demo Scene Placeholder</text>
      <text x="90" y="175" fill="#cbd5e1" font-size="22" font-family="Arial, sans-serif">${safePrompt || MOCK_STORY_BIBLE.logline}</text>
      <text x="90" y="650" fill="#94a3b8" font-size="18" font-family="Arial, sans-serif">${MOCK_STORY_BIBLE.title}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}



export async function generateImagePrompts(script: string, model: string = "gemini-1.5-flash-latest") {
  const contentType = script.toLowerCase().includes("anime") ? "Anime" : "Series";
  const systemInstruction = IMAGE_PROMPT_GENERATION_PROMPT(contentType, script);

  try {
    const text = await generateText(
      model,
      `Generate image prompts for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackImagePrompt(script);
  } catch (error) {
    console.error("Error generating image prompts:", error);
    return buildFallbackImagePrompt(script);
  }
}

export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = ENHANCE_SCENE_VISUALS_PROMPT;

  try {
    const prompt = `Narration context: "${narration}"\nCurrent Visuals: "${visuals}"\n\nEnhance these visuals.`;
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
    return text || visuals;
  } catch (error) {
    console.error("Error enhancing visuals:", error);
    return visuals;
  }
}

export async function generateSceneImage(
  prompt: string, 
  model: string = "stable-image/generate/core",
  isDemo: boolean = false
): Promise<string | null> {
  try {
    const imageData = await generateImage(prompt, model);
    if (!imageData) {
      throw new Error("AI engine failed to return image data.");
    }
    return imageData;
  } catch (error) {
    console.error("Error generating image via Stable Diffusion:", error);
    if (isDemo) {
      return buildFallbackSceneImageData(prompt);
    }
    throw error;
  }
}




