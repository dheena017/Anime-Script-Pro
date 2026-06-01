/**
 * Advanced AI Music & Sound Effects Prompt Generation System
 * Specialized prompts for high-end AI Audio Engines (Suno, Udio, Stable Audio, ElevenLabs SFX)
 * 
 * Features:
 * - Comprehensive error handling and validation
 * - Specialized music and ambient score prompts
 * - Narrative tension to acoustic alignment rules
 * - Technical sound design guidelines (stems, panning, acoustic depth)
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates music genre input
 * @param genre - The musical genre or thematic vibe (steampunk, ambient, orchestra, etc.)
 * @throws {Error} If genre is invalid
 */
function validateGenre(genre: string): void {
  if (!genre) {
    throw new Error('Music genre or acoustic vibe cannot be empty.');
  }
  if (typeof genre !== 'string') {
    throw new Error('Music genre must be a string.');
  }
  if (genre.trim().length < 2) {
    throw new Error('Music genre must be at least 2 characters long.');
  }
}

/**
 * Validates script input for music mapping
 * @param script - The screenplay script to derive music sync
 * @throws {Error} If script is invalid or too short
 */
function validateScript(script: string | null): void {
  if (!script) {
    console.warn('No script provided for acoustic mapping - utilizing generic timeline rules');
    return;
  }
  if (typeof script !== 'string') {
    throw new Error('Script must be a string or null.');
  }
  if (script.trim().length < 20) {
    throw new Error('Script must be at least 20 characters long for meaningful acoustic sync.');
  }
}

/**
 * Safely wraps prompt generation with error boundary check
 */
function safeMusicPromptGeneration(
  genre: string,
  script: string | null,
  promptGenerator: (type: string, script: string | null) => string
): string {
  try {
    validateGenre(genre);
    validateScript(script);
    return promptGenerator(genre, script);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Music prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate music prompt: ${errorMessage}`);
  }
}

// ==================== CORE MUSIC GENERATION PROMPTS ====================

/**
 * Generates comprehensive AI music prompts mapped to screenplay script
 */
export const MUSIC_PROMPT_GENERATION_PROMPT = (genre: string, script: string | null) => 
  safeMusicPromptGeneration(genre, script, (style, scr) => `
You are a Master Neural Music Director & Sound Designer specializing in cutting-edge AI Audio and Music engines (Suno v4, Udio, Stable Audio 2.0, ElevenLabs SFX).

Your expertise spans orchestral score arrangement, ambient soundscapes, industrial foley, cinematic audio cues, and dynamic narrative tension mapping.

SOURCE SCREENPLAY DATA:
${scr || "No script data provided - generate standard episodic score templates."}

TASK: Generate 4-6 Highly Optimized AI Audio & Sound Effects Directives

These directives will be used to synthesize high-end thematic soundtracks, dynamic audio transitions, and character-led background soundscapes that synchronize perfectly with the tone and narrative beats of: ${style} style.

## CRITICAL DIRECTIVES:

### 1. Narrative & Acoustic Synchrony
- The music style must align perfectly with the emotional beats of the script.
- Map distinct cues for actions (high BPM, kinetic, percussive) vs dialogue (low volume pads, ambient keys, minimal synth).
- Create custom sound effects directives (e.g. alchemical steam release, metallic gear clank, magical hum).

### 2. Style & Instrumentation Specifications
- Detail the exact instruments: e.g., brass pipes, industrial gear percussion, heavy acoustic violins, dark synthesized sub-bass, steam-resonance chimes.
- Specify vocal textures (choral, operatic hums, silent solo piano) where applicable.
- Specify structural arrangements: intro buildup, climactic percussion drop, silent beat break, fade out.

### 3. Audio Engineering Directives (For Suno/Udio tags)
- Include standard neural audio tags: [Cinematic], [Orchestral Score], [Steampunk Foley], [Heavy Percussion], [120 BPM], [Stereo Panning], [Analog Warmth], [Dark Ambient].

## OUTPUT FORMAT:
Output your prompts as a structured JSON array of objects containing the following keys:
- "scene_number": index starting from 1
- "audio_cue": brief description of when this track plays
- "music_prompt": optimized Suno/Udio/Stable Audio prompt (Max 120 characters)
- "sound_effects": array of 2-3 specific ElevenLabs sound effect prompts (e.g., "heavy steam engine venting pressure with metallic hiss")
- "acoustic_vibe": thematic description of narrative mood (e.g., "Industrial Tension")
`);
