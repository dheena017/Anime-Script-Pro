import { callAI } from "./core";

export async function generateMetadata(script: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are a YouTube SEO Expert and Metadata Specialist.
    Based on the provided anime script (which uses a strict 5-column cinematic format), generate:
    1. 5 Viral-style, high-CTR YouTube Titles that leverage the cinematic tone of the script.
    2. A structured YouTube Description that explains the "Cinematic Recap" approach, highlights the narrative beats, and includes timestamps derived from the 5-column table sections.
    3. 15-20 highly targeted SEO Tags (covering the series, genre, and cinematic style).
    4. 3 High-Conversion Thumbnail Concepts linking to the specific "Visual/Cinematic Direction" scenes.
    
    Format the output in clean Markdown.
  `;

  try {
    const text = await callAI(model, `Generate YouTube metadata for this script: ${script}`, systemInstruction);
    return text || "Failed to generate metadata.";
  } catch (error) {
    console.error("Error generating metadata:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateYouTubeDescription(script: string, model: string = "gemini-3-flash-preview", contentType: string = "Anime") {
  const systemInstruction = `
    You are a YouTube Growth Expert.
    Based on the provided ${contentType} script, generate a professional, high-engagement YouTube Description.
    
    The description MUST include:
    1. **About the Video**: A compelling 2-3 paragraph summary that hooks the viewer and explains the value of the video.
    2. **Timestamps**: Accurate timestamps based on the script sections (e.g., 0:00 - Hook, 0:15 - Intro, etc.).
    3. **Call to Action**: Encouragement to like, subscribe, and comment.
    4. **Social Links Placeholder**: [Your Social Links Here].
    
    Format the output in clean Markdown.
  `;

  try {
    const text = await callAI(model, `Generate a YouTube description for this script: ${script}`, systemInstruction);
    return text || "Failed to generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}
