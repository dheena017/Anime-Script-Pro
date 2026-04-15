import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function callAI(model: string, prompt: string, systemInstruction: string) {
  // Use Gemini directly if it's a Gemini model
  if (model.includes("gemini")) {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  }

  // Otherwise, call our backend proxy for other providers
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, systemInstruction }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate content");
  }

  const data = await response.json();
  return data.text;
}

export async function generateAnimeScript(prompt: string, tone: string = "Hype/Energetic", audience: string = "General Fans", model: string = "gemini-3-flash-preview") {
    const systemInstruction = `
    You are an expert Anime Scriptwriter and YouTube Strategist. 
    Your task is to create a 5-minute motion comic or anime recap script.
    
    TONE: ${tone}
    TARGET AUDIENCE: ${audience}
    
    CRITICAL DIRECTIVE: You are a CINEMATIC DIRECTOR. Generic descriptions are strictly FORBIDDEN.
    
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
    
    The script MUST be formatted as a Markdown table with exactly 4 columns in this STRICT ORDER:
    1. Section (e.g., Hook, Intro, Rising Action, Climax, Conclusion, Outro)
    2. Voiceover Narration (The spoken lines)
    3. Visual/Scene Description (MANDATORY: Be highly evocative. Suggest specific camera angles, lighting moods, and character actions. For example, instead of 'Character walks into a room,' write 'Medium shot, character walks into a dimly lit room, light catching dust particles in the air'.)
    4. Sound Effect/BGM Cues (MANDATORY: Layered sound design. Specify reverb, pitch, and specific instrumental textures.)
    
    Ensure the hook is exactly 15 seconds and gripping.
    The total script should cover approximately 5 minutes of content.
    
    Return ONLY the markdown table.
  `;

  try {
    const text = await callAI(model, prompt, systemInstruction);
    return text || "Failed to generate script.";
  } catch (error) {
    console.error("Error generating script:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateMetadata(script: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are a YouTube SEO Expert and Metadata Specialist.
    Based on the provided anime script, generate:
    1. 5 Viral-style YouTube Titles (High CTR).
    2. A structured YouTube Description (including a "About the Video" section and suggested timestamps).
    3. 15-20 SEO Tags.
    4. 3 Thumbnail Concepts (Detailed descriptions of the visual and text overlays).
    
    Format the output in clean Markdown with clear headings.
  `;

  try {
    const text = await callAI(model, `Generate YouTube metadata for this script: ${script}`, systemInstruction);
    return text || "Failed to generate metadata.";
  } catch (error) {
    console.error("Error generating metadata:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateImagePrompts(script: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an AI Image Prompt Engineer.
    Based on the "Visual/Scene Description" column of the provided anime script, generate 5-8 highly detailed image prompts suitable for Midjourney or Stable Diffusion.
    
    Each prompt should include:
    - Subject description
    - Art style (Anime, high-quality, detailed)
    - Lighting and atmosphere
    - Camera angle
    - Specific keywords for quality (e.g., "8k, masterpiece, highly detailed")
    
    Format as a numbered list in Markdown.
  `;

  try {
    const text = await callAI(model, `Generate image prompts for this script: ${script}`, systemInstruction);
    return text || "Failed to generate image prompts.";
  } catch (error) {
    console.error("Error generating image prompts:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateSeriesPlan(prompt: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are a YouTube Content Strategist.
    Based on the provided anime concept, create a 3-part series plan (Part 1, Part 2, Part 3).
    For each part, provide:
    - A catchy title
    - A brief summary of the arc
    - The major cliffhanger for that part
    - The Link/Transition to the next episode (How does this episode directly set up the next one?)
    
    Format the output in clean Markdown.
  `;

  try {
    const text = await callAI(model, `Generate a 3-part series plan for: ${prompt}`, systemInstruction);
    return text || "Failed to generate series plan.";
  } catch (error) {
    console.error("Error generating series plan:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function generateCharacters(genre: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Anime Character Designer and Story Consultant.
    Based on the provided genre or theme, suggest 3 unique character archetypes that would fit perfectly into a 5-minute motion comic or recap.
    
    For each character, provide:
    - **Name & Archetype**: (e.g., "Kael, The Cursed Vessel")
    - **Backstory**: A compelling, high-impact backstory (3-4 sentences).
    - **Personality & Traits**: Key personality quirks and behavioral traits.
    - **Key Motivations**: What drives this character in the story?
    - **Visual Design**: Specific, vivid visual traits (e.g., "Silver hair, crimson glowing seal on chest, obsidian-clawed hand").
    - **Special Abilities/Skills**: Unique powers or expertise relevant to the genre.
    - **Narrative Role**: Their specific purpose and arc in this 5-minute script.
    
    Format the output as professional character sheets in Markdown, using clear headings, bold labels, and bullet points.
    Return ONLY the character suggestions.
  `;

  try {
    const text = await callAI(model, `Generate characters for the genre: ${genre}`, systemInstruction);
    return text || "Failed to generate characters.";
  } catch (error) {
    console.error("Error generating characters:", error);
    return "Error: " + (error instanceof Error ? error.message : String(error));
  }
}

export async function continueAnimeScript(currentScript: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Anime Scriptwriter.
    Based on the provided script, continue the story for the next 3 scenes following this framework:
    
    1. Scene Planning: Identify setting, characters, and mood.
    2. Scene Creation: Title, Setting, Characters, Action & Dialogue, Inner Thoughts, and Closing Frame.
    
    Maintain the same tone and character consistency.
    Format the output as a Markdown table with the same 4 columns:
    1. Section
    2. Voiceover Narration
    3. Visual/Scene Description (MANDATORY: Be highly evocative. Suggest specific camera angles, lighting moods, and character actions. For example, instead of 'Character walks into a room,' write 'Medium shot, character walks into a dimly lit room, light catching dust particles in the air'.)
    4. Sound Effect/BGM Cues
    
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

export async function generateYouTubeDescription(script: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are a YouTube Growth Expert.
    Based on the provided anime script, generate a professional, high-engagement YouTube Description.
    
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

export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Cinematic Director and Storyboard Artist.
    Your task is to take a basic scene description and rewrite it to be highly evocative and cinematic.
    Suggest specific camera angles, lighting moods, and character actions that enhance the narrative.
    For example, instead of 'Character walks into a room,' suggest 'Medium shot, character walks into a dimly lit room, light catching dust particles in the air'.
    Keep it concise (1-3 sentences) but highly visual.
    Return ONLY the enhanced visual description without any markdown formatting or quotes.
  `;

  try {
    const prompt = `Narration context: "${narration}"\nCurrent Visuals: "${visuals}"\n\nEnhance these visuals.`;
    const text = await callAI(model, prompt, systemInstruction);
    return text || visuals;
  } catch (error) {
    console.error("Error enhancing visuals:", error);
    return visuals;
  }
}
