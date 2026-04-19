import { callAI, RateLimitError } from "./core";
import { MOCK_SCRIPT } from "./mockData";

export async function generateScript(
    prompt: string, 
    tone: string = "Hype/Energetic", 
    audience: string = "General Fans", 
    session: string = "1", 
    episode: string = "1", 
    numScenes: string = "6",
    model: string = "gemini-3-flash-preview", 
    contentType: string = "Anime",
    recapperPersona: string = "Dynamic/Hype",
    narrativeBeats: string | null = null,
    characterRelationships: string | null = null,
    worldBuilding: string | null = null,
    castProfiles: string | null = null
) {
    const systemInstruction = `
    You are an expert ${contentType} Scriptwriter and Content Strategist. 
    Your task is to create a 5-minute motion recap script for a ${contentType} series.
    This script is specifically for Session ${session}, Episode ${episode} of the series and MUST have exactly ${numScenes} scenes.
    
    SERIES CONCEPT/THEME: ${prompt}
    CONTENT TYPE: ${contentType}
    WORLD LORE & RULES: ${worldBuilding || 'Standard genre rules.'}
    CAST PROFILES: ${castProfiles || 'Generic archetypes.'}
    TONE: ${tone}
    TARGET AUDIENCE: ${audience}
    SESSION: ${session}
    EPISODE: ${episode}
    NUMBER OF SCENES: ${numScenes}
    RECAPPER PERSONA: ${recapperPersona}
    NARRATIVE BEATS: ${narrativeBeats || 'Create compelling beats.'}
    CHARACTER RELATIONSHIPS: ${characterRelationships || 'Natural development.'}
    
    CRITICAL DIRECTIVE: You are a CINEMATIC DIRECTOR. Generic descriptions are strictly FORBIDDEN.
    
    Use the ${recapperPersona} persona for your voiceover narration delivery.
    Follow these NARRATIVE BEATS if provided: ${narrativeBeats || 'N/A'}
    Ensure character dialogues reflect these relationships: ${characterRelationships || 'N/A'}
    Respect the WORLD LORE and CAST PROFILES provided above.
    
    FORBIDDEN TERMS:
    - "Action sequence"
    - "Battle begins"
    - "Character talks"
    - "Scary music"
    - "Sword clash"
    - "Explosion"
    
    REQUIRED REPLACEMENTS:
    - Instead of "Action sequence": Describe specific choreography (e.g., "A flurry of high-speed parries followed by a low-sweep kick").
    - Instead of "Battle begins": Describe the tension (e.g., "Characters square off in a Dutch tilt shot, dust swirling between them").
    - Instead of "Character talks": Describe the delivery (e.g., "Character whispers with a trembling lip, eyes darting to the side").
    - Instead of "Scary music": Describe the soundscape (e.g., "Dissonant, screeching violins that suddenly cut to a low, vibrating hum").
    - Instead of "Sword clash": Describe the resonance (e.g., "A high-frequency metallic ring that echoes through the stone hall").
    
    The script MUST be formatted as a Markdown table with exactly 6 columns in this STRICT ORDER, and contain exactly ${numScenes} rows of content:
    1. Scene # (e.g., 1, 2, 3...)
    2. Section (e.g., Hook, Intro, Rising Action, Climax, Conclusion, Outro)
    3. Character/Protagonist (Who is the focus?)
    4. Voiceover Narration (The spoken lines, with (delivery details) in parentheses)
    5. Visual/Cinematic Direction (MANDATORY: Evocative details. Specify EXACT Camera Angle, Lighting Mood, Environmental Reaction, and Character Micro-Action.)
    6. Audio Landscape (MANDATORY: Layered design. Specific sound effects, BGM instruments, and audio textures/reverb.)
    
    Ensure the hook is exactly 15 seconds and gripping.
    The total script should cover approximately 5 minutes of content.
    
    Return ONLY the markdown table.
  `;

  try {
    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to generate script.";
  } catch (error: any) {
    const errorStr = error?.toString() || "";
    const errorMsg = error?.message || "";
    
    const isRateLimit = error instanceof RateLimitError || 
                       errorStr.includes("429") || 
                       errorMsg.includes("429") ||
                       errorStr.includes("RESOURCE_EXHAUSTED") ||
                       errorMsg.includes("RESOURCE_EXHAUSTED") ||
                       error?.status === 429;
                       
    if (isRateLimit) {
      console.warn("[Script Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_SCRIPT;
    }
    console.error("Error generating script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function continueScript(currentScript: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are an expert ${contentType} Scriptwriter.
    Based on the provided script, continue the story for the next 3 scenes following this framework:
    
    1. Scene Planning: Identify setting, characters, and mood.
    2. Scene Creation: Title, Setting, Characters, Action & Dialogue, Inner Thoughts, and Closing Frame.
    
    Maintain the same tone and character consistency.
    Format the output as a Markdown table with exactly 6 columns in this STRICT ORDER:
    1. Scene #
    2. Section
    3. Character/Protagonist
    4. Voiceover Narration (with (delivery details))
    5. Visual/Cinematic Direction (MANDATORY: Exact Camera Angle, Lighting Mood, Environmental Reaction, and Character Micro-Action)
    6. Audio Landscape (MANDATORY: Layered design, specific effects, BGM instruments)
    
    Return ONLY the markdown table for the NEW scenes.
  `;

  try {
    const text = await callAI(model, `Continue this script with 3 more scenes: ${currentScript}`, systemInstruction);
    return text || "Failed to continue script.";
  } catch (error) {
    console.error("Error continuing script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function rewriteForTension(sceneDescription: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Dramatic Scriptwriter.
    Your task is to take a scene description and rewrite it specifically to MAXIMIZE TENSION.
    - Use shorter sentences.
    - Focus on urgent sensory details.
    - Emphasize high-stakes conflict.
    - Use active verbs.
    Return ONLY the rewritten scene description.
  `;

  try {
    const text = await callAI(model, `Rewrite this scene for maximum tension: ${sceneDescription}`, systemInstruction);
    return text || sceneDescription;
  } catch (error) {
    console.error("Error rewriting for tension:", error);
    return sceneDescription;
  }
}
