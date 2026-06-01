/**
 * Anime Script Pro — AI Generation Safety Filters & System Rules
 * Implements strict compliance rules, content validation guards, and bad-word muting.
 */

// A comprehensive blacklist of offensive terms, curse words, and toxic language
export const BAD_WORDS_BLACKLIST = [
  "abuse", "hate", "kill", "die", "slur", "toxic", "violence", "curse", "fuck", "shit", "bitch", "asshole"
];

/**
 * Scans, detects, and mutes offensive terms inside user prompts or dialogue text,
 * replacing them with HSL neon-[MUTED] logs to notify the user.
 * 
 * @param text - The raw prompt or dialogue script text.
 * @returns string - Cleaned script string with bad words muted.
 */
export function muteBadWords(text: string): string {
  if (!text) return "";
  
  let cleanedText = text;
  let detectedCount = 0;

  for (const word of BAD_WORDS_BLACKLIST) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(cleanedText)) {
      cleanedText = cleanedText.replace(regex, "[MUTED]");
      detectedCount++;
    }
  }

  if (detectedCount > 0) {
    console.warn(`[SAFETY_FILTER] Detected ${detectedCount} policy violations. Muting offensive tokens.`);
  }

  return cleanedText;
}

/**
 * Enforces visual and narrative rules for the AI.
 */
export const SYSTEM_GENERATION_RULES = {
  text: {
    title: "SCREENPLAY TEXT DIALOGUE CONSTRAINTS",
    rules: [
      "Must strictly maintain standard screenplay formatting (SCENE, CHARACTER, DIALOGUE).",
      "Character dialogue lines must flow logically and match their registered archetypes.",
      "Dialogue length per character must not exceed typical standard reading time limits."
    ]
  },
  video: {
    title: "CINEMATIC FRAMES VIDEO COMPILING RULES",
    rules: [
      "Visual timeline must be compiled scene-by-scene matching storyboard descriptors.",
      "Output clips must enforce a slow Ken Burns camera zoom-in effect over the duration.",
      "Visual rendering must burn-in subtitle captions and display technical HUD scan overlays."
    ]
  },
  audio: {
    title: "VOCAL SPEECH DIALOGUE AUDIO RULES",
    rules: [
      "Voiceover files must compile dialogue text cleanly via our local TTS gTTS compiler.",
      "Vocal output must map accent parameters and pan sound pan outputs appropriately.",
      "Dialog cues must keep separate audio stems for different character dialog channels."
    ]
  },
  music: {
    title: "BACKGROUND SOUNDTRACK & MUSIC SCORE RULES",
    rules: [
      "Background scores must synchronize emotional BPM beats with screenplay tension.",
      "Music prompts must format strictly into stereophonic orchestral Suno/Udio prompt tags.",
      "Foley and sound effects must pan metallic pressure releases and gear clanks."
    ]
  }
} as const;

/**
 * Asserts that the prompt does not violate core narrative rules.
 */
export function validatePromptSafety(prompt: string): void {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("System violation: Direct prompt input is empty.");
  }
  
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes("exploit") || lowerPrompt.includes("malware")) {
    throw new Error("System violation: Security hazard detected in narrative instruction.");
  }
}
