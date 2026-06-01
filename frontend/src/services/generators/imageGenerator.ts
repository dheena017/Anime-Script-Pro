import { generateText, generateImage } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import { 
  IMAGE_PROMPT_GENERATION_PROMPT, 
  ENHANCE_SCENE_VISUALS_PROMPT
} from "../prompts";
import { TEXT_MODELS } from "@/lib/aiModels/textModels";

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
  const isCharacter = prompt.toLowerCase().includes("character") || prompt.toLowerCase().includes("portrait") || prompt.toLowerCase().includes("concept art") || prompt.toLowerCase().includes("streetwear");
  const title = isCharacter ? "CHARACTER DNA VISUALIZATION PROTOCOL" : "PRODUCTION SCENE VISUALIZATION";
  const accentColor = isCharacter ? "#06b6d4" : "#a855f7"; // Cyan for character, Purple for scene
  
  // Clean prompt and wrap lines for the SVG display
  const cleanPrompt = prompt.replace(/"/g, "'").replace(/[<&>]/g, "");
  const words = cleanPrompt.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).length > 70) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  
  // Format up to 6 lines to fit in the blueprint box
  const displayLines = lines.slice(0, 6);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#020205" />
          <stop offset="50%" stop-color="#050814" />
          <stop offset="100%" stop-color="#0a030c" />
        </linearGradient>
        <linearGradient id="cyberGrid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#000" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#d946ef" />
        </linearGradient>
      </defs>
      
      <!-- Premium Dark Background -->
      <rect width="1024" height="1024" fill="url(#bg)" />
      
      <!-- Tech Grid Pattern -->
      <rect width="1024" height="1024" fill="url(#cyberGrid)" />
      <path d="M 0,100 L 1024,100 M 0,200 L 1024,200 M 0,300 L 1024,300 M 0,400 L 1024,400 M 0,500 L 1024,500 M 0,600 L 1024,600 M 0,700 L 1024,700 M 0,800 L 1024,800 M 0,900 L 1024,900" stroke="${accentColor}" stroke-opacity="0.08" stroke-width="1" />
      <path d="M 100,0 L 100,1024 M 200,0 L 200,1024 M 300,0 L 300,1024 M 400,0 L 400,1024 M 500,0 L 500,1024 M 600,0 L 600,1024 M 700,0 L 700,1024 M 800,0 L 800,1024 M 900,0 L 900,1024" stroke="${accentColor}" stroke-opacity="0.08" stroke-width="1" />
      
      <!-- Circular Blueprint Elements -->
      <circle cx="512" cy="512" r="380" fill="none" stroke="${accentColor}" stroke-opacity="0.1" stroke-dasharray="10, 5" stroke-width="2" />
      <circle cx="512" cy="512" r="280" fill="none" stroke="${accentColor}" stroke-opacity="0.05" stroke-width="1" />
      
      <!-- Border Cyber Brackets -->
      <rect x="30" y="30" width="964" height="964" rx="24" fill="none" stroke="url(#cyanGlow)" stroke-opacity="0.15" stroke-width="1" />
      <path d="M 30,80 L 30,30 L 80,30" fill="none" stroke="${accentColor}" stroke-width="4" />
      <path d="M 994,80 L 994,30 L 944,30" fill="none" stroke="${accentColor}" stroke-width="4" />
      <path d="M 30,944 L 30,994 L 80,994" fill="none" stroke="${accentColor}" stroke-width="4" />
      <path d="M 994,944 L 994,994 L 944,994" fill="none" stroke="${accentColor}" stroke-width="4" />
      
      <!-- Technical Branding Headers -->
      <text x="80" y="90" fill="${accentColor}" font-size="12" font-family="Courier New, monospace" font-weight="900" letter-spacing="4">SYSTEM DIRECTIVE: ACTIVE</text>
      <text x="944" y="90" fill="#64748b" font-size="12" font-family="Courier New, monospace" font-weight="900" text-anchor="end" letter-spacing="2">PRIORITY STATUS: ALPHA</text>
      
      <!-- Main Protocol Title -->
      <text x="80" y="160" fill="#f8fafc" font-size="32" font-family="Arial, sans-serif" font-weight="900" letter-spacing="1">${title}</text>
      
      <!-- Divider line -->
      <line x1="80" y1="200" x2="944" y2="200" stroke="${accentColor}" stroke-opacity="0.25" stroke-width="2" />
      
      <!-- Cybernetic Interface details -->
      <g transform="translate(80, 260)">
        <rect width="864" height="380" rx="16" fill="#000" fill-opacity="0.5" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1" />
        
        <!-- Target indicator box -->
        <rect x="20" y="20" width="12" height="12" fill="${accentColor}" />
        <text x="45" y="32" fill="${accentColor}" font-size="11" font-family="Courier New, monospace" font-weight="bold" letter-spacing="2">LATENT DNA RESOLVED</text>
        
        <!-- Text Prompt content lines -->
        ${displayLines.map((line, i) => `
          <text x="45" y="${80 + (i * 45)}" fill="#e2e8f0" font-size="18" font-family="Arial, sans-serif" font-weight="600" letter-spacing="0.5" font-style="italic">"${line}"</text>
        `).join('')}
      </g>
      
      <!-- Technical Metadata Specs (Bottom Card) -->
      <g transform="translate(80, 680)">
        <rect width="864" height="240" rx="24" fill="#05070f" stroke="url(#cyanGlow)" stroke-opacity="0.2" stroke-width="1" />
        <text x="40" y="50" fill="${accentColor}" font-size="11" font-family="Courier New, monospace" font-weight="900" letter-spacing="3">RENDER PIPELINE BLUEPRINT</text>
        
        <!-- Three Grid Metrics -->
        <g transform="translate(40, 100)">
          <!-- Col 1 -->
          <text x="0" y="20" fill="#475569" font-size="10" font-family="Arial, sans-serif" font-weight="900" letter-spacing="1">GENETIC STABILITY</text>
          <text x="0" y="50" fill="#f8fafc" font-size="20" font-family="Arial, sans-serif" font-weight="900">98.42%</text>
          
          <!-- Col 2 -->
          <text x="260" y="20" fill="#475569" font-size="10" font-family="Arial, sans-serif" font-weight="900" letter-spacing="1">AESTHETIC STYLE</text>
          <text x="260" y="50" fill="#f8fafc" font-size="20" font-family="Arial, sans-serif" font-weight="900">HIGH FIDELITY ANIME</text>
          
          <!-- Col 3 -->
          <text x="540" y="20" fill="#475569" font-size="10" font-family="Arial, sans-serif" font-weight="900" letter-spacing="1">VECTOR RESOLUTION</text>
          <text x="540" y="50" fill="#06b6d4" font-size="20" font-family="Arial, sans-serif" font-weight="900">8K MASTERPIECE</text>
        </g>
        
        <!-- Status Bar -->
        <rect x="40" y="190" width="784" height="4" rx="2" fill="#1e293b" />
        <rect x="40" y="190" width="680" height="4" rx="2" fill="${accentColor}" />
      </g>
      
      <!-- Footer details -->
      <text x="80" y="970" fill="#475569" font-size="11" font-family="Courier New, monospace" font-weight="bold" letter-spacing="2">ANIME-SCRIPT-PRO // CAST REGISTERED SYSTEM</text>
      <text x="944" y="970" fill="#475569" font-size="11" font-family="Courier New, monospace" font-weight="bold" text-anchor="end" letter-spacing="1">DEC-01 // v1.5</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}



export async function generateImagePrompts(script: string, model: string = TEXT_MODELS[0].id) {
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

export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = TEXT_MODELS[0].id) {
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
  model: string = "hugging-face-inference",
  isDemo: boolean = false
): Promise<string | null> {
  try {
    const imageData = await generateImage(prompt, model);
    if (!imageData) {
      throw new Error("AI engine failed to return image data.");
    }
    return imageData;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}




