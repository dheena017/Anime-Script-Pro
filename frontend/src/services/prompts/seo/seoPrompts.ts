import metadataPromptRaw from './skill/metadataPrompt.md?raw';
import youtubeDescriptionPromptRaw from './skill/youtubeDescriptionPrompt.md?raw';
import altTextPromptRaw from './skill/altTextPrompt.md?raw';
import growthStrategyPromptRaw from './skill/growthStrategyPrompt.md?raw';
import repurposeMatrixPromptRaw from './skill/repurposeMatrixPrompt.md?raw';

import { validateSEOScript, validateSEOContentType, safeSEOPromptGeneration } from './seoUtils';

// ==================== SEO PROMPT TEMPLATES ====================

export const METADATA_GENERATION_PROMPT = (script: string | null) =>
  safeSEOPromptGeneration(script, validateSEOScript, (sourceScript) => {
    return metadataPromptRaw.replace(/{{SOURCE_SCRIPT}}/g, sourceScript || '');
  });

export const YOUTUBE_DESCRIPTION_GENERATION_PROMPT = (contentType: string, script: string | null) =>
  safeSEOPromptGeneration({ contentType, script }, (input) => {
    validateSEOContentType(input.contentType);
    validateSEOScript(input.script);
  }, ({ contentType, script: sourceScript }) => {
    return youtubeDescriptionPromptRaw
      .replace(/{{CONTENT_TYPE}}/g, contentType)
      .replace(/{{SOURCE_SCRIPT}}/g, sourceScript || '');
  });

export const ALT_TEXT_GENERATION_PROMPT = (script: string | null) =>
  safeSEOPromptGeneration(script, validateSEOScript, (sourceScript) => {
    return altTextPromptRaw.replace(/{{SOURCE_SCRIPT}}/g, sourceScript || '');
  });

export const GROWTH_STRATEGY_PROMPT = (contentType: string, script: string | null) =>
  safeSEOPromptGeneration({ contentType, script }, (input) => {
    validateSEOContentType(input.contentType);
    validateSEOScript(input.script);
  }, ({ contentType, script: sourceScript }) => {
    return growthStrategyPromptRaw
      .replace(/{{CONTENT_TYPE}}/g, contentType)
      .replace(/{{SOURCE_SCRIPT}}/g, sourceScript || '');
  });

export const REPURPOSE_MATRIX_PROMPT = (script: string) =>
  safeSEOPromptGeneration(script, validateSEOScript, (sourceScript) => {
    return repurposeMatrixPromptRaw.replace(/{{SOURCE_SCRIPT}}/g, sourceScript);
  });
