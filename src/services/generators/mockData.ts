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
# Local Synthesis: World Lore
*Generated via fallback logic due to API Rate Limit*

## Core Concept
An industrial-future landscape where neural architecture dictates reality.

## The Friction
The divide between those with high-tier AI processing and those living in the "Manual Deadzones."

## Visual Keys
High-contrast shadows, neon-etched tactical gear, atmospheric lens flares.
`;

export const MOCK_SERIES_PLAN = [
  { episode: "01", title: "The Neural Spark", hook: "A manual scavenger discovers a high-tier processing core." },
  { episode: "02", title: "Static Echoes", hook: "The city's security AI detects an unauthorized frequency." },
  { episode: "03", title: "Manual Override", hook: "A rebellion forms in the deadzones as the core begins to talk." },
  { episode: "04", title: "Protocol 429", hook: "The main AI enters a forced cool-down, creating chaos." },
  { episode: "05", title: "System Reboot", hook: "A new architectural order emerges from the digital dust." }
];

export const MOCK_SCRIPT = `
| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| **Hook** | "The AI Engine is recharging, but the story never stops." | Low-angle shot of the city, rain slicked streets. | [SFX: Thunder, deep bass.] |
| **Synthesis** | "Establishing the local narrative framework while we wait for neural sync." | High-speed data streams flowing over character faces. | [BGM: Pulse-heavy synth theme.] |
| **Outro** | "Stay tuned for the higher-tier AI generation once the quota resets." | Character silhouette against the setting sun. | [BGM: Fading somber theme.] |
`;
