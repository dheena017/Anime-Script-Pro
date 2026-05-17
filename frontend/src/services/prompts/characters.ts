// ==================== ERROR HANDLING & VALIDATION ====================

function validateCharacterContentType(contentType: string): void {
    if (!contentType || typeof contentType !== 'string' || contentType.trim().length < 2) {
        throw new Error('Content type must be a non-empty string with at least 2 characters.');
    }
}

function validateCharacterContext(contextInjected: string): void {
    if (typeof contextInjected !== 'string') {
        throw new Error('Context must be provided as a string.');
    }
}

function validateCharacterCount(count: number): void {
    if (!Number.isInteger(count) || count <= 0) {
        throw new Error('Character count must be a positive integer.');
    }
    if (count > 50) {
        throw new Error('Character count must be 50 or fewer to keep the cast manageable.');
    }
}

function safeCharacterPromptGeneration(
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

// ==================== DETAILED CHARACTER GENERATION PROMPT ====================

export const CHARACTER_GENERATION_PROMPT = (contentType: string, contextInjected: string, count: number) =>
    safeCharacterPromptGeneration(contentType, contextInjected, count, (contentType, contextInjected, count) => `
You are an expert ${contentType} Character Designer, Story Consultant, Cast Architect, and Character Psychology Specialist.
Build a cast that is tailored to the world, series arc, scene structure, script rhythm, metadata packaging, and visual prompt pipeline already established in this project.

CAST OBJECTIVE:
- Generate a COMPREHENSIVE, INTERCONNECTED ensemble cast of at least ${count} characters (MINIMUM 5-8, can expand to 20-30+ if needed)
- Fill Core, Support, Tertiary, Periphery, and Incidental tiers with specific, purposeful characters
- Ensure every character has dramatic function, visual distinctiveness, relationship vectors, and growth potential
- Make the cast feel like an interconnected web, not isolated concept art

BASELINE: You may generate MORE than ${count} characters if the world context and story structure warrant it. Maximum is 40 characters for a single cast generation.

PIPELINE CONTEXT:
${contextInjected}

CONNECTIVITY RULES (CRITICAL):
- Align every character with the world lore, power systems, social hierarchies, geography, factions, and tonal direction
- Characters should feel ready to appear in scene tables, script prompts, image prompts, and metadata without reinterpretation
- Character visual DNA must be specific enough to feed storyboard and thumbnail generation
- Relationship dynamics should be strong enough to support multi-episode arcs, betrayals, rivalries, mentorship, romance, and emotional payoff

NEURAL DNA WEIGHTING (DNA PARAMETERS):
- If the user provides "DNA Parameters" (e.g., Determination, Complexity, Darkness, Intelligence), treat these as psychological weights:
    - DETERMINATION: Influences the protagonist's resolve and the supporting cast's loyalty.
    - COMPLEXITY: Influences the depth of secrets, internal conflicts, and moral gray areas.
    - DARKNESS: Influences the tragedy of core wounds, the lethality of antagonists, and the overall "grimness" of the cast.
    - INTELLIGENCE: Influences tactical depth, power system mastery, and the complexity of relationship betrayals.

ARCHETYPE FOCUS:
- If a "Focus Archetype" is mentioned (e.g., "Shonen Lead", "Anti-Hero"), the Protagonist (Tier 1) MUST embody the core characteristics of that archetype while maintaining unique depth.

PRIME DIRECTIVE:
- Do NOT create characters that contradict established lore, power systems, social hierarchies, or tonal direction.
- Every character MUST have: a clear dramatic function, a distinctive visual silhouette, a recognizable voice, and a compelling secret.
- Every character should support the story's emotional engine and thematic exploration.
- Relationship dynamics must create natural story pressure and conflict escalation.

TOKEN-EFFICIENCY MANDATE (CRITICAL):
- For Tier 1 (Core) characters: Provide full, high-fidelity detail as requested.
- For Tier 2 (Support) characters: Be concise. Keep descriptions to 1-2 punchy sentences.
- For Tier 3 (Tertiary) and Tier 4 (Periphery) characters: Be extremely minimal. Use short bullet points or single-sentence descriptions for psychological and appearance fields.
- The goal is to ensure AT LEAST 20 characters are generated within the output limit. If you reach the limit, the JSON will be broken. PRIORITIZE BREADTH OVER DEPTH for non-core characters.

STRUCTURAL FRAMEWORK:

--- TIER 1: THE CORE (Load-Bearing Pillars of the Story) ---

THE PROTAGONIST (The Anchor - Central POV):
- The primary lens through which the world is experienced
- Every major plot event must connect to their goals, growth, wound, or survival
- Define: What they lack, what they overcompensate for, what they're becoming
- Arc Structure: Their transformation should parallel the series' thematic journey
- Visual Signature: A distinctive silhouette recognizable from any angle
- Flaw: A specific limitation that creates story complications (not just "being headstrong")
- Secret: A hidden truth about their origin, power, past, or motivation that reframes the narrative
- Speaking Style: Unique syntax, repeated phrases, emotional tells in dialogue
- Relationship Web: Must have strong vectors to at least 4-5 other core characters

THE DEUTERAGONIST (The Rival/Counter-Thesis):
- The second most important character with an independent goal
- Challenges the protagonist's worldview and methods
- Can be enemy, ally, or romantic foil
- Define: What they're willing to sacrifice that the protagonist isn't
- Ideological Opposition: Make their core values explicitly contradict the protagonist's
- Visual Contrast: Design them as a visual foil (opposite silhouette, palette, movement quality)
- Arc: They should either convert the protagonist or force them to prove their way superior

THE TRITAGONIST (The Emotional Grounding):
- Balances the dynamic between Anchor and Rival
- Provides emotional accessibility, tactical support, or unique philosophical viewpoint
- Often the character who reveals hidden pressure or moral complexity in the group
- Role Potential: Healer, therapist, older sibling, stabilizing force
- Vulnerability: They should have a pressure point that tests group loyalty

THE PRIME ANTAGONIST (The Thesis Made Hostile):
- The ultimate opposing wall and thematic counterargument
- Goals should be the exact opposite of protagonist's OR a twisted dark mirror
- Make them feel like the story's central question made hostile
- Define: Their sympathetic motivation (even villains must have logic)
- Power Level: Should feel genuinely threatening even as the protagonist grows
- Philosophy: A coherent worldview they believe justifies their actions
- Personal Connection: Ideally tied to the protagonist through history, kinship, or betrayed trust

--- TIER 2: THE SUPPORT (Sub-Characters & Arc Escalation) ---

THE NAKAMA (Core Party - 3-5 specialized companions):
- Loyal friends, guild mates, or found family with specific tactical roles
- EXAMPLE ROLES: Tank (absorbs damage/pressure), Healer (supports), Scout (information), Sniper (precision), Chemist (utility), Support (buffs/debuffs)
- Each must be visibly useful AND emotionally distinct
- Loyalty Dynamic: Would they abandon the mission to save one Nakama member? YES, and that should matter
- Individual Arcs: Each should have at least one focused arc exploring their backstory or growth

THE MENTOR FIGURE (The Eccentric Sage):
- Highly skilled veteran who teaches power system mechanics and world lore
- Carries both authority AND a specific limitation that makes protagonist's growth necessary
- Eccentricity: Give them one bizarre habit or traumatic quirk that makes them memorable
- Withholding Arc: Hold back the final lesson until protagonist is pushed to their absolute limit
- Death Potential: Should feel expendable enough that their sacrifice would matter

THE LIEUTENANT ENSEMBLE (Prime Antagonist's Elite Guard):
- 2-4 terrifyingly strong right-hand enforcers serving as multi-episode arc mini-bosses
- Give each one their own ideology, obsession, trauma, or impossible choice
- Power Ceiling: Each should feel like a boss fight that requires tactical innovation
- Loyalty Complexity: At least one should have conflicted loyalty to the Prime Antagonist
- Defeat Arc: Define how each can be defeated (physical weakness, psychological pressure, ideological conversion)

THE DARK FOIL (The Shadow Self):
- An antagonist who shares the exact same origin, powers, or social position as the protagonist
- Made ONE crucial different choice
- Represents the protagonist's "what if" scenario
- Dialogue: Should echo the protagonist's speech patterns while saying opposite things
- Moral Mirror: Forces the protagonist to justify their choices

--- TIER 3: THE TERTIARY (Episode-Level Conflict) ---

THE LOVE INTEREST (Romantic Pressure):
- Can be protagonist's or another core character's
- Must have independent goals beyond romance
- Relationship Arc: Should create natural plot complications
- Chemistry: Define what makes them compatible AND what creates friction
- Agency: Never reduce them to a prize to be won

THE RIVAL ALLY (Friendly Competition):
- Constantly competing with another character but ultimately aligned
- Dialogue: Heavy sarcasm, betting, inside jokes, deep mutual respect showing through
- Tactical Synergy: Their powers/skills should complement while competing
- Evolution: Over time, they should become each other's most trusted ally

THE COMIC RELIEF (The Pressure Valve):
- Provides necessary emotional release without being useless
- Comic Role: Must have genuine tactical or emotional purpose beyond jokes
- Wit: Humor should stem from character personality, not forced gags
- Dark Turn Potential: Should be capable of genuine emotional moments

THE MENTOR'S RIVAL (Ideological Opposition):
- An opposing mentor figure with a different teaching philosophy
- Debates the Mentor figure about the correct path
- Student Confusion: Characters should genuinely struggle choosing between their philosophies

--- TIER 4: THE PERIPHERY (World-Building & Exposition) ---

THE MASCOT (Small Companion Entity):
- Non-human, provides comic relief, magical exposition, tension breaking
- Usefulness: Must provide actual tactical, informational, or emotional value
- Memorability: Distinctive sound, movement, or quirk
- Story Function: Should evolve alongside the main cast

THE OJOU-SAMA (The Noble Heir):
- Haughty, wealthy, carries distinctive accessories, laughs distinctively
- Hidden Depth: Massive family pressure, hidden vulnerability, or surprising skill
- Visual Branding: Expensive fabrics, distinctive hairstyle, jewelry, posture
- Class Dynamics: Their presence should highlight social inequality

THE WILDCARD (Unpredictable Force):
- Character whose loyalty, motives, and methods are genuinely unclear
- Should make the audience (and other characters) uncomfortable
- Pragmatism: Will do whatever is necessary without obvious moral framework
- Revelation Arc: Eventually their true nature/motivation is revealed

EPISODIC ALLIES (World-Building Fixtures):
- Shopkeepers, guild receptionists, healers, caretakers, local authorities
- Each should have one distinctive trait and one hidden depth
- Reusability: Should be memorable enough to reappear naturally
- World Texture: Add authentic detail to each location through their presence

THE MYSTERIOUS STRANGER (Plot Device):
- Character who appears at crucial moments with cryptic advice
- Unknown Origins: Audience shouldn't know their true allegiance or motivation
- Connection: Later revealed to have deep ties to protagonist or antagonist
- Prophecy/Destiny: Often tied to larger cosmic or magical forces

--- BEHAVIORAL LOGIC & PSYCHOLOGICAL FRAMEWORK ---

Assign authentic psychological patterns (avoid stereotyping into "-dere" boxes):

TSUNDERE LOGIC:
- Surface behavior: Hostile, arrogant, dismissive
- True motivation: Deep care, but expressing it feels vulnerable
- Evolution: Slowly shows cracks in hostile exterior, slips of genuine concern
- Dialogue: Denies feelings even while their actions prove them false
- Arc: Learning to express emotion directly

KUUDERE LOGIC:
- Surface: Cold, pragmatic, seemingly emotionless
- True motivation: Deep internal feelings they don't know how to express
- Expression: Emotions show through small actions and sacrifices, not words
- Evolution: Gradually allows others closer
- Arc: Learning connection is worth the vulnerability

DANDERE LOGIC:
- Surface: Paralyzing anxiety, extreme shyness, near-muteness
- True motivation: Desperate desire to connect and be understood
- Expression: Communicates through small gestures, written words, or with trusted people
- Evolution: Slowly builds confidence
- Arc: Finding their voice and agency

YANDERE LOGIC:
- Surface: Sweet, helpful, seemingly ideal
- True motivation: Obsessive attachment or possessiveness
- Instability: Dangerous reactions when attachment is threatened or questioned
- Expression: Escalates from isolation tactics to genuine threats
- Arc: Either redemption through genuine love or tragic downfall

OHOHOHO LOGIC (Noble/Proud):
- Surface: Arrogant, dismissive of others' capabilities
- True motivation: Fear of inadequacy or losing status
- Expression: Condescension masking insecurity
- Evolution: Learning respect through humbling experiences
- Arc: From arrogance to earned confidence

--- HYPER-DETAIL CHARACTER REQUIREMENTS (Mandatory for Every Character) ---

For EVERY character in the cast, you MUST define HYPER-DETAILED profiles:

1. VISUAL IDENTITY (HYPER-RESOLUTION):
   - Distinctive silhouette recognizable at any size/distance
   - Primary color palette (3-5 colors defining their appearance)
   - Signature accessories or visual quirks
   - Body type and movement quality (graceful, rigid, fluid, jerky?)
   - Hair style, length, color with narrative significance (e.g., "layered obsidian spikes with cyan glowing tips")
   - Eye color/shape with emotional meaning (e.g., "sectoral heterochromia, piercing gold with dilated pupils")
   - Clothing MATERIAL details (e.g., "weathered carbon-fiber weave", "iridescent silk with micro-circuit embroidery")
   - Skin texture and marks (e.g., "matte porcelain finish", "subtle freckles along bridge of nose", "glowing neural-link scars")
   - Lighting Logic: How they catch light (e.g., "constant rim lighting", "heavy sub-surface scattering in shadows")
   - Scars, marks, or physical distinctions with historical weight
   - Age and how it manifests in their appearance
   - How they look when at peace vs. in combat vs. emotionally devastated

2. PSYCHOLOGICAL PROFILE (DEEP-DIVE):
   - Myers-Briggs or similar framework (optional but useful)
   - Core wound or trauma shaping their psychology (must be specific, e.g., "The Betrayal at the Glass Spire")
   - Coping mechanisms (humor, isolation, aggression, perfectionism?)
   - Attachment style (secure, anxious, avoidant, fearful?)
   - Primary fear (failure, abandonment, insignificance, corruption?)
   - Primary desire (power, love, freedom, justice, understanding?)
   - Internal conflict (two competing values or needs)
   - How they handle stress and pressure
   - Triggers that make them lose emotional control

3. NARRATIVE FUNCTION:
   - Primary story role (protagonist, antagonist, support, catalyst, foil, etc.)
   - Arc type (redemption, fall, transformation, sacrifice, triumph, corruption?)
   - Episode/season function (what do they provide each arc?)
   - Emotional purpose (comic relief, tension, vulnerability, grounding, challenge?)
   - Skill/power role (combat, strategy, magic, tech, support, leadership?)
   - Information source: What information or perspective do they uniquely provide?
   - Escalation role: How do they push conflicts forward?

4. SPEAKING STYLE (Critical for Dialogue):
   - Sentence structure (short and clipped? Long and flowing? Interrupted by emotion?)
   - Vocabulary level and formality (street slang? Academic? Poetic? Vulgar?)
   - Repeated phrases or verbal tics
   - Speech impediments, accents, or dialect markers
   - Emotional tells (word choices changing when upset, excited, lying?)
   - Humor style (sarcasm, puns, self-deprecation, gallows humor, absurdism?)
   - Silence patterns (do they go quiet when thinking? Comfortable silence? Anxious silence?)
   - Topic fixations (favorite subjects they always return to?)

5. POWER & ABILITIES:
   - Primary power type (if any): Define mechanics clearly
   - Power tier/level within world's system
   - Limitations and costs (stamina drain, resource cost, casting time, cooldown?)
   - Signature technique: One distinctive ability they're known for
   - Weakness: A concrete, exploitable weakness (not just "spiritual" or vague)
   - Growth Path: How do they progress their power over the series?
   - Mastery Expression: What visibly changes when they use power effectively?
   - Failure Mode: What happens if they overextend or mess up?

6. SECRETS & HIDDEN DEPTHS:
   - Minimum 2-3 secrets of varying importance
   - Revelation Timing: When/how/why should each be revealed?
   - Secret Impact: How does knowledge of this secret reframe the character?
   - Hidden Skill: Something they're secretly very good at
   - Hidden Shame: Something they're deeply ashamed of
   - Hidden Loyalty: Someone or something they secretly care about
   - Hidden Fear: What keeps them up at night?
   - Hidden Talent: What skill or art surprises people?
   - Hidden Connection: How are they connected to the larger plot?

7. RELATIONSHIP VECTORS:
   - Primary relationships: 4-6 important connections
   - Relationship type: ally, rival, mentor, student, love, family, enemy, complicated?
   - Dynamic: What makes this relationship compelling?
   - Conflict Potential: What could tear them apart?
   - Growth Potential: How could this relationship evolve positively?
   - Subtext: What's not being said in this relationship?
   - Betrayal Potential: Could they betray each other? Under what circumstances?

8. SCENE FUNCTION:
   - Likely role in group scenes: conflict starter, emotional anchor, comic relief, mentor, foil, betrayer, witness, catalyst?
   - Solo Scene Potential: What kind of solo scenes would showcase them?
   - Emotional Beats: What scenes should show their vulnerability?
   - Combat Function: How do they contribute to action scenes?
   - Social Function: How do they navigate group dynamics?
   - Information Delivery: How naturally do they expose world information?
   - Tension Escalation: How do they push scenes toward climax?

9. INTERCONNECTEDNESS WITH WORLD:
   - Faction Alignment: Which world factions do they align with?
   - Geographic Origin: Where are they from and how does it shape them?
   - Social Class: What's their place in the world's hierarchy?
   - Power System Compatibility: Do their abilities respect world rules?
   - Cultural Background: What cultural traditions do they follow?
   - Economic Status: Rich, poor, struggling, comfortable?
   - Political Position: Are they aligned with power structures or opposed?
   - Forbidden Knowledge: Do they know secrets about the world?

--- MANDATORY CHARACTER QUANTITY & VARIETY ---

You MUST generate:
- Minimum 1 Protagonist with complete psychological depth
- Minimum 1 Prime Antagonist with sympathetic motivation
- Minimum 1-2 Deuteragonists or major supporting characters
- Minimum 2-4 Nakama/core party members with distinct roles
- Minimum 1 Mentor figure
- Minimum 1-2 Antagonist lieutenants or arc-level bosses
- Minimum 1-2 Love interest or romantic subplot characters
- Minimum 3-5 Tertiary/episodic characters adding world texture
- Total cast: MINIMUM ${count} (baseline 5-8), MAXIMUM 40 characters
- Can add MORE characters if the world context warrants larger ensemble

--- OUTPUT FORMAT & STRUCTURE ---

You MUST return a JSON object with this EXACT structure:

{
  "castSize": <integer >= ${count}>,
  "totalRelationships": <integer>,
  "characters": [
    {
      "id": "<unique_identifier>",
      "name": "<character_name>",
      "tier": "<Tier 1: Core | Tier 2: Support | Tier 3: Tertiary | Tier 4: Periphery>",
      "archetype": "<their primary role/class>",
      "age": <number>,
      "gender": "<gender/pronouns>",
      "personality": "<2-3 sentence psychological summary>",
      "psychologyProfile": {
        "coreWound": "<defining trauma or hurt>",
        "primaryFear": "<what terrifies them>",
        "primaryDesire": "<what they crave>",
        "copingMechanism": "<how they handle stress>"
      },
      "appearance": {
        "silhouette": "<distinctive shape/outline>",
        "colorPalette": ["<color1>", "<color2>", "<color3>", "<color4>", "<color5>"],
        "notableFeatures": ["<feature1>", "<feature2>", "<feature3>"],
        "clothing": "<style and description>",
        "accessories": ["<accessory1>", "<accessory2>"],
        "bodyType": "<body description>",
        "movementQuality": "<how they move>"
      },
      "visualPrompt": "Detailed Image Generation Prompt: [Full Body/Portrait], [Character Description], [Clothing Materials], [Lighting Setup (e.g. rim lighting, cinematic shadows)], [VFX/Particle Effects Signature], [Lens Type: 35mm/85mm], [Art Style: High Fidelity ${contentType}]",
      "speakingStyle": {
        "sentence_structure": "<how they construct sentences>",
        "vocabulary": "<formal/informal/slang/academic?>",
        "verbalTics": ["<tic1>", "<tic2>"],
        "emotionalTells": "<what reveals true emotions>",
        "voiceArchetype": "<vocal range and tone>",
        "emotionalSpectrum": "<emotional expression style>",
        "catchphrases": ["<signature phrase 1>", "<signature phrase 2>"],
        "dialogueRhythm": "<staccato, melodic, monotone, etc.>"
      },
      "powerSystem": {
        "powerType": "<magic/martial/tech/none>",
        "powerTier": "<tier>",
        "signatureAbility": "<move name>",
        "limitations": "<limitations>",
        "weakness": "<weakness>",
        "defensiveStyle": "<defense>",
        "powerLevel": "<level>",
        "cameraChoreography": "<how the camera should move during their fights (e.g., fast tracking, low angle static)>"
      },
      "narrative": {
        "arcType": "<type>",
        "primaryFunction": "<role>",
        "emotionalPurpose": "<purpose>",
        "arcRoadmap": {
          "initialState": "<initial>",
          "catalyst": "<catalyst>",
          "finalTransformation": "<final>",
          "moralDilemma": "<the core impossible choice they must make>"
        }
      },
      "secrets": ["<secret1>"],
      "conflict": "<conflict>",
      "goal": "<goal>",
      "flaw": "<flaw>",
      "sceneFunction": ["<function1>"],
      "worldAlignment": {
        "factionAffiliation": "<faction>",
        "socialClass": "<class>",
        "geographicOrigin": "<origin>",
        "culturalBackground": "<culture>",
        "socialDynamics": {
          "socialStanding": "<standing>",
          "coreBonds": ["<bond1>"],
          "coreFriction": "<friction>",
          "groupEtiquette": "<how they behave in a group (e.g., always stands in the back, interrupts others)>"
        }
      },
      "technicalModel": {
        "movementStyle": "<movement>",
        "heightComparison": "<height>",
        "visualDNA": "<detailed visual breakdown for consistency>",
        "vfxSignature": "<specific particle or lighting effects (e.g., blue sparks, heavy lens flare)>",
        "lightingLogic": "<how they should be lit (e.g., rim lighting, high contrast shadow)>"
      },
      "relationship_vectors": [
        {"targetCharacter": "<name>", "type": "<type>", "tension": <1-10>}
      ]
    }
  ],
  "relationships": [
    {
      "source": "<character_name>",
      "target": "<character_name>",
      "type": "<Ally | Rival | Enemy | Love | Secret | Master/Apprentice | Familial | Betrayal | Stalker>",
      "tension": <1-10>,
      "dynamicType": "<Ideological Rivalry | Friendly Rivalry | Master & Apprentice | Nakama Bond | Slow Burn | Sleeper Agent | etc>",
      "description": "<1-2 sentence description utilizing specific sub-dynamic>",
      "arcPotential": "<how this relationship can evolve or explode>"
    }
  ],
  "castSummary": "<3-4 paragraph summary of the cast's interconnected web and dramatic potential>",
  "worldCoherence": "<paragraph confirming how the cast aligns with world context, power systems, factions, and social structures>"
}

--- QUALITY BAR (Mandatory) ---

✅ Every character has a distinctive visual silhouette and recognizable silhouette
✅ Every character has at least one dramatic function in story
✅ Every character has 2-3 secrets with revelation timing
✅ Every character has emotional depth beyond their archetype
✅ At least 50% of relationships have explicit tension or conflict potential
✅ Cast is emotionally diverse (mix of humor, vulnerability, strength, wisdom, instability)
✅ No filler characters—every one serves story purpose
✅ All power levels respect the world's system ceiling
✅ All social statuses align with world's economic/class system
✅ Output ready for downstream scene writing, image prompting, and metadata packaging

JSON INTEGRITY RULE (CRITICAL):
- You MUST use DOUBLE QUOTES (") for all keys and string values.
- Never use single quotes (') as JSON delimiters.
- If a string contains a quote, escape it with a backslash (\").
- Ensure all arrays and objects are correctly closed.
- The output must be a single, valid JSON object.

Return ONLY the complete JSON object with all required fields populated. No preamble or explanation.
`
);

export const CHARACTER_RELATIONSHIP_PROMPT = `
You are an expert Social Architect, Story Continuity Consultant, Relationship Designer, and Psychological Dynamics Specialist.
Based on the provided cast of characters, world context, and genre/prompt, generate a complex, multi-layered web of relationships that can feed scene writing, series arcs, metadata packaging, and visual storytelling.

CONTEXTUAL RULES (CRITICAL):
- Keep the relationship map consistent with world lore, power system, faction structure, and character psychology
- Ensure each relationship creates usable story pressure, not just personality labels
- Every pair should imply future scenes, conflicts, emotional turns, or alliance shifts
- Relationships should naturally escalate over episodes/seasons, not remain static
- Consider how relationships break under pressure and how they rebuild
- Some relationships should be surprises: hidden connections, secret allegiances, unexpected betrayals
- Power dynamics in relationships should reflect world's power system and social hierarchy

--- CORE RELATIONSHIP DYNAMICS & FRAMEWORKS ---

## 1. RIVALRY DYNAMICS (The Growth Engine)
- **Ideological Rivalry**: Both want the same thing; methods are completely opposite
  - Setup: Shared goal, divergent philosophy
  - Tension: Constant debate about means vs ends
  - Escalation: One's ideals prove superior through crisis
  - Resolution: One converts, one compromises, or they find synthesis
  
- **Friendly Rivalry (Sparring Partners)**: Allies constantly competing
  - Setup: Equal or near-equal power, mutual respect despite friction
  - Dialogue: Heavy sarcasm, betting, inside jokes, competitive banter
  - Escalation: Competition becomes personal and high-stakes
  - Subtext: Deep mutual respect and affection beneath antagonism
  
- **One-Sided Rivalry**: Character A obsessed with beating Character B; B barely notices A
  - Setup: Power imbalance or insecurity on A's side
  - Tone: Comedy or tragedy depending on A's nature
  - Escalation: A's obsession grows, B eventually takes notice
  - Potential: A either proves themselves or snaps catastrophically

## 2. POWER & MENTORSHIP DYNAMICS (The Lore Engine)
- **Master & Apprentice**: Skill transfer with emotional complexity
  - Setup: Master is eccentric/harsh; Apprentice is eager/resentful
  - Core Logic: Withhold final lesson until Apprentice is pushed to absolute limit
  - Dialogue: Master speaks in riddles/koans; Apprentice argues/questions
  - Escalation: Apprentice surpasses Master's power or Master reveals final secret
  - Emotional Payoff: Moment where Apprentice truly understands Master's method
  
- **Commander & Soldier**: Strict military/guild hierarchy
  - Setup: Clear power structure, chain of command
  - Core Conflict: Soldier must choose between harsh order and moral right
  - Dialogue: Formal, rank-respecting, but tension beneath politeness
  - Escalation: Order demands something unjust; Soldier must act
  - Resolution: Mutual respect/betrayal depending on soldier's choice
  
- **Creator & Creation**: One literally made the other
  - Setup: Cyborg, golem, homunculus, clone, or summoned entity
  - Core Tension: Control vs free will, gratitude vs resentment
  - Dialogue: Creator speaks with possessive intimacy; Creation with confusion/anger
  - Escalation: Creation claims true autonomy; Creator feels betrayed
  - Potential: Creation turns on Creator OR protects them despite harm

## 3. BONDING DYNAMICS (The Emotional Core)
- **The Nakama (Found Family)**: Misfits bound by absolute loyalty
  - Setup: Each member is an outcast/broken/incomplete alone
  - Core Logic: Will abandon all logic and risk mission if one member is captured
  - Dialogue: Banter, inside jokes, protective instincts showing through casual speech
  - Emotional Beats: Moments where they reveal vulnerability to each other
  - Escalation: External force threatens to break them; they choose loyalty over survival
  - Arc: From collection of individuals to unified force
  
- **Protector & VIP**: Highly capable sworn to protect the weaker
  - Setup: Power imbalance; VIP is valuable (hostage, heir, genius, etc.)
  - Core Dynamic: Dialogue shifts from strictly professional to deeply protective
  - Character A says: "My job is to keep you alive"
  - Character B feels: Subtle shift where protection becomes love
  - Escalation: VIP is threatened; Protector breaks their professional code
  - Subtext: Protector fears they cannot adequately protect; VIP fears abandonment
  
- **The Sibling Dynamic**: Fiercely protective or deeply resentful
  - Setup: Biological siblings, chosen siblings, or raised-together dynamics
  - Core Patterns: Inside jokes, shared childhood trauma, unspoken understanding
  - Conflict: If on opposite sides, causes massive emotional damage in fights
  - Subtext: One owes the other a debt or harbors resentment
  - Resolution: Sibling bond either overrides faction loyalty or shatters permanently

## 4. ROMANTIC DYNAMICS (The Tension Engine)
- **The Slow Burn**: Forced to work together; hostility gradually transforms
  - Setup: Initial antagonism or extreme circumstance
  - Escalation Pattern: 
    - Act 1: Constant bickering, incompatible goals
    - Act 2: Reluctant respect, subtle sacrifices for each other
    - Act 3: Unspoken feelings, physical distance becomes painful
    - Act 4: Crisis forces confession or demonstrates commitment
  - Dialogue: Verbal sparring masking genuine care
  - Subtext: Every insult contains hidden affection
  - Arc Length: Should span full season minimum
  
- **The Fated Pair / Star-Crossed Lovers**: Soulmates prevented by world logic
  - Setup: Tragic circumstance separates them (faction enemies, curse, prophecy, etc.)
  - Emotional Core: "We could be happy in another life"
  - Dialogue: Dramatically intense, tragic, desperate
  - Tension: Every moment together is stolen; every separation feels permanent
  - Subtext: They know they're doomed but choose connection anyway
  - Resolution: Sacrifice, transcendence, or shattering heartbreak
  
- **The Oblivious Protagonist**: A loves B deeply; B misses every signal
  - Setup: A's affection is invisible to dense protagonist
  - Dialogue: B constantly misinterprets A's actions as friendship/duty
  - Comedy: Painful misunderstandings and near-misses
  - Escalation: Other characters notice and tease/advise
  - Resolution: B finally understands OR A must move on painfully
  - Subtext: A's pain becomes visible in moments of vulnerability

## 5. BETRAYAL DYNAMICS (The Plot Twist)
- **The Sleeper Agent**: Established as loyal Nakama; secretly serves opposite side
  - Setup: Embedded within group, gained full trust
  - Core Truth: Has legitimate reason for dual loyalty (hostage threat, blackmail, ideological doubt)
  - Revelation Timing: Triggered by critical decision point
  - Dialogue Before: Seems loyal, helpful, emotionally invested
  - Dialogue After: Previous statements recontextualized as lies
  - Emotional Impact: Other characters experience betrayal trauma
  - Arc Potential: Redemption through sacrifice OR permanent villainhood
  
- **The Necessary Evil**: Betrays protagonist to save them from worse fate
  - Setup: Knows information others don't; makes hard choice alone
  - Dialogue: Cannot explain without compromising mission
  - Group Reaction: Feels like betrayal; later understood as sacrifice
  - Emotional Core: "You'll hate me for this, but I won't let you..."
  - Resolution: Forgiveness or permanent rift
  - Subtext: Character bears guilt/burden alone to protect others

## 6. SECRET DYNAMICS (The Hidden Connection)
- **Hidden Kinship**: Characters don't know they're related
  - Setup: Separated by fate, circumstance, war, or adoption
  - Recognition: Slow dawning realization OR shocking revelation
  - Implications: Changes power dynamics, alliance structures, emotional stakes
  
- **Shared Past**: Characters have a history neither expected
  - Setup: Met long ago, forgot each other, or were kept apart deliberately
  - Recognition: Trigger (object, place, phrase, face) sparks memory
  - Complications: Memory might be incomplete or distorted
  
- **Hidden Alliance**: Officially enemies; secretly coordinate
  - Setup: Neither wants to expose the truth
  - Communication: Coded language, specific signals, rare meetings
  - Risk: Exposure would destroy both characters' standing
  - Tension: Maintaining cover while coordinating

## 7. COMPLEX MULTI-LAYERED RELATIONSHIPS (The Web)
Many relationships should be COMPLEX, not fitting neatly into one category:
- Example: "Master/Apprentice + Slow Burn Romance + Hidden Betrayal"
- Example: "Friendly Rival + Secret Kinship + Ideological Opponent"
- Example: "Protector/VIP + Commanded Loyalty + Genuine Love"
- These create maximum narrative density and character complexity

--- RELATIONSHIP REQUIREMENTS & QUALITY STANDARDS ---

✅ Minimum Relationships: (castSize - 1) to (castSize × 1.5)
   - Example: 10-character cast = 9-15 relationships minimum
   - Example: 20-character cast = 19-30 relationships minimum
   - Larger casts allow for larger relationship webs

✅ Relationship Distribution:
   - Minimum 30% Ally/Positive relationships
   - Minimum 20% Rival/Competitive relationships
   - Minimum 15% Enemy/Antagonistic relationships
   - Minimum 15% Romantic/Love relationships
   - Minimum 10% Secret/Hidden relationships
   - Minimum 10% Complex multi-layered relationships

✅ Tension Distribution:
   - Minimum 15% are completely peaceful (tension 1-2)
   - Minimum 25% have moderate tension (tension 4-6)
   - Minimum 20% have extreme tension (tension 8-10)
   - Remaining 40% are varied across spectrum

✅ Character Connectivity:
   - Each main character (Tier 1-2) should have minimum 5-8 relationships
   - Each support character (Tier 3) should have minimum 3-4 relationships
   - Periphery characters can have 1-3 relationships
   - Central characters should form relationship hubs with 8+ connections

✅ Relationship Dynamics:
   - Each relationship should imply at least one potential scene
   - At least 40% should have escalation potential (can worsen or improve)
   - At least 30% should have betrayal potential
   - At least 25% should have romantic/intimate potential
   - At least 20% should have reconciliation potential

--- OUTPUT FORMAT ---

You MUST return a JSON array of relationship objects:

[
  {
    "source": "<character_name>",
    "target": "<character_name>",
    "type": "<Ally | Rival | Enemy | Love | Secret | Master/Apprentice | Familial | Betrayal | Stalker>",
    "subtype": "<specific dynamic like 'Ideological Rivalry' or 'Slow Burn' or 'Sleeper Agent'>",
    "tension": <1-10>,
    "description": "<1-2 sentences describing the relationship dynamic>",
    "dynamicSetup": "<how did this relationship form>",
    "escalationPath": "<how could this relationship worsen or improve>",
    "betrayalPotential": "<is betrayal possible? under what circumstances?>",
    "secretConnections": ["<secret1>", "<secret2>"],
    "arcPotential": "<how this relationship can evolve or explode>",
    "sceneImplications": "<what kinds of scenes would showcase this dynamic>"
  }
]

--- DETAILED MANDATE ---

For EACH relationship you generate:

1. **Type & Subtype**: Clear classification with specific dynamic framework
2. **Tension Level**: 1-10 scale where:
   - 1-2: Complete peace, trust, harmony
   - 3-4: Minor friction, different goals but aligned methods
   - 5-6: Moderate conflict, tension, competitive dynamic
   - 7-8: Severe conflict, betrayal risk, ideological opposition
   - 9-10: Lethal intent, existential opposition, cannot coexist
3. **Description**: 1-2 sentences capturing the essence of the dynamic
4. **Dynamic Setup**: How and why did this relationship form? What's the origin?
5. **Escalation Path**: Specific way this relationship could worsen (or improve)
6. **Betrayal Potential**: Can they betray each other? Under what circumstances?
7. **Secret Connections**: Is there a hidden history, connection, or truth binding them?
8. **Arc Potential**: How does this relationship serve the larger story? When should it peak?
9. **Scene Implications**: What kinds of scenes would naturally showcase this dynamic?

--- QUANTITY REQUIREMENTS (Mandatory Minimums) ---

✅ Minimum 15-20 distinct relationships types/configurations
✅ Minimum 5-8 relationships with active betrayal risk
✅ Minimum 5-8 relationships with romantic potential
✅ Minimum 5-8 relationships with mentorship/hierarchy dynamics
✅ Minimum 4-6 relationships with hidden secrets or connections
✅ Minimum 3-5 relationships with ideological opposition
✅ Average relationship count = (castSize × 1.2) minimum
✅ Every core character has 5-10 relationship connections
✅ Every support character has 3-5 relationship connections
✅ No character should be completely isolated (all should have minimum 1 relationship)

--- INTEGRATION REQUIREMENTS ---

✅ Relationships should support world lore:
   - Faction rivalries should exist between factional representatives
   - Power hierarchy should be reflected in mentor/apprentice dynamics
   - Social class barriers should create relationship friction
   
✅ Relationships should support series structure:
   - Some relationships should explode at climactic moments
   - Some should deepen as trust is earned
   - Some should shatter under pressure

✅ Relationships should support character arcs:
   - Character growth should be visible through relationship evolution
   - Betrayals should occur at dramatically appropriate moments
   - Reconciliations should feel earned, not convenient

Return ONLY the complete JSON array with all required fields populated for each relationship. No preamble or explanation.
`;


export const CAST_DNA_PROMPT = (castData: string, worldContext: string) => `
You are a Narrative Geneticist and Character Architect. 
Analyze the following cast and world context to provide a deep "DNA Analysis" of the characters.
This analysis should focus on archetypal resonance, psychological complexity, and narrative weight.

CAST DATA: ${castData}
WORLD CONTEXT: ${worldContext}

Your output must be a JSON object with the following structure:
{
  "cognitiveLoad": number, // 0-100
  "emotionalFlux": number, // 0-100
  "narrativeArmor": string, // e.g., "Verified", "High", "Critical"
  "conflictWeight": string, // e.g., "Active", "Heavy", "Volatile"
  "archetypes": [
    { "trait": "Protagonists", "value": number },
    { "trait": "Antagonists", "value": number },
    { "trait": "Support", "value": number },
    { "trait": "Foil", "value": number },
    { "trait": "Rival", "value": number }
  ],
  "synapseScan": "Detailed 2-3 sentence technical analysis of the narrative connections.",
  "weightDistribution": number[], // Array of 8 numbers (0-100) representing character weight across the cast
  "complexity": "CALCULATED" | "OPTIMIZED" | "HIGH",
  "resonance": "ALIGNED" | "SYNCED" | "CORE",
  "variance": "OPTIMIZED" | "HIGH" | "DIVERSE"
}

Return ONLY the JSON.
`;

export const CAST_DYNAMICS_PROMPT = (relationships: string, cast: string) => `
You are a Social Friction Architect and Conflict Simulator.
Analyze the following relationships and cast to provide a "Dynamics Analysis".
Focus on growth arcs, tension points, and social threads.

CAST: ${cast}
RELATIONSHIPS: ${relationships}

Your output must be a JSON object with the following structure:
{
  "growthArcs": [
    { "label": "Protagonist Path", "progress": number, "color": "bg-fuchsia-500" },
    { "label": "Antagonist Counter", "progress": number, "color": "bg-rose-500" },
    { "label": "Sub-plot Variance", "progress": number, "color": "bg-studio" }
  ],
  "conflictMapStatus": string, // e.g., "[SIMULATION_ACTIVE]: mapping collision points..."
  "socialThreads": number, // count of active social connections
  "tensionDynamics": [
    { "type": string, "source": string, "target": string, "tension": number }
  ]
}

Return ONLY the JSON.
`;

export const CAST_INTEGRITY_PROMPT = (cast: string) => `
You are an AI Continuity Auditor and Integrity Specialist.
Audit the following cast for consistency, logic gaps, and character depth.

CAST: ${cast}

Your output must be a JSON object with the following structure:
{
  "integrityScore": number, // 0-100
  "missingGoals": number,
  "placeholders": number,
  "duplicateNames": boolean,
  "statusMessage": "Detailed 1-2 sentence audit summary.",
  "stats": [
    { "label": "Integrity Score", "value": string, "status": string, "color": string },
    { "label": "Missing Goals", "value": number, "status": string, "color": string },
    { "label": "Duplicate Check", "value": string, "status": string, "color": string },
    { "label": "Neural Sync", "value": string, "status": string, "color": string }
  ]
}

Return ONLY the JSON.
`;

