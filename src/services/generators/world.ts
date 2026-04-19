import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";

export async function generateWorld(prompt: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are an expert ${contentType} World Builder and Lore Architect.
    Based on the provided prompt, design a comprehensive world setting for a ${contentType} series.
    
    Provide a deep-dive specification including:
    - **World Name & High Concept**: (The elevator pitch for the setting)
    - **Visual Architecture**: (Camera styles, color palettes, lighting mood, and recurring visual motifs)
    - **Physical Geography & Climate**: (Visual descriptions of environments and environmental hazards)
    - **Power Systems & Social Laws**: (The 'Magic' or 'Tech' rules, social hierarchy, and forbidden acts)
    - **The Core Conflict**: (The underlying friction that drives the story)
    - **Chronicle of Eras**: (Brief history segments: Genesis, The Great Shift, and The Current State)
    - **Flora & Fauna / Tech Specs**: (Unique creatures or signature technology)
    - **Sensory Palette**: (Dominant colors, ambient sound textures, and environmental smells)
    
    Format the output as professional world-building documentation (Lore Bible style) in Markdown with clear headers.
    Return ONLY the world description.
  `;

  try {
    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to generate world lore.";
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
      console.warn("[World Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_WORLD;
    }
    console.error("Error generating world:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
