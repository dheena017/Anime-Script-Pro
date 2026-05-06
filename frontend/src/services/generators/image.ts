import { callAI} from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { 
  IMAGE_PROMPT_GENERATION_PROMPT, 
  ENHANCE_SCENE_VISUALS_PROMPT, 
  GENERATE_SCENE_IMAGE_SYSTEM_PROMPT 
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
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#050505" />
          <stop offset="55%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#bg)" />
      <rect width="1280" height="720" fill="url(#glow)" />
      <g fill="none" stroke="#7dd3fc" stroke-opacity="0.2">
        <path d="M0 560H1280" />
        <path d="M160 0V720" />
        <path d="M480 0V720" />
        <path d="M800 0V720" />
        <path d="M1120 0V720" />
      </g>
      <text x="80" y="150" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="46" font-weight="700">${MOCK_STORY_BIBLE.title}</text>
      <text x="80" y="220" fill="#67e8f9" font-family="Arial, sans-serif" font-size="24">${MOCK_STORY_BIBLE.logline}</text>
      <text x="80" y="290" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="20">${prompt.slice(0, 120).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export async function generateImagePrompts(script: string, model: string = "gemini-1.5-flash-latest") {
  const contentType = script.toLowerCase().includes("anime") ? "Anime" : "Series";
  const systemInstruction = IMAGE_PROMPT_GENERATION_PROMPT(contentType, script);

  try {
    const text = await callAI(
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
    return text || visuals;
  } catch (error) {
    console.error("Error enhancing visuals:", error);
    return visuals;
  }
}

export async function generateSceneImage(prompt: string, model: string = "imagen-3.0-generate-001"): Promise<string | null> {
  try {
    // Route image generation through our stable proxy
    const imageData = await callAI(
      model,
      prompt,
      GENERATE_SCENE_IMAGE_SYSTEM_PROMPT,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return imageData || buildFallbackSceneImageData(prompt); // The backend returns the full data URI
  } catch (error) {
    console.error("Error generating image via proxy:", error);
    return buildFallbackSceneImageData(prompt);
  }
}




