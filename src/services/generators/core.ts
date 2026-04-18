import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function callAI(model: string, prompt: string, systemInstruction: string) {
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
