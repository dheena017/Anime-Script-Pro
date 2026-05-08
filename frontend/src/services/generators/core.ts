/**
 * Utility: Checks if a value is empty (null, undefined, empty string, or empty array/object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Utility: Clamp a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Utility: Debounce a function (wait ms after last call before invoking)
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  } as T;
}

/**
 * Unified Styled Logger for AI Core
 */
const STYLES = {
  prefix: 'font-weight: bold; padding: 2px 4px; border-radius: 4px;',
  ai: 'color: #8b5cf6; font-weight: bold;',
  info: 'color: #94a3b8;',
  success: 'color: #10b981;',
  warn: 'color: #f59e0b;',
  error: 'color: #ef4444;',
  group: 'color: #6366f1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;'
};

export const logger = {
  info: (msg: string, ...args: any[]) => console.info(`%c[AI Core] %c${msg}`, STYLES.ai, STYLES.info, ...args),
  success: (msg: string, ...args: any[]) => console.info(`%c[AI Core] %c${msg}`, STYLES.success, STYLES.info, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`%c[AI Core] %c${msg}`, STYLES.warn, STYLES.info, ...args),
  error: (msg: string, ...args: any[]) => console.error(`%c[AI Core] %c${msg}`, STYLES.error, STYLES.info, ...args),
  group: (title: string) => console.groupCollapsed(`%c[AI Core] %c${title}`, STYLES.ai, STYLES.group),
  end: () => console.groupEnd(),
};

function logAIUserHint(message: string) {
  console.groupCollapsed("[AI Core] User Guidance");
  console.info(message);
  console.info("• If you are running locally, set VITE_GEMINI_API_KEY in your .env file.");
  console.info("• If you want to use the backend proxy, ensure the FastAPI backend is running and accessible at http://127.0.0.1:8080.");
  console.groupEnd();
}

import { GoogleGenAI } from "@google/genai";
import { API_BASE_URL } from "@/lib/api-utils";
import { studioGroup, studioEnd } from "@/lib/studio-logger";
import ValidationEngine from "@/services/validators/ValidationEngine";
import { traceContextFromInstruction } from "@/services/validators/ContextTracer";

/**
 * Custom Error Classes for AI Operations
 */
export class AIError extends Error {
  status?: number;
  details?: any;
  retryable: boolean;
  constructor(message: string, status?: number, details?: any, retryable: boolean = false) {
    super(message);
    this.name = "AIError";
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

export class RateLimitError extends AIError {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 25) {
    super(message, 429, null, true);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class ContentFilterError extends AIError {
  constructor(message: string, details?: any) {
    super(message, 400, details, false);
    this.name = "ContentFilterError";
  }
}

export class AuthenticationError extends AIError {
  constructor(message: string) {
    super(message, 401, null, false);
    this.name = "AuthenticationError";
  }
}

export class ModelNotFoundError extends AIError {
  constructor(message: string) {
    super(message, 404, null, false);
    this.name = "ModelNotFoundError";
  }
}

export class ValidationError extends AIError {
  constructor(message: string) {
    super(message, 400, null, false);
    this.name = "ValidationError";
  }
}

export class NetworkError extends AIError {
  constructor(message: string) {
    super(message, 0, null, true);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends AIError {
  constructor(message: string = "Request timed out") {
    super(message, 408, null, true);
    this.name = "TimeoutError";
  }
}



/**
 * AI Event System for real-time feedback
 */
export const AI_EVENTS = new EventTarget();

const inFlightRequests = new Map<string, Promise<string>>();
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8080";
const BACKEND_BASE_URL = API_BASE_URL || (import.meta as any)?.env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL;
const BACKEND_GENERATE_URL = `${BACKEND_BASE_URL.replace(/\/+$|^\s+|\s+$/g, '')}/api/generate`;

const DETAIL_DEPTH_DIRECTIVE = `
DETAIL DEPTH POLICY:
- Make every answer rich, specific, and production-ready.
- Prefer concrete sensory detail, explicit relationships, precise staging, and clear cause-and-effect.
- Expand each field to the maximum useful specificity allowed by the requested format.
- Use layered detail: surface description, hidden implication, continuity consequence, and production utility.
- If the output must remain JSON, Markdown table, or another strict schema, stay inside that format while still making each value as detailed as possible.
- Do not replace detail with generic summary language unless the prompt explicitly demands brevity.
- If a prompt is already constrained, deepen the value content rather than widening the schema.
`;

function composeDetailedSystemInstruction(
  systemInstruction: string,
  worldLore?: string | null,
  castDNA?: string | null,
  episodePlan?: string | null
): string {
  const trimmedInstruction = systemInstruction.trim();

  if (!trimmedInstruction) {
    return DETAIL_DEPTH_DIRECTIVE.trim();
  }

  const strictFormatSignals = [
    'Return only the JSON',
    'Return ONLY the JSON',
    'Return only the markdown table',
    'Return only the prompt list',
    'Return ONLY the rewritten scene description',
    'Return ONLY the duration in seconds',
    'Return clean Markdown',
    'Do not use code fences',
    'Do not add explanations',
  ];

  const supportsStrictFormatting = strictFormatSignals.some(signal => trimmedInstruction.includes(signal));
  const detailAppendix = supportsStrictFormatting
    ? `${DETAIL_DEPTH_DIRECTIVE}\nFORMAT SAFETY:\n- Preserve the exact requested schema and output shape.\n- Increase detail within the permitted fields only.`
    : DETAIL_DEPTH_DIRECTIVE;

  // Inject context blocks if provided
  const contextBlocks: string[] = [];
  if (worldLore?.trim()) {
    contextBlocks.push(`=== WORLD LORE SOURCE OF TRUTH ===\n${worldLore}\n`);
  }
  if (castDNA?.trim()) {
    contextBlocks.push(`=== CHARACTER DNA REGISTRY ===\n${castDNA}\n`);
  }
  if (episodePlan?.trim()) {
    contextBlocks.push(`=== EPISODE MASTER BLUEPRINT ===\n${episodePlan}\n`);
  }

  const contextSection = contextBlocks.length > 0
    ? `\n\nSTORY STATE CONTEXT:\n${contextBlocks.join('\n')}`
    : '';

  return `${trimmedInstruction}${contextSection}\n\n${detailAppendix.trim()}`;
}

export interface AIMetadata {
  text: string;
  model: string;
  latency: number;
  fallbacks: string[];
  error?: string;
}

function broadcastAIMetadata(metadata: AIMetadata) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_generation_complete', { detail: metadata }));
}

function broadcastAIFallback(failedModel: string, error: string, nextModel: string) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_fallback', { detail: { failedModel, error, nextModel } }));
}

function broadcastAIStart(model: string) {
  AI_EVENTS.dispatchEvent(new CustomEvent('ai_generation_start', { detail: { model } }));
}

/**
 * Robust AI Call Utility with built-in retries, timeouts, and error handling.
 * Optional context parameters allow story state injection for consistent generation.
 */
export async function callAI(
  model: string,
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.85,
  maxTokens: number = 2048,
  topP: number = 0.95,
  topK: number = 40,
  timeoutMs: number = 180000,
  worldLore?: string | null,
  castDNA?: string | null,
  episodePlan?: string | null
) {
  const detailedSystemInstruction = composeDetailedSystemInstruction(
    systemInstruction,
    worldLore,
    castDNA,
    episodePlan
  );
  const requestKey = JSON.stringify({ model, prompt, systemInstruction: detailedSystemInstruction, temperature, maxTokens, topP, topK });
  if (inFlightRequests.has(requestKey)) {
    logger.info('Duplicate generation request detected. Reusing existing in-flight request.');
    return inFlightRequests.get(requestKey)!;
  }

  const generationPromise = (async () => {
    const startTime = performance.now();
    broadcastAIStart(model);

    logger.info(`Starting generation request for model: ${model}`);
    logger.info(`Prompt length: ${prompt?.length || 0}, instruction length: ${detailedSystemInstruction?.length || 0}`);

    // Context Audit: Find "SOURCE OF TRUTH" markers in the system instruction
    const worldInjected = detailedSystemInstruction.includes("WORLD LORE SOURCE OF TRUTH");
    const castInjected = detailedSystemInstruction.includes("CHARACTER DNA REGISTRY");
    const planInjected = detailedSystemInstruction.includes("EPISODE MASTER BLUEPRINT");

    // Enhanced Neural Context Audit with detailed metrics
    const auditMetrics = {
      "World Lore Sync": worldInjected
        ? `ACTIVE ✅ (${worldLore?.length || 0} chars)`
        : "NONE ❌",
      "Cast DNA Sync": castInjected
        ? `ACTIVE ✅ (${castDNA?.length || 0} chars)`
        : "NONE ❌",
      "Episode Plan Sync": planInjected
        ? `ACTIVE ✅ (${episodePlan?.length || 0} chars)`
        : "NONE ❌",
      "Total Instruction Volume": `${detailedSystemInstruction.length} chars`,
      "User Prompt Volume": `${prompt.length} chars`,
      "Combined Context Size": `${detailedSystemInstruction.length + prompt.length} chars`,
    };

    // Emit a structured context trace for UI/telemetry
    try {
      const trace = traceContextFromInstruction(detailedSystemInstruction);
      AI_EVENTS.dispatchEvent(new CustomEvent('ai_context_trace', { detail: { model, trace } }));
      console.groupCollapsed('%c[AI Core] Context Trace', 'color: #6366f1; font-weight:700;');
      console.log(trace);
      console.groupEnd();
    } catch (e) {
      logger.warn('Context tracer failed', e);
    }

    studioGroup('AI Core', `Neural Context Audit: ${model}`, 'system');
    Object.entries(auditMetrics).forEach(([key, value]) => {
      const isActive = value.includes('ACTIVE');
      const style = isActive ? STYLES.success : (value.includes('NONE') ? STYLES.warn : STYLES.info);
      console.log(`%c${key}:`, style, value);
    });
    studioEnd();

    logger.group(`Request to ${model}`);
    console.log("%cSystem Instruction:", STYLES.info, detailedSystemInstruction);
    console.log("%cUser Prompt:", STYLES.info, prompt);
    logger.end();

    // 1. Pre-flight checks
    if (!prompt?.trim()) {
      throw new ValidationError("Prompt is required for AI generation.");
    }

    logger.info("Browser-side Gemini SDK direct call is disabled. Using backend proxy /api/generate only.");

    //
    // Normalize and prepare model fallbacks
    //
    const normalizeModelId = (id: string | undefined): string => {
      if (!id) return "gemini-2.0-flash";
      let normalized = id.toLowerCase().trim();
      normalized = normalized.replace(/^models\//, "");
      // Common aliases
      if (normalized === "gemini-flash") return "gemini-1.5-flash";
      if (normalized === "gemini-pro") return "gemini-1.5-pro";
      return normalized;
    };

    const primaryModel = normalizeModelId(model);
    const modelFallbacks = [
      primaryModel,
      ...["gemini-3.1-flash-lite-preview", "gemini-2.5-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash", "gemma-3-27b-it"].filter(m => m !== primaryModel)
    ];

    let lastError: Error | null = null;
    const attemptedFallbacks: string[] = [];

    for (const currentModel of modelFallbacks) {
      let timeoutId: any;
      try {
        if (currentModel !== model) attemptedFallbacks.push(currentModel);

        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const payload = {
          model: currentModel,
          prompt: prompt,
          systemInstruction: detailedSystemInstruction,
          temperature: temperature,
          max_tokens: maxTokens,
          top_p: topP,
          top_k: topK
        };

        console.log(`%c[AI Core] %cTrying model: %c${currentModel}`, STYLES.ai, STYLES.info, 'font-weight: bold; color: #fff;');
        let response: Response | null = null;
        try {
          response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
        } catch (fetchError: any) {
          const fetchErrorMessage = fetchError?.message?.toString?.() || "";
          if (fetchError instanceof TypeError || fetchErrorMessage.includes('Failed to fetch') || fetchErrorMessage.includes('ERR_EMPTY_RESPONSE')) {
            logger.warn(`/api proxy fetch failed, retrying direct backend URL: ${BACKEND_GENERATE_URL}`);
            response = await fetch(BACKEND_GENERATE_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
          } else {
            throw fetchError;
          }
        }
        clearTimeout(timeoutId);

        if (!response) {
          throw new NetworkError("Backend proxy and direct backend URL both failed to return a response.");
        }

        if (!response.ok) {
          let errorData: any = {};
          try {
            errorData = await response.json();
          } catch (e) {
            const text = await response.text().catch(() => "Unknown backend error");
            errorData = { error: text };
          }
          const msg = errorData.detail || errorData.details || errorData.error?.message || errorData.error?.details || (typeof errorData.error === 'string' ? errorData.error : response.statusText) || "Generation Failed";
          logger.error(`Backend Error (${response.status}):`, errorData);
          if (response.status === 401 || msg.includes("Invalid AI Credentials")) {
            logAIUserHint("The backend proxy rejected the API key. Verify the backend uses a valid Gemini key in GOOGLE_API_KEY or VITE_GEMINI_API_KEY.");
          }
          if (response.status === 500 || response.status === 502) {
            logger.warn("Backend proxy may be unavailable or misconfigured. Ensure the FastAPI server is running.");
          }
          if (response.status === 503 || msg.includes("UNAVAILABLE")) {
            logAIUserHint("The backend or Gemini service is temporarily unavailable. Wait briefly and retry.");
          }

          const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
          if (nextModel) broadcastAIFallback(currentModel, msg, nextModel);

          lastError = new Error(msg);
          continue; // Try next model
        }

        const data = await response.json();
        const text = data.text;
        if (!text) throw new Error("AI returned an empty response.");

        logger.group(`Response from ${currentModel}`);
        console.log("%cContent:", STYLES.info, text);
        logger.end();

        const totalLatency = performance.now() - startTime;
        logger.success(`Success! Model: ${currentModel} | Latency: ${totalLatency.toFixed(2)}ms`);

        broadcastAIMetadata({
          text: text,
          model: currentModel,
          latency: data.latency_ms || totalLatency,
          fallbacks: attemptedFallbacks
        });

        // Run lightweight validation on the returned text and broadcast results
        try {
          const engine = new ValidationEngine();
          const validation = engine.validate(detailedSystemInstruction, text);
          console.groupCollapsed("%c[AI Core] Validation Result", "color: #6366f1; font-weight: 700;");
          console.log(validation);
          console.groupEnd();
          AI_EVENTS.dispatchEvent(new CustomEvent('ai_validation', { detail: { model: currentModel, validation } }));
          if (!validation.isValid) {
            logger.warn(`Validation flagged issues (score: ${validation.score})`, validation.violations);
          }
        } catch (valErr) {
          logger.warn('Validation engine failed:', valErr);
        }

        return text;
      } catch (error: any) {
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
        const errMessage = error?.message || error;
        logger.warn(`Model ${currentModel} failed: ${errMessage}`);

        if (errMessage.toString().includes('Failed to fetch') || errMessage.toString().includes('ERR_EMPTY_RESPONSE')) {
          logAIUserHint("The backend proxy fetch failed. Confirm that the frontend dev server can reach /api/generate and that the backend is running on port 8080.");
          throw new NetworkError("Backend proxy unreachable. Ensure the backend is running at http://127.0.0.1:8080 and Vite proxy /api is configured.");
        }

        const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
        if (nextModel) broadcastAIFallback(currentModel, errMessage, nextModel);

        lastError = error instanceof Error ? error : new Error(String(error));
        continue; // Try next model
      }
    }

    // If all models fail, show helpful guidance and throw the last error
    if (lastError) {
      const errMessage = lastError?.message?.toString() || String(lastError);
      if (errMessage.includes("API_KEY_INVALID") || errMessage.includes("Invalid AI Credentials") || errMessage.includes("401")) {
        logAIUserHint("All Gemini fallback attempts failed due to invalid or missing API credentials.");
      } else if (errMessage.includes("Failed to fetch") || errMessage.includes("ERR_EMPTY_RESPONSE")) {
        logAIUserHint("All Gemini fallback attempts failed because the backend proxy is not reachable. Start the backend and verify /api/generate is available.");
      } else {
        logger.error(`Final fallback failure: ${errMessage}`);
        logger.info("You can try a different model, simplify the prompt, or refresh the application.");
      }
    }
    throw lastError || new Error("All Gemini models failed.");
  })();

  inFlightRequests.set(requestKey, generationPromise);
  generationPromise.finally(() => inFlightRequests.delete(requestKey));
  return generationPromise;
}


/**
 * Returns a configured Gemini API client using the best available key.
 */
export const getAIClient = (userKey?: string) => {
  const apiKey = userKey || localStorage.getItem('gemini_api_key') || (import.meta as any)?.env?.VITE_GEMINI_API_KEY || "";
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta'
  });
};





