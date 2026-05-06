/**
 * Utility Prompts for Advanced Content Creation
 * Specialized prompts for narration enhancement, timing estimation, and voice direction
 * 
 * Features:
 * - Comprehensive error handling and validation
 * - Detailed voice direction specifications
 * - Advanced timing calculation algorithms
 * - Emotional delivery guidance
 * - Production-quality voice direction
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates narration input for enhancement
 * @param narration - The narration text to validate
 * @throws {Error} If narration is invalid
 */
function validateNarration(narration: string): void {
  if (!narration) {
    throw new Error('Narration cannot be empty. Please provide dialogue or narration text to enhance.');
  }
  if (typeof narration !== 'string') {
    throw new Error('Narration must be a string.');
  }
  if (narration.trim().length < 2) {
    throw new Error('Narration must be at least 2 characters long.');
  }
  // Check for reasonable max length (prevent abuse)
  if (narration.length > 5000) {
    throw new Error('Narration exceeds maximum length of 5000 characters. Please split into shorter segments.');
  }
}

/**
 * Validates language/dialect specification
 * @param language - The language or dialect to validate
 * @throws {Error} If language is invalid
 */
function validateLanguage(language: string): void {
  if (!language) {
    throw new Error('Language cannot be empty.');
  }
  if (typeof language !== 'string') {
    throw new Error('Language must be a string.');
  }
  const validLanguages = ['English', 'Japanese', 'Japanese (Formal)', 'Japanese (Casual)', 'Japanese (Kansai)', 'Chinese', 'Korean', 'Spanish', 'French', 'German', 'Italian', 'Russian', 'Portuguese', 'Thai', 'Vietnamese'];
  if (!validLanguages.some(lang => language.toLowerCase().includes(lang.toLowerCase()))) {
    console.warn(`Language "${language}" may not be standard. Proceeding with custom language specification.`);
  }
}

/**
 * Safely wraps prompt generation with comprehensive error handling
 * @param input - The input parameter(s)
 * @param validator - Validation function
 * @param promptGenerator - Function that generates the prompt
 * @returns The generated prompt or error message
 */
function safePromptGeneration(
  input: string | Record<string, string>,
  validator: (input: any) => void,
  promptGenerator: (input: any) => string
): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate prompt: ${errorMessage}`);
  }
}

// ==================== CORE UTILITY PROMPTS ====================

/**
 * Generates an enhanced narration prompt with detailed voice direction
 * @param narration - The basic narration or dialogue text
 * @param language - Optional: Language/dialect specification
 * @returns Detailed prompt for AI voice direction enhancement
 */
export const ENHANCE_NARRATION_PROMPT = (narration: string, language: string = 'English') =>
  safePromptGeneration(
    { narration, language },
    (input) => {
      validateNarration(input.narration);
      validateLanguage(input.language);
    },
    ({ narration, language }) => `
You are a world-class Voice Director and Dialogue Enhancement Specialist.

Your expertise encompasses vocal technique, emotional delivery, linguistic nuance, and production-quality voice acting direction.

SOURCE NARRATION:
"${narration}"

LANGUAGE/DIALECT: ${language}

TASK: Enhance this narration with specific, actionable voice direction instructions.

## ENHANCEMENT SPECIFICATIONS:

### 1. Emotional Delivery
- **Primary emotion**: What's the dominant emotional state? (Joy, sorrow, anger, fear, love, determination, confusion, etc.)
- **Emotional intensity**: Subtle and restrained vs. explosive and dramatic
- **Emotional arc**: Does emotion evolve during the line? (Start hopeful, end defeated; start confused, end determined)
- **Authentic delivery**: Avoid melodrama; ensure delivery feels genuine and earned

### 2. Vocal Characteristics
- **Voice quality**: 
  - Tone: Warm, cold, sharp, smooth, rough, delicate, powerful
  - Texture: Clear, breathy, raspy, whispered, controlled, raw
  - Resonance: Nasal, throaty, chest, head voice, mixed placement
- **Volume & Intensity**: 
  - Whisper (barely audible)
  - Quiet (intimate, 20-30% volume)
  - Normal (conversational, 50-60% volume)
  - Emphatic (loud and clear, 80%+ volume)
  - Dynamic (volume changes within line)
- **Pace & Rhythm**:
  - Slow deliberate (emphasis, significance, weight)
  - Normal conversational (natural, relatable)
  - Rapid (excitement, panic, urgency)
  - Staccato (sharp, punchy delivery)
  - Flowing (smooth, lyrical, connected)

### 3. Phrasing & Emphasis
- **Key words to emphasize**: Which words should receive vocal stress?
- **Breath placement**: Where should the voice take breaths? (End of clauses, strategic pauses)
- **Pauses**: Where should meaningful silences occur? (Contemplation, impact, dramatic effect)
- **Inflection patterns**:
  - Rising inflection (question, uncertainty, hope)
  - Falling inflection (statement, authority, finality)
  - Level inflection (matter-of-fact, controlled)
  - Wave inflection (emotional intensity varying throughout)

### 4. Vocal Effects & Techniques
- **Tremolo**: Wavering voice suggesting emotion (fear, sadness, passion)
- **Vibrato**: Natural pitch variation for richness and emotion
- **Harshness**: Vocal tension for anger, determination, or strain
- **Breathiness**: Air through voice for softness, vulnerability, or otherworldliness
- **Resonance shifting**: How the voice "sits" (nasal, throat, chest, head)
- **Distortion**: Should voice have any digital or supernatural distortion?

### 5. Contextual Factors
- **Character type**: Hero, villain, mentor, comic relief, mysterious figure, romantic interest
- **Character age**: How does age affect vocal quality? (Young/energetic vs. mature/weary)
- **Character background**: How does accent/dialect reflect background?
- **Scene context**: What's happening around this dialogue?
- **Power dynamics**: Is character in control, vulnerable, asserting dominance?

### 6. Language-Specific Direction
- **Pronunciation**: Any specific pronunciation guidance for ${language}?
- **Dialect features**: Specific accent markers or linguistic patterns?
- **Formality level**: Formal/respectful vs. casual/familiar speech?
- **Linguistic idiosyncrasies**: Unique word choices or speech patterns?

### 7. Production Technical Details
- **Microphone technique**: Close intimacy vs. normal distance vs. far for smallness
- **Post-processing**: Should audio have reverb, echo, or processing effects?
- **Delivery takes**: Should actor try multiple takes? (Soft and subtle vs. bold and powerful)
- **Compatibility**: How should this voice work with sound design and music?

## DELIVERY DIRECTION FORMAT:

Provide specific, actionable voice direction in parentheses BEFORE the dialogue. Examples:
- "(voice warm and reassuring, slow deliberate pace, slight tremor of emotion) I promise you, everything will be alright."
- "(voice sharp and commanding, rapid delivery, absolute conviction) Stand down immediately!"
- "(voice barely a whisper, trembling with fear, hesitant pauses between words) W-we shouldn't... be here..."
- "(voice ethereal and distant, echoing quality, floating above the scene) My time has come..."
- "(voice deep and resonant, theatrical delivery, powerful emphasis on key words) THIS is our moment of destiny!"

## OUTPUT FORMAT:

Return ONLY the enhanced narration with voice direction in parentheses.
Do NOT include quotes, markdown formatting, or explanations.
The direction should be concise yet specific enough for a professional voice actor to execute.

ENHANCED NARRATION:
`);

/**
 * Generates prompt for calculating narration duration
 * @param narration - The narration text to time
 * @returns Detailed prompt for duration estimation
 */
export const SUGGEST_DURATION_PROMPT = (narration: string) =>
  safePromptGeneration(
    narration,
    validateNarration,
    (text) => `
You are an expert Production Manager and Voice-Over Timing Specialist.

Your expertise includes precise timing calculation, speech rate analysis, and production scheduling accuracy.

SOURCE NARRATION:
"${text}"

TASK: Calculate the precise duration in seconds for this narration when read aloud.

## TIMING CALCULATION SPECIFICATIONS:

### 1. Base Speaking Rate Analysis
- **Standard speaking rate**: 130-150 words per minute (WPM)
- **Slow deliberate delivery**: 80-110 WPM (emphasis, significance, emotional weight)
- **Normal conversational rate**: 120-150 WPM (natural, relatable)
- **Fast/rapid delivery**: 160-200 WPM (urgency, excitement, panic)
- **Very fast delivery**: 200+ WPM (extreme urgency, supernatural)

### 2. Word Count Analysis
- Count total words in provided narration
- Calculate base duration: (word count / speaking rate in WPM) × 60 seconds

### 3. Pause & Silence Adjustments
- **Natural breaths**: Add 0.5-1.0 seconds for breath pauses at clause endings
- **Dramatic pauses**: Add 1-3 seconds for emphasis or dramatic effect
- **Silence for reflection**: Add 1-2 seconds where silence serves emotional purpose
- **Hesitation pauses**: Add 0.3-0.5 seconds per hesitation or stutter effect

### 4. Phonetic Complexity Adjustments
- **Complex phonetics**: Words with difficult consonant clusters (add 0.1s per complex word)
- **Multi-syllable words**: Longer words require slightly more time
- **Proper nouns**: Character/place names may require careful pronunciation (add 0.1s each)
- **Foreign words**: Non-English words may require additional pronunciation time

### 5. Delivery Style Considerations
- **Whispered delivery**: Typically slower, add 5-10% to base time
- **Emotional delivery**: Strong emotions often extend timing by 5-15%
- **Trembling/shaky voice**: Vocal instability adds 3-8% to timing
- **Echoing/reverb effects**: Post-processing doesn't affect delivery time but affects perceived duration
- **Vocal effects**: Distortion or processing doesn't affect delivery timing

### 6. Contextual Timing Factors
- **Character speaking style**: Does character have natural speech patterns affecting speed?
- **Linguistic complexity**: Dense technical dialogue vs. simple casual speech
- **Emphasis/inflection**: Dramatic emphasis often slows delivery slightly
- **Scene pacing**: Does scene rhythm suggest faster or slower delivery?

## CALCULATION METHOD:

1. Count words in narration
2. Determine appropriate speaking rate based on delivery style
3. Calculate base time: (word count ÷ WPM) × 60
4. Add adjustments for pauses (estimate 0.5-1.0s per major pause point)
5. Add adjustments for emotional delivery (+5-15% if specified)
6. Add adjustments for phonetic complexity (+0.1s per complex word)
7. Round to nearest 0.5 second for practical production timing

## TIMING EXAMPLES:

- "Hello" (1 word, normal speech): ~0.5s
- "I'm going to the store today." (6 words, normal speech): ~2.5s
- "I love you." (3 words, emotional delivery with pause): ~2-3s
- "What do you mean?! Why would you... how could you?" (10 words, emotional with pauses): ~4-5s

## OUTPUT FORMAT:

Return ONLY the duration in seconds with 's' suffix (e.g., '12.5s' or '3.5s' or '45s').
No explanation, markdown, or additional text.
Be precise to the nearest 0.5 second.

DURATION:
`);

/**
 * Generates prompt for multi-voice dialogue enhancement
 * @param dialogueLines - Multiple lines of dialogue with speaker labels
 * @returns Detailed prompt for ensemble voice direction
 */
export const ENHANCE_DIALOGUE_ENSEMBLE_PROMPT = (dialogueLines: string) =>
  safePromptGeneration(
    dialogueLines,
    validateNarration,
    (lines) => `
You are a Master Dialogue Director specializing in ensemble voice direction and character voice consistency.

SOURCE DIALOGUE:
${lines}

TASK: Enhance this multi-character dialogue with distinct voice direction for each speaker.

## ENSEMBLE VOICE DIRECTION SPECIFICATIONS:

### 1. Character Voice Consistency
- **Establish unique vocal signature**: Each character should have recognizable vocal qualities
- **Voice differentiation**: Age, gender, background, personality should affect vocal characteristics
- **Vocal relationships**: How do characters' voices relate? (Contrast, harmony, conflict)
- **Growth/change**: Can voices show character evolution throughout dialogue?

### 2. Dialogue Dynamics
- **Turn-taking**: How do characters overlap or interrupt?
- **Dominance**: Who controls the conversation through vocal authority?
- **Emotional reactions**: How do characters respond vocally to each other?
- **Mirroring/contrast**: Do characters vocally respond to each other?

### 3. Individual Character Voices
For each character specify:
- **Base vocal quality**: Tone, texture, natural pitch range
- **Unique vocal markers**: Accent, speech patterns, verbal tics
- **Emotional range**: How voice changes with emotion
- **Relationship-specific adjustments**: Does voice change based on conversation partner?

### 4. Synchronization & Timing
- **Simultaneous dialogue**: Do multiple characters speak at once? How?
- **Rapid exchange**: How fast should dialogue flow?
- **Silence between lines**: Natural breathing space or intense no-pause delivery?
- **Emotional beats**: Where should voices pause for impact?

### 5. Production Quality
- **Microphone positions**: Each character's spatial relationship to mic?
- **Post-processing**: Individual processing for each voice?
- **Audio levels**: Relative volumes between characters
- **Perspective**: Are we hearing dialogue subjectively through one character's perspective?

## OUTPUT FORMAT:

For each line of dialogue, provide:
[CHARACTER NAME] (voice direction details) "dialogue text"

Example:
PROTAGONIST (voice warm and determined, steady pace, genuine warmth) "I've made my decision. Whatever comes next, we face it together."
ANTAGONIST (voice cold and threatening, slow deliberate delivery, each word emphasized) "You... are making... a grave mistake."
ALLY (voice uncertain, slight tremor, quick intake of breath) "Wait, are you sure about this?"

Return ONLY the enhanced dialogue with voice directions.

ENHANCED DIALOGUE:
`);

/**
 * Generates prompt for voice acting emotional range guidance
 * @param character - Character name/description
 * @returns Detailed prompt for emotional range specification
 */
export const CHARACTER_VOICE_RANGE_PROMPT = (character: string) =>
  safePromptGeneration(
    character,
    validateNarration,
    (char) => `
You are an expert Voice Coach and Character Voice Development Specialist.

CHARACTER: ${char}

TASK: Define the complete emotional voice range and vocal characteristics for this character.

## CHARACTER VOICE DEVELOPMENT SPECIFICATIONS:

### 1. Base Vocal Identity
- **Natural voice**: Age-appropriate pitch, tone, resonance
- **Unique markers**: Accent, speech patterns, distinctive qualities
- **Vocal range**: High, medium, low register preference
- **Natural cadence**: Speech rhythm and phrasing patterns
- **Default intensity**: Baseline energy level

### 2. Emotional Voice Variations
For each major emotion specify how voice changes:
- **Joy**: Pitch rises, speed increases, warmth increases, breathiness if laughing
- **Sorrow**: Pitch lowers, tempo slows, voice may crack or thin, depth increases
- **Anger**: Intensity rises, articulation becomes sharp, volume increases, resonance hardens
- **Fear**: Pitch rises slightly, tremor enters voice, breathing becomes shallow, hesitation
- **Love/Tenderness**: Voice softens, pitch may lower, warmth and resonance increase
- **Determination/Resolve**: Vocal authority increases, pacing becomes steady, conviction strengthens
- **Confusion/Uncertainty**: Pitch wavers, pace becomes irregular, inflection rises (question-like)
- **Contempt/Disdain**: Vocal placement shifts, delivery becomes clipped, sneer-like quality
- **Vulnerability**: Voice thins, tremor present, pace may stutter, intensity reduces

### 3. Vocal Flexibility
- **Can character shift registers?**: Move between head voice, mix, chest voice?
- **Vocal breaks**: When does voice show strain? Emotional moments?
- **Vocal control**: Is character a skilled speaker or does voice betray emotion?
- **Restraint vs. expression**: Does character hide or express emotions vocally?

### 4. Physical State Effects on Voice
- **Exhaustion**: Voice becomes thinner, less controlled, pitch may waiver
- **Illness**: Voice may sound strained, hoarse, weaker
- **Intoxication**: Speech becomes loose, control decreases, emotional intensity may increase
- **Physical pain**: Voice becomes tight, breathing affected, articulation suffers
- **Adrenaline/shock**: Voice becomes sharp, speech rapid, breathing prominent

### 5. Relationship-Specific Voice Modifications
- **To authority figures**: Does character become more formal, less confident?
- **To loved ones**: Does voice soften, become more vulnerable?
- **To enemies**: Does voice become sharper, colder, more controlled?
- **To inferiors**: Does character adopt commanding tone?

### 6. Growth Arc Voice Changes
- **Beginning of story**: How does voice reflect initial state?
- **Midpoint transformation**: How does voice show change?
- **End of story**: Final vocal state reflecting character growth
- **Traumatic moments**: How does trauma affect voice permanently or temporarily?

### 7. Signature Vocal Moments
- **Catchphrases**: Specific delivery for character's unique lines
- **Emotional breaking points**: When does vocal control fail?
- **Power moments**: When does voice achieve maximum authority?
- **Vulnerability moments**: When does voice reveal true self?

## OUTPUT FORMAT:

Provide a comprehensive character voice profile including:
1. Base vocal characteristics
2. Emotional voice variations (how each emotion affects voice)
3. Key relationship voice modifications
4. Significant story moment voice requirements
5. Recommended vocal references (similar character voices to study)

VOICE PROFILE:
`);

/**
 * Generates prompt for technical voice recording specifications
 * @param narration - The narration to optimize for
 * @returns Detailed prompt for recording specifications
 */
export const VOICE_RECORDING_SPECS_PROMPT = (narration: string) =>
  safePromptGeneration(
    narration,
    validateNarration,
    (text) => `
You are an expert Audio Engineer and Voice Recording Specialist.

SOURCE NARRATION:
"${text}"

TASK: Define optimal recording specifications for professional voice-over production.

## RECORDING SPECIFICATIONS:

### 1. Technical Audio Parameters
- **Sample rate**: 44.1 kHz (broadcast standard), 48 kHz (video production), 96 kHz (ultra-high quality)
- **Bit depth**: 16-bit (standard), 24-bit (professional), 32-bit (mastering)
- **Audio format**: WAV (lossless), MP3 (compressed), FLAC (lossless compressed)
- **Mono vs. Stereo**: Mono (standard for VO), Stereo (if special effects needed)

### 2. Microphone Selection
- **Microphone type**:
  - Condenser: Sensitive, detailed, great for intimate VO (studio standard)
  - Dynamic: Less sensitive, great for loud delivery, live performance
  - Lavalier: Hands-free, consistent distance
  - Shotgun: Directional, isolates speaker from room
- **Microphone characteristics**: Proximity effect, frequency response, sensitivity
- **Microphone placement**: Distance from talent (6-12 inches typical)

### 3. Studio Environment
- **Acoustic treatment**: Sound-dampening foam, bass traps, diffusion
- **Background noise**: Should be below -80dB
- **Room tone**: Natural, dead, or slightly reflective?
- **Isolation**: How isolated from external noise?

### 4. Recording Technique
- **Microphone technique**: Staying on-axis, distance variation for effect
- **Pop filter**: Wind screen for plosives (p, b, t, k sounds)
- **Mouth noise management**: Hydration, avoiding clicking sounds
- **Gain staging**: Recording level optimization (peak around -3dB)

### 5. Performance Considerations
- **Takes**: How many takes should be recorded?
- **Variations**: Record multiple emotional interpretations
- **Ad-libs**: Should talent improvise variations?
- **Safety**: Record longer versions for flexibility in editing

### 6. Post-Processing Parameters
- **EQ**: Frequency adjustments for tone shaping
- **Compression**: Dynamic range control
- **Reverb**: Acoustic space simulation (if needed)
- **Normalization**: Level optimization
- **Noise reduction**: If environmental noise present

### 7. Delivery Optimization
- **Warm-up**: Actor voice preparation time needed
- **Hydration**: Water breaks between takes
- **Rest**: Vocal rest time needed between long sessions
- **Performance energy**: Physical preparation for optimal delivery

## OUTPUT FORMAT:

Provide complete recording specifications including technical parameters, microphone recommendations, and performance guidelines.

RECORDING SPECIFICATIONS:
`);




