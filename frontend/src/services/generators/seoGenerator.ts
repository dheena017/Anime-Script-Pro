// ==================== SEO GENERATOR SUITE ====================
// Properly named SEO generation module — replaces the legacy generators/metadata.ts naming.
// Calls Gemini AI with the enhanced SEO prompt templates from prompts/seoPrompts.ts.

import { generateText } from "./core";
import { MOCK_STORY_BIBLE } from "./mockData";
import {
  METADATA_GENERATION_PROMPT,
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
  ALT_TEXT_GENERATION_PROMPT
} from "../prompts";

// ==================== FALLBACK BUILDERS ====================

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

// ==================== SEO GENERATORS ====================

export async function generateMetadata(
  script: string,
  model: string = "gemini-3.1-pro",
  worldLore?: string,
  characterDNA?: string
) {
  const systemInstruction = METADATA_GENERATION_PROMPT(script);

  try {
    const text = await generateText(
      model,
      `Generate YouTube metadata for this script: ${script}\n\nCRITICAL DIRECTIVE:\nEnsure the metadata is highly accurate, logically structured, and deeply detailed. Provide the absolute best, most effective SEO output to maximize engagement and discoverability.`,
      systemInstruction,
      0.85, // temperature
      2048, // maxTokens
      0.95, // topP
      40,   // topK
      180000, // timeoutMs
      worldLore,
      characterDNA
    );
    return text || buildFallbackMetadata(script);
  } catch (error) {
    console.error("[SEOGenerator] Error generating metadata:", error);
    return buildFallbackMetadata(script);
  }
}

export async function generateYouTubeDescription(
  script: string,
  model: string = "gemini-3.1-pro",
  contentType: string = "Anime",
  worldLore?: string,
  characterDNA?: string
) {
  const systemInstruction = YOUTUBE_DESCRIPTION_GENERATION_PROMPT(contentType, script);

  try {
    const text = await generateText(
      model,
      `Generate a YouTube description for this script: ${script}\n\nCRITICAL DIRECTIVE:\nEnsure the description is highly accurate, compelling, and deeply detailed. Provide the absolute best, most engaging description to hook viewers.`,
      systemInstruction,
      0.85,
      2048,
      0.95,
      40,
      180000,
      worldLore,
      characterDNA
    );
    return text || buildFallbackDescription(contentType, script);
  } catch (error) {
    console.error("[SEOGenerator] Error generating description:", error);
    return buildFallbackDescription(contentType, script);
  }
}

export async function generateAltTexts(
  script: string,
  model: string = "gemini-3.1-pro",
  worldLore?: string,
  characterDNA?: string
) {
  const systemInstruction = ALT_TEXT_GENERATION_PROMPT(script);

  try {
    const text = await generateText(
      model,
      `Generate alt text captions for this script: ${script}\n\nCRITICAL DIRECTIVE:\nEnsure the alt text is highly accurate, descriptive, and deeply detailed. Provide the absolute best, most accessible image descriptions possible.`,
      systemInstruction,
      0.85,
      2048,
      0.95,
      40,
      180000,
      worldLore,
      characterDNA
    );
    return text || buildFallbackAltText(script);
  } catch (error) {
    console.error("[SEOGenerator] Error generating alt text:", error);
    return buildFallbackAltText(script);
  }
}

export async function generateGrowthStrategy(
  script: string,
  model: string = "gemini-3.1-pro",
  contentType: string = "Anime",
  worldLore?: string,
  characterDNA?: string
) {
  const { GROWTH_STRATEGY_PROMPT } = await import("../prompts/seoPrompts");
  const systemInstruction = GROWTH_STRATEGY_PROMPT(contentType, script);

  try {
    const text = await generateText(
      model,
      `Develop a comprehensive YouTube growth strategy for this script: ${script}\n\nCRITICAL DIRECTIVE:\nEnsure the strategy is highly accurate, logical, and deeply detailed. Provide the absolute best, most actionable growth plan possible.`,
      systemInstruction,
      0.85,
      2048,
      0.95,
      40,
      180000,
      worldLore,
      characterDNA
    );
    return text || buildFallbackGrowthStrategy(script);
  } catch (error) {
    console.error("[SEOGenerator] Error generating growth strategy:", error);
    return buildFallbackGrowthStrategy(script);
  }
}

export async function generateDistributionStrategy(
  script: string,
  model: string = "gemini-3.1-pro",
  worldLore?: string,
  characterDNA?: string
) {
  const { REPURPOSE_MATRIX_PROMPT } = await import("../prompts/youtubeStrategyPrompts");
  const systemInstruction = REPURPOSE_MATRIX_PROMPT(script);

  try {
    const text = await generateText(
      model,
      `Develop a cross-platform distribution matrix for this script: ${script}\n\nCRITICAL DIRECTIVE:\nEnsure the distribution matrix is highly accurate, logical, and deeply detailed. Provide the absolute best, most comprehensive distribution strategy possible.`,
      systemInstruction,
      0.85,
      2048,
      0.95,
      40,
      180000,
      worldLore,
      characterDNA
    );
    return text || buildFallbackDistribution(script);
  } catch (error) {
    console.error("[SEOGenerator] Error generating distribution strategy:", error);
    return buildFallbackDistribution(script);
  }
}
