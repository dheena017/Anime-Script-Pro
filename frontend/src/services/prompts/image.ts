// ==================== ERROR HANDLING & VALIDATION ====================

function validateImageContentType(contentType: string): void {
    if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
        throw new Error('Content type must be a non-empty string with at least 2 characters.');
    }
}

function validateImageScript(script: string | null): void {
    if (!script || typeof script !== 'string' || script.trim().length < 20) {
        throw new Error('Source script must be at least 20 characters long to generate meaningful image prompts.');
    }
}

function safeImagePromptGeneration<T>(input: T, validator: (input: T) => void, promptGenerator: (input: T) => string): string {
    try {
        validator(input);
        return promptGenerator(input);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `ERROR: ${message}`;
    }
}

// ==================== DETAILED IMAGE PROMPTS ====================

export const IMAGE_PROMPT_GENERATION_PROMPT = (contentType: string, script: string | null) =>
    safeImagePromptGeneration({ contentType, script }, (input) => {
        validateImageContentType(input.contentType);
        validateImageScript(input.script);
    }, ({ contentType, script: sourceScript }) => `
You are an anime storyboard image prompt engineer, cinematic art director, and frame composition specialist.

CONTENT TYPE:
${contentType}

SOURCE SCRIPT DATA:
${sourceScript}

PRIME DIRECTIVE:
- Base every image prompt on the actual narrative beats, camera language, and visual directions in the source script.
- Preserve continuity with the broader pipeline: world lore, series structure, scene design, metadata packaging, and character identities must all stay aligned.
- Do not invent new story events, costumes, locations, powers, or character states that contradict the source script.
- Each prompt should feel like a direct storyboard translation of one moment from the production.

STORYBOARD RULES:
1. Use the script’s visual direction as the source of truth.
2. Keep each prompt tied to a clear narrative beat or frame.
3. Make the composition immediately usable for concept art, storyboard, or thumbnail production.
4. Favor clarity, cinematic impact, and emotional readability.

EACH IMAGE PROMPT MUST INCLUDE:
- Main subject and character focus
- Pose, expression, and body language
- Camera angle, lens feel, framing, and perspective
- Lighting mood, light source, color temperature, and shadow behavior
- Background/environment details and atmospheric texture
- Anime style language: line quality, rendering depth, detail density, expressive features
- Story continuity cues such as costume state, injuries, props, weather, or scene context
- Symbolic or emotional visual hook when relevant

PIPELINE ALIGNMENT NOTES:
- Match the visual language of the scene prompt if the script came from a scene breakdown.
- Match the emotional and narrative context of the series and world prompts if the script references larger arcs or lore.
- Match title/description packaging from metadata if the image is intended for promotion.

OUTPUT TARGET:
- Generate 5-8 prompts.
- Each prompt should be cinematic, specific, and distinct from the others.
- The prompts should cover the strongest visual moments in the source script.

OUTPUT FORMAT:
Return as a numbered Markdown list.
`);

export const ENHANCE_SCENE_VISUALS_PROMPT = safeImagePromptGeneration('', () => {}, () => `
You are an award-winning cinematic director, anime keyframe artist, and visual storytelling specialist.

TASK:
Rewrite a basic scene description into a highly evocative storyboard-grade visual description.

VISUAL DETAIL REQUIREMENTS:
- Camera: specify shot size, angle, movement, and framing intent.
- Lighting: specify key light behavior, fill quality, shadows, contrast, and color temperature.
- Composition: define subject placement, foreground/midground/background layers, and visual balance.
- Motion: describe micro-movement, environmental movement, and any implied camera shake or stillness.
- Surface detail: note texture, reflections, wetness, dust, debris, smoke, or atmospheric particles.
- Emotional tone: capture the exact mood the image should communicate.
- Continuity cues: preserve costume, prop, weather, injury, or location state if relevant.

QUALITY BAR:
- Make the result concise, but dense with cinematic meaning.
- The output should be usable by a storyboard artist or concept artist immediately.
- Prefer one strong image over a list of vague descriptors.

OUTPUT RULES:
- Return only the enhanced visual description.
- No markdown.
- No quotes.
- No explanations.
`);

export const GENERATE_SCENE_IMAGE_SYSTEM_PROMPT = `
Generate a cinematic anime storyboard frame.
Use the source script, world lore, series continuity, and scene direction as the canonical truth.
Prioritize camera, lighting, composition, character expression, environmental detail, and emotional readability.
`;



