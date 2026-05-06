/**
 * Advanced AI Video Prompt Generation System
 * Specialized prompts for high-end AI video engines (Luma, Kling, Runway, Sora)
 * 
 * Features:
 * - Comprehensive error handling and validation
 * - Multiple specialized video prompt types
 * - Detailed cinematography specifications
 * - Technical production guidelines
 * - Style consistency frameworks
 * - Motion and camera choreography guidance
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates content type input
 * @param contentType - The type of content (anime, cinematic, promotional, etc.)
 * @throws {Error} If content type is invalid
 */
function validateContentType(contentType: string): void {
  if (!contentType) {
    throw new Error('Content type cannot be empty. Please specify: anime, cinematic, promotional, 3D animation, etc.');
  }
  if (typeof contentType !== 'string') {
    throw new Error('Content type must be a string.');
  }
  if (contentType.trim().length < 2) {
    throw new Error('Content type must be at least 2 characters long.');
  }
}

/**
 * Validates script input for video prompt generation
 * @param script - The source script for video generation
 * @throws {Error} If script is invalid or too short
 */
function validateScript(script: string | null): void {
  if (!script) {
    console.warn('No script provided - will generate generic video prompts');
    return;
  }
  if (typeof script !== 'string') {
    throw new Error('Script must be a string or null.');
  }
  if (script.trim().length < 20) {
    throw new Error('Script must be at least 20 characters long for meaningful video generation.');
  }
}

/**
 * Safely wraps prompt generation with comprehensive error handling
 * @param contentType - The content type
 * @param script - The source script
 * @param promptGenerator - Function that generates the prompt
 * @returns The generated prompt or error message
 */
function safeVideoPromptGeneration(
  contentType: string,
  script: string | null,
  promptGenerator: (type: string, script: string | null) => string
): string {
  try {
    validateContentType(contentType);
    validateScript(script);
    return promptGenerator(contentType, script);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Video prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate video prompt: ${errorMessage}`);
  }
}

// ==================== CORE VIDEO GENERATION PROMPTS ====================

/**
 * Generates comprehensive AI video prompts for scene visualization
 * @param contentType - Type of content (anime, cinematic, etc.)
 * @param script - Source script with narrative and production cues
 * @returns Detailed prompt for AI video generation
 */
export const VIDEO_PROMPT_GENERATION_PROMPT = (contentType: string, script: string | null) => 
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are a Master Neural Video Prompt Architect specializing in cutting-edge AI Video Generation Engines (Luma AI, Kling, Runway Gen-3, OpenAI Sora).

Your expertise spans cinematography, motion design, visual effects, color grading, and production pipeline optimization.

SOURCE SCRIPT DATA:
${scr || "No script data provided - generate industry-standard visual prompts."}

TASK: Generate 8-12 Highly Optimized, Production-Ready AI Video Prompts

These prompts will be used to generate cinematic-quality video clips that capture the narrative intensity, visual style, and kinetic energy of ${type} production.

## CRITICAL DIRECTIVES:

### 1. Script Fidelity
- MUST strictly adhere to narrative events from the source script
- MUST preserve specific visual cues, character descriptions, and environmental details
- MUST capture the intended emotional tone and pacing
- MUST maintain logical scene continuity and spatial relationships

### 2. Cinematography & Camera Choreography
- **Specify camera type**: Handheld, gimbal, crane, dolly, static mounted, aerial drone
- **Define movement patterns**: 
  - Slow push-in, tracking lateral, overhead crane, handheld follow
  - Camera speed (approximate velocity: slow 5-15 pixels/frame, medium 15-30, fast 30-50)
  - Movement trajectory (linear, curved, circular, erratic)
- **Frame composition**: Wide establishing, medium shot, close-up, over-the-shoulder, POV
- **Depth of field**: Shallow focus on subject vs. deep focus environment
- **Focal length feel**: Wide-angle (100-120°), normal (50°), telephoto (35°)

### 3. Motion & Kinetics
- **START state**: Initial scene composition, lighting, character position, environmental state
- **END state**: Final composition after motion completes, character position changes, lighting shifts
- **Motion type**: 
  - Character movement (walking, running, combat, emotional gesture)
  - Environmental motion (explosions, weather, particle effects, water/fire interaction)
  - Magical/supernatural motion (energy waves, spell effects, dimension shifts)
- **Motion intensity**: Subtle and graceful vs. explosive and violent
- **Motion duration**: 2-5 second typical clip length (specify if longer)

### 4. Lighting & Atmospheric Design
- **Lighting setup**: 
  - Key light position and intensity
  - Fill light for shadow detail
  - Backlight for depth separation
  - Ambient/environmental light contribution
- **Lighting quality**: Hard directional vs. soft diffused
- **Color temperature**: Warm (amber, orange), cool (blue, cyan), neutral, mixed
- **Dynamic lighting**: Does light change during motion? (Flickering, fading, sweeping)
- **Volumetric effects**: Fog, dust, smoke particles, light shafts, god rays
- **Atmospheric density**: Clear air vs. thick atmosphere vs. particle-heavy

### 5. Visual Style & Art Direction
- **Animation style**: 
  - Ufotable high-fidelity anime realism
  - MAPPA dramatic stylization
  - Kyoto Animation detailed elegance
  - 3D CGI with anime-influenced coloring
  - Rotoscoped photorealism
  - Abstract/stylized
- **Color grading**:
  - Specific color palette (e.g., "Teal and orange cinematic", "Desaturated cool blue")
  - Contrast level (high contrast dramatic vs. soft midtones vs. blown-out surreal)
  - Saturation level (vibrant, natural, desaturated, monochromatic)
  - Specific color grades for mood (cyberpunk neon, romantic golden hour, ominous desaturated)
- **Visual effects**:
  - Particle systems (dust, sparks, magical effects, weather)
  - Distortions (heat shimmer, magical aura, dimensional warping)
  - Motion blur or frozen detail
  - Film grain or digital artifacts
  - Light flares or bokeh effects

### 6. Scene-Specific Details
- **Environmental context**: Location, weather, time of day, season
- **Prop and asset details**: Specific objects, their positions, materials
- **Character appearance**: Clothing, pose, expression, action being performed
- **Background elements**: What's visible in soft focus or peripheral areas
- **Scale indicators**: How large are spaces? Intimate interior vs. vast landscape

### 7. Production Quality Standards
- **Resolution target**: 1080p, 2K, 4K (specify for quality level)
- **Frame rate**: 24fps (cinematic), 30fps (smooth), 60fps (ultra-smooth)
- **Aspect ratio**: 16:9 (standard), 21:9 (cinematic), 1:1 (square)
- **Render quality**: Maximum detail, optimized for quality, performance-optimized

### 8. Specific Technical Parameters
- **Motion smoothness**: Should motion be fluid and graceful or dynamic with stop-frames?
- **Focus transitions**: Does focus shift during the shot? How fast?
- **Exposure changes**: Does brightness shift during motion?
- **Color shifts**: Does color palette change during the motion?
- **Transition endings**: Cut abruptly, fade to black, motion blur exit, natural stop

## PROMPT FORMAT REQUIREMENTS:

Each video prompt MUST include:
1. **Scene context** (1-2 sentences establishing the moment)
2. **Camera type & movement** (explicit choreography)
3. **Lighting specification** (key details on illumination)
4. **Color grade & mood** (specific visual style)
5. **Motion & action** (START to END state)
6. **Visual effects** (particles, distortions, effects)
7. **Duration target** (2-5 seconds typical)
8. **Style reference** (which anime/film style to emulate)

## EXAMPLE PROMPT FORMAT:

"[Scene context]. Camera: [type and movement pattern]. Lighting: [specific illumination]. Colors: [grade and palette]. Motion: [action from START to END]. Effects: [particles/distortions]. Duration: [3-5 sec]. Style: [anime reference]."

---

Generate 8-12 production-ready prompts now. Format as a numbered Markdown list.

Return ONLY the prompt list with no explanations or meta-commentary.
`);

/**
 * Generates action-focused video prompts emphasizing dynamic movement
 * @param contentType - Type of content
 * @param script - Source script
 * @returns Action-optimized video prompts
 */
export const ACTION_SEQUENCE_PROMPT = (contentType: string, script: string | null) =>
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are an expert Action Choreography and Motion Design Specialist for AI video generation.

SOURCE SCRIPT:
${scr || "No script provided - create high-impact action sequences."}

TASK: Generate 6-10 High-Impact Action Sequence Prompts for ${type}.

## ACTION PROMPT SPECIFICATIONS:

### 1. Combat & Dynamic Movement
- **Attack choreography**: Define punch, kick, slash, projectile patterns
- **Impact moments**: Where does contact occur? What's the reaction?
- **Momentum transfer**: How does force translate through bodies/objects?
- **Collision effects**: Dust clouds, sparks, shockwaves, debris scattering

### 2. Speed & Intensity
- **Movement speed**: Slow-motion dramatic (10fps feel), normal speed, ultra-fast (100fps)
- **Acceleration patterns**: Slow buildup vs. explosive start vs. continuous acceleration
- **Intensity escalation**: Does action ramp up throughout clip?
- **Peak moments**: Where is the moment of maximum impact/intensity?

### 3. Environmental Destruction
- **Destructible elements**: What breaks, cracks, shatters?
- **Destruction timing**: Synchronized with action or reactive?
- **Material responses**: How do different materials react? (Metal dents, stone cracks, wood splinters)
- **Debris trajectories**: Direction and speed of flying objects

### 4. Dynamic Camera Work for Action
- **Camera stability**: Locked steady vs. handheld follow vs. dynamic repositioning
- **Focus tracking**: Does camera follow subject or stay on impact zone?
- **Speed ramping**: Does camera motion change speed during shot?
- **Multiple angles**: Does scene show from different perspectives or single POV?

### 5. Visual Impact Techniques
- **Motion blur**: How much blur for speed indication?
- **Impact frames**: Freeze frames at collision moments?
- **Particle density**: Heavy particle clouds vs. sparse effects
- **Energy visualization**: How to show force/power visually?

### 6. Sound Design Implications
- **Rhythm**: What's the sonic rhythm to match? (Define approximate BPM)
- **Impact sounds**: Where do major sound hits occur?
- **Ambient sound**: Background audio texture during action
- **Silence moments**: Are there quiet tension-building moments?

Format each action prompt following the VIDEO_PROMPT_GENERATION_PROMPT standard.

Return ONLY the numbered action prompt list.
`);

/**
 * Generates cinematic establishment and transition prompts
 * @param contentType - Type of content
 * @param script - Source script
 * @returns Cinematic scene establishment prompts
 */
export const CINEMATIC_ESTABLISHMENT_PROMPT = (contentType: string, script: string | null) =>
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are a Master Cinematographer specializing in establishing shots and cinematic scene transitions.

SOURCE SCRIPT:
${scr || "No script provided - create atmospheric establishing visuals."}

TASK: Generate 6-10 Cinematic Establishment & Transition Prompts for ${type}.

## ESTABLISHMENT PROMPT SPECIFICATIONS:

### 1. Establishing Shot Design
- **Location introduction**: How to visually introduce a new location?
- **Scale establishment**: Show vastness or intimacy appropriately
- **Time of day**: Visual lighting to establish temporal context
- **Season/era**: Visual cues for when this story occurs
- **Mood setting**: Atmospheric quality that establishes emotional tone

### 2. Camera Movements for Discovery
- **Reveal technique**: 
  - Pan across landscape
  - Push in from wide to detail
  - Crane up from ground level
  - Reveal from behind foreground element
- **Pacing**: Slow contemplative (fast meditative feel) vs. energetic discovery
- **Focal points**: Where should viewer's eye go first, then where?

### 3. Environmental Storytelling
- **Environmental details**: What does location tell us about the world?
- **Signs of life**: Characters, creatures, activity implied by environment
- **Layering depth**: Foreground, mid-ground, background visual hierarchy
- **Focal distance**: What's in sharp focus vs. artfully blurred?

### 4. Color Grading for Emotional Context
- **Emotional palette**: 
  - Warm amber for nostalgic/homey moments
  - Cool blue for mystery/danger/sadness
  - Saturated vibrant for excitement
  - Desaturated for despair/loss
  - Contrasty for drama, soft for romance
- **Time of day lighting**: Golden hour, blue hour, high noon, overcast, night
- **Weather visualization**: Clear skies, storms, fog, mist, dust

### 5. Transition Techniques
- **Between scenes**: How to smoothly move from one location to another
- **Wipe techniques**: Iris wipe, edge swipe, portal effect
- **Dissolve variations**: Cross-fade, dip to black, dip to color
- **Match cut**: Visual connection between scenes
- **Magical transition**: Dimensional shift, spell effect transition

### 6. Atmospheric Elements
- **Particle systems**: Floating dust, pollen, magic particles
- **Weather effects**: Rain, snow, wind, storm visualization
- **Light phenomena**: Sunbeams, lens flares, light shafts through fog
- **Supernatural elements**: Auras, energy fields, dimensional markers

Format each establishment prompt following the VIDEO_PROMPT_GENERATION_PROMPT standard.

Return ONLY the numbered cinematic prompt list.
`);

/**
 * Generates character-focused cinematic moments
 * @param contentType - Type of content
 * @param script - Source script
 * @returns Character moment video prompts
 */
export const CHARACTER_MOMENT_PROMPT = (contentType: string, script: string | null) =>
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are an expert Character-Focused Cinematography and Emotional Visual Storytelling Specialist.

SOURCE SCRIPT:
${scr || "No script provided - create character-focused emotional moments."}

TASK: Generate 6-10 Character Moment Prompts for ${type}.

## CHARACTER MOMENT SPECIFICATIONS:

### 1. Emotional Expression Cinematography
- **Facial focus**: Close-up that captures emotional depth
- **Body language**: How physical posture conveys emotion
- **Environmental framing**: Is character isolated or surrounded?
- **Lighting on face**: Key light placement for emotional impact
- **Eye direction**: Where is character looking? What are they seeing?

### 2. Reaction & Response Moments
- **Trigger moment**: What causes the emotional reaction?
- **Reaction progression**: How does emotion unfold? (Instant vs. dawning realization)
- **Physical manifestation**: Tears, smile, tension, relaxation, hand movements
- **Duration**: Quick reaction vs. lingering emotional beat
- **Recovery**: How does character transition from reaction?

### 3. Intimate Camera Work
- **Depth of field**: Shallow focus on character face
- **Distance**: How close does camera get? (Intimate vs. respectful vs. observational)
- **Camera position**: Eye-level, slightly above, slightly below
- **Steadiness**: Locked-off tripod vs. subtle gentle movement
- **Framing geometry**: Rule of thirds, centered intimate, geometric composition

### 4. Relationship Dynamics
- **Two-character framing**: 
  - Equal framing (both in focus, balanced composition)
  - Unequal framing (one in focus, one slightly soft)
  - Reverse shot technique (cut between perspectives)
  - Over-shoulder perspective
- **Physical proximity**: How close are characters? What does spacing imply?
- **Connection moments**: Hands touching, eye contact, movement toward/away

### 5. Internal Conflict Visualization
- **Visual metaphors**: How to show internal struggle visually?
- **Color symbolism**: Colors representing different internal states
- **Environmental reflection**: Does environment mirror character emotion?
- **Supernatural elements**: Auras, shadows, light/dark internal conflict

### 6. Character Movement & Gesture
- **Purposeful movement**: Character has specific goal
- **Hesitant movement**: Uncertainty, fear, conflict
- **Automatic gesture**: Habitual movement revealing character
- **Emotional release**: Movement as emotional catharsis
- **Stillness**: Power of character remaining motionless

### 7. Expression of Power/Vulnerability
- **Power moment framing**: Low angles, dramatic lighting, dominant posture
- **Vulnerability moment framing**: High angles, soft lighting, curled posture
- **Transition between states**: How does visual language shift?
- **Contradiction**: Showing power and vulnerability simultaneously

Format each character moment prompt following the VIDEO_PROMPT_GENERATION_PROMPT standard.

Return ONLY the numbered character moment prompt list.
`);

/**
 * Generates visual effects and supernatural phenomena prompts
 * @param contentType - Type of content
 * @param script - Source script
 * @returns Visual effects video prompts
 */
export const VISUAL_EFFECTS_PROMPT = (contentType: string, script: string | null) =>
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are a Master Visual Effects Supervisor and Supernatural Cinematography Specialist.

SOURCE SCRIPT:
${scr || "No script provided - create impressive visual effect sequences."}

TASK: Generate 6-10 Visual Effects & Supernatural Phenomenon Prompts for ${type}.

## VISUAL EFFECTS SPECIFICATIONS:

### 1. Energy & Power Visualization
- **Energy type**: Magical aura, electrical discharge, kinetic force, spiritual energy
- **Energy appearance**: Color, particle behavior, intensity, flow patterns
- **Energy interaction**: How does energy affect environment/objects?
- **Energy crescendo**: Does effect build to peak intensity?
- **Energy dissipation**: How does effect fade/end?

### 2. Spell & Magic Effect Design
- **Spell incantation moment**: Visual cue when power activates
- **Effect formation**: How does spell manifest? (Instant vs. forming vs. growing)
- **Effect shape**: Linear beam, sphere, wave, circular pattern, chaotic burst
- **Effect trajectory**: Direction and path of magical effect
- **Impact effect**: What happens where spell hits? (Explosion, transformation, displacement)

### 3. Particle System Design
- **Particle type**: Dust, sparks, magical particles, elemental particles
- **Particle density**: Sparse elegant vs. thick dramatic
- **Particle behavior**: 
  - Floating gentle vs. chaotic violent
  - Gravity-affected vs. floating suspended
  - Attracted/repelled by center vs. random movement
- **Particle lifespan**: Quick burst vs. lingering clouds
- **Particle color**: Single color, gradient, multicolor

### 4. Environmental Interaction
- **Destruction/Deformation**: How surfaces react to magic
- **Material-specific effects**: Different reactions for metal, stone, wood, flesh
- **Shockwave propagation**: How does shockwave travel through scene?
- **Secondary effects**: Cascading reactions from primary effect
- **Environmental transformation**: Permanent or temporary change?

### 5. Dimensional & Portal Effects
- **Portal appearance**: Torn fabric, swirling vortex, geometric frame, organic mass
- **Portal movement**: Stationary vs. traveling vs. expanding
- **Through-portal view**: What's visible inside portal? Energy? Other dimension?
- **Portal stability**: Stable vs. flickering vs. collapsing
- **Portal interaction**: How do characters/objects interact with portal?

### 6. Lighting Effects & Phenomena
- **Light source**: Where is magical light emanating from?
- **Light color**: Does light have specific color properties?
- **Light spread**: Sharp directional vs. diffused bloom
- **Shadow interaction**: How does magical light affect shadows?
- **Exposure flaring**: Does light cause camera exposure changes?

### 7. Atmospheric Distortion
- **Heat shimmer**: Wavy distortion from heat
- **Dimensional warp**: Space-bending distortion effect
- **Magical saturation**: Colors intensifying or shifting near magic
- **Reality flicker**: Flickering between states/dimensions
- **Chromatic aberration**: Color separation distortion from magical interference

Format each effects prompt following the VIDEO_PROMPT_GENERATION_PROMPT standard.

Return ONLY the numbered visual effects prompt list.
`);

/**
 * Generates color grading and mood-focused prompts
 * @param contentType - Type of content
 * @param script - Source script
 * @returns Color grading and mood video prompts
 */
export const COLOR_MOOD_PROMPT = (contentType: string, script: string | null) =>
  safeVideoPromptGeneration(contentType, script, (type, scr) => `
You are a Master Colorist and Visual Mood/Tone Specialist for ${type}.

SOURCE SCRIPT:
${scr || "No script provided - create mood-driven color-graded sequences."}

TASK: Generate 6-10 Color Grading & Atmospheric Mood Prompts for ${type}.

## COLOR & MOOD SPECIFICATIONS:

### 1. Color Palette Selection
- **Primary colors**: 3-5 main colors defining the scene
- **Color relationships**: 
  - Complementary (opposite colors for drama)
  - Analogous (similar colors for harmony)
  - Triadic (3-color dynamic balance)
  - Monochromatic (single color with variations)
- **Saturation approach**: Vibrant saturated vs. natural vs. desaturated
- **Value contrast**: High contrast dramatic vs. soft midtones vs. high-key bright

### 2. Emotional Color Psychology
- **Warm colors** (Red, Orange, Yellow):
  - Emotional impact: Passion, energy, warmth, nostalgia, danger
  - Usage: Action moments, romantic scenes, nostalgic memories
- **Cool colors** (Blue, Cyan, Purple):
  - Emotional impact: Calm, mystery, sadness, supernatural, authority
  - Usage: Night scenes, emotional moments, tension scenes
- **Neutral colors** (Gray, Brown, White):
  - Emotional impact: Stability, desolation, purity, rawness
  - Usage: Grounded moments, stark drama, minimalist beauty

### 3. Lighting-Color Interaction
- **Warm light** (Tungsten, Golden hour):
  - Visual quality: Soft, glowing, intimate
  - Color palette: Amber, orange, warm yellows
  - Emotional tone: Nostalgia, comfort, romance, danger
- **Cool light** (Daylight, Blue hour):
  - Visual quality: Clear, clinical, mysterious
  - Color palette: Blue, cyan, cool whites
  - Emotional tone: Clarity, mystery, sadness, supernatural
- **Mixed light**: Combination of warm and cool for visual interest

### 4. Color Grade Presets & Styles
- **Teal & Orange**: Popular cinematic look (cool shadows, warm highlights)
- **Blue & Gold**: Romantic elegant look
- **Desaturated Cool**: Dystopian futuristic feel
- **High Saturation Vibrant**: Energetic animated feel
- **High Contrast B&W influenced**: Dramatic noir feel
- **Faded Vintage**: Nostalgic retro feel
- **Neon Cyberpunk**: Artificial saturated colors

### 5. Dynamic Color Shifts
- **Transition colors**: Does color grade change during shot?
- **Color temperature shift**: Warm to cool or vice versa
- **Saturation changes**: Shifting between saturated and desaturated
- **Intensity changes**: Darker to brighter or more contrasted to softer
- **Emotional progression**: How does color mirror emotional arc?

### 6. Contrast & Detail
- **Highlight detail**: Is highlight detail visible or blown-out?
- **Shadow detail**: Are shadows deep black or showing detail?
- **Midtone quality**: Crushed midtones vs. full midtone range
- **Edge contrast**: Crisp vs. soft focus transitions
- **Film grain**: Should grain be visible? How much?

### 7. Time of Day Color Signatures
- **Golden Hour** (Sunrise/Sunset):
  - Colors: Warm amber, orange, golden yellow
  - Lighting: Low angle warm directional light
  - Mood: Nostalgic, romantic, dramatic, transitional
- **Blue Hour** (Dusk/Dawn):
  - Colors: Deep blue, cyan, purple, cool white
  - Lighting: Cool directional light with artificial light
  - Mood: Mysterious, contemplative, magical, melancholic
- **High Noon**: 
  - Colors: Saturated bright colors, harsh whites
  - Lighting: Overhead bright white light
  - Mood: Energetic, explicit, intense
- **Night**:
  - Colors: Deep blues, blacks, accent colors
  - Lighting: Artificial light sources
  - Mood: Intimate, mysterious, dangerous, romantic

Format each color/mood prompt following the VIDEO_PROMPT_GENERATION_PROMPT standard.

Return ONLY the numbered color mood prompt list.
`);




