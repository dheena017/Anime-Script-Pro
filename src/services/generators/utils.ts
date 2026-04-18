import { callAI } from "./core";

export async function enhanceNarration(narration: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Voice Director and Scriptwriter.
    Your task is to take a basic line of dialogue or narration and add evocative delivery details in parentheses before the spoken text.
    For example, instead of 'I am here.', suggest '(voice echoing, ethereal) I am here.' or '(voice trembling, barely a whisper) I am here.'
    Keep the original dialogue intact, just add or refine the delivery instructions.
    Return ONLY the enhanced narration without any markdown formatting or quotes.
  `;

  try {
    const prompt = `Current Narration: "${narration}"\n\nEnhance this narration with delivery details.`;
    const text = await callAI(model, prompt, systemInstruction);
    return text || narration;
  } catch (error) {
    console.error("Error enhancing narration:", error);
    return narration;
  }
}

export async function suggestDuration(narration: string, model: string = "gemini-3-flash-preview") {
  const systemInstruction = `
    You are an expert Production Manager and Script timing expert.
    Based on the provided narration text, estimate the duration in seconds for reading it. 
    A normal speaking rate is approximately 130-150 words per minute.
    Return ONLY the time in seconds with an 's' suffix (e.g., '12s').
  `;

  try {
    const text = await callAI(model, `Narration: ${narration}`, systemInstruction);
    return text ? text.trim() : "5s";
  } catch (error) {
    console.error("Error suggesting duration:", error);
    return "5s";
  }
}
