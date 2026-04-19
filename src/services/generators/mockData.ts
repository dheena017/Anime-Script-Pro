/**
 * NEURAL PROXY FALLBACK DATA
 * Used when the Gemini API Quota is exhausted (Error 429).
 * Ensures the studio remains functional for structural testing. 
 */

export const MOCK_NARRATIVE_BEATS = [
  {
    label: "Local Mystery Hook",
    description: "The AI Engine is currently cooling down to manage your daily free quota. In the meantime, the studio has generated this local structural blueprint for your concept.",
    duration: "0:00 - 0:45",
    intensity: 8,
    vfx: "Atmospheric lens flares, desaturated colors",
    audio: "Low-frequency hum with sudden sharp pings"
  },
  {
    label: "Local Setup Phase",
    description: "Establishing the core ideological conflict while the neural sync waits for a refresh on your API plan.",
    duration: "0:45 - 2:00",
    intensity: 5,
    vfx: "Slow tracking shots of the environment",
    audio: "Rhythmic bass-heavy background score"
  },
  {
    label: "Synthesis Climax",
    description: "The peak narrative tension as the local engine maintains the production flow.",
    duration: "2:00 - 4:00",
    intensity: 10,
    vfx: "High-contrast rim lighting and negative color flashes",
    audio: "Epic orchestral peak with layered impacts"
  },
  {
    label: "Local Resolution",
    description: "The aftermath is established. You can re-roll these beats once the API quota backoff ends.",
    duration: "4:00 - 5:00",
    intensity: 3,
    vfx: "Fade to black with white particle effects",
    audio: "Single melancholic piano note sustained"
  }
];

export const MOCK_CHARACTERS = `
# Local Synthesis: Character Cast
*Generated via fallback logic due to API Rate Limit*

## 1. The Protag (Lead)
- **Archetype**: The Reluctant Vessel
- **Trait**: High emotional intelligence / Hidden power
- **Visual**: Silver hair, tactical gear, glowing eyes.

## 2. The Mirror (Rival)
- **Archetype**: The Perfect Solider
- **Trait**: Disciplined / Secretly Jealous
- **Visual**: Dark robes, elegant blade, stoic expression.
`;

export const MOCK_WORLD = `
# WORLD SPECIFICATION: THE NEURAL NEXUS
*Local Synthesis Fallback (API Backup)*

## 1. High Concept
A hyper-dense industrial sprawl where physical space is leased based on cognitive output. The "Nervous System" of the city is literally powered by the dreams of the lower-class.

## 2. Visual Architecture
- **Lighting**: Chiaroscuro high-contrast. Flickering neon against absolute pitch black.
- **Motifs**: Exposed wiring that looks like creeping vines, holographic eyes in the sky.
- **Cam Styles**: Dutch tilts and low-angle extreme close-ups on machinery.

## 3. Physical Geography
The city is built in a "Deep Stack" format. The further down you go, the denser the oxygen becomes and the more archaic the technology appears.

## 4. Power Systems
- **The Sync**: A wireless neural link that grants processing power for miracles but causes "Data Bleed" (memory loss).
- **Social Law**: Disconnecting for more than 4 hours is considered "Neural Trespassing" and is punishable by total memory wipe.

## 5. Chronicle of Eras
- **Genesis**: The First Connection (The day the cloud became the sky).
- **The Great Shift**: The Severing (When half the population lost access to the Nexus).
- **The Current State**: The Quiet Revolution (Manual laborers learning to code via muscle memory).

## 6. Sensory Palette
- **Colors**: Electric Cyan, Warning Orange, Ash Grey.
- **Audio**: Constant low-frequency server hum, rhythmic metallic clanging, static whispers.
`;

export const MOCK_SERIES_PLAN = [
  { episode: "01", title: "The Neural Spark", hook: "A manual scavenger discovers a high-tier processing core." },
  { episode: "02", title: "Static Echoes", hook: "The city's security AI detects an unauthorized frequency." },
  { episode: "03", title: "Manual Override", hook: "A rebellion forms in the deadzones as the core begins to talk." },
  { episode: "04", title: "Protocol 429", hook: "The main AI enters a forced cool-down, creating chaos." },
  { episode: "05", title: "System Reboot", hook: "A new architectural order emerges from the digital dust." }
];

export const MOCK_SCRIPT = `
| Scene # | Section | Character/Protagonist | Voiceover Narration | Visual/Cinematic Direction | Audio Landscape |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Hook** | The Protag | "The AI Engine is recharging, but the story never stops." | Low-angle shot of the city, rain slicked streets. | [SFX: Thunder, deep bass.] |
| 2 | **Synthesis** | AI System | "Establishing the local narrative framework while we wait for neural sync." | High-speed data streams flowing over character faces. | [BGM: Pulse-heavy synth theme.] |
| 3 | **Outro** | The Mirror | "Stay tuned for the higher-tier AI generation once the quota resets." | Character silhouette against the setting sun. | [BGM: Fading somber theme.] |
`;
