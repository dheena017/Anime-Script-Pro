import worldGenerationPromptRaw from './skill/worldGenerationPrompt.md?raw';
import powerSystemPromptRaw from './skill/powerSystemPrompt.md?raw';
import factionSystemPromptRaw from './skill/factionSystemPrompt.md?raw';
import loreGenerationPromptRaw from './skill/loreGenerationPrompt.md?raw';
import architectureGenerationPromptRaw from './skill/architectureGenerationPrompt.md?raw';
import atlasGenerationPromptRaw from './skill/atlasGenerationPrompt.md?raw';
import cultureGenerationPromptRaw from './skill/cultureGenerationPrompt.md?raw';
import systemsGenerationPromptRaw from './skill/systemsGenerationPrompt.md?raw';

import { validateContentType, validateWorldSpec, safePromptGeneration } from './worldUtils';

// ==================== EXPORTED PROMPTS ====================

export const WORLD_GENERATION_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => worldGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, type.trim())
);

export const POWER_SYSTEM_PROMPT = (worldConcept: string, powerSystem: string) => 
  safePromptGeneration(
    { worldConcept, powerSystem },
    (input) => validateWorldSpec(input.worldConcept, input.powerSystem),
    ({ worldConcept, powerSystem }) => powerSystemPromptRaw
      .replace(/{{WORLD_CONCEPT}}/g, worldConcept)
      .replace(/{{POWER_SYSTEM}}/g, powerSystem)
  );

export const FACTION_SYSTEM_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => factionSystemPromptRaw.replace(/{{CONTENT_TYPE}}/g, type.trim())
);

export const LORE_GENERATION_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => loreGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, type.trim())
);

export const ARCHITECTURE_GENERATION_PROMPT = (contentType: string) => 
  architectureGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, contentType.trim());

export const ATLAS_GENERATION_PROMPT = (contentType: string) => 
  atlasGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, contentType.trim());

export const CULTURE_GENERATION_PROMPT = (contentType: string) => 
  cultureGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, contentType.trim());

export const SYSTEMS_GENERATION_PROMPT = (contentType: string) => 
  systemsGenerationPromptRaw.replace(/{{CONTENT_TYPE}}/g, contentType.trim());
