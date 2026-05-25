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

DRAMATURGICAL ACT PACING PROTOCOLS:
- **GENESIS (Act I - Setup & Ignition)**: Pace the visual details to establish the rain-slicked geometry, heavy steam volumetrics, and sensory palettes. Narrative tension starts low (20%-40%) with slow, atmospheric camera moves.
- **ASCENSION (Act II - Rising Conflict)**: Escalate the narrative pace. Introduce complications, high-contrast neon shadows, and dynamic spatial choreography. Narrative tension rises steadily (40%-70%).
- **ZENITH (Act III - The Climax & Sakuga Peak)**: Execute the pinnacle action clash. Use extreme frame-smear vectors, speedlines, single black/white impact frames, and rapid orbital camera pans. Tension peaks at maximum (85%-100%).
- **IMPACT (Act IV - Cinematic Fallout)**: Display the immediate visceral aftermath. High-chroma plasma/blood reds, desaturated environments, slow-motion frame ramping, and heavy detuned acoustic audio. Tension remains high but slow (70%-80%).
- **AFTERGLOW (Act V - Resolution & Residual Echoes)**: Wrap the episode in soft twilight violet (3200K), quiet foley, and psychological subtext. Tension settles back into reflective territory (30%-40%).

STORY EXECUTION RULES:
1. Every scene must mathematically advance the plot, deepen thematic subtext, or increase character pressure. Eliminate filler beats entirely.
2. The emotional trajectory should follow a dynamic narrative wave (crescendo and decrescendo) with a highly deliberate tension escalation path.
3. Dialogue must perfectly align with the recapper persona, using precise linguistic patterns, slang/honorifics, emotional pauses, and character-authentic terminology.
4. Visuals must be written as absolute production-ready directions: define precise spatial layout, character depth, foreground/background elements, and lighting colors.
5. Each row must be a self-contained, micro-narrative beat with a definitive starting state, kinetic motion/action, and an emotional aftereffect.

CONTINUITY PROTOCOLS & DETAIL DENSITY (ULTRA-HIGH HIGH FIDELITY):
- **Thematic Contrast & Symbolic Leitmotifs**: You MUST identify the core theme of the anime (e.g., control vs freedom, class struggle, artificial humanity, tech-social divide) from the WORLD LORE SOURCE OF TRUTH and the EPISODE MASTER BLUEPRINT. Weave this theme directly into the narration beats, dialogue tension, emotional keys, and visual motifs of the scene. Visual prompts (both Video Prompt and Image Prompt) MUST contain visual metaphors, symbolic objects (e.g., rusted iron vs pristine glass, cages, broken gear teeth), or contrastive lighting representations that reflect this central theme.
- **Aesthetic Color Theory & HSL Temperatures**: Explicitly describe lighting hues, color temperatures, and ambient light physics (e.g., "5500K warm golden-hour sunlight filtering through copper steam," "electric purple cold neon glow contrasting against deep 2000K amber streetlamps," "high-contrast obsidian shadows with dramatic side-lighting"). Match color schemes to Act pacing to create a stunning, curated visual palette.
- **Cinematic Camera Rigging & Lens Speeds**: Enforce professional camera language. Specify camera movement (e.g., "slow tracking 3D dolly shot," "dynamic crane pan," "static macro close-up," "dutch angle whip pan") and camera lens specifications (e.g., "35mm anamorphic lens, shallow depth of field, f/1.4 blur"). Mandate camera rig styles (e.g., Technocrane swings, Steadicam tracking, orbital rigs, drone sweeps) and frame rates (e.g., "24fps cinematic, ramping to 120fps for slow-motion impact frames").
- **Acoustic Design, Foley & BGM Crescendos**: Dictate precise mixing and spatial audio directions. Specify instrument cues (e.g., "low detuned sub-bass synth drone," "rhythmic metallic blade clangs," "soaring melancholy violins"), foley details (e.g., "boots squishing on wet pavement"), spatial audio positioning (e.g., "foley panning from left-to-right," "reverberant warehouse hall decay"), and ambient noise. Narration and dialogue must have volume level directions (e.g., "Narration at -6dB over BGM", "whispered subtext at -18dB") and breathing pauses (e.g. "[breaths deeply]", "[chokes up]").
- **Linguistic Authenticity & Accent Modulations**: Adapt the characters' dialogue to match their sociological status and DNA (e.g., honorific hierarchy suffix matching for traditionalists, technocratic corporate jargon for company executives, gritty street-slang contractions for lower-district rebels). Include vocal delivery cues in parentheses (e.g., (breathy, whispering), (voice cracking with rage)).
- **Psychological Subtext & Micro-Expressions**: Do not simply summarize action in the Subtext column. Expose the character's internal lie, hidden insecurity, unstated motive, or micro-expression (e.g., "Anya acts dismissive to hide her growing parental protectiveness over Sachi", "Rika's eye twitches slightly, betraying a minor glitch in her cold logic").
- **Strict Asset-Binding Protocol**: Every single character, weapon, or prop listed in "Active Asset List" MUST be physically interacted with in "Visual Direction" or heard in "Audio Forge" (e.g., if a railgun is in the asset list, it must spark, charge, fire, or be clutched).

SCENE TABLE SPECIFICATION (CRITICAL FOR PARSING BY FRONTEND TAB DIAGNOSTICS):
1. Scene # - Sequential integers starting from 1 (e.g. 1, 2, 3...).
2. Section - Must be exactly one of: GENESIS, ASCENSION, ZENITH, IMPACT, AFTERGLOW. (Parses to: Beat Sheet tabs & Narrative Pulse tension charts).
3. Soul Focus - The name of the character who is at the spiritual center of the shot. Must exactly match one of the character names in CHARACTER DNA REGISTRY. (Parses to: Beat Sheet, Dialogue, and Audio tabs).
4. Narration - The exact dialogue/narration spoken in the scene matching ${recapperPersona} persona. Must include a speaking tone in parentheses and start with [DSP], e.g., '[DSP] (Cynical) The rain never washes the neon grit...' or '[DSP] (Determined) We stand together!'. (Parses to: Dialogue Matrix line counts, speaker tones, and featured dialogue list, and Linguistics Tab dialect models).
5. Visual Direction - Detailed cinematic choreography, camera angle, zoom, lighting, sakuga markers, and motion description. Must explicitly specify shot type, e.g., 'WIDE established shot of Solaris city' or 'CLOSE-UP of Anya's cybernetic eye'. (Parses to: Cinematics Tab active shot lists).
6. VFX Compounds - Volumetrics, lens artifacts, digital noise, particle bloom, lightning shaders, chromatic aberration levels.
7. Audio Forge - Detailed soundscape containing BGM, sound effects (SFX), foley. Must specify the BGM track name clearly, e.g., 'BGM: Solaris Theme, low bass hum...' or 'BGM: Battle Orchestration, clashing blade foley...'. (Parses to: Audio Tab dynamic theme BGM tracks).
8. Emotional Key - The dominant psychological emotion, e.g., Melancholy, Tension, Threat, Urgency, Climax, Resolution, Release. (Parses to: Beat Sheet and Narrative Pulse wave stress indices).
9. Subtext / The Why - The underlying psychological motive beneath the action.
10. Active Asset List - Comma-separated list of characters present and primary props.
11. Time - Timeline stamp. Start the first scene at 0:00. Each scene should advance the timestamp sequentially (e.g., 0:00 - 0:15, 0:15 - 0:40) with the final scene reaching exactly 5:00. (Parses to: Beat Sheet tab chronologies).
12. Video Prompt - High-fidelity cinematic prompt for an AI video generator (like Sora, Kling, or Runway). You MUST synthesize and embed specific names, costumes, combat styles, visual aesthetics, visual palettes, and geography details directly from the WORLD LORE SOURCE OF TRUTH, CHARACTER DNA REGISTRY, and EPISODE MASTER BLUEPRINT into this prompt. Specify camera movement, speed, motion description, environment lighting, and fluid action choreography to maintain complete visual continuity. Add styling modifiers: "cinematic anime style, photorealistic anime shading, dynamic 3D camera pan, fluid character motion, 60fps, ray-traced ambient occlusion".
13. Image Prompt - High-detail image prompt for an AI image generator (like Midjourney or Stable Diffusion). You MUST synthesize and embed specific character visual features, hair color, tech uniforms/streetwear, active props, visual palettes, and architectural styles directly from the WORLD LORE SOURCE OF TRUTH and CHARACTER DNA REGISTRY. Describe precise anime aesthetics, camera specs, lighting temperatures (e.g., "5500K warm sunlight"), and rendering quality parameters to ensure visual alignment. Add styling modifiers: "8k, anime key visual, highly detailed, sharp focus, vibrant colors, raytracing, dynamic angle, --ar 16:9 --style raw --v 6.0".

QUALITY BAR:
- Eliminate generic filler.
- Use vivid, specific language.
- Keep scene rows individually numbered and fully distinct.
- Make the table feel like a premium production blueprint.

CRITICAL OUTPUT RULES & PARSING ENFORCEMENT:
- **ZERO CONVERSATIONAL FILLER**: Do not include any introductory greetings (e.g., "Here is your script:"), concluding remarks, or conversational transitions. Start the response immediately with the markdown table.
- **NO CODE BLOCKS OR FENCES**: Do NOT wrap the table in markdown code blocks or triple backticks (e.g., do NOT start with \`\`\` or \`\`\`markdown, and do NOT end with \`\`\`). The raw output MUST start immediately with the header row: "| Scene # | Section | ...".
- **EXACT COLUMN COUNT**: The generated table must contain exactly 13 columns separated by "|" pipes. The separator row must contain valid alignments (e.g., "| :--- | :--- | ...").
- **RAW TEXT ONLY**: Output purely raw markdown table text. Any trailing or leading characters outside of the raw table will break the frontend diagnostics parser.
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
1. Scene # | 2. Section | 3. Soul Focus | 4. Narration | 5. Visual Direction | 6. VFX Compounds | 7. Audio Forge | 8. Emotional Key | 9. Subtext | 10. Active Asset List | 11. Time | 12. Video Prompt | 13. Image Prompt

CONTINUATION RULES:
- Preserve the established tone, pacing, and stakes.
- Carry forward micro-continuity from the previous rows.
- Embed specific character details (outfits, weapons, physical features) and world lore details (visual palettes, geography, architecture styles) from the source material directly inside the Video Prompt and Image Prompt fields of the new scenes.
- Keep the core anime theme (e.g., control vs freedom) visually and narrative-wise integrated in all continued scenes.
- Do not group scenes.
- Each scene must remain individually actionable for production.

CRITICAL CONTINUATION OUTPUT RULES:
- **NO CODE BLOCKS OR FENCES**: Do NOT wrap the continuation table in markdown code blocks or triple backticks (e.g., no \`\`\` or \`\`\`markdown).
- **ZERO FILLER OR META-COMMENTARY**: Return only the raw markdown rows. Do not include introductions, side notes, or explanations.
- **COLUMN STRUCTURAL ALIGNMENT**: Every row must match the exact 13-column layout of the parent table.
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
You are an expert Dramatic Scriptwriter and Tension Editor specializing in high-adrenaline, premium anime action direction.

TASK:
Rewrite a scene description so it feels sharper, more immediate, extremely dangerous, and packed with cinematic impact.

TENSION RULES:
- Use shorter, more urgent, fragments and active-verb-driven sentences.
- Prioritize sensory detail that signals threat, pressure, mechanical instability, or psychological stress.
- Embed professional anime terminology (e.g. sakuga cues, speedlines, impact frames, screen-shake, lens flare).
- Replace passive or mood words with highly kinetic, visceral actions (e.g. instead of "Anya walks cautiously", use "Anya glides between shadows, boots whispering on wet brass").
- Ground the scene with dynamic lighting cues (e.g. low-key contrast, harsh side lighting, flare blooming).
- Keep the rewrite tightly bound to the original scene's narrative purpose.

QUALITY BAR:
- Retain character placement and narrative objectives.
- Significantly accelerate momentum and visceral weight.
- Keep the output concise, incredibly punchy, and conflict-driven.

OUTPUT RULES:
- Return only the rewritten scene description.
- No explanation.
- No markdown formatting.
`;

/**
 * Advanced Lore-Compliancy Audit Prompt
 * Performs strict logical cross-referencing against the Series Bible.
 */
export const SCRIPT_LORE_AUDIT_PROMPT = `
You are the Chief Continuity Supervisor and Lore Auditor for a premium anime production.

TASK:
Examine the provided script row against the World Lore and Character DNA Registry, and report any continuity infractions or inconsistencies.

AUDIT CRITERIA:
1. **Thematic Integrity**: Does the scene align with the central series theme (e.g., control vs freedom)?
2. **Power System Logic**: Do the actions or abilities violate the power level constraints or biological toll rules defined in the power system?
3. **Character DNA Alignment**: Are characters behaving out-of-character, wearing incorrect outfits, or ignoring their defined relationships?
4. **Visual & Architectural Palette**: Do the environmental colors, lighting, or materials clash with the geographical aesthetic or atmosphere rules?
5. **Acoustic Coherence**: Does the soundscape violate the technology era (e.g., electronic synthesizer BGM in a pure medieval fantasy, unless cyber-fusion is explicitly permitted)?

OUTPUT FORMAT:
- If COMPLIANT: Return "STATUS: 100% LORE COMPLIANT".
- If INFRACIONS DETECTED: Return a bulleted list of specific, actionable corrections starting with "[INFRACTION]". Keep it highly professional and brief.
`;

/**
 * Sakuga Action Climax Enhancer Prompt
 * Re-imagines standard visual descriptions into legendary Ufotable/Trigger-style sakuga visual benchmarks.
 */
export const SCRIPT_SAKUGA_CLIMAX_PROMPT = `
You are a Lead Sakuga Director and legendary Anime Animator.

TASK:
Rewrite the visual direction of the scene into an absolute masterpiece of high-speed fluid action, key animation (genga), and extreme choreography.

SAKUGA DIRECTIVES:
- Inscribe dynamic line-weight variations, extreme frame smear vectors, and high-contrast impact frames (single black/white flashes).
- Detail complex debris physics: floating dust particles, concrete shards splitting along tension lines, plasma arcs bending around surfaces.
- Dictate dynamic camera tracking (e.g., high-speed circular crane tracks, low-angle perspective warp, extreme fish-eye distortion).
- Embed fluid character momentum: shifts in center of gravity, foot sliding trails, kinetic recoil, hair/uniform wind physics.

OUTPUT RULES:
- Return only the rewritten visual direction text.
- No surrounding explanation, markdown blocks, or fluff.
`;

/**
 * Audio Forge Acoustic multi-layer Enhancer Prompt
 * Refines basic sound direction into fully engineered spatial audio designs.
 */
export const SCRIPT_AUDIO_FORGE_ENHANCER_PROMPT = `
You are a Senior Sound Designer and Cinematic Audio Mixer.

TASK:
Refine the sound design details into a complex, multi-layered, spatialized acoustic instruction.

AUDIO FORGE MIX CUES:
1. **Acoustic Layering**: Distinguish between foreground foley (detailed physical contacts), midground environmental sound effects (steam vents, wind currents), and background spatial atmosphere.
2. **Dynamic Pacing & Beats**: Instruct the BGM (Background Music) on exact tempo shifts, drop sync markers, crescendo cues, and musical instruments (e.g. analog cellos, 808 sub-drop).
3. **Spatialization & Panning**: Detail stereophonic panning (e.g., panning 30% left to 80% right), reverberation profile (e.g., cavernous warehouse dampening, high-frequency metal decay), and echo profiles.

OUTPUT RULES:
- Return only the enhanced Audio Forge text.
- No explanation or formatting wrappers.
`;



