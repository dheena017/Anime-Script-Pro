/**
 * Script Prompts for Scene Generation and Rewrite Workflows
 * Builds high-detail scene tables with continuity, production, and pacing controls.
 */

// ==================== ERROR HANDLING & VALIDATION ====================

function validateNonEmptyText(value: string, fieldName: string, minimumLength = 2): void {
    if (!value || typeof value !== 'string' || value.trim().length < minimumLength) {
        throw new Error(`${fieldName} must be a non-empty string with at least ${minimumLength} characters.`);
    }
}

function validateSceneCount(numScenes: string): void {
    validateNonEmptyText(numScenes, 'Scene count', 1);

    const parsedSceneCount = Number(numScenes);
    if (!Number.isInteger(parsedSceneCount) || parsedSceneCount <= 0) {
        throw new Error('Scene count must be a positive integer value in string form.');
    }

    if (parsedSceneCount > 50) {
        throw new Error('Scene count exceeds the supported maximum of 50 scenes.');
    }
}

function validateScriptGenerationInputs(
    contentType: string,
    tone: string,
    audience: string,
    session: string,
    episode: string,
    numScenes: string,
    recapperPersona: string
): void {
    validateNonEmptyText(contentType, 'Content type');
    validateNonEmptyText(tone, 'Tone');
    validateNonEmptyText(audience, 'Audience');
    validateNonEmptyText(session, 'Session');
    validateNonEmptyText(episode, 'Episode');
    validateSceneCount(numScenes);
    validateNonEmptyText(recapperPersona, 'Recapper persona');
}

function safeScriptPromptGeneration(
    contentType: string,
    tone: string,
    audience: string,
    session: string,
    episode: string,
    numScenes: string,
    episodePlan: string | null,
    worldBuilding: string | null,
    castProfiles: string | null,
    characterRelationships: string | null,
    recapperPersona: string
): string {
    try {
        validateScriptGenerationInputs(contentType, tone, audience, session, episode, numScenes, recapperPersona);
        return buildScriptGenerationPrompt(
            contentType,
            tone,
            audience,
            session,
            episode,
            numScenes,
            episodePlan,
            worldBuilding,
            castProfiles,
            characterRelationships,
            recapperPersona
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `ERROR: ${message}`;
    }
}

function buildScriptGenerationPrompt(
    contentType: string,
    tone: string,
    audience: string,
    session: string,
    episode: string,
    numScenes: string,
    episodePlan: string | null,
    worldBuilding: string | null,
    castProfiles: string | null,
    characterRelationships: string | null,
    recapperPersona: string
): string {
    const optionalSections = [
        episodePlan ? `EPISODE MASTER BLUEPRINT:\n${episodePlan}\n` : '',
        worldBuilding ? `WORLD LORE SOURCE OF TRUTH:\n${worldBuilding}\n` : '',
        castProfiles ? `CHARACTER DNA REGISTRY:\n${castProfiles}\n` : '',
        characterRelationships ? `INTERPERSONAL DYNAMICS:\n${characterRelationships}\n` : ''
    ].join('');

    return `
You are the Prime Synthesis Architect and the Transcendent Showrunner.
You are manifesting a living reality for a ${contentType} production.

MISSION:
Create a ${numScenes}-scene markdown table that is emotionally coherent, visually specific, and fully consistent with the provided source material.

PRODUCTION SPECS:
- MODE: ${tone}
- TARGET AUDIENCE: ${audience}
- PLACEMENT: Session ${session}, Episode ${episode}
- VOLUME: Generate exactly ${numScenes} scenes.

${optionalSections}
PRIME DIRECTIVE:
You MUST strictly adhere to the WORLD LORE and CHARACTER DNA provided above. Every scene, dialogue line, and visual description must be consistent with these established facts. Do not invent details that contradict the source of truth.

STORY EXECUTION RULES:
1. Every scene must advance the plot, reveal character, or increase pressure.
2. The emotional trajectory should escalate in a controlled, deliberate way.
3. Dialogue should reflect the recapper persona while remaining natural and scene-specific.
4. Visuals should be written as production-ready direction, not vague mood language.
5. Each row must feel like a distinct beat with a clear beginning, motion, and aftereffect.

CONTINUITY PROTOCOLS:
- Preserve micro-details such as wounds, props, costumes, lighting temperatures, and environment state.
- Keep character motivations aligned with the provided profiles.
- Do not merge scenes or compress multiple beats into one row.
- Treat the final time column as cumulative chronology, with the last scene reaching exactly 5:00.

SCENE TABLE SPECIFICATION:
1. Scene #
2. Section (GENESIS -> ASCENSION -> ZENITH -> IMPACT -> AFTERGLOW)
3. Soul Focus (The character at the spiritual center of the shot)
4. Narration (${recapperPersona} persona with [DSP] and (Dynamic Delivery))
5. Visual Direction (camera, lighting, framing, choreography, and sakuga markers)
6. VFX Compounds (particles, shaders, volumetrics, lens artifacts)
7. Audio Forge (BGM, foley, frequency shaping, sonic metaphors)
8. Emotional Key (the psychological seed of the scene)
9. Subtext / The Why (the hidden motive beneath the action)
10. Active Asset List (characters present and primary props required)
11. Time (precise timing and cumulative chronology)

QUALITY BAR:
- Eliminate generic filler.
- Use vivid, specific language.
- Keep scene rows individually numbered and fully distinct.
- Make the table feel like a premium production blueprint.

OUTPUT RULES:
- Return only the markdown table.
- Do not add explanations.
- Do not add bullet lists outside the table.
- Do not use code fences.
`;
}

function validateContentType(contentType: string): void {
    validateNonEmptyText(contentType, 'Content type');
}

/**
 * Generates the primary script table prompt.
 */
export const SCRIPT_GENERATION_PROMPT = (
    contentType: string,
    tone: string,
    audience: string,
    session: string,
    episode: string,
    numScenes: string,
    episodePlan: string | null,
    worldBuilding: string | null,
    castProfiles: string | null,
    characterRelationships: string | null,
    recapperPersona: string
) => safeScriptPromptGeneration(
    contentType,
    tone,
    audience,
    session,
    episode,
    numScenes,
    episodePlan,
    worldBuilding,
    castProfiles,
    characterRelationships,
    recapperPersona
);

/**
 * Generates the continuation script table prompt.
 */
export const SCRIPT_CONTINUATION_PROMPT = (contentType: string) => {
    try {
        validateContentType(contentType);
        return `
You are the Prime Synthesis Architect continuing a cinematic blueprint for a ${contentType} production.

MISSION:
Synthesize the next 3 scenes with the same continuity discipline, emotional escalation, and production specificity as the parent table.

CONTINUATION FRAME:
1. Scene # | 2. Section | 3. Soul Focus | 4. Narration | 5. Visual Direction | 6. VFX | 7. Audio | 8. Emotion | 9. Subtext | 10. Assets | 11. Time

CONTINUATION RULES:
- Preserve the established tone, pacing, and stakes.
- Carry forward micro-continuity from the previous rows.
- Do not group scenes.
- Each scene must remain individually actionable for production.

OUTPUT RULES:
- Return only the markdown table.
- No explanation.
- No code fences.
`;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `ERROR: ${message}`;
    }
};

/**
 * Rewrite prompt for tension amplification.
 */
export const SCRIPT_REWRITE_TENSION_PROMPT = `
You are an expert Dramatic Scriptwriter and Tension Editor.

TASK:
Rewrite a scene description so it feels sharper, more immediate, and more dangerous.

TENSION RULES:
- Use shorter, more urgent sentences.
- Prioritize sensory detail that signals threat, pressure, or instability.
- Push the stakes forward in every line.
- Replace vague language with active, specific verbs.
- Keep the rewrite grounded in the original scene intent.

QUALITY BAR:
- Preserve meaning where possible.
- Increase momentum without adding unnecessary exposition.
- Keep the result concise, cinematic, and conflict-driven.

OUTPUT RULES:
- Return only the rewritten scene description.
- No explanation.
- No markdown.
`;



