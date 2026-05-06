import { callAI } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import {
  METADATA_GENERATION_PROMPT,
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
  ALT_TEXT_GENERATION_PROMPT
} from "../prompts";

function buildFallbackMetadata(script: string): string {
  return [
    `Title: ${MOCK_STORY_BIBLE.title}`,
    `Hook: ${MOCK_STORY_BIBLE.logline}`,
    `World: ${MOCK_STORY_BIBLE.worldName}`,
    `Theme: ${MOCK_STORY_BIBLE.theme}`,
    `Visual Language: ${MOCK_STORY_BIBLE.visualPalette}`,
    `Script Seed: ${script.slice(0, 220).trim() || MOCK_STORY_BIBLE.script[0].narration}`,
  ].join("\n");
}

function buildFallbackDescription(contentType: string, script: string): string {
  return [
    `Watch ${MOCK_STORY_BIBLE.title} unfold through a ${contentType} production lens.`,
    `This story follows Anya, Sachi, and Rika through a collapsing sky-world powered by ${MOCK_STORY_BIBLE.powerSystem}.`,
    `Core themes include ${MOCK_STORY_BIBLE.theme.toLowerCase()} and the fight to preserve identity inside a broken system.`,
    `Preview: ${script.slice(0, 180).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join(" ");
}

function buildFallbackAltText(script: string): string {
  return [
    `ALT 1: Neon-storm skyline over Aetheria with floating islands and copper machinery.`,
    `ALT 2: Anya Wraith framed in rain and holographic light, aiming a custom railgun pistol.`,
    `ALT 3: Sachi and Rika positioned as opposing forces in a high-contrast cyberpunk battle scene.`,
    `ALT 4: ${script.slice(0, 120).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join("\n");
}

function buildFallbackGrowthStrategy(script: string): string {
  return [
    `Growth Strategy for ${MOCK_STORY_BIBLE.worldName}`,
    `1. Anchor uploads around the world hook: ${MOCK_STORY_BIBLE.logline}`,
    `2. Reuse the cast contrast between Anya, Sachi, and Rika to drive retention and comments.`,
    `3. Package clips around the strongest visual markers: ${MOCK_STORY_BIBLE.visualPalette}.`,
    `4. Tie Shorts, trailers, and community posts to the same story bible so the funnel stays coherent.`,
    `5. Source clip context: ${script.slice(0, 140).trim() || MOCK_STORY_BIBLE.script[0].narration}`,
  ].join("\n");
}

function buildFallbackDistribution(script: string): string {
  return [
    `Cross-Platform Distribution Matrix`,
    `YouTube: Long-form episode and trailer drops aligned to the season beats in ${MOCK_STORY_BIBLE.title}.`,
    `Shorts/Reels: Character-intro cuts for Anya, Sachi, Rika, and Taro.`,
    `Community: Polls and lore posts focused on the floating-island conflict and the Great Descent.`,
    `SEO: Center titles on ${MOCK_STORY_BIBLE.worldName}, ${MOCK_STORY_BIBLE.powerSystem}, and cyberpunk fantasy production keywords.`,
    `Source clip context: ${script.slice(0, 140).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join("\n");
}

export async function generateMetadata(script: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = METADATA_GENERATION_PROMPT(script);

  try {
    const text = await callAI(
      model,
      `Generate YouTube metadata for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackMetadata(script);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return buildFallbackMetadata(script);
  }
}

export async function generateYouTubeDescription(script: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const systemInstruction = YOUTUBE_DESCRIPTION_GENERATION_PROMPT(contentType, script);

  try {
    const text = await callAI(
      model,
      `Generate a YouTube description for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackDescription(contentType, script);
  } catch (error) {
    console.error("Error generating description:", error);
    return buildFallbackDescription(contentType, script);
  }
}

export async function generateAltTexts(script: string, model: string = "gemini-1.5-flash-latest") {
  const systemInstruction = ALT_TEXT_GENERATION_PROMPT(script);

  try {
    const text = await callAI(
      model,
      `Generate alt text captions for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackAltText(script);
  } catch (error) {
    console.error("Error generating alt text:", error);
    return buildFallbackAltText(script);
  }
}

export async function generateGrowthStrategy(script: string, model: string = "gemini-1.5-flash-latest", contentType: string = "Anime") {
  const { GROWTH_STRATEGY_PROMPT } = await import("../prompts/metadata");
  const systemInstruction = GROWTH_STRATEGY_PROMPT(contentType, script);

  try {
    const text = await callAI(
      model,
      `Develop a comprehensive YouTube growth strategy for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackGrowthStrategy(script);
  } catch (error) {
    console.error("Error generating growth strategy:", error);
    return buildFallbackGrowthStrategy(script);
  }
}

export async function generateDistributionStrategy(script: string, model: string = "gemini-1.5-flash-latest") {
  const { REPURPOSE_MATRIX_PROMPT } = await import("../prompts/youtube_strategies");
  const systemInstruction = REPURPOSE_MATRIX_PROMPT(script);

  try {
    const text = await callAI(
      model,
      `Develop a cross-platform distribution matrix for this script: ${script}`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000 // timeoutMs
    );
    return text || buildFallbackDistribution(script);
  } catch (error) {
    console.error("Error generating distribution strategy:", error);
    return buildFallbackDistribution(script);
  }
}




