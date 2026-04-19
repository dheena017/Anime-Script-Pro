import { callAI, RateLimitError } from "./core";
import { MOCK_SERIES_PLAN } from "./mockData";

export async function generateSeriesPlan(prompt: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime", episodeCount: number = 5) {
  const systemInstruction = `
    You are a YouTube Content Strategist for ${contentType}.
    Based on the provided concept, create a ${episodeCount}-episode production plan.
    
    Return ONLY a JSON array of objects:
    [
      {
        "episode": "01",
        "title": "High-Impact Catchy Title",
        "hook": "The dramatic hook or cliffhanger for this episode"
      }
    ]
    
    Ensure the arc has a logical progression and high-stakes tension across all ${episodeCount} episodes.
    Return ONLY the raw JSON array.
  `;

  try {
    const text = await callAI(model, `Generate a ${episodeCount}-episode production plan for: ${prompt}`, systemInstruction);
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
      console.warn("[Series Lab] API Quota Exceeded. Injecting Local Synthesis Failover.");
      return MOCK_SERIES_PLAN;
    }
    console.error("Error generating series plan:", error);
    return null;
  }
}
