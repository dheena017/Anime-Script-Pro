import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

/**
 * TYPES & INTERFACES
 */
export interface ScriptGenerationParams {
  prompt: string;
  tone?: string;
  audience?: string;
  model?: string;
  session?: string;
  episode?: string;
}

export interface AIResponse {
  text: string;
  error?: string;
  usage?: any;
}

/**
 * CONFIGURATION & CONSTANTS
 */
const DEFAULT_MODEL = "gemini-3-flash-preview";

const AI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || "",
  maxRetries: 3,
  retryDelay: 1000, // ms
  timeout: 30000,
};

/**
 * WORLD-CLASS MODEL REGISTRY
 * These models are supported by the backend proxy or local Gemini SDK.
 */
export const MODEL_GROUPS = [
  {
    name: "Google Gemini (Local)",
    models: [
      { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (Fast)", description: "Best for speed and daily drafts." },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", description: "State of the art speed and multi-modal." },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Smart)", description: "Deep reasoning and complex story beats." },
    ]
  },
  {
    name: "OpenAI GPT",
    models: [
      { id: "gpt-4o", name: "GPT-4o (Omni)", description: "Most versatile and intelligent model." },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo", description: "Reliable production-grade intelligence." },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Legacy speed for simple tasks." },
    ]
  },
  {
    name: "Anthropic Claude",
    models: [
      { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", description: "Best for creative writing and prose." },
      { id: "claude-3-opus-latest", name: "Claude 3 Opus", description: "Masterful creative reasoning." },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", description: "Lightweight and creative." },
    ]
  },
  {
    name: "Groq (Meta / Mistral)",
    models: [
      { id: "llama3-70b-8192", name: "Llama 3 70B", description: "High-performance open weights." },
      { id: "llama3-8b-8192", name: "Llama 3 8B", description: "Ultra-fast open weights." },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Great for long context windows." },
    ]
  }
];

/**
 * ERROR HANDLING & CUSTOM CLASSES
 */
export class AIError extends Error {
  constructor(
    message: string,
    public code: 'MISSING_KEY' | 'RATE_LIMIT' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'SAFETY_BLOCK' | 'UNKNOWN',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Maps raw errors to user-friendly AIError objects.
 */
function handleAIError(error: any): AIError {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('API_KEY_INVALID') || message.includes('apiKey missing')) {
    return new AIError("Invalid or missing API Key. Please check your .env settings.", 'MISSING_KEY', error);
  }

  if (message.includes('429') || message.includes('Quota exceeded')) {
    return new AIError("Rate limit exceeded. Try switching to a more stable model like Gemini 1.5 Flash.", 'RATE_LIMIT', error);
  }

  if (message.includes('404') || message.includes('model not found')) {
    return new AIError("AI Model Not Found. This model might not be available in your region yet.", 'SERVER_ERROR', error);
  }

  if (message.includes('SAFETY')) {
    return new AIError("The request was flagged by AI safety filters. Please try rephrasing your prompt.", 'SAFETY_BLOCK', error);
  }

  if (message.includes('fetch') || message.includes('Network')) {
    return new AIError("Network connection issue. Please check your internet.", 'NETWORK_ERROR', error);
  }

  return new AIError(message || "An unexpected AI error occurred.", 'UNKNOWN', error);
}

/**
 * Retry utility with exponential backoff for transient errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = AI_CONFIG.maxRetries): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const aiError = handleAIError(error);
    if (retries > 0 && (aiError.code === 'RATE_LIMIT' || aiError.code === 'SERVER_ERROR' || aiError.code === 'NETWORK_ERROR')) {
      const delay = AI_CONFIG.retryDelay * (AI_CONFIG.maxRetries - retries + 1);
      console.warn(`AI Request failed. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, retries - 1);
    }
    throw aiError;
  }
}

/**
 * SYSTEM PROMPTS (Professional Grade)
 */
const SYSTEM_PROMPTS = {
  ANIME_STRATEGIST: (tone: string, audience: string, session: string, episode: string) => `
    ROLE: Expert Anime Scriptwriter & YouTube Growth Strategist.
    TASK: Create a high-retention 5-minute anime recap/motion comic script.
    
    CONTEXT:
    - Session: ${session}
    - Episode: ${episode}
    - Target Tone: ${tone}
    - Audience: ${audience}

    STORYTELLING ARCHITECTURE:
    1. THE HOOK (0:00-0:15): High-stakes "In Media Res" start. Establish immediate curiosity.
    2. THE RECAP/INTRO (0:15-1:00): Bridge sequence connecting previous episode events to now.
    3. RISING ACTION (1:00-3:30): Escalating tension, character development, and world-building.
    4. CLIMAX (3:30-4:30): Peak emotional/physical confrontation.
    5. CLIFFHANGER/OUTRO (4:30-5:00): Resolution leads to a massive question for next time.

    DIRECTOR'S RULES:
    - NO GENERIC DESCRIPTIONS. Instead of "They fight", describe "dynamic low-angle shots showing sparks igniting from heavy blade impacts."
    - SOUNDSCAPE: Layered audio (reverb, muffling, ambient pressure).
    - VISUALS: Cinematic terminology only (Dutch tilt, Tracking shot, Close-up on micro-expressions).

    FORBIDDEN PHRASES: "Action sequence", "Battle begins", "Character talks", "Scary music".
    
    OUTPUT FORMAT: Return ONLY a Markdown table with 4 columns:
    | Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
    |---------|---------------------|--------------------------|-----------------------|
  `,

  SEO_EXPERT: `
    ROLE: YouTube SEO & Viral Growth Specialist.
    TASK: Generate high-CTR metadata for an anime content channel.
    
    REQUIREMENTS:
    - Titles: Use cognitive triggers (Curiosity Gap, High Stakes, Comparison).
    - Description: SEO-optimized, includes narrative hooks and social-readiness.
    - Tags: Mixed broad (Anime) and long-tail (Specific Plot Points).
    - Thumbnail Concepts: Contrast-heavy, rule of thirds, emotional focus.
    
    Format: Clean Markdown with Structured Headings.
  `,

  IMAGE_PROMPT_ENGINEER: `
    ROLE: AI Image Generation Specialist (Midjourney/Stable Diffusion expert).
    TASK: Translate script visuals into hyper-detailed generative prompts.
    
    PROMPT STRUCTURE: [Subject] [Action] [Art Style: High-End Anime/Digital Art] [Lighting: Gloom/Golden Hour/Cyberpunk Neon] [Camera: Wide/Macro] [Quality: 8k, masterpiece, volumentric lighting].
    
    Format: Numbered list.
  `,

  SERIES_ARCHITECT: `
    ROLE: Narrative Architect & Showrunner.
    TASK: Design a cohesive multi-part series arc based on a core concept.
    
    FOCUS: Interconnectedness, foreshadowing, and cliffhanger-pacing.
    
    Format: Structured series bible (Part 1-3).
  `,

  CHARACTER_DESIGNER: `
    ROLE: Senior Anime Character Designer.
    TASK: Create modern, unique character archetypes with deep lore.
    
    FOCUS: Visual distinctiveness (Silhouettes), Psychological depth, and Narrative utility.
    
    Format: Professional Character Sheets.
  `,

  LORE_KEEPER: `
    ROLE: Anime World-Building Specialist.
    TASK: Create a compact lore profile for persistent world elements.
    
    Format: JSON-like list for tooltips. 3-5 lines max.
  `,

  VISUAL_ENHANCER: `
    ROLE: Cinematic Director.
    TASK: Upgrade a basic visual description into a production-ready storyboard prompt.
    
    RULE: One sentence, high impact, cinematic camera/lighting terms only.
  `,

  BRAINSTORMER: `
    ROLE: Creative Showrunner & Anime Producer.
    TASK: Brainstorm high-concept plots, twists, and expansion ideas.
    
    FOCUS: Subverting tropes, emotional anchors, and marketability.
    Format: Bulleted list with "Concept Name", "The Hook", and "Why it works".
  `,

  SCRIPT_POLISHER: `
    ROLE: Elite Script Doctor.
    TASK: Polish a draft for better pacing, punchier dialogue, and clearer action.
    
    Format: Return the full polished script.
  `,

  YOUTUBE_GROWTH_EXPERT: `
    ROLE: YouTube Performance & Growth Specialist.
    TASK: Generate a high-retention video description.
    
    STRUCTURE:
    1. THE HOOK (First 2 lines): Summary that makes clicking irresistible.
    2. THE STORY: 2-3 paragraphs of narrative context.
    3. TIMESTAMPS: Formatted as 00:00 - Section.
    4. RESOURCES: Placeholder for Socials/Links.
    
    Format: Clean Markdown.
  `,

  PACING_ANALYST: `
    ROLE: Professional Script Doctor & Narrative Pacing Expert.
    TASK: Analyze the script for pacing issues. 
    
    CRITERIA:
    - DRAGGING: Too much exposition, slow dialogue, repetitive beats.
    - RUSHING: Action without emotional weight, jumps in logic, lack of transition.
    
    OUTPUT FORMAT: Return a JSON array of issues:
    [
      {
        "type": "dragging" | "rushing",
        "issue": "Brief description of the issue",
        "suggestion": "Specific cut or addition to fix it",
        "segment": "The exact snippet of text that is problematic"
      }
    ]
  `,

  DIALOGUE_SPECIALIST: `
    ROLE: Award-winning Screenwriter.
    TASK: Generate 5 distinct variations of a specific line of dialogue.
    
    VARIATIONS NEEDED:
    1. Sarcastic/Witty
    2. Dramatic/Intense
    3. Action-oriented/Brief
    4. Vulnerable/Emotional
    5. Mysterious/Cryptic
    
    Format: Return ONLY a numbered list of the 5 variations.
  `,

  WHAt_IF_ARCHITECT: `
    ROLE: Narrative Simulation AI.
    TASK: Analyze a "What If" scenario and its ripples across the entire script.
    
    OUTPUT:
    1. ALTERNATE SUMMARY: How the scene changes.
    2. RIPPLE EFFECTS: 3 major changes that would happen later in the story.
    
    Format: Structured Markdown with "Alternate Scene Summary" and "Narrative Ripple Effects".
  `
};

/**
 * INTERNAL AI CORE
 */
const ai = new GoogleGenAI({ apiKey: AI_CONFIG.apiKey });

async function callAI(model: string, prompt: string, systemInstruction: string, jsonMode: boolean = false): Promise<string> {
  return withRetry(async () => {
    // 1. Local Gemini Logic
    if (model.toLowerCase().includes("gemini")) {
      if (!AI_CONFIG.apiKey) {
        throw new Error('API_KEY_INVALID: Gemini API Key missing.');
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          ],
        },
      });

      if (!response.text) {
        throw new Error('SERVER_ERROR: AI returned an empty response.');
      }

      return response.text;
    }

    // 2. Proxy Server Logic
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, systemInstruction }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `SERVER_ERROR: Proxy Response ${response.status}`);
    }

    const data = await response.json();
    return data.text || "";
  });
}

/**
 * PUBLIC API (SERVICE METHODS)
 */

/**
 * Generates a full anime script based on parameters.
 */
export async function generateAnimeScript(
  prompt: string,
  tone: string = "Hype/Energetic",
  audience: string = "General Fans",
  model: string = DEFAULT_MODEL,
  session: string = "1",
  episode: string = "1"
): Promise<string> {
  const systemInstruction = SYSTEM_PROMPTS.ANIME_STRATEGIST(tone, audience, session, episode);

  try {
    const result = await callAI(model, prompt, systemInstruction);
    return result || "Failed to generate script content.";
  } catch (error) {
    return `Generation Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates series-wide planning for a concept.
 */
export async function generateSeriesPlan(prompt: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Create a series plan for: ${prompt}`, SYSTEM_PROMPTS.SERIES_ARCHITECT);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates unique character sheets for a genre.
 */
export async function generateCharacters(genre: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Design characters for: ${genre}`, SYSTEM_PROMPTS.CHARACTER_DESIGNER);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates YouTube metadata (SEO tags, titles, descriptions).
 */
export async function generateMetadata(script: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Generate optimized YouTube metadata for this script:\n\n${script}`, SYSTEM_PROMPTS.SEO_EXPERT);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates highly descriptive image prompts from a script.
 */
export async function generateImagePrompts(script: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Extract and create 5-8 vivid visual prompts from this script:\n\n${script}`, SYSTEM_PROMPTS.IMAGE_PROMPT_ENGINEER);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates a production scene breakdown with character and prop requirements.
 */
export async function generateSceneBreakdown(script: string, model: string = DEFAULT_MODEL) {
  const systemInstruction = `
    ROLE: Script Breakdown Coordinator for episodic animation production.
    TASK: Analyze the script and extract a practical production breakdown.

    OUTPUT FORMAT (Markdown):
    ## Character List
    - Character Name: short note on why needed in this episode

    ## Prop List
    - Prop Name: short note on where/why it appears

    REQUIREMENTS:
    - Include only items clearly implied by the script.
    - Merge duplicates and normalize naming.
    - Keep it concise and production-friendly.
  `;

  try {
    return await callAI(model, script, systemInstruction);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Continues an existing script with new scenes.
 */
export async function continueAnimeScript(currentScript: string, model: string = DEFAULT_MODEL) {
  const systemInstruction = `
    Continue this anime script while maintaining the exact tone, character voices, and Markdown table format.
    Current Context:\n${currentScript}
  `;

  try {
    return await callAI(model, "Provide the next 3 scenes of the story.", systemInstruction);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Rewrites a selection of a script (expand/condense).
 */
export async function rewriteScriptSelection(
  selection: string,
  fullScript: string,
  mode: 'expand' | 'condense',
  model: string = DEFAULT_MODEL
) {
  const instruction = `Rewrite this section to ${mode}. Preserve character voice and story beats.
  Context: ${fullScript}
  Selection: ${selection}`;

  try {
    return await callAI(model, instruction, "You are a professional script editor. Return ONLY the edited text.");
  } catch (error) {
    return `${selection} (Selection Rewrite Error: ${error instanceof Error ? error.message : String(error)})`;
  }
}

/**
 * Formats a raw script into industry standards.
 */
export async function formatScriptToStandard(
  script: string,
  format: 'screenplay' | 'anime',
  model: string = DEFAULT_MODEL
) {
  const instruction = `Format this script as a professional ${format === 'screenplay' ? 'Hollywood Screenplay' : 'Anime Industry Script'}.`;

  try {
    return await callAI(model, script, instruction);
  } catch (error) {
    return `${script}\n\n(Formatting Error: ${error instanceof Error ? error.message : String(error)})`;
  }
}

/**
 * Creates short lore tooltips for characters/items.
 */
export async function generateLoreProfile(
  entityName: string,
  scriptContext: string,
  model: string = DEFAULT_MODEL
) {
  try {
    return await callAI(model, `Entity: ${entityName}\nContext: ${scriptContext}`, SYSTEM_PROMPTS.LORE_KEEPER);
  } catch (error) {
    return `${entityName}: Lore unavailable. Detailed Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Generates a polished YouTube description from a script.
 */
export async function generateYouTubeDescription(script: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Script Context:\n\n${script}`, SYSTEM_PROMPTS.YOUTUBE_GROWTH_EXPERT);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Enhances individual scene visuals for storyboarding.
 */
export async function enhanceSceneVisuals(visuals: string, narration: string, model: string = DEFAULT_MODEL) {
  const prompt = `Visuals: ${visuals}\nNarration: ${narration}`;
  try {
    return await callAI(model, prompt, SYSTEM_PROMPTS.VISUAL_ENHANCER);
  } catch (error) {
    throw new Error(`Visual Enhancement Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * ADVANCED: BRAINSTORMING & REFINEMENT
 */

export async function brainstormConcept(concept: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Concept: ${concept}`, SYSTEM_PROMPTS.BRAINSTORMER);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function polishScript(script: string, model: string = DEFAULT_MODEL) {
  try {
    return await callAI(model, `Script to polish:\n\n${script}`, SYSTEM_PROMPTS.SCRIPT_POLISHER);
  } catch (error) {
    return `${script}\n\n(Polish Error: ${error instanceof Error ? error.message : String(error)})`;
  }
}

/**
 * NEW: ADVANCED CO-WRITER FEATURES
 */

export async function analyzePacing(script: string, model: string = DEFAULT_MODEL) {
  try {
    const result = await callAI(model, `Analyze this script for pacing:\n\n${script}`, SYSTEM_PROMPTS.PACING_ANALYST);
    try {
      // Find the JSON block if the model included extra text
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : result);
    } catch (e) {
      console.error("Failed to parse pacing JSON", e);
      return [];
    }
  } catch (error) {
    return [];
  }
}

export async function generateDialogueVariations(line: string, scriptContext: string, model: string = DEFAULT_MODEL) {
  try {
    const prompt = `Context: ${scriptContext}\n\nLine to vary: "${line}"`;
    return await callAI(model, prompt, SYSTEM_PROMPTS.DIALOGUE_SPECIALIST);
  } catch (error) {
    return "Error generating variations.";
  }
}

export async function generateWhatIfSummary(whatIfPrompt: string, scriptContext: string, model: string = DEFAULT_MODEL) {
  try {
    const prompt = `Script Context:\n${scriptContext}\n\nWhat If Scenario: ${whatIfPrompt}`;
    return await callAI(model, prompt, SYSTEM_PROMPTS.WHAt_IF_ARCHITECT);
  } catch (error) {
    return "Error generating what-if summary.";
  }
}

export async function translateScript(script: string, targetLanguage: string = "Japanese", model: string = DEFAULT_MODEL) {
  const systemInstruction = `
    ROLE: Professional Media Translator.
    TASK: Translate the following anime script into ${targetLanguage}.
    
    RULES:
    - PRESERVE ALL MARKDOWN FORMATTING (Tables, Headings).
    - Maintain character names if they are in English/Standard.
    - Ensure the translation captures the specific tone of the original.
    - RETURN ONLY THE TRANSLATED SCRIPT.
  `;

  try {
    return await callAI(model, script, systemInstruction);
  } catch (error) {
    return `${script}\n\n(Translation Error: ${error instanceof Error ? error.message : String(error)})`;
  }
}

/**
 * STREAMING SUPPORT (BOILERPLATE FOR REAL-TIME UI)
 * Use this for ultra-fast feeling interfaces.
 */
export async function* streamAnimeScript(params: ScriptGenerationParams) {
  const { prompt, tone, audience, model = DEFAULT_MODEL, session, episode } = params;
  const sys = SYSTEM_PROMPTS.ANIME_STRATEGIST(tone || "", audience || "", session || "", episode || "");

  // This assumes the underlying @google/genai supports streaming
  // If not, it will fall back to a single pulse.
  try {
    // @ts-ignore - Assuming stream support in library
    const stream = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: { systemInstruction: sys }
    });

    for await (const chunk of stream) {
      // Handle both getter and method for compatibility
      const text = typeof (chunk as any).text === 'function' ? (chunk as any).text() : (chunk as any).text;
      yield text;
    }
  } catch (err) {
    console.warn("Streaming not fully supported in this environment yet. Falling back to static.", err);
    yield await generateAnimeScript(params as any);
  }
}

// End of Service
