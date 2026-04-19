import { callAI, RateLimitError } from "./core";
import { MOCK_WORLD } from "./mockData";

export async function generateWorld(prompt: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are an expert ${contentType} World Builder and Lore Architect.
    Based on the provided prompt, design a comprehensive world setting for a ${contentType} series.
    
    Provide:
    - **World Name & Concept**: (e.g., "Aetheria: The Floating Isles")
    - **Physical Geography & Atmosphere**: (Visual descriptions of environments, lighting, and climate)
    - **Societal Structure & Power Systems**: (Rules of the world, magic/tech systems, social hierarchy)
    - **Current Political/Global Conflict**: (The major tension in the world)
    - **Unique Lore/Legends**: (Interesting historical or mythical elements)
    - **Recap Setting Tips**: (How to best visualize this world in a 5-minute recap)
    
    Format the output as professional world-building documentation in Markdown.
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
