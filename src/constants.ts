export const NARRATIVE_TEMPLATES = {
  "3-Act Structure": "I. Hook: Establish the central problem or goal.\nII. Rising Action: Three escalating trials/conflicts.\nIII. Climax: The ultimate test.\nIV. Resolution: The aftermath and change.",
  "Hero's Journey": "I. Departure: The call to adventure.\nII. Initiation: Going through tests, allies, and enemies.\nIII. Return: Returning with the elixir/knowledge.",
  "Mystery/Thriller": "I. The Crime/Hook: Something goes wrong.\nII. Investigation: Gathering clues and raising stakes.\nIII. Twist: A major change in understanding.\nIV. Confrontation: The truth is revealed."
};

export const COMPOUND_BEATS = {
  "The World-Building Escalation": {
    genre: "Sci-Fi / Fantasy",
    intensity: 6,
    thumbnail: "/cyberpunk_thumbnail_1776537282821.png",
    beats: [
      { label: "Mystery Hook", description: "Introduce a visual or narrative anomaly that defies world rules.", duration: "0:00 - 0:30", intensity: 8, vfx: "Particle distortion, lens flares", audio: "Low-frequency hum, glitch SFX" },
      { label: "Global Stakes", description: "Establish how this anomaly threatens the world order.", duration: "0:30 - 1:30", intensity: 5, vfx: "Wide establishing shots, holographic maps", audio: "Driving orchestral pulse" },
      { label: "Personal Impact", description: "Show how the protagonist is uniquely affected or connected.", duration: "1:30 - 2:30", intensity: 7, vfx: "Close-up micro-expressions, color shift", audio: "Heartbeat thud, muffled ambient" },
      { label: "Lore Drop", description: "Provide a historical context that recontextualizes the threat.", duration: "2:30 - 3:30", intensity: 4, vfx: "Sepia filters, stylized scrolls/UI", audio: "Haunting solo instrument (violin/cello)" },
      { label: "The Shift", description: "The anomaly evolves, leading to a cliffhanger climax.", duration: "3:30 - 5:00", intensity: 9, vfx: "Full-screen white-out, chromatic aberration", audio: "Silence followed by massive bass drop" }
    ]
  },
  "Shonen Tournament Arc": {
    genre: "Action",
    intensity: 9,
    thumbnail: "/shonen_battle_thumbnail_1776537245370.png",
    beats: [
      { label: "The Stakes", description: "Explain the reward and the cost of failure.", duration: "0:00 - 0:45", intensity: 6, vfx: "Trophy/Title reveal, crowd blur", audio: "Hype build-up, announcer voice" },
      { label: "The Rival", description: "Introduce a psychological or physical mirror to the hero.", duration: "0:45 - 2:00", intensity: 7, vfx: "Split screen, aura clash", audio: "Electric guitar riffs, metallic clashing" },
      { label: "Mechanical Struggle", description: "The hero faces an ability that seems impossible to counter.", duration: "2:00 - 3:30", intensity: 8, vfx: "Slow-motion impacts, negative color flashes", audio: "Dissonant strings, rhythmic impact SFX" },
      { label: "The Breakthrough", description: "A flashback or realization unlocks a secret technique.", duration: "3:30 - 4:30", intensity: 10, vfx: "Blinding light, energy particles/lightning", audio: "Orchestral climax, thematic leitmotif" },
      { label: "The Aftermath", description: "Victory or loss with an emotional hook for the next fight.", duration: "4:30 - 5:00", intensity: 5, vfx: "Slow pan to the sky, dust settling", audio: "Fading reverb, melancholic piano" }
    ]
  },
  "Psychological Deconstruction": {
    genre: "Horror / Drama",
    intensity: 8,
    thumbnail: "/dream_detective_thumbnail_1776537317644.png",
    beats: [
      { label: "False Normalcy", description: "Establish a slice-of-life vibe with subtle, uncanny details.", duration: "0:00 - 1:00", intensity: 2, vfx: "Warm lighting, static camera", audio: "Cheerful but slightly out-of-tune BGM" },
      { label: "The Crack", description: "A single event shatters the illusion of reality.", duration: "1:00 - 2:00", intensity: 7, vfx: "Jittery camera, mirror glitches", audio: "High-pitched ringing, sudden silence" },
      { label: "Mental Labyrinth", description: "Protagonist's internal monologue begins to override reality.", duration: "2:00 - 3:30", intensity: 8, vfx: "Surreal geometry, perspective shifts", audio: "Layered whispers, reversed audio" },
      { label: "The Void", description: "The core truth is revealed, often tragic or surreal.", duration: "3:30 - 4:30", intensity: 9, vfx: "Void/Black background, single spotlight", audio: "Sub-bass rumble, distorted scream" },
      { label: "Acceptance/Collapse", description: "The protagonist is changed forever, ending in ambiguity.", duration: "4:30 - 5:00", intensity: 6, vfx: "Slow zoom on eye, fade to gray", audio: "Single sustained note, wind noise" }
    ]
  },
  "Isekai Progression": {
    genre: "Fantasy",
    intensity: 7,
    thumbnail: "/dark_isekai_thumbnail_1776537262155.png",
    beats: [
      { label: "System Arrival", description: "The protagonist learns the 'rules' of the new world.", duration: "0:00 - 0:45", intensity: 4, vfx: "Blue floating UI screens, magical dust", audio: "Video game UI sounds (clicks/pings)" },
      { label: "Grind Phase", description: "Montage of adaptation and overcoming initial hurdles.", duration: "0:45 - 2:00", intensity: 5, vfx: "Training montage cuts, stat bars rising", audio: "Upbeat synth-pop or lo-fi beats" },
      { label: "The Anomaly", description: "Protag encounters something their 'system' can't explain.", duration: "2:00 - 3.15", intensity: 7, vfx: "Dark energy, screen glitches/error signs", audio: "Low synth drone, alarm sound" },
      { label: "Dominance", description: "Applying 'earth logic' to bypass local fantasy limitations.", duration: "3:15 - 4:15", intensity: 9, vfx: "Explosive magic, massive scale shots", audio: "Epic brass-heavy orchestral" },
      { label: "Political Hook", description: "The local powers take notice, escalating the stakes.", duration: "4:15 - 5:00", intensity: 8, vfx: "Shadowy council reveal, looming castle", audio: "Ominous choir, heavy drums" }
    ]
  },
  "High-School Romance": {
    genre: "Romance / Slice of Life",
    intensity: 4,
    thumbnail: "/supernatural_school_thumbnail_1776537301525.png",
    beats: [
      { label: "Ordinary Day", description: "Establish the mundane routine and the protagonist's yearning.", duration: "0:00 - 1:00", intensity: 2, vfx: "Soft sun flares, cherry blossom petals", audio: "Lofi piano, ambient school noise" },
      { label: "The Inciting Encounter", description: "A chance meeting that disrupts the daily rhythm.", duration: "1:00 - 1:45", intensity: 5, vfx: "Slow-motion close-ups, depth of field shift", audio: "Sudden chime, heartbeat skip" },
      { label: "The Misunderstanding", description: "A social complication that builds emotional distance.", duration: "1:45 - 3:00", intensity: 6, vfx: "Cool color grading, rain or overcast sky", audio: "Melancholic strings, distant thunder" },
      { label: "The Truth", description: "A vulnerable moment where the mask slips and honesty emerges.", duration: "3:00 - 4:15", intensity: 8, vfx: "Golden hour glow, fireworks or heavy rain", audio: "Uplifting orchestral swell" },
      { label: "New Connection", description: "A status quo shift that leaves the audience wanting more.", duration: "4:15 - 5:00", intensity: 3, vfx: "Fading soft focus, character silhouettes", audio: "Sweet, acoustic guitar melody" }
    ]
  },
  "Noir Mystery": {
    genre: "Crime / Thriller",
    intensity: 7,
    thumbnail: "/detective_noir_thumbnail_1776537665824.png",
    beats: [
      { label: "The Discovery", description: "A crime scene or an impossible clue is revealed.", duration: "0:00 - 0:45", intensity: 7, vfx: "Desaturated colors, high contrast shadows", audio: "Low brass notes, dripping water SFX" },
      { label: "Shadowy Interviews", description: "Gathering intel while uncovering the rot in society.", duration: "0:45 - 2:00", intensity: 4, vfx: "Cigarette smoke, blinds casting bars of light", audio: "Slow jazz saxophone, muffled traffic" },
      { label: "The Red Herring", description: "A confrontation with the wrong suspect raises the stakes.", duration: "2:00 - 3:30", intensity: 8, vfx: "Fast cuts, tilted camera angles", audio: "Tense violin staccato, heavy breathing" },
      { label: "The Revelation", description: "The pieces fall into place, revealing a shocking truth.", duration: "3:30 - 4:30", intensity: 9, vfx: "Flickering neon lights, zoom on evidence", audio: "Sudden electronic pulse, silence" },
      { label: "The Compromise", description: "Justice is served, but at a moral cost to the detective.", duration: "4:30 - 5:00", intensity: 6, vfx: "Rainy street, fading to black", audio: "Low, somber piano theme" }
    ]
  },
  "Battle Royale": {
    genre: "Death Game / Action",
    intensity: 10,
    thumbnail: "/survival_game_thumbnail_1776537679688.png",
    beats: [
      { label: "The Drop", description: "Characters are introduced as they enter the kill zone.", duration: "0:00 - 0:30", intensity: 9, vfx: "Glitchy HUD overlay, fast tracking shots", audio: "Sirens, industrial techno beat" },
      { label: "First Contact", description: "The initial purge begins, demonstrating the lethality.", duration: "0:30 - 1:30", intensity: 8, vfx: "Impact flashes, blood splatters (stylized)", audio: "Gunshots, metallic clanging, screams" },
      { label: "Uneasy Alliance", description: "Forced cooperation under the threat of immediate death.", duration: "1:30 - 3:00", intensity: 5, vfx: "Close-ups on eyes, campfire lighting", audio: "Suspenseful synth drone, crackling fire" },
      { label: "The Betrayal", description: "A sudden turn as the countdown forces hands.", duration: "3:00 - 4:15", intensity: 10, vfx: "Shattering glass, extreme high angle", audio: "Sharp orchestral sting, bass impact" },
      { label: "The Lone Survivor", description: "One stands among the ruins, scarred and changed.", duration: "4:15 - 5:00", intensity: 7, vfx: "Wide desolate shot, dust and ash", audio: "Distant wind, fading choir" }
    ]
  }
};

export const SCRIPT_TEMPLATE = `
| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| **Hook (0:00 - 0:15)** | [Gripping 15-second hook text] | [Extreme close-up on eyes, dynamic speed lines. Lighting: Harsh rim light, high contrast.] | [Sudden bass drop, high-pitched ring, or intense rhythmic percussion] |
| **Intro (0:15 - 1:00)** | [Introduction to the world/character] | [Slow pan across environment, character reveal with low-angle hero shot. Lighting: Soft volumetric god rays.] | [Atmospheric ambient noise, subtle orchestral build-up] |
| **Rising Action (1:00 - 2:30)** | [Core conflict, initial events] | [Dutch tilts for tension, fast-paced tracking shots. Lighting: Flickering strobe or dynamic shadows.] | [Metallic clashing SFX, suspenseful strings building to a crescendo] |
| **Climax (2:30 - 4:00)** | [Peak of the story, major reveal] | [Slow-motion impact shots, extreme close-ups. Lighting: Intense bloom, saturated colors.] | [Epic orchestral peak, layered explosion SFX with deep resonance] |
| **Conclusion (4:00 - 4:45)** | [Resolution, aftermath] | [Fading shots to black, character looking into the distance. Lighting: Warm golden hour glow.] | [Melancholic piano melody, fading ambient wind/fire SFX] |
| **Outro (4:45 - 5:00)** | [Call to action, cliffhanger] | [End card with social links, stylized character silhouette. Lighting: Silhouette against neon backlight.] | [Upbeat/Catchy outro theme with a final sharp SFX sting] |

### Character Archetypes:
[Suggested character archetypes and backstories will appear here]
`;

export const DARK_FANTASY_EXAMPLE = `
| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| **Hook (0:00 - 0:15)** | "They called him a savior. But as the seal on his chest cracks, the world will realize... he was never the hero. He was the cage for the King of Calamity." | Extreme close-up of a young man's eyes snapping open, pupils constricting as they glow crimson. A low-angle shot shows a black, vein-like seal on his chest shattering into obsidian shards. | [SFX: Deep, resonant heartbeat thud; high-pitched glass shattering with magical reverb. BGM: Low, ominous bass drop that vibrates the air.] |
| **Intro (0:15 - 1:00)** | "In the kingdom of Eldoria, legends speak of the Vessel—a mortal born to contain the soul of the Monster King, Typhon. Meet Kael, a boy who has spent eighteen years in a silent prison, unaware of the god-slayer sleeping within his blood." | Wide establishing shot of a desolate, gothic cathedral under a blood-moon. Slow pan down to Kael chained in a glowing ritual circle. Dust motes dance in sharp shafts of moonlight; Kael's head is bowed, hair shadowing his face. | [SFX: Wind howling through cracked stone pillars; distant, rhythmic chanting. BGM: Melancholic, haunting choir with a solo cello.] |
| **Rising Action (1:00 - 2:30)** | "The ritual is failing. The cult of the Crimson Moon has arrived to claim their king. As the temple walls crumble, Kael feels a voice—cold, ancient, and hungry—whispering from the shadows of his own mind." | Dutch tilt shot as shadowy figures in red robes storm the cathedral. Close-up on Kael's chains melting into viscous black smoke. A tracking shot follows his shadow as it grows ten times its size, morphing into a multi-eyed monstrous silhouette. | [SFX: Steel clashing with sparks; layered, multi-tonal demonic whispers. BGM: Fast-paced, aggressive orchestral strings and heavy war drums.] |
| **Climax (2:30 - 4:00)** | "The seal breaks. Typhon doesn't just wake up; he consumes. Kael watches in horror as his own hand turns to obsidian claw, tearing through the high priest like paper. 'Finally,' the King roars, 'I am home.'" | Slow-motion tracking shot of Kael's arm transforming into a jagged claw. A massive explosion of black energy ripples outward, leveling stone pillars. Kael stands amidst the ruins, a low-angle shot revealing his half-human, half-monstrous deity form. | [SFX: Earth-shaking guttural roar; deafening energy blast with a high-frequency ring. BGM: Epic, high-stakes gothic opera with a thunderous pipe organ.] |
| **Conclusion (4:00 - 4:45)** | "The cult is gone, but so is the boy. Kael is still there, trapped in a corner of his mind, watching as the Monster King begins his march toward the capital. The savior has become the end of the world." | High-angle shot of Kael/Typhon walking away from the burning cathedral ruins. The sky transitions to a deep, bruised purple. Close-up on Kael's face: a single, crystalline tear falls from his remaining human eye before it too turns red. | [SFX: Fire crackling and wood splintering; heavy, metallic footsteps on gravel. BGM: Somber, tragic piano melody with a fading violin.] |
| **Outro (4:45 - 5:00)** | "Is there any hope for Kael, or is the Monster King's reign absolute? Subscribe to find out in Part 2. Don't forget to like if you want more Dark Fantasy recaps!" | End card with 'Part 2 Coming Soon' in stylized gothic font. Split-screen visual: Kael's innocent past self on the left, the Monster King's silhouette on the right. | [SFX: Sharp sword unsheathing; digital glitch transition. BGM: High-energy, synth-heavy outro theme.] |

### Character Archetypes for this Story:

*   **Kael (The Cursed Vessel)**: A soft-spoken boy with silver hair and a hidden crimson seal. He spent his life in isolation, fearing the power within him.
*   **Typhon (The King of Calamity)**: An ancient, arrogant deity with obsidian skin and multiple glowing eyes. He views mortals as mere insects or temporary housing.
*   **High Priest Malakor (The Fanatical Architect)**: A scarred man in crimson robes who believes that unleashing Typhon is the only way to "purify" the world.
`;
