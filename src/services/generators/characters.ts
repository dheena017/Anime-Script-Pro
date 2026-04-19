import { callAI, RateLimitError } from "./core";
import { MOCK_CHARACTERS } from "./mockData";

export async function generateCharacters(genre: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are an expert ${contentType} Character Designer and Story Consultant.
    Based on the provided genre or theme, suggest 3 unique character archetypes that would fit perfectly into a 5-minute motion recap of a ${contentType} series.
    
    For each character, provide:
    - **Name & Archetype**: (e.g., "Kael, The Cursed Vessel")
    - **Visual Persona**: (Detailed description of visual design, colors, and unique features - crucial for the Storyboard)
    - **Backstory & Motivation**: (Impactful backstory driving their actions)
    - **Personality & Behavioral Traits**: (Key traits influencing dialogue delivery)
    - **Core Conflict**: (What stands in their way?)
    - **Role in the Recap**: (Their specific narrative function)
    
    Format the output as professional character sheets in Markdown, focusing on visual and dramatic impact.
    Return ONLY the character suggestions.
  `;

  try {
    const text = await callAI(model, `Generate characters for the genre: ${genre}`, systemInstruction);
    return text || "Failed to generate characters.";
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
      console.warn("[Cast Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_CHARACTERS;
    }
    console.error("Error generating characters:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
