import characterGenerationPromptRaw from './skill/characterGenerationPrompt.md?raw';
import characterRelationshipPromptRaw from './skill/characterRelationshipPrompt.md?raw';
import castDnaPromptRaw from './skill/castDnaPrompt.md?raw';
import castDynamicsPromptRaw from './skill/castDynamicsPrompt.md?raw';
import castIntegrityPromptRaw from './skill/castIntegrityPrompt.md?raw';

import { validateCharacterContentType, validateCharacterContext, validateCharacterCount, safeCharacterPromptGeneration } from './characterUtils';

// ==================== EXPORTED PROMPTS ====================

export const CHARACTER_GENERATION_PROMPT = (contentType: string, contextInjected: string, count: number) =>
    safeCharacterPromptGeneration(contentType, contextInjected, count, (contentType, contextInjected, count) => {
        return characterGenerationPromptRaw
            .replace(/{{CONTENT_TYPE}}/g, contentType)
            .replace(/{{CONTEXT_INJECTED}}/g, contextInjected)
            .replace(/{{COUNT}}/g, String(count));
    });

export const CHARACTER_RELATIONSHIP_PROMPT = characterRelationshipPromptRaw;

export const CAST_DNA_PROMPT = (characterData: string, worldContext: string) => {
    return castDnaPromptRaw
        .replace(/{{CHARACTER_DATA}}/g, characterData)
        .replace(/{{WORLD_CONTEXT}}/g, worldContext);
};

export const CAST_DYNAMICS_PROMPT = (relationships: string, cast: string) => {
    return castDynamicsPromptRaw
        .replace(/{{RELATIONSHIPS}}/g, relationships)
        .replace(/{{CAST}}/g, cast);
};

export const CAST_INTEGRITY_PROMPT = (cast: string) => {
    return castIntegrityPromptRaw
        .replace(/{{CAST}}/g, cast);
};
