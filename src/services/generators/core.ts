import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 20) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export async function callAI(model: string, prompt: string, systemInstruction: string) {
  try {
    // Use Gemini directly if it's a Gemini model
    if (model.includes("gemini")) {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });
      
      // Handle edge cases where response is blocked
      if (!response.text) {
         throw new Error("AI response was blocked by safety filters or returned empty.");
      }
      
      return response.text;
    }

    // Otherwise, call our backend proxy for other providers
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, systemInstruction }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError("AI Quota Exhausted. Please wait before retrying.", 20);
      }
      const error = await response.json();
      throw new Error(error.error || "Failed to generate content");
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    // Specifically catch local Gemini rate limits
    if (error?.message?.includes("429") || error?.status === 429 || error?.toString().includes("RESOURCE_EXHAUSTED")) {
      console.warn("[AI Core] Rate Limit Detected. Failover logic triggered.");
      throw new RateLimitError(error.message || "Quota Exceeded", 15);
    }
    throw error;
  }
}
