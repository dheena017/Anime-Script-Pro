import { MOCK_STORY_BIBLE } from "../mockData";

// ==================== GENERATOR UTILITIES ====================

export function buildFallbackMetadata(script: string): string {
  return [
    `Title: ${MOCK_STORY_BIBLE.title}`,
    `Hook: ${MOCK_STORY_BIBLE.logline}`,
    `World: ${MOCK_STORY_BIBLE.worldName}`,
    `Theme: ${MOCK_STORY_BIBLE.theme}`,
    `Visual Language: ${MOCK_STORY_BIBLE.visualPalette}`,
    `Script Seed: ${script.slice(0, 220).trim() || MOCK_STORY_BIBLE.script[0].narration}`,
  ].join("\n");
}

export function buildFallbackDescription(contentType: string, script: string): string {
  return [
    `Watch ${MOCK_STORY_BIBLE.title} unfold through a ${contentType} production lens.`,
    `This story follows Anya, Sachi, and Rika through a collapsing sky-world powered by ${MOCK_STORY_BIBLE.powerSystem}.`,
    `Core themes include ${MOCK_STORY_BIBLE.theme.toLowerCase()} and the fight to preserve identity inside a broken system.`,
    `Preview: ${script.slice(0, 180).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join(" ");
}

export function buildFallbackAltText(script: string): string {
  return [
    `ALT 1: Neon-storm skyline over Aetheria with floating islands and copper machinery.`,
    `ALT 2: Anya Wraith framed in rain and holographic light, aiming a custom railgun pistol.`,
    `ALT 3: Sachi and Rika positioned as opposing forces in a high-contrast cyberpunk battle scene.`,
    `ALT 4: ${script.slice(0, 120).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join("\n");
}

export function buildFallbackGrowthStrategy(script: string): string {
  return [
    `Growth Strategy for ${MOCK_STORY_BIBLE.worldName}`,
    `1. Anchor uploads around the world hook: ${MOCK_STORY_BIBLE.logline}`,
    `2. Reuse the cast contrast between Anya, Sachi, and Rika to drive retention and comments.`,
    `3. Package clips around the strongest visual markers: ${MOCK_STORY_BIBLE.visualPalette}.`,
    `4. Tie Shorts, trailers, and community posts to the same story bible so the funnel stays coherent.`,
    `5. Source clip context: ${script.slice(0, 140).trim() || MOCK_STORY_BIBLE.script[0].narration}`,
  ].join("\n");
}

export function buildFallbackDistribution(script: string): string {
  return [
    `Cross-Platform Distribution Matrix`,
    `YouTube: Long-form episode and trailer drops aligned to the season beats in ${MOCK_STORY_BIBLE.title}.`,
    `Shorts/Reels: Character-intro cuts for Anya, Sachi, Rika, and Taro.`,
    `Community: Polls and lore posts focused on the floating-island conflict and the Great Descent.`,
    `SEO: Center titles on ${MOCK_STORY_BIBLE.worldName}, ${MOCK_STORY_BIBLE.powerSystem}, and cyberpunk fantasy production keywords.`,
    `Source clip context: ${script.slice(0, 140).trim() || MOCK_STORY_BIBLE.logline}`,
  ].join("\n");
}

// ==================== PROMPT UTILITIES ====================

export function validateSEOScript(script: string | null): void {
  if (!script || typeof script !== 'string' || script.trim().length < 20) {
    throw new Error('Source script must be at least 20 characters long to generate meaningful SEO content.');
  }
}

export function validateSEOContentType(contentType: string): void {
  if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
    throw new Error('Content type must be a non-empty string with at least 2 characters.');
  }
}

export function safeSEOPromptGeneration<T>(
  input: T,
  validator: (input: T) => void,
  promptGenerator: (input: T) => string
): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `ERROR: ${message}`;
  }
}
