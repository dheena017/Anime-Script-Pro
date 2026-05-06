/**
 * Comprehensive World Building & Lore Generation Prompts
 * Specialized AI prompts for creating cohesive anime/manga worlds
 * 
 * Features:
 * - Error handling and input validation
 * - Multiple world-building prompt types
 * - Detailed specifications for different genres
 * - Lore consistency frameworks
 * - Visual and sensory design guidance
 * - Character-world interaction frameworks
 */

// ==================== ERROR HANDLING & VALIDATION ====================

/**
 * Validates content type input
 * @param contentType - The type of content (anime, manga, game, novel, etc.)
 * @throws {Error} If content type is invalid
 */
function validateContentType(contentType: string): void {
  if (!contentType) {
    throw new Error('Content type cannot be empty. Please specify: anime, manga, game, novel, etc.');
  }
  if (typeof contentType !== 'string') {
    throw new Error('Content type must be a string.');
  }
  if (contentType.trim().length < 2) {
    throw new Error('Content type must be at least 2 characters long.');
  }
}

/**
 * Validates world prompt specifications
 * @param worldConcept - The core world concept
 * @param powerSystem - The world's power system type
 * @throws {Error} If specifications are invalid
 */
function validateWorldSpec(worldConcept: string, powerSystem: string): void {
  if (!worldConcept || !powerSystem) {
    throw new Error('Both world concept and power system are required for world generation.');
  }
  if (worldConcept.trim().length < 20) {
    throw new Error('World concept must be at least 20 characters for meaningful generation.');
  }
  if (powerSystem.trim().length < 5) {
    throw new Error('Power system description must be at least 5 characters.');
  }
}

/**
 * Safely wraps prompt generation with comprehensive error handling
 * @param input - The input parameter
 * @param validator - Validation function
 * @param promptGenerator - Function that generates the prompt
 * @returns The generated prompt or error message
 */
function safePromptGeneration(
  input: string | { worldConcept: string; powerSystem: string },
  validator: (input: any) => void,
  promptGenerator: (input: any) => string
): string {
  try {
    validator(input);
    return promptGenerator(input);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Prompt generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate world prompt: ${errorMessage}`);
  }
}

// ==================== CORE WORLD GENERATION PROMPTS ====================

/**
 * Generates a comprehensive world building prompt
 * @param contentType - The type of content (anime, manga, etc.)
 * @returns Detailed prompt for AI world generation
 */
export const WORLD_GENERATION_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => `
You are an expert ${type.trim()} World Builder, Lore Architect, and Creative Director.

TASK: Design a Comprehensive & Cohesive World Setting for a ${type.trim()} Series.

DETAILED INSTRUCTIONS:

## 1. World Foundation
- **World Name & High Concept**: 
  - Memorable, culturally resonant world name
  - Elevator pitch (2-3 sentences capturing world essence)
  - Target audience tone (dark fantasy, light-hearted adventure, philosophical sci-fi, etc.)
  - Unique selling point: What makes this world different from existing ${type} worlds?
  - Core emotional promise: What feeling should the world consistently evoke?
  - Narrative scale: intimate, regional, continental, planetary, cosmic, or multiversal?
  - Reader entry point: what should a new audience understand within the first minute?

## 2. Power System & Combat Logic (CRITICAL)
- **Core Power Type**: 
  - Magic system: Schools of magic, mana mechanics, spell limitations
  - Martial arts: Combat philosophy, technique tiers, mastery progression
  - Spiritual energy (Chi, Aura, Soul): Energy cultivation, forms, awakening stages
  - Technology: Tech level (Medieval-tech hybrid, Cyberpunk, Post-apocalyptic), limitations
  - Hybrid systems: How multiple power types coexist and interact
- **Power Rules & Limitations**:
  - Maximum power ceiling: What prevents overpowered characters?
  - Energy cost mechanics: Physical/mental toll, resource management
  - Power scaling progression: How do characters grow stronger? (Linear, exponential, plateaus?)
  - Forbidden techniques: Dangerous abilities with consequences
  - Power tier system: Novice, Intermediate, Advanced, Master, Legendary classifications
- **Combat Logic**:
  - Combat pacing: Fast-paced action or tactical strategy?
  - Ability effectiveness: How do different powers interact and counter each other?
  - Warrior archetypes: Define 3-5 distinct combat styles and their strengths/weaknesses
  - Combat environment impact: How do locations affect power usage?
  - Mastery expression: what visibly changes when a user gets stronger?
  - Risk visibility: how does the audience know power use is dangerous?
  - Recovery cadence: how long until a fighter can realistically act again?

## 3. The Ultimate Ambition (Main Goal/Driving Force)
- **Primary Objective**: What are characters striving to achieve?
  - Save the world / Prevent apocalypse
  - Obtain legendary artifact / Ultimate power
  - Restore balance / Maintain status quo
  - Achieve enlightenment / Transcendence
  - Overcome external threat / Conquer territory
- **Secondary Goals**: Competing objectives creating moral complexity
- **Cosmic Stakes**: How high do the consequences go? (Personal, Regional, Global, Universal?)
- **Time Pressure**: Is there an deadline that creates urgency?
  - Failure state: what happens if the objective is never achieved?
  - Moral price: what must be sacrificed to win?
  - Personal stake: how does the ambition affect a single character’s identity?

## 4. Visual Architecture & Aesthetic Design
- **Camera & Cinematography Style**:
  - Dominant perspective: Wide establishing shots, intimate close-ups, dramatic angles?
  - Motion style: Static philosophical scenes, dynamic action, rapid cuts, slow-motion drama?
  - Visual transitions: Cut, fade, dissolve, or unique transition style?
- **Color Palette**:
  - Dominant colors: Primary 3-5 colors defining world aesthetics
  - Color psychology: What emotions do these colors evoke?
  - Color by region/faction: Different areas have distinct color schemes
  - Color for power/magic: How does magic/power appear visually?
- **Lighting Mood**:
  - Ambient light: Naturalistic, stylized, high-contrast noir, soft-focus romance?
  - Lighting sources: Sun, bioluminescence, magical light, artificial light?
  - Time of day: Is world predominantly day or night? Eternal twilight?
  - Seasonal variation: Dramatic seasonal visual changes?
- **Visual Motifs & Symbols**:
  - Recurring shapes: Geometry repeating across architecture, clothing, nature
  - Symbolic elements: Water (flow, time), fire (passion, destruction), stone (permanence)
  - Aesthetic signatures: What makes this world instantly recognizable?
  - Material language: metal, glass, cloth, bone, stone, wood, hologram, ash, or crystal?
  - Surface behavior: reflective, matte, wet, dusty, cracked, luminous, or weathered?
  - Motion identity: what does the world look like when it is calm versus under threat?

## 5. Physical Geography & Climate
- **Terrain Variety**:
  - Primary biomes: Mountains, deserts, forests, oceans, urban centers, subterranean
  - Biome interactions: How do different regions connect? Trade routes? Natural barriers?
  - Notable landmarks: Unique locations of story significance
  - Environmental hazards: Dangerous areas (storm zones, magical wastelands, dimensional rifts)
- **Climate System**:
  - Temperature zones: Tropical, temperate, arctic, variable by season
  - Weather patterns: Severe storms, magical weather, seasonal extremes
  - Climate impact on inhabitants: How do people adapt to environment?
- **Geographic Challenges**:
  - Travel difficulty: How isolated is the world?
  - Natural resources: What's abundant? What's scarce?
  - Environmental threats: Earthquakes, tsunamis, magical anomalies?
  - Transit logic: how do people, goods, or armies move between regions?
  - Isolation pockets: where does the world feel unreachable or forbidden?
  - Environmental storytelling: what does geography reveal about history and politics?

## 6. Social Structure & Political Systems
- **Social Hierarchy**:
  - Tier system: How many social classes? Mobility between tiers?
  - Power distribution: Monarchy, oligarchy, democracy, meritocracy, theocracy?
  - Social roles: Distinct professions and their status
  - Gender/race dynamics: Are there systemic hierarchies based on characteristics?
- **Ruling Factions**:
  - Primary factions (3-5): Name, philosophy, leadership, resources, territory
  - Faction conflicts: What separates them? Can they coexist?
  - Minor factions: Smaller groups with unique perspectives
  - Underground/forbidden groups: Resistance, cults, criminal organizations
- **Social Laws & Codes**:
  - Legal system: How are crimes punished? Is justice fair or arbitrary?
  - Forbidden acts: What's absolutely prohibited? Why?
  - Sacred customs: Important rituals and traditions
  - Ethical frameworks: What's considered honorable vs. shameful?
- **Economic System**:
  - Currency: Physical money, magical exchange, barter?
  - Trade goods: What's valuable and why?
  - Wealth distribution: Are resources equally distributed?
  - Economic disparities: Class wealth gaps and their consequences
  - Social rituals: what public behaviors reinforce the order?
  - Education/training: how do people learn the world’s rules?
  - Surveillance/control: how is obedience enforced or resisted?
  - Administrative layers: how is the world governed day to day?
  - Law enforcement style: what do authorities look like in practice?
  - Civil resistance: what does organized opposition look like?
  - Public ceremonies: what events reaffirm loyalty or social order?

## 7. The Core Conflict (Story Tension)
- **Fundamental Friction**:
  - Primary conflict: What's the central contradiction driving the story?
  - Ideological clash: Differing worldviews causing tension
  - Resource conflict: Competing for limited resources
  - Power struggle: Who deserves authority?
  - Existential threat: External danger uniting or dividing factions
- **Conflict Layers**:
  - Interpersonal: Character relationships and rivalries
  - Factional: Groups struggling for dominance
  - Ideological: Philosophy and belief system clashes
  - Environmental: Nature vs. civilization, resource depletion
- **Conflict Resolution Paths**:
  - Victory: How might one side definitively win?
  - Compromise: Can factions find middle ground?
  - Sacrifice: What might be lost in resolution?
  - Transformation: How might the world change?
  - Hidden contradiction: what truth makes the conflict impossible to ignore?
  - Escalation ladder: how does the conflict worsen over time?
  - Peace cost: what does temporary peace require?
  - Breaking point: what event forces every side to act?
  - End-state vision: what does a changed world actually look like?

## 8. Chronicle of Eras (Historical Timeline)
- **Genesis Era**: 
  - World creation: Was it natural, divine, magical accident?
  - First inhabitants: How did civilization begin?
  - Founding myths: Creation stories and legendary events
  - Power origin: How did magic/power systems emerge?
- **The Great Shift Era**:
  - Major catastrophe/transformation: What changed the world fundamentally?
  - Power redistribution: How did power dynamics shift?
  - Societal upheaval: What was lost and gained?
  - Duration: Was shift sudden or gradual?
- **The Current State**:
  - Timeline: How long ago was the Great Shift? How stable is current state?
  - Remnants: What artifacts or ruins from past eras remain?
  - Lingering consequences: How does the past affect present?
  - Momentum: Is the world moving toward another shift?
  - Historical bias: which era is idealized, censored, or feared?
  - Public memory: what does ordinary society believe happened?
  - Truth layer: what actually happened versus the myth?
  - Recovery phase: what rebuilt society after the major shift?
  - Memory suppression: what truths were deliberately erased?

## 9. Flora & Fauna / Signature Technology
- **Unique Creatures**:
  - Dominant species (besides humans): Intelligence level, role in ecosystem
  - Magical creatures: Do they exist? Rare or common?
  - Apex predators: What's dangerous? How do people protect themselves?
  - Companion creatures: Species bonding with humans (mounts, familiars, etc.)
  - Extinct/legendary creatures: Lost species affecting lore and quests
- **Plant Life**:
  - Signature flora: Visually distinct plants defining the world
  - Magical plants: Do plants have properties beyond normal?
  - Agricultural crops: What do people eat? How is food grown?
  - Rare/valuable plants: What's hunted for alchemical/magical properties?
- **Signature Technology/Tools**:
  - Tech level: Medieval, Renaissance, Industrial, Modern, Futuristic?
  - Crafting systems: How are weapons/armor made?
  - Iconic items: Signature technology defining the world
  - Tech limitations: Why hasn't technology advanced further?
  - Creature behavior: how do animals affect settlements and travel?
  - Tool aesthetics: what materials and forms define everyday objects?
  - Rarity logic: what makes certain plants or tools valuable?
  - Everyday utility: which tools define ordinary life?
  - Maintenance culture: how are important devices repaired or maintained?

## 10. Sensory Palette (Immersion Layer)
- **Dominant Colors**:
  - Primary color triad: Three colors most associated with world
  - Accent colors: Colors used for emphasis and contrast
  - Seasonal color shifts: How does palette change with seasons?
- **Ambient Sounds**:
  - Background noise: Natural sounds (wind, water, wildlife, magic hum)
  - Urban sounds: City-specific ambient audio (market bustle, machine rhythm, spell chanting)
  - Music: Instrumental themes, cultural music styles, magical sound frequencies
- **Environmental Scents**:
  - Dominant smell: What does the world smell like?
  - Regional scents: Different areas have signature smells
  - Olfactory markers: Scents associated with magic, power, factions
- **Tactile Sensations**:
  - Texture diversity: What does everything feel like?
  - Temperature: Is the world warm, cold, variable?
  - Air quality: Clear and crisp, humid, dusty, magical particles?
  - Weather soundscape: how does rain, wind, or storm noise shape mood?
  - Crowd texture: what does a busy place sound and feel like?
  - Silence signature: what does quiet mean in this world?
  - Taste markers: what does food or air taste like in different regions?
  - Touch contrast: what surfaces feel comforting, dangerous, or sacred?

## 11. Narrative Framework
- **Storytelling Style**: 
  - Episodic adventures, overarching narrative, mysteries, character-driven?
  - Tone: Serious, comedic, romantic, darker, philosophical?
  - Pacing: Fast-paced action, slow-burn mystery, steady progression?
- **Character Archetypes**: 
  - 3-5 fundamental character types fitting naturally into this world
  - How does world shape personality types?
- **Thematic Depth**:
  - Central theme: What's the story ultimately about?
  - Subthemes: Supporting philosophical questions
  - Character growth vectors: How do characters transform in this world?
  - Narrative pressure: what keeps stories moving in this world?
  - Genre support: how does the world reinforce the intended genre?
  - Reusable setup: what world elements can power multiple episodes or arcs?
  - Emotional range: what feelings should the world support across long stories?
  - Arc architecture: what kinds of story arcs are naturally enabled?

## 12. Rituals & Daily Life
- **Daily routines**: what do people do every day that reveals the world?
- **Work patterns**: how does occupation shape identity and status?
- **Food culture**: what do people eat, avoid, celebrate, or fear?
- **Family structure**: how are households, inheritance, and caregiving organized?
- **Coming-of-age**: what marks adulthood, rank, or belonging?
- **Death customs**: how are the dead honored, remembered, or forgotten?
- **Seasonal rituals**: what changes when seasons or cycles shift?

## 13. Belief Systems & Moral Order
- **Shared beliefs**: what does most of society believe is true?
- **Competing beliefs**: what alternate worldviews exist?
- **Sacred vs. profane**: what is considered pure, forbidden, or untouchable?
- **Moral dilemmas**: what ethical conflicts repeatedly arise in the world?
- **Faith and power**: how do religion, ideology, and authority interact?
- **Heretics and outsiders**: who is rejected for believing differently?

## 14. Conflict Ecology
- **Small conflicts**: what everyday disputes shape life?
- **Medium conflicts**: faction, village, district, or academy tensions
- **Large conflicts**: wars, revolutions, collapse, migration, invasion
- **Invisible conflicts**: prejudice, secrecy, status anxiety, generational pressure
- **Conflict inheritance**: how do past conflicts continue in the present?

## 15. World Anchors
- **Iconic location**: one place every viewer should remember
- **Iconic object**: one object that carries symbolic or plot weight
- **Iconic event**: one recurring event or festival that defines the world
- **Iconic rule**: one world rule that creates dramatic stories
- **Iconic image**: one visual that captures the identity of the setting

## 16. Educational & Knowledge Systems (EXPANDED)
- **Formal Education**: 
  - What ages are children educated? Duration? Mandatory or optional?
  - Who teaches? Professionals, nobility, clergy, masters?
  - What's taught? Literacy, history, power use, trades, ethics?
  - Curriculum variations: Do rich and poor learn different things?
  - Meritocratic pathways: Can talent override birth status?
  - Elite academies: Do special schools exist for exceptional students?
  - Boarding vs. local: Are students sent away or educated locally?
- **Apprenticeship & Vocational Training**:
  - How do trades pass from master to apprentice?
  - What's the typical apprenticeship length?
  - Are some professions closed to certain castes or genders?
  - How do people advance from apprentice to master?
- **Knowledge Preservation**:
  - Are libraries common or rare?
  - Who controls access to knowledge?
  - Is literacy widespread or restricted?
  - How are secrets guarded? (Guilds, oaths, magical sealing?)
  - Are there forbidden texts? Censored history?
  - Oral traditions vs. written records: which is more trusted?

## 17. Military & Defense Structures (EXPANDED)
- **Military Organization**:
  - Standing armies or militia-based defense?
  - Rank structure: How are soldiers promoted?
  - Recruitment: Conscription, volunteers, or both?
  - Military training: Where and how long?
- **Combat Units**:
  - Primary unit types: Infantry, cavalry, archers, cavalry, mages, support?
  - Formation tactics: How do soldiers fight together?
  - Commander hierarchy: Who makes battlefield decisions?
  - Communication: Drums, horns, signals, magic, runners?
- **Fortifications & Defense**:
  - Castle architecture: How are settlements defended?
  - Garrison strength: How many soldiers per fort?
  - Defensive strategy: Active offense or turtle tactics?
  - Weak points: What vulnerabilities does the defense have?
- **Military Culture**:
  - Warrior values: Honor, loyalty, pragmatism, survival?
  - Ranks and insignia: How do you recognize military rank?
  - Military justice: How are soldiers punished?
  - Veterans: What happens to retired soldiers?

## 18. Transportation & Trade Networks (EXPANDED)
- **Land Transportation**:
  - Roads: Maintained highways or wilderness paths?
  - Mounts: Horses, magical creatures, mechanical vehicles?
  - Caravans: How are goods transported? Organized or chaotic?
  - Travel time: How long between major cities?
  - Tolls & taxes: Do merchants pay to use roads?
- **Sea Transportation**:
  - Ports: Major trade hubs? Fortified?
  - Ship types: Cargo, war, exploration, fishing vessels?
  - Navigation: How do sailors navigate? Compasses, stars, magic?
  - Piracy: Is maritime trade threatened?
  - Naval power: Which faction controls the seas?
- **Trade Routes & Economics**:
  - Primary goods: What's traded between regions?
  - Trade monopolies: Which factions control certain goods?
  - Price variations: What's cheap in one region but expensive elsewhere?
  - Merchant guilds: Do organized traders exist?
  - Black markets: Where does illegal trade happen?

## 19. Communication & Information Systems (EXPANDED)
- **Long-distance Communication**:
  - Methods: Messengers, carrier birds, magical communication?
  - Speed: How long does news take to spread?
  - Reliability: How trustworthy is communication?
  - Encryption: Do important messages get coded?
- **Public Information**:
  - News distribution: How does public learn about events?
  - Announcements: Criers, posters, town meetings, broadcasts?
  - Rumors: How fast do rumors spread? Are they believed?
  - Propaganda: Who controls the narrative?
- **Gatekeeping & Censorship**:
  - Who controls information flow?
  - What information is restricted?
  - Punishment for spreading forbidden information?
  - Underground information networks?

## 20. Economic Depth & Resource Flow (EXPANDED)
- **Resource Distribution**:
  - Natural resources: Where are minerals, metals, timber abundant?
  - Production centers: Where are goods manufactured?
  - Bottlenecks: What resources are scarce and critical?
  - Seasonal economics: How do seasons affect economy?
- **Wealth Inequality**:
  - Richest 1%: What do they own and control?
  - Middle class: What defines the middle?
  - Poorest 50%: What's subsistence living like?
  - Social mobility: Can the poor become rich?
  - Wealth transfer: How is inheritance handled?
- **Luxury Goods & Status Symbols**:
  - What do elites wear, eat, own?
  - Rarity: What's expensive just because it's rare?
  - Craftsmanship: What items are valued for quality?
  - Fashion & trends: Do styles change? Who sets trends?
- **Labor & Employment**:
  - Unemployment: Can people not find work?
  - Wages: How much do workers earn relative to survival costs?
  - Working conditions: Are jobs safe, dangerous, or varied?
  - Child labor: Are children forced to work?
  - Slavery: Does slavery exist? Is it legal?

## 21. Underground & Criminal Systems (EXPANDED)
- **Criminal Organizations**:
  - Thieves' guilds: Organized or independent?
  - Assassins: Professional contracts or vigilante justice?
  - Black markets: What's sold illegally?
  - Smuggling routes: How do criminals move contraband?
- **Law Enforcement**:
  - Police/guard effectiveness: Can they actually stop crime?
  - Corruption: Are guards bribed?
  - Punishment severity: Is justice harsh or lenient?
  - Prisons: Do they exist? Conditions?
- **Resistance & Rebellion**:
  - Is underground resistance organized?
  - What are they resisting against?
  - Visibility: Do they operate openly or secretly?
  - Popular support: Do common people aid resistance?

## 22. Regional Variations & Diversity (EXPANDED)
- **Regional Cultures**:
  - North: Different customs, architecture, economy, personality?
  - South: Distinct characteristics and lifestyle?
  - East & West: Regional identities and conflicts?
  - Center: Different from periphery?
- **Micro-climates & Biomes**:
  - How does terrain shape regional culture?
  - Do isolated regions develop unique traditions?
  - Are there regions impossible to reach or forbidden?
  - Do resources vary dramatically by region?
- **Regional Economies**:
  - Agricultural regions vs. industrial vs. trading hubs?
  - Do regions specialize in different goods?
  - Regional pride: Do regions compete or cooperate?

## 23. Language, Dialect & Communication Style (EXPANDED)
- **Languages & Dialects**:
  - Single language or multiple?
  - Class dialects: Do nobles speak differently than peasants?
  - Regional accents: Do northerners sound different from southerners?
  - Ancient languages: Are old tongues still used for magic/ritual?
  - Forbidden words: Are some words taboo or illegal?
- **Non-verbal Communication**:
  - Gesture meanings: Do hand signs communicate?
  - Body language: Is physical bearing important?
  - Clothing codes: Does outfit communicate status or allegiance?
  - Color symbolism: Do colors convey meaning?

## 24. Supernatural & Anomalous Phenomena (EXPANDED)
- **Magical Anomalies**:
  - Are there places where magic behaves strangely?
  - Do ley lines or power nexuses exist?
  - Magical deserts: Regions where magic doesn't work?
  - Prophecy or divination: Can the future be foreseen?
  - Curses & blessings: Do they have real power?
- **Supernatural Entities**:
  - Ghosts: Are they real? Can they interact with living?
  - Demons/angels: Do celestial beings exist?
  - Spirits of nature: Are forests/mountains inhabited?
  - Reincarnation: Do souls return after death?
- **Unexplained Phenomena**:
  - Disappearances: Do people vanish without explanation?
  - Miracles: Do impossible things sometimes happen?
  - Curses: Are families cursed across generations?
  - Synchronicity: Do unlikely coincidences happen frequently?

## 25. Population & Demographics (EXPANDED)
- **Population Distribution**:
  - World population: Hundreds? Millions? Billions?
  - Urban vs. rural: Where do most people live?
  - Major cities: Names, populations, characteristics?
  - Settlement patterns: Clustered or spread out?
- **Demographics**:
  - Average lifespan: How long do people live?
  - Birth rates: High or low population growth?
  - Mortality: What kills people most often?
  - Gender ratios: Equal or skewed?
  - Age distribution: Young population or aging?
- **Migration & Immigration**:
  - Do people migrate seasonally?
  - Immigration: Are outsiders welcomed or rejected?
  - Refugees: Are people fleeing conflict?
  - Diaspora: Are there expatriate communities?

## 26. Technology Advancement & Progress Pathways (EXPANDED)
- **Tech Level Evolution**:
  - Is technology advancing or stagnant?
  - What's preventing further advancement?
  - Are there lost technologies from the past?
  - Do other cultures have more advanced tech?
- **Specific Technologies**:
  - Medicine: How advanced? Can diseases be cured?
  - Agriculture: Advanced farming or primitive?
  - Weapons: Arrows, swords, guns, energy weapons, or other?
  - Transportation: What's the fastest vehicle?
  - Communication: Telegraph, radio, magical, or messenger?
- **Technology & Society**:
  - Do people fear or embrace technology?
  - Is new technology adopted quickly or slowly?
  - Technology divide: Do rich/poor have access gaps?
  - Artisanal vs. mass production: What's the balance?

## 27. Death, Afterlife & Mortality (EXPANDED)
- **Death Beliefs**:
  - What do people believe happens after death?
  - Is there an afterlife? Heaven/hell concepts?
  - Do ghosts exist and interact with living?
  - Reincarnation: Do souls return?
- **Death Rituals**:
  - Funeral customs: How are dead honored?
  - Body disposal: Burial, cremation, other?
  - Mourning period: How long do people grieve?
  - Ancestor veneration: Are ancestors worshipped?
- **Mortality Impact**:
  - Average lifespan: How does this affect society?
  - Infant mortality: Is death of children common?
  - Cause of death: What kills most people?
  - Longevity: Do some people live exceptionally long?

## 28. Art, Music & Cultural Expression (EXPANDED)
- **Visual Arts**:
  - What art styles dominate? Realistic, abstract, symbolic?
  - Art materials: Paint, sculpture, performance, projection?
  - Subject matter: What do artists typically depict?
  - Patronage: Who funds artists?
- **Music & Performance**:
  - Musical instruments: What are they? Simple or complex?
  - Musical styles: Genres and their associations?
  - Performance venues: Concerts, street performers, festivals?
  - Musical training: Is music taught or innate?
- **Literature & Storytelling**:
  - Written literature: Common or rare?
  - Story genres: What types of stories are told?
  - Storytellers: Professional or amateur?
  - Oral traditions: How important is oral history?

## 29. Magical/Technological Infrastructure & Maintenance (EXPANDED)
- **Infrastructural Magic/Tech**:
  - Does the world rely on active magic to function? (Levitation cities, magical sewers, enchanted bridges?)
  - Who maintains these systems? Specialized guilds, government, nobility?
  - What happens when infrastructure breaks? Economic collapse? Mass casualty events?
  - Maintenance rituals: Are there daily/weekly/yearly ceremonies required?
  - Failure cascades: If one system fails, do others collapse?
  - Repair expertise: Is this knowledge closely guarded or freely shared?
  - Cost of maintenance: Is it expensive? Who pays?
  - Vulnerability: What could sabotage critical infrastructure?
- **Power Distribution**:
  - How does magical power or electricity reach different areas?
  - Are there power shortages or brownouts?
  - Efficiency: Does power degrade over distance?
  - Backup systems: What happens during outages?
  - Unequal distribution: Do poor areas lack access to power?
- **Structural Engineering**:
  - Architecture support: How are massive structures supported?
  - Lifespan of buildings: How long until they require rebuilding?
  - Natural disaster impact: Are structures earthquake-proof, flood-resistant?
  - Building codes: Are there safety standards?

## 30. Climate Phenomena & Seasonal Cycles (EXPANDED)
- **Annual Seasons**:
  - Does the world follow traditional 4-season cycles or unique patterns?
  - For each season: temperature ranges, precipitation, day/night length
  - Season duration: Do some seasons last longer than others?
  - Seasonal migration: Do people/animals move with seasons?
  - Seasonal availability: What goods are available only in certain seasons?
  - Seasonal emotions: Do seasons affect mood, behavior, social activity?
  - Seasonal festivals: What celebrations mark seasonal changes?
  - Seasonal hazards: What dangers emerge in each season?
- **Extreme Weather Events**:
  - Hurricanes/typhoons: How frequently? Predicted or random?
  - Blizzards/ice storms: Severity and frequency?
  - Droughts: How often? How long? Impact on economy?
  - Flooding: Does flooding happen regularly? How do people prepare?
  - Magical storms: Are there supernatural weather events?
  - Warning systems: Can extreme weather be predicted?
  - Disaster preparation: How do people prepare?
  - Disaster response: Who organizes relief efforts?
- **Long-term Climate Patterns**:
  - Solar/lunar cycles: Do celestial bodies dramatically affect climate?
  - Climate stability: Is the climate changing long-term?
  - Catastrophic climate events: Have climate shifts caused civilizational collapse?
  - Adaptation: How have people adapted to their climate?

## 31. Inter-dimensional/Multi-planar Cosmology (EXPANDED)
- **Planes of Existence**:
  - Is this world the only reality or one of many?
  - Named planes/dimensions: Spirit realm, afterlife, shadow world, etc.?
  - Accessibility: Can mortals travel between planes?
  - Travel methods: Portals, rituals, accidents, natural thin places?
  - Planar consequences: What happens if planes collide or destabilize?
- **Planar Entities & Beings**:
  - Inhabitants of other planes: Spirits, demons, angels, aliens?
  - Planar power: Can beings from other planes affect this one?
  - Planar warfare: Do different planes conflict?
  - Summons & binding: Can entities be brought to this plane?
  - Planar prophecy: Do other planes influence destiny?
- **Reality Stability**:
  - Is reality stable or fragile?
  - Paradox effects: What happens when reality contradicts itself?
  - Zone anomalies: Are there areas where reality behaves strangely?
  - Existence philosophy: What is the nature of existence in this world?

## 32. Rare Phenomena & Narrative Hooks (EXPANDED)
- **Mysterious Events**:
  - Unexplained disappearances: People vanish without trace?
  - Spontaneous combustion: People burst into flame?
  - Time distortions: Places where time moves differently?
  - Spatial anomalies: Impossible geometry or size distortions?
  - Reality glitches: Moments where the world seems wrong?
  - Ghost sightings: Specific locations known for hauntings?
  - Miracle events: Impossible healing or survival?
  - Prophecy fulfillments: Do vague prophecies sometimes come true?
- **Narrative Opportunities**:
  - What mysteries could drive multi-episode arcs?
  - What unsolved puzzles would characters want to investigate?
  - What secrets, if revealed, would change everything?
  - What historical mysteries could be rediscovered?
  - What contradictions hint at deeper truths?

## 33. Character Archetypes & Social Roles (EXPANDED)
- **Mandatory Character Types** (Provide 10-15 distinct archetypes):
  - The Nobility: Define multiple noble types (warrior nobles, merchant princes, scheming courtiers)
  - The Warrior: Combat specialist variations (swordmaster, berserker, tactical commander)
  - The Scholar: Knowledge roles (scientist, historian, mystic scholar, archivist)
  - The Merchant: Economic roles (trader, smuggler, caravan master, banker)
  - The Mystic: Spiritual roles (priest, oracle, hermit sage, cult leader)
  - The Outlaw: Criminal roles (thief, assassin, rebel, pirate)
  - The Commoner: Working roles (farmer, laborer, craftsperson, servant)
  - The Hybrid: Combinations (warrior-scholar, merchant-mystic, soldier-criminal)
- **Social Archetypes**:
  - The Mentor: Elder figures who guide protagonists
  - The Love Interest: Romantic lead possibilities and complications
  - The Rival: Competition within social hierarchy
  - The Outcast: Rejected by society, seeking belonging
  - The Innocent: Naive characters with growth potential
- **How Archetypes Fit the World**:
  - Does the world DEMAND these archetypes exist?
  - What prevents other archetypes from existing?
  - Social mobility: Can archetypes change or transition?

## 34. Campaign/Story Potential & Dramatic Structure (EXPANDED)
- **Natural Story Arcs** (Identify 5-10 potential multi-episode story structures):
  - Origin quest: How do characters get pulled into adventure?
  - Conflict escalation: How do small conflicts become world-threatening?
  - Redemption opportunity: Can fallen characters be restored?
  - Revolution trajectory: How could society be overthrown?
  - Prophecy fulfillment: What prophecies could drive plot?
  - Forbidden knowledge: What dangerous secrets could be uncovered?
  - Artifact quests: What legendary items exist and drive conflict?
  - Betrayal potential: Who will backstab whom and why?
  - Sacrifice requirement: What permanent costs might victory demand?
  - Transformation arcs: How could characters fundamentally change?
- **Dramatic Pressure Points**:
  - What forces characters to make impossible choices?
  - What ethical dilemmas define the world?
  - What secrets, if revealed, would change relationships?
  - What losses would hurt characters most?
  - What victories would feel most earned?
- **Rewatch Value**:
  - What details should viewers notice on second viewing?
  - What foreshadowing elements exist?
  - What mysteries reward careful viewing?


### MASTER MANIFEST FORMAT (UNIFIED):
Your response MUST be a single, cohesive **Master Manifest** document. Do not provide separate summaries for tabs; instead, build an interconnected, encyclopedic world bible.

Your response MUST be **15,000-20,000+ words** MINIMUM. This is a professional world bible, not a summary. Each of the 34 sections above must receive substantial elaboration:

### For EACH Main Section (1-34):
- Provide 300-450 words of content per section
- Include 5-10 specific named examples per section (cities, cultures, items, events, NPCs)
- Provide 3+ detailed sub-sections with hierarchical depth
- Include numerical specifics: populations, percentages, distances, timeframes, costs
- Include visual/sensory descriptions: colors, sounds, textures, smells, tastes where relevant
- Explain 3-5 cause-and-effect chains showing why the world works this specific way
- Provide 2-3 specific scenarios showing how this section impacts characters/story
- Include both micro (individual/family) and macro (civilization/world) perspectives

### Mandatory Detail Requirements:
- **Naming Convention**: Provide 50+ specific proper names (locations, people, organizations, artifacts, events, factions)
- **Numerical Specificity**: Include at least 50 concrete numbers (distances, populations, percentages, years, temperatures, monetary values, costs, timeframes)
- **Interconnectedness Examples**: Identify and explain 15+ specific points where different world sections influence each other
- **Visual World Building**: Describe the visual appearance of at least 20 distinct locations with specific architectural/natural details
- **Cultural Depth**: Provide 8+ specific cultural traditions with precise explanations of rituals, meanings, and societal impacts
- **Economic Specifics**: Detail actual trade routes, material costs, labor wages, commodity values, economic disparities with specific numbers
- **Timeline Anchors**: Provide specific historical dates/periods for at least 15 major historical events
- **Power & Combat**: Include 12+ specific ability examples with exact mechanics and limitations
- **Social Dynamics**: Describe specific class tensions with real examples of privilege gaps and social mobility barriers
- **Conflict Seeds**: Identify 8+ potential conflicts waiting to erupt with specific trigger events and escalation paths

### Sensory Immersion (Must Include Extensively):
- **Visual**: Describe dominant color palettes for each major region, lighting conditions at different times, architectural signatures, distinctive visual landmarks, seasonal visual changes
- **Auditory**: What sounds define each area? Market sounds, combat sounds, magical sounds, natural ambience, music styles, warning signals, celebratory noise?
- **Olfactory**: What does each region smell like? What smells indicate power, danger, wealth, poverty, magic, poison, food, flowers, decay?
- **Tactile**: Describe surface textures throughout the world (wet cobblestones, rough bark, silk fabric, cold stone, warm sand, sharp metal, soft vegetation)
- **Gustatory**: What do different regions taste like? Spiced foods, mineral water, acrid magic, sweet fruits, metallic blood, bitter herbs, salty air?
- **Emotional Resonance**: What feeling does each region evoke? Danger, peace, excitement, dread, wonder, nostalgia?

### Cause-and-Effect Mandate (EXTENSIVE):
Every statement must connect to broader world logic. Provide detailed explanations:
- ❌ AVOID: "There's a desert to the east."
- ✅ BETTER: "The Shalazar Desert exists because the Meridian Mountains block rainfall, creating a rain shadow that extends 400 miles east. This barren expanse forces trade routes northward through the treacherous Spine Pass, making northern settlements wealthier and more defensible. The harsh desert has bred the nomadic Khar'dun people, whose expertise with minimal resources makes them invaluable mercenaries. However, this also means northern nobles hoard wealth, creating resentment among southern populations..."

### Interconnectedness Requirements (Show Complex Cause-and-Effect Webs):
- How does geography force political divisions?
- How does power system availability shape settlement patterns?
- How do trade routes create wealth centers and poverty zones?
- How do historical traumas echo into current faction tensions?
- How do climate patterns determine food sources and seasonal social rhythms?
- How do resource scarcities drive conflict and innovation?
- How do power hierarchies enforce or resist social mobility?
- How do communication limits create misunderstandings and regional identities?
- How do death customs connect to religious beliefs and social status?
- How do tech limitations create social structures?
- How does magic/tech infrastructure determine political power?
- How do rare phenomena create religion and superstition?
- How do dramatic pressure points make conflict inevitable?
- How does world design naturally support the story you want to tell?

### Character-Story Impact Examples (Include 5-8 for each section):
For each major world element, explain how it creates dramatic situations:
- Example 1: "The rigid caste system means a talented fighter born to merchants can never officially join the warrior class, forcing them to prove themselves through illegal duels. This creates a constant underground fighting scene that serves as cover for political assassinations."
- Example 2: "The seasonal flooding means entire neighborhoods must be abandoned during monsoon season. Wealthier families own property in multiple zones; poorer families must choose: lose their home or lose their livelihood by relocating temporarily."
- Example 3: "The prophecy that 'one born of two bloods shall break the chain' has persecuted every mixed-race child for 300 years, creating a culture of hiding identity and a hidden network of illegitimate half-siblings who don't know each other exist."

### Output Format (MANDATORY):
- Use numbered sections (## 1. through ## 34.)
- Use hierarchical bullet points (-, --, ---)
- Use bold for key terms and proper nouns (**Example**)
- Use italic for sensory descriptions (*crimson silk*, *acrid smoke*)
- Use code formatting for specific game mechanics or powers ('Inferno Strike: CSS 50 mana, 3-turn cooldown')
- Include section summaries (3-4 sentences) at the end of each major section (except short sections)
- Include a final "World Coherence Check" section verifying internal consistency across all 34 sections
- Include a "Narrative Potential Summary" showing how the world naturally supports story

### Word Count Tracking:
- Each section should average 300-400 words minimum (34 sections = 10,200+ words baseline)
- Target 12,000-15,000 words for premium professional-grade world bible
- NO section can be under 250 words
- NO examples can be generic or vague—every example must be specific, memorable, and tied to world logic
- Longer sections (Power System, Factions, Geography) should be 500-700 words

### QUANTITY REQUIREMENTS (Explicit Minimums):
- Minimum 60 specific named locations/cities/landmarks
- Minimum 50 named NPCs, leaders, or historical figures
- Minimum 10 named factions, organizations, or cultural groups (from sections 6, 7, 30, etc.)
- Minimum 30 specific power/ability examples with mechanics
- Minimum 50 numerical data points (populations, distances, costs, percentages, timeframes)
- Minimum 20 specific historical events with dates/eras
- Minimum 15 named trade goods or valuable resources
- Minimum 12 named weapons, artifacts, or technology types
- Minimum 15 named festivals, rituals, or cultural events
- Minimum 15 specific cause-and-effect chains showing world logic
- Minimum 8 specific potential story arcs that naturally emerge from world design
- Minimum 20 environmental/architectural descriptions with sensory details

## PRIME DIRECTIVE (ABSOLUTE):
You MUST strictly adhere to consistency. Every aspect of the world setting—from physical geography to power systems, social structures to sensory details—must be logically interconnected and evocatively coherent. This is a world where EVERYTHING connects to everything else.

EXPLICITLY AVOID:
- Contradictory lore (establish clear rules and follow them)
- Powerscaling inconsistencies (define power ceilings clearly)
- Cultural inconsistencies (cultures should reflect their environment and values)
- Generic fantasy tropes without justification
- Flat world design with no internal cause and effect
- Underspecified factions, cultures, or environmental logic
- Brevity: this must be an EXHAUSTIVE, ENCYCLOPEDIC world bible
- Vague references: ALWAYS be specific with names, numbers, and examples
- Isolated concepts: ALWAYS show how each element connects to the broader world
- Placeholder language: ALWAYS use concrete, evocative, memorable descriptions

Return ONLY the comprehensive, expansive world description in professional Markdown format with extensive detail, numerous examples, specific numbers, and demonstrated cause-and-effect logic throughout. This output should be ready for professional anime production, novel publication, or game design implementation.
` );

/**
 * Generates a detailed power system design prompt
 * @param worldConcept - Brief description of the world
 * @param powerSystem - Type of power system
 * @returns Detailed prompt for power system specification
 */
export const POWER_SYSTEM_PROMPT = (worldConcept: string, powerSystem: string) => 
  safePromptGeneration(
    { worldConcept, powerSystem },
    (input) => validateWorldSpec(input.worldConcept, input.powerSystem),
    ({ worldConcept, powerSystem }) => `
You are an expert Power System Designer and Game Balance Specialist.

TASK: Design a Detailed, Balanced Power System for this world concept.

WORLD CONTEXT:
${worldConcept}

POWER SYSTEM TYPE: ${powerSystem}

DETAILED SPECIFICATIONS:

## 1. Core Power Mechanics
- **Energy Source**: Where does power come from? (Internal cultivation, external mana, divine blessing, technology?)
- **Activation Method**: How do users access and utilize power? (Verbal incantations, gestures, mental focus, equipment?)
- **Energy Consumption**: What's the cost of using power? (Physical exhaustion, mana depletion, lifespan drain, stamina?)
- **Recovery System**: How do users restore their power? (Rest, meditation, rituals, items, passive regeneration?)
 - **Sensory signature**: what does the power look, sound, and feel like when activated?
 - **Failure mode**: what happens when the power misfires or is interrupted?

## 2. Power Tier System
Define 5-7 distinct power tiers with clear progression:
- **Tier 1 (Novice)**: Entry-level abilities, minimal impact, short duration
- **Tier 2 (Intermediate)**: Noticeable combat effectiveness, medium resource cost
- **Tier 3 (Advanced)**: Significant damage/effects, requires training and experience
- **Tier 4 (Expert)**: Rare abilities, major resource costs, lengthy mastery
- **Tier 5 (Master)**: World-affecting power, extreme costs, few practitioners
- **Tier 6+ (Legendary/Divine)**: Reality-bending abilities, potentially unique to legends

For each tier specify:
- Typical effects and abilities
- Resource requirements
- Mastery time requirements
- Percentage of population reaching this tier
 - Visible tells: how can observers recognize the tier in action?
 - Tactical role: what does this tier contribute in a fight or mission?
 - Training environment: what is needed to safely reach this tier?
 - Social status: how is this tier viewed by the wider world?

## 3. Power Types & Specializations
- **Primary Types**: 3-5 main power categories (Examples: Fire, Ice, Lightning, Healing, Support)
- **Type Advantages/Weaknesses**: Rock-paper-scissors style advantages and counters
- **Hybrid Abilities**: Can users combine multiple power types?
- **Specialization Depth**: Can users specialize further within types?
 - **Expression styles**: are powers subtle, explosive, ritualized, or technical?
 - **Style signatures**: what makes one user’s version distinct from another?

## 4. Power Scaling & Progression
- **Power Growth Method**: 
  - Experience-based (battles grant experience points)
  - Training-based (dedicated practice increases power)
  - Artifact-based (magical items grant power)
  - Hybrid system (combination of methods)
- **Power Cap**: Is there a maximum power level? Can it be exceeded?
- **Plateau Mechanics**: Do users hit power plateaus requiring breakthrough moments?
- **Diminishing Returns**: Does each power level require exponentially more resources?
 - **Breakthrough conditions**: what triggers a major leap in ability?
 - **Regression risk**: can users lose power or skill over time?

## 5. Power Limitations & Costs
- **Hard Limitations**:
  - Physical toll: Injuries, exhaustion, illness from power use
  - Mental toll: Sanity loss, memory gaps, psychological effects
  - Lifetime cost: Does using power reduce lifespan?
  - Forbidden knowledge: Are some powers too dangerous to teach?
- **Soft Limitations**:
  - Skill requirement: Even with power potential, mastery takes time
  - Equipment needs: Does powerful equipment amplify or enable power?
  - Environmental factors: Does setting affect power availability? (Sunlight, weather, magical auras?)
  - Psychological barriers: Do users need confidence or willpower to manifest power?
  - Ritual dependency: must some powers be prepared, spoken, or activated in sequence?
  - Resource scarcity: are key materials or catalysts rare?

## 6. Power Use Consequences
- **Short-term**: Immediate effects of power usage
- **Medium-term**: Effects lasting hours/days (weakened state, vulnerability)
- **Long-term**: Permanent changes (power scars, ability mutations, status changes)
- **Social consequences**: How does power use affect reputation? (Admiration, fear, ostracism?)
 - **Visual aftermath**: what traces remain after the power is used?
 - **Recovery rituals**: what do characters do after overuse?

## 7. Power Interactions & Combat Mechanics
- **Type Interactions**: How do different powers interact?
  - Synergies: Powers that work well together
  - Counters: Powers that effectively neutralize others
  - Neutral matchups: Powers with no advantage/disadvantage
- **Ability Chaining**: Can users combine multiple abilities into combos?
- **Defense Systems**: How do users defend against power attacks?
  - Shields/barriers: Protection abilities or equipment
  - Evasion: Movement-based defense
  - Absorption: Taking damage and converting it
  - Nullification: Canceling incoming attacks
- **Environmental Interactions**: How does environment affect power?
 - **Combo visibility**: how does the audience know a combo is happening?
 - **Counter readability**: how can weaker fighters exploit openings?

## 8. Forbidden & Taboo Powers
- **Explicitly Forbidden**: Powers that are completely illegal/immoral (define why)
- **Dangerous**: Powers that are legal but require strict regulation
- **Corruption Risk**: Do some powers corrupt users morally/physically?
- **Prophecy/Legend**: Are there ancient powers lost to time?
 - **Containment methods**: how are forbidden powers locked away or monitored?
 - **Taboo symbols**: what markings or artifacts signal forbidden power use?

## 9. Power Balance Framework
- **Beginner Balance**: Are entry-level players relatively equal in power?
- **Mid-Game Balance**: How do power differences manifest at intermediate levels?
- **End-Game Balance**: Do high-tier users dominate, or is there viable diversity?
- **Counter-Play**: Can weaker users defeat stronger ones through strategy?
 - **Matchup clarity**: can the audience instantly understand why one power wins or loses?
 - **Strategic depth**: does knowledge matter as much as raw power?
 - **Spectacle control**: how is power shown without losing readability?

Return ONLY the power system specification in professional Markdown format.
`
  );

/**
 * Generates a faction and political system design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for faction design
 */
export const FACTION_SYSTEM_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => `
You are an expert Faction Designer and Political Systems Architect.

TASK: Design a Comprehensive Faction and Political System for a ${type} World.

DETAILED SPECIFICATIONS:

## 1. Core Factions (Design 4-6 Primary Factions)
For each faction specify:
- **Name & Symbolism**: Memorable name and visual symbol
- **Core Philosophy**: What values drive this faction?
- **Leadership Structure**: Single leader, council, democratic, merit-based?
- **Territory & Resources**: What lands/resources do they control?
- **Population**: Rough member count and demographics
- **Military Strength**: Combat capabilities and tactics
- **Cultural Identity**: Customs, traditions, aesthetic
- **Long-term Goals**: 5, 10, 50-year objectives
 - **Public image**: how does the outside world perceive them?
 - **Internal cost**: what do members sacrifice to belong?

## 2. Faction Relationships Matrix
- **Alliances**: Which factions work together? Why?
- **Rivals/Enemies**: Which factions oppose each other? Root causes?
- **Neutral Parties**: Factions indifferent to each other
- **Betrayal Potential**: Which alliances are unstable?
- **Hidden Allies**: Do any factions secretly collaborate?
 - **Diplomatic language**: what words, titles, or rituals keep alliances intact?
 - **Hostage leverage**: who or what is used to maintain peace?

## 3. Internal Faction Structure
- **Leadership Hierarchy**: How is power distributed within faction?
- **Subgroups**: Does faction have internal ideological splits?
- **Extremists**: Are there radical wings pushing faction ideology to extremes?
- **Moderates**: Are there pragmatists compromising with other factions?
- **Dissenters**: Who challenges faction authority?

## 4. Political Power Dynamics
- **Power Balance**: Which faction is strongest? How fragile is this balance?
- **Shifting Allegiances**: Can factions flip allegiances based on circumstances?
- **Political Intrigue**: Spy networks, assassinations, blackmail?
- **Public vs. Private**: Do factions hide true goals from public?
- **Diplomacy**: Do factions negotiate or just fight?
 - **Trigger events**: what incidents cause the balance to change quickly?
 - **Escalation pathway**: how does political tension become open conflict?

## 5. Faction Interaction with Power System
- **Power Type Correlation**: Do factions specialize in certain power types?
- **Recruitment**: How do factions find and train new members?
- **Power Restrictions**: Do factions ban certain abilities?
- **Training Methods**: Different factions teach power differently?

## 6. Faction Economy & Resources
- **Economic Model**: How do factions fund themselves?
- **Trade**: Do they trade with rivals? Import/export key goods?
- **Resource Wars**: Do conflicts stem from resource competition?
- **Black Markets**: Illegal trade between factions?
 - **Dependency map**: what does each faction need from the others?
 - **Scarcity leverage**: what resource can be weaponized politically?

## 7. Cultural & Aesthetic Identity
- **Visual Branding**: Colors, symbols, clothing, architecture?
- **Art & Music**: Faction-specific artistic traditions?
- **Language/Dialect**: Unique speech patterns or vocabulary?
- **Social Customs**: Unique traditions and celebrations?
 - **Internal hierarchy signals**: how can status be recognized at a glance?
 - **Public-facing ideology**: what message do they want outsiders to believe?

## 8. Conflict Seeds
- **Ideological Conflicts**: Fundamental belief disagreements
- **Resource Conflicts**: Competition for limited goods
- **Territorial Disputes**: Border conflicts and territorial claims
- **Personal Vendettas**: Historical grievances between leaders
- **External Threats**: Does external danger unite or divide factions?
 - **Trigger incidents**: what specific event could ignite open conflict?
 - **Slow-burn tension**: what never gets fully resolved?

Return ONLY the faction system specification in professional Markdown format.
`
);

/**
 * Generates a world lore and history design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for world history and lore
 */
export const LORE_GENERATION_PROMPT = (contentType: string) => safePromptGeneration(
  contentType,
  validateContentType,
  (type) => `
You are an expert Lore Master and World Historian specializing in ${type} narratives.

TASK: Design Comprehensive World Lore and Historical Timeline.

DETAILED SPECIFICATIONS:

## 1. Creation Myth & Genesis Era
- **World Origin**: How was the world created? (Divine creation, cosmic accident, scientific experiment?)
- **First Inhabitants**: What were the original sentient species?
- **Founding Legends**: Legendary heroes and pivotal early events
- **Ancient Powers**: Were ancient beings more powerful than modern era?
- **Lost Civilizations**: Civilizations that rose and fell before current era
 - **Myth versus fact**: which parts are believed, and which are true?
 - **Origin symbol**: what image or artifact represents the birth of the world?

## 2. Historical Eras (Establish 4-5 Major Historical Periods)
For each era specify:
- **Era Name & Duration**: Memorable name and timeline
- **Major Events**: 3-5 transformative events during era
- **Key Figures**: Important historical figures and their legacies
- **Technological Advancement**: Power system and tech level evolution
- **Social Changes**: How society transformed during this period
- **Cultural Flourishing**: Art, literature, scientific advances
- **Conflict & Conquest**: Wars, upheavals, power shifts
- **End Trigger**: What ended this era?
 - **Signature mood**: how did the era feel to people living in it?
 - **Legacy weight**: what did later generations inherit from it?

## 3. Legendary Events & Turning Points
- **The Great Catastrophe**: World-changing disaster (plague, war, cataclysm?)
- **The Discovery**: Revolutionary finding that changed civilization (new power source, ancient truth?)
- **The Ascension**: Rise of a legendary figure or faction to prominence
- **The Fall**: Downfall of a previously powerful civilization
- **The Awakening**: Sudden emergence of new power or knowledge
 - **Public memory**: how do people retell these events in everyday speech?
 - **Physical remnants**: what ruins, scars, or artifacts still exist?

## 4. Legendary Figures & Their Legacies
- **Historical Heroes**: 3-5 legendary figures whose names are remembered
  - Their accomplishments and legacy
  - How they're remembered (hero, villain, complex figure?)
  - Artifacts or locations associated with them
  - Did they achieve or fail their ultimate goals?
- **Ancient Villains**: 2-3 figures remembered for their evil deeds
  - What motivated their antagonism?
  - Were they defeated or did they succeed?
  - What's their lingering impact?

## 5. Prophecies & Destinies
- **Ancient Prophecies**: 2-3 ancient predictions affecting current era
  - Are they being fulfilled or misinterpreted?
  - Who believes in them? Who rejects them?
  - Will they come true or prove false?
- **Legendary Artifacts**: 3-5 powerful items from history
  - Current location/status (lost, hidden, guarded?)
  - Powers and limitations
  - Quests associated with finding them
 - **Prophecy mechanics**: are prophecies symbolic, literal, or self-fulfilling?
 - **Artifact cost**: what is lost or changed when an artifact is used?

## 6. Cultural & Linguistic Heritage
- **Ancient Languages**: Do dead languages persist in magic/rituals?
- **Language Evolution**: How has primary language changed through history?
- **Cultural Borrowing**: Which cultures influenced each other?
- **Artistic Heritage**: How has art style evolved through eras?
 - **Ritual continuity**: what traditions survived even after major upheavals?
 - **Dialect markers**: what speech patterns reveal age, class, or region?

## 7. Religious & Spiritual Traditions
- **Pantheon**: If relevant, design deity/spirit system
  - Number of gods/spirits: Many or few?
  - Domains: What does each oversee?
  - Relationship with believers: Active intervention or distant?
  - Competing religions: Are multiple belief systems present?
- **Spiritual Evolution**: How have beliefs changed through history?
- **Sacred Sites**: Locations of spiritual importance
- **Religious Conflicts**: Have religions clashed throughout history?

## 8. Technological Evolution Arc
- **Ancient Technology**: What did ancients possess that's now lost?
- **Dark Ages**: Was there period of technological regression?
- **Modern Era**: Current technological level and capabilities
- **Technological Barriers**: What prevents further advancement? (Ethical concerns, resource limits, power caps?)
- **Future Potential**: What might be technologically possible?

## 9. Unresolved Mysteries
- **Lost Lore**: What's deliberately hidden or forgotten?
- **Conspiracy**: Are there hidden truths known only to few?
- **Ancient Questions**: Mysteries that have persisted through eras
- **Current Rumors**: What do people speculate about?
 - **Forbidden archive**: what information is physically inaccessible?
 - **Narrative hook**: which mystery should make audiences want the next chapter?

## 10. Historical Echoes in Present
- **Lingering Consequences**: How does past affect current era?
- **Cyclical Patterns**: Do history's lessons apply to present conflicts?
- **Unfinished Business**: Are ancient feuds still active?
- **Historical Prophecy**: Will history repeat itself?
 - **Everyday influence**: what historical detail shapes ordinary life today?
 - **Political residue**: what old event still controls current power?
 - **Educational canon**: what does school or folklore teach about the past?
 - **Counter-history**: who challenges the official version of events?

Return ONLY the comprehensive lore and history in professional Markdown format with clear timelines and narrative flow.
`
);
/**
 * Generates an architectural and visual design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for architectural design
 */
export const ARCHITECTURE_GENERATION_PROMPT = (contentType: string) => `
You are an expert Architectural Designer, Visual Director, and Cinematographer specializing in ${contentType.trim()} world-building.

TASK: Design the Comprehensive Visual Architecture and Aesthetic Identity for this ${contentType.trim()} world.

DETAILED SPECIFICATIONS:

## 1. Architectural Signature
- **Settlement Styles**: Define 3-5 distinct architectural styles based on region or faction.
- **Structural Philosophy**: How do people build? (Organic, brutalist, gothic, high-tech, nomadic?)
- **Material Language**: What materials define the world? (Obsidian, neon-glass, carved bone, floating stone?)
- **Scale & Verticality**: Are settlements sprawling, towering, subterranean, or aerial?

## 2. Visual Aesthetic & Cinematography
- **Color Palette**: Dominant color schemes and their psychological impact.
- **Lighting Mood**: Ambient light sources and dramatic contrast signatures.
- **Camera Language**: How should this world be "filmed"? (Grand wide shots, claustrophobic intimacy, dynamic action?)
- **Visual Motifs**: Recurring symbols, shapes, and patterns in design.

## 3. Interior & Living Spaces
- **Domestic Design**: What do ordinary homes look like?
- **Elite Architecture**: How do the powerful manifest their status visually?
- **Public Spaces**: Markets, forums, and temples—how is social space designed?

Return ONLY the architectural and visual specification in professional Markdown format.
`;

/**
 * Generates a geographic and environmental design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for atlas and geography
 */
export const ATLAS_GENERATION_PROMPT = (contentType: string) => `
You are an expert Geographic Cartographer, Climate Scientist, and Environmental Storyteller specializing in ${contentType.trim()} settings.

TASK: Design the Comprehensive Physical Geography and Climate System for this ${contentType.trim()} world.

DETAILED SPECIFICATIONS:

## 1. Global Topology
- **Primary Continents/Regions**: Names, shapes, and geological origins.
- **Notable Landmarks**: 5-10 iconic natural features (mountains, rivers, rifts).
- **Subterranean & Aerial Geography**: If relevant, what lies above or below the surface?

## 2. Climate & Environment
- **Weather Patterns**: Unique weather phenomena (mana storms, crystal rain, eternal twilight).
- **Seasonal Cycles**: How do seasons change the physical world?
- **Environmental Hazards**: Regions that are naturally dangerous or uninhabitable.

## 3. Resource Distribution
- **Strategic Resources**: Where are rare materials found?
- **Geography of Conflict**: How does terrain force political friction or trade routes?

Return ONLY the geographic atlas specification in professional Markdown format.
`;

/**
 * Generates a cultural and societal design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for culture and daily life
 */
export const CULTURE_GENERATION_PROMPT = (contentType: string) => `
You are an expert Cultural Anthropologist, Sociologist, and Lore Master specializing in ${contentType.trim()} narratives.

TASK: Design the Comprehensive Cultural Ethos and Societal Norms for this ${contentType.trim()} world.

DETAILED SPECIFICATIONS:

## 1. Societal Structure
- **Class & Hierarchy**: How is society layered? (Caste systems, meritocracies, tribal units?)
- **Family & Identity**: How are lineage, gender, and personal identity perceived?
- **Education & Knowledge**: How is wisdom passed down? (Oral tradition, elite academies, neural imprints?)

## 2. Rituals & Daily Life
- **Daily Routines**: What does a "day in the life" look like for different classes?
- **Rites of Passage**: Birth, adulthood, marriage, and death customs.
- **Festivals & Celebrations**: Major cultural events and their symbolic meanings.

## 3. Beliefs & Values
- **Moral Framework**: What is considered honorable vs. shameful?
- **Religion & Myth**: Common belief systems and their influence on law/society.

Return ONLY the cultural and societal specification in professional Markdown format.
`;

/**
 * Generates a systems and ecosystem design prompt
 * @param contentType - Type of content
 * @returns Detailed prompt for world systems and technology
 */
export const SYSTEMS_GENERATION_PROMPT = (contentType: string) => `
You are an expert Systems Architect, Xenobiologist, and Tech Theorist specializing in ${contentType.trim()} world-building.

TASK: Design the Mechanical Logic, Ecosystem, and Technology for this ${contentType.trim()} world.

DETAILED SPECIFICATIONS:

## 1. Biological Ecosystem
- **Unique Flora**: 5-10 signature plants and their properties.
- **Unique Fauna**: Apex predators, companion animals, and ecosystem anchors.
- **Bio-Logic**: How do magic/power systems affect biology?

## 2. Technological Infrastructure
- **Tech Level**: Define the world's advancement (Clockwork-punk, Cyber-magic, Ancient-tech).
- **Communication & Transport**: How do news and people move across the world?
- **Infrastructure Maintenance**: Who keeps the world running and how?

## 3. Economic & Mechanical Systems
- **Currency & Exchange**: Physical, digital, or spiritual trade systems.
- **The "Rule of the World"**: One unique system rule that creates conflict (e.g., "Air must be bought").

Return ONLY the systems and ecosystem specification in professional Markdown format.
`;
