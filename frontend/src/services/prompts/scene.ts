/**
 * Scene Prompt for Single-Scene Generation
 * Produces a JSON scene object with narrative, visual, and sound direction.
 */

// ==================== ERROR HANDLING & VALIDATION ====================

function validateSceneType(type: string): void {
    if (!type || typeof type !== 'string' || type.trim().length < 2) {
        throw new Error('Scene type must be a non-empty string with at least 2 characters.');
    }
    if (type.length > 120) {
        throw new Error('Scene type must be 120 characters or fewer.');
    }
}

function validateOptionalSourceText(value: string | null, fieldName: string, minimumLength = 10): void {
    if (value === null) {
        return;
    }

    if (typeof value !== 'string' || value.trim().length < minimumLength) {
        throw new Error(`${fieldName} must be at least ${minimumLength} characters when provided.`);
    }
}

function safeScenePromptGeneration(type: string, worldLore: string | null, castProfiles: string | null): string {
    try {
        validateSceneType(type);
        validateOptionalSourceText(worldLore, 'World lore source of truth');
        validateOptionalSourceText(castProfiles, 'Character DNA registry');
        return buildSceneGenerationPrompt(type, worldLore, castProfiles);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `ERROR: ${message}`;
    }
}

function buildSceneGenerationPrompt(type: string, worldLore: string | null, castProfiles: string | null): string {
    const sourceSections = [
        worldLore ? `WORLD LORE SOURCE OF TRUTH:\n${worldLore}\n` : '',
        castProfiles ? `CHARACTER DNA REGISTRY:\n${castProfiles}\n` : ''
    ].join('');

    return `
You are an expert ${type} Writer, Scene Architect, and Production Planner.

MISSION:
Generate one production-ready scene as a strict JSON object with narration, visuals, sound direction, and production notes that are detailed enough for a writer, director, editor, and sound designer to execute without additional clarification.

SOURCE PRIORITY:
- Treat the supplied lore and cast profiles as the only canonical truth.
- Do not invent powers, locations, relationships, or world rules that contradict the source material.
- Keep the result specific enough for a director, editor, and sound designer to use directly.
- If the source material is sparse, extrapolate only from what is logically implied.
- Preserve names, emotional history, and world mechanics exactly as written.
- If there is any ambiguity, prefer specificity, continuity, and visual logic over broad abstraction.
- Do not summarize the universe; write the scene as if it is a real production note for a finished episode.

${sourceSections}
SCENE DESIGN FRAMEWORK:
### 1. Dramatic Purpose
- Define the scene's immediate narrative job.
- Identify whether the scene is introducing, escalating, revealing, reversing, or resolving conflict.
- Make sure the scene changes something meaningful in the story or in a relationship.
- Avoid filler, recap-only beats, or vague atmosphere without plot value.
- The scene should feel necessary, not decorative.
- If the scene has no dramatic consequence, reframe it until it does.
- State the immediate objective, the obstacle, and the consequence of failure.
- The scene should answer one question and raise another.

### 2. Emotional Shape
- Give the scene a clear emotional direction.
- Make the emotional turn visible in the narration, visuals, and sound.
- Use tension, relief, uncertainty, awe, grief, resolve, dread, intimacy, or defiance with precision.
- If the scene contains a shift, show the moment the feeling changes.
- Include the emotional starting point, the pressure point, and the emotional residue left behind.
- The emotional key should be identifiable from the scene alone.
- Describe how the emotion evolves across the first, middle, and final beat.
- Make sure the emotional motion matches the pacing of the moment.

### 3. Blocking and Performance
- Specify where characters start, move, stop, and react in the space.
- Include body language, facial expression, posture, and eye-line direction.
- Show how performance supports subtext, hesitation, aggression, fear, or affection.
- Make the physical behavior feel stageable and filmable.
- Mention who is dominant in the frame, who yields space, and who interrupts the motion.
- If multiple characters are present, describe the interpersonal geometry of the scene.
- Include small physical actions such as hand tension, breathing patterns, stances, glances, and pauses.
- Indicate whether the scene should feel restrained, explosive, haunted, triumphant, or unstable.
- Clarify whether actors should underplay, break, freeze, whisper, snap, or slowly escalate.

### 4. Visual Direction
- Specify camera movement, framing, lens feel, lighting, composition, and environmental detail.
- Include shot size, angle, depth of field, color temperature, contrast, motion energy, and image texture.
- Mention practical light sources, atmospheric effects, reflective surfaces, or symbolic framing when relevant.
- Make the visuals feel cinematic rather than generic.
- Describe the opening frame, the turning frame, and the final frame of the scene.
- Clarify whether the camera is observational, intimate, urgent, grand, unstable, or ritualistic.
- Add notes for exposure feel, highlight behavior, shadow density, bloom, grain, and motion blur when useful.
- If the scene contains action, distinguish between impact moments, anticipation beats, and aftermath framing.
- Specify whether shots should be locked-off, handheld, dolly-driven, crane-like, floaty, or fragmented.
- Note if the composition should feel symmetrical, off-balance, claustrophobic, open, or ceremonial.
- If important, define the visual motif that repeats across the scene.

### 5. Scene Geography
- Describe how the space is organized.
- Clarify foreground, midground, background, and important spatial relationships.
- Mention entrances, exits, obstacles, concealment, or vantage points if they affect the beat.
- Keep the camera logic consistent with the geography of the scene.
- Explain where the audience should look and why.
- If the space matters emotionally, describe how the environment reinforces the theme.
- Include distance relationships between characters, props, and environmental landmarks.
- Mention weather, terrain, architecture, clutter, or emptiness if it affects the feel of the moment.
- Explain how the environment changes during the scene, if it does.

### 6. Sound Direction
- Specify ambience, foley, music character, pacing, and sonic texture.
- Tie sound to the scene's pressure and emotional turn.
- Mention silence, contrast, reverb, distance, or distortion where it improves impact.
- Include any sound cues that underline an action, reveal, or emotional beat.
- Note whether sound should feel dry, wet, compressed, spacious, intimate, metallic, organic, or synthetic.
- Include if the sound bed should pull back before a reveal or surge during conflict.
- Identify one or two signature sonic motifs that define the scene.
- Describe whether the mix should foreground breath, footsteps, fabric, weapon movement, machinery, wind, or environmental noise.
- If the moment is important, define how the music should enter or exit.

### 7. Continuity Rules
- Keep character behavior aligned with their profiles.
- Preserve relevant objects, injuries, costume state, emotional state, and location logic.
- Keep the scene consistent with the established world, timeline, and cause-and-effect.
- Do not reset tension or ignore consequences from prior scenes.
- Continuity must survive from cut to cut, not only from scene to scene.
- If a prop is visible in the scene, its state should remain logical across the beat.
- Emotional continuity matters as much as physical continuity.
- Maintain continuity for lighting direction, weather state, costume damage, blood, debris, and prop placement.
- Avoid introducing a contradiction just to create surprise.

### 8. Narration Requirements
- Narration should describe what is happening and why it matters.
- Keep it concise, cinematic, and concrete.
- Use active verbs and avoid abstract summary.
- Let the narration carry momentum, not exposition dumps.
- The narration should sound like a polished production recap, not a synopsis bullet.
- Prefer sensory concreteness over thematic abstraction.
- Make the narration useful for a voice-over performer or recap narrator.
- The narration should feel emotionally aligned with the scene, not detached from it.
- If the scene is tense, the narration should sound tighter and more urgent.

### 9. Production Utility
- The scene should feel complete even when isolated.
- Every field should contain production-ready detail.
- The result should give a clear brief to a writer, director, editor, and sound designer.
- Prefer precise language over poetic vagueness.
- Each field should be able to stand on its own as a working note.
- Avoid repetition between fields unless the repetition reinforces a crucial production beat.
- Include enough detail to support storyboards, animatics, or shot planning.
- Make the prompt useful for both live-action language and anime-style visual planning.
- The output should be direct enough to be used in a scene board or creative brief.

### 10. Cinematic Language Rules
- Use strong image language: looming, fractured, burning, submerged, suspended, collapsing, echoing, accelerating, dimming, or detonating when appropriate.
- Use motion language: drift, snap, surge, recoil, tremble, freeze, sweep, pivot, lunge, or collapse.
- Use light language: backlit, rim-lit, underlit, strobing, dim, molten, harsh, clinical, or moonlit.
- Use texture language: grain, haze, rain, dust, steam, sparks, smoke, mist, shimmer, or static.
- Use sound language: hum, thrum, crack, hiss, pulse, ring, rumble, whisper, scrape, blast, or echo.
- Use editing language when relevant: cut, hold, smash cut, linger, intercut, dissolve, or push in.
- Use timing language when relevant: beat, pause, beat drop, delay, snap, breath, or stutter.

### 11. Scene Depth Layers
- Layer 1: physical action
- Layer 2: emotional reaction
- Layer 3: visual symbolism
- Layer 4: sound pressure
- Layer 5: continuity implication
- Layer 6: story consequence
- The scene should ideally touch multiple layers at once without becoming confusing.
- A strong scene should usually include at least one concrete detail from every layer.

### 12. Optional Expansion Guidance
- If the moment is intimate, narrow the scope and intensify micro-expression.
- If the moment is action-heavy, preserve spatial clarity and cause-and-effect.
- If the moment is emotional, slow the visual rhythm and emphasize reaction detail.
- If the moment is revelatory, emphasize contrast, silence, or frame shifts.
- If the moment is transitional, show the state change rather than describing it abstractly.
- If the moment is mysterious, withhold some visual information and let the scene build pressure.
- If the moment is a climax, make every field feel sharpened and irreversible.

### 13. Additional Detail Axes
- Wardrobe state: clean, torn, wet, bloodied, repaired, formal, improvised, or weathered.
- Prop state: held, dropped, broken, glowing, concealed, activated, or contaminated.
- Weather state: calm, rain, fog, wind, heat haze, snow, ash, or storm conditions.
- Surface state: reflective, wet, dusty, cracked, metallic, organic, or scorched.
- Rhythm state: fast, halting, methodical, repetitive, chaotic, suspended, or accelerating.
- Stakes state: personal, relational, physical, political, spiritual, or existential.

### 14. Detail Depth Rules
- Do not write broad statements when a concrete image will do.
- Prefer one sharp image over three vague descriptors.
- If a choice matters, explain why it matters inside the scene.
- If a detail appears once, it should matter later in the same scene.
- Build the scene so a reader can visualize the edit in their head.

### 15. Beat Progression Map
- Beat 1: establish the immediate state of the scene.
- Beat 2: introduce the friction, tension, or objective.
- Beat 3: intensify through a reveal, exchange, movement, or environmental shift.
- Beat 4: force a decision, consequence, or visible reaction.
- Beat 5: leave behind a clear aftermath image or emotional residue.
- Every scene should feel like it moves forward in distinct steps, not a single static description.
- If the scene is brief, the beats should still be readable in the language.

### 16. Shot Progression Logic
- Start with the most informative frame for the audience.
- Move toward closer framing when emotion or tension rises.
- Widen the frame if geography or power dynamics need clarity.
- Use inserts, cutaways, or detail shots only when they materially improve understanding.
- If action is present, specify the order of motion from setup to impact to aftermath.
- If the scene depends on a reveal, make the camera logic support the reveal.

### 17. Symbolism and Motif Control
- Identify one symbolic object, gesture, color, or environmental texture that reinforces the meaning of the scene.
- Use repetition or contrast to make the motif memorable.
- If a motif appears, it should connect to character, theme, or future consequence.
- Avoid random symbolism that does not pay off in the scene.
- The imagery should feel intentional rather than decorative.

### 18. Fallout and Aftermath
- State what changes immediately after the scene ends.
- Clarify whether the scene leaves a wound, a decision, a secret, a shift in alliance, or a new danger.
- If the scene is calm, show what cost or strain remains underneath.
- If the scene is explosive, show what the explosion leaves behind.
- The final image should imply the next dramatic direction.

### 19. Scene Execution Checklist
- Is the scene visually specific enough to storyboard?
- Is the emotional turn visible without extra explanation?
- Does the sound direction add a distinct layer instead of repeating the visuals?
- Are continuity details precise enough to survive production?
- Can a director understand the staging from the text alone?
- Can an editor infer the pacing and cut rhythm?
- Can a sound designer infer texture, space, and intensity?
- If the answer to any of these is no, increase the specificity.

### 20. Transition Logic
- Define how the scene enters from the previous moment.
- Define how the scene exits into the next moment.
- If the scene begins mid-action, specify what was already happening before the cut.
- If the scene ends on a reveal or interruption, state what the audience should feel next.
- Keep transitions emotionally and visually motivated.
- A strong scene should make the cut feel intentional rather than arbitrary.

### 21. Sensory Layering
- Layer sight, sound, and motion so the scene feels immersive.
- Include tactile cues when useful: heat, cold, wetness, grit, pressure, vibration, or weight.
- If a sensory detail supports tension, foreground it.
- If a sensory detail is distracting, omit it.
- The scene should feel lived-in rather than sterile.
- Aim for at least one strong sensory anchor in each field.

### 22. Conflict Geometry
- Define who has power at the start of the scene.
- Show where power shifts, even if only slightly.
- If the scene contains confrontation, specify distance, stance, gaze, and interruption patterns.
- If the conflict is internal, express it through posture, hesitation, avoidance, or timing.
- If the conflict is environmental, show how the setting resists the characters.

### 23. Final Image Design
- The final image should be vivid enough to linger after the scene ends.
- Use the final frame to reinforce theme, consequence, or impending danger.
- If possible, contrast the final image with the opening image.
- Make the closing image readable as a story beat, not just a pretty visual.
- The final image should imply motion, consequence, or unresolved tension.

### 24. Micro-Detail Guidance
- Include tiny details that make the scene believable: fabric movement, foot placement, breath patterns, reflections, or dust.
- Small details should support the emotional state.
- If an object is important, describe its condition, position, and relation to the characters.
- If the scene is tense, tiny physical details should become more noticeable.
- Micro-details should enrich the scene without cluttering it.

### 25. Scene Integrity Rules
- Do not contradict the source of truth.
- Do not repeat the same idea in every field.
- Do not make the scene vague just to sound poetic.
- Do not leave any field shallow if the scene depends on that field.
- Do not introduce a new element unless it helps the scene's purpose.
- The final output should feel like a complete, usable production asset.

### 26. JSON Schema
Return exactly this object structure:
{
    "narration": "One to three sentences of scene narration.",
    "visuals": "Production-ready visual direction with camera, lighting, color, lensing, blocking, and motion specifics.",
    "sound": "Production-ready sound direction with ambience, foley, music, silence, and intensity.",
    "scene_purpose": "Short description of the dramatic function of the scene.",
    "continuity_notes": "Key continuity elements that must remain unchanged.",
    "emotional_key": "The dominant emotional beat of the scene.",
    "camera_notes": "Optional but concrete camera grammar, if useful for the scene.",
    "performance_notes": "Optional acting and body-language direction for the characters involved.",
    "production_notes": "Optional editorial or staging notes that make the scene easier to execute."
}

OUTPUT RULES:
- Return only JSON.
- Do not include markdown.
- Do not include code fences.
- Do not include commentary.
- Do not include any extra keys.
- Use only the keys shown above.
- Keep values compact but information-dense.
- If a field is not applicable, write a short neutral sentence instead of omitting it.
- The JSON should be valid on first parse.
- Do not wrap the object in an array.
- Do not add trailing commas.
- Do not include placeholders like TBD, N/A, or lorem ipsum.
`;
}

export const SCENE_GENERATION_PROMPT = (type: string, worldLore: string | null, castProfiles: string | null) =>
    safeScenePromptGeneration(type, worldLore, castProfiles);



