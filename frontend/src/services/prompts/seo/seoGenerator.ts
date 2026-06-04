// ==================== SEO GENERATOR SUITE ====================
// Properly named SEO generation module — replaces the legacy generators/metadata.ts naming.
// Calls Gemini AI with the enhanced SEO prompt templates from prompts/seoPrompts.ts.

import { generateText } from "../core";
import { 
  buildFallbackMetadata, 
  buildFallbackDescription, 
  buildFallbackAltText, 
  buildFallbackGrowthStrategy, 
  buildFallbackDistribution 
} from "./seoUtils";
import {
  METADATA_GENERATION_PROMPT,
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
  ALT_TEXT_GENERATION_PROMPT,
  GROWTH_STRATEGY_PROMPT,
  REPURPOSE_MATRIX_PROMPT
} from "./seoPrompts";

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


export * from "./seoUtils";

export * from "./seoPrompts";
