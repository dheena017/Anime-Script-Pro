import { callAI } from "./core";

export async function generateSeriesPlan(prompt: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are a YouTube Content Strategist.
    Based on the provided ${contentType} concept, create a 3-part series plan (Part 1, Part 2, Part 3).
    For each part, provide:
    - **Catchy Title** (High-impact)
    - **Dramatic Arc Summary** (Focus on conflict and tension)
    - **Major Cliffhanger** (The hook for the next part)
    - **Cinematic Link/Transition** (How does this set up the visual and narrative stakes for the next episode?)
    
    Format the output in clean, structured Markdown for a series arc.
  `;

  try {
    const text = await callAI(model, `Generate a 3-part series plan for: ${prompt}`, systemInstruction);
    return text || "Failed to generate series plan.";
  } catch (error) {
    console.error("Error generating series plan:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
