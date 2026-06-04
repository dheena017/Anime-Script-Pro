import { GeneratedCast } from "./characterGenerator";

// ==================== GENERATOR UTILITIES ====================

export function getEmptyCast(): GeneratedCast {
  return {
    markdown: "# New Cast Manifest\nNo characters generated yet.",
    characters: [],
    relationships: []
  };
}

// ==================== PROMPT UTILITIES ====================

export function validateCharacterContentType(contentType: string): void {
    if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
        throw new Error('Content type must be a non-empty string with at least 2 characters.');
    }
}

export function validateCharacterContext(contextInjected: string): void {
    if (typeof contextInjected !== 'string') {
        throw new Error('Context must be provided as a string.');
    }
}

export function validateCharacterCount(count: number): void {
    if (!Number.isInteger(count) || count <= 0) {
        throw new Error('Character count must be a positive integer.');
    }
    if (count > 50) {
        throw new Error('Character count must be 50 or fewer to keep the cast manageable.');
    }
}

export function safeCharacterPromptGeneration(
    contentType: string,
    contextInjected: string,
    count: number,
    promptGenerator: (contentType: string, contextInjected: string, count: number) => string
): string {
    try {
        validateCharacterContentType(contentType);
        validateCharacterContext(contextInjected);
        validateCharacterCount(count);
        return promptGenerator(contentType, contextInjected, count);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `ERROR: ${message}`;
    }
}
