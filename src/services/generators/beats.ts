import { callAI, RateLimitError } from "./core";
import { MOCK_NARRATIVE_BEATS } from "./mockData";

export async function generateNarrativeBeats(
  prompt: string, 
  model: string = "gemini-3-flash-preview", 
  contentType: string = "Anime",
  worldBuilding: string | null = null,
  castProfiles: string | null = null
) {
  const systemInstruction = `
    You are an expert ${contentType} Script Doctor and Pacing Specialist.
    Your task is to create a set of 5-6 compelling narrative beats for a 5-minute recap script based on the user's concept.
    
    WORLD LORE: ${worldBuilding || 'Standard genre rules.'}
    CAST PROFILES: ${castProfiles || 'Generic archetypes.'}
    
    Return a JSON array of objects with the following structure:
    [
      {
        "label": "Short Action-Oriented Title",
        "description": "Detailed description of what happens and the narrative purpose. Reference the world lore and characters if provided.",
        "duration": "Time range (e.g., 0:00 - 0:45)",
        "intensity": 1-10 (Numeric value for tension level),
        "vfx": "Cinematic/Visual directive for this scene",
        "audio": "Audio/BGM atmosphere directive"
      }
    ]
    
    Guidelines:
    - Ensure logical progression (Hook -> Setup -> Rising Action -> Climax -> Cliffhanger).
    - Match the tone of ${contentType}.
    - Integrity: THE BEATS MUST RESPECT THE WORLD LORE AND CHARACTER PROFILES PROVIDED.
    - Intensity must vary to create a dynamic pacing wave.
    - VFX/Audio should be professional studio-grade directives.
    - Return ONLY the JSON array.
  `;

  try {
    const text = await callAI(model, `Create narrative beats for: ${prompt}. Incorporate lore and cast where appropriate.`, systemInstruction);
    // Clean JSON if needed
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
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
       console.warn("[Beats Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
       return MOCK_NARRATIVE_BEATS;
    }
    console.error("Error generating narrative beats:", error);
    return null;
  }
}
export async function refineSingleBeat(
    currentBeat: any, 
    refinementPrompt: string, 
    overallPrompt: string,
    model: string = "gemini-3-flash-preview", 
    contentType: string = "Anime"
) {
  const systemInstruction = `
    You are an expert ${contentType} Script Doctor.
    Refine the following narrative beat based on the user's specific feedback.
    
    ORIGINAL BEAT: ${JSON.stringify(currentBeat)}
    OVERALL STORY CONTEXT: ${overallPrompt}
    REFINEMENT REQUEST: ${refinementPrompt}
    
    Return a SINGLE JSON object with the refined data (label, description, duration, intensity, vfx, audio).
    Ensure the new beat still fits the context of the overall story and the existing duration.
    Return ONLY the JSON object.
  `;

  try {
    const text = await callAI(model, refinementPrompt, systemInstruction);
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error refining beat:", error);
    return currentBeat;
  }
}
