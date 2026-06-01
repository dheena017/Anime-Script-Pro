/**
 * Utility: Checks if a value is empty (null, undefined, empty string, or empty array/object/Set/Map)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") {
    if (value instanceof Date) return isNaN(value.getTime());
    return Object.keys(value).length === 0;
  }
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
 * Utility: Promisified setTimeout for async flows
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Utility: Retry an async function with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[AI Core] Retry attempt ${attempt}/${maxRetries} failed. Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  throw new Error("Retry failed");
}

/**
 * Utility: Extract and parse JSON from a Markdown string that might contain \`\`\`json blocks
 */
export function parseAIJSON<T = any>(text: string, fallback?: T): T {
  if (!text) return fallback as T;
  
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const rawJson = match ? match[1].trim() : text.trim();
  
  try {
    return JSON.parse(rawJson);
  } catch (e) {
    console.error("[AI Core] Failed to parse AI JSON response", text);
    if (fallback !== undefined) return fallback;
    throw new Error("AI returned invalid JSON structure.");
  }
}

/**
 * Utility: Lightweight JSON Schema Validator
 * Ensures that the parsed JSON object contains all the required keys.
 */
export function validateJSONSchema<T = any>(data: any, requiredKeys: string[]): data is T {
  if (!data || typeof data !== 'object') return false;
  return requiredKeys.every(key => key in data);
}

/**
 * Utility: Simple Prompt Template Interpolator
 * Replaces {key} in a string with values from the variables object.
 */
export function fillTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    return key in variables ? String(variables[key]) : `{${key}}`;
  });
}

/**
 * Utility: Run an array of async tasks in batches with a concurrency limit
 * Extremely useful for generating multiple AI scenes/characters without hitting rate limits.
 */
export async function processInBatches<T, R>(
  items: T[], 
  processor: (item: T, index: number) => Promise<R>, 
  concurrencyLimit: number = 3
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrencyLimit) {
    const batch = items.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(batch.map((item, idx) => processor(item, i + idx)));
    results.push(...batchResults);
  }
  return results;
}

/**
 * Utility: Lightweight heuristic token estimator (approx 4 chars per token for English)
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

import { studioLog, studioGroup, studioEnd } from "@/lib/dev-console-logs";

export const logger = {
  info: (msg: string, ...args: any[]) => studioLog("AI CORE", msg, "info", ...args),
  success: (msg: string, ...args: any[]) => studioLog("AI CORE", msg, "success", ...args),
  warn: (msg: string, ...args: any[]) => studioLog("AI CORE", msg, "warn", ...args),
  error: (msg: string, ...args: any[]) => studioLog("AI CORE", msg, "error", ...args),
  group: (title: string) => studioGroup("AI CORE", title, "system"),
  end: () => studioEnd(),
};

function logAIUserHint(message: string) {
  console.groupCollapsed("%c[AI Core] User Guidance", "color: #3b82f6; font-weight: bold;");
  console.info(message);
  console.info("• If you are running locally, set VITE_GEMINI_API_KEY in your .env file.");
  console.info("• If you want to use the backend proxy, ensure the FastAPI backend is running and accessible via the proxy (/api).");
  console.groupEnd();
}

import { GoogleGenAI } from "@google/genai";
import { API_BASE_URL } from "@/lib/api-utils";
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
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

export class RateLimitError extends AIError {
  retryAfter: number;
  constructor(message: string, retryAfter: number = 25) {
    super(message, 429, null, true);
    this.retryAfter = retryAfter;
  }
}

export class ContentFilterError extends AIError {
  constructor(message: string, details?: any) {
    super(message, 400, details, false);
  }
}

export class AuthenticationError extends AIError {
  constructor(message: string) {
    super(message, 401, null, false);
  }
}

export class ModelNotFoundError extends AIError {
  constructor(message: string) {
    super(message, 404, null, false);
  }
}

export class ValidationError extends AIError {
  constructor(message: string) {
    super(message, 400, null, false);
  }
}

export class NetworkError extends AIError {
  constructor(message: string) {
    super(message, 0, null, true);
  }
}

export class TimeoutError extends AIError {
  constructor(message: string = "Request timed out") {
    super(message, 408, null, true);
  }
}

/**
 * AI Event System for real-time feedback
 */
export const AI_EVENTS = new EventTarget();

/**
 * Utility: Generate a quick pseudo-random UUID for UI keys and tracking
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Utility: Strip markdown syntax from text to get plain readable text
 */
export function cleanMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace links with text
    .replace(/[*_~`#]/g, '') // remove markdown formatting chars
    .trim();
}

/**
 * AI Response Cache to prevent duplicate calls and save tokens during dev/re-renders
 */
const RESPONSE_CACHE = new Map<string, { result: string, timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minute cache

export function getCachedResponse(requestKey: string): string | null {
  const cached = RESPONSE_CACHE.get(requestKey);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    RESPONSE_CACHE.delete(requestKey);
    return null;
  }
  return cached.result;
}

export function setCachedResponse(requestKey: string, result: string) {
  // Simple LRU: Keep cache size under 50 items
  if (RESPONSE_CACHE.size >= 50) {
    const oldestKey = RESPONSE_CACHE.keys().next().value;
    if (oldestKey) RESPONSE_CACHE.delete(oldestKey);
  }
  RESPONSE_CACHE.set(requestKey, { result, timestamp: Date.now() });
}

const inFlightRequests = new Map<string, Promise<string>>();
const DEFAULT_BACKEND_URL = "";
const BACKEND_BASE_URL = API_BASE_URL || (import.meta as any)?.env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL;
const BACKEND_GENERATE_URL = `${BACKEND_BASE_URL.replace(/\/+$|^\s+|\s+$/g, '')}/api/text`;
const BACKEND_GENERATE_IMAGE_URL = `${BACKEND_BASE_URL.replace(/\/+$|^\s+|\s+$/g, '')}/api/image`;

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
  characterDNA?: string | null,
  episodePlan?: string | null
): string {
  const trimmedInstruction = systemInstruction?.trim() || "";

  if (!trimmedInstruction) {
    return DETAIL_DEPTH_DIRECTIVE.trim();
  }

  const strictFormatSignals = [
    'return only the json',
    'return only the markdown table',
    'return only the prompt list',
    'return only the rewritten scene description',
    'return only the duration in seconds',
    'return clean markdown',
    'do not use code fences',
    'do not add explanations',
  ];

  const lowerInstruction = trimmedInstruction.toLowerCase();
  const supportsStrictFormatting = strictFormatSignals.some(signal => lowerInstruction.includes(signal));
  
  const detailAppendix = supportsStrictFormatting
    ? `${DETAIL_DEPTH_DIRECTIVE}\nFORMAT SAFETY:\n- Preserve the exact requested schema and output shape.\n- Increase detail within the permitted fields only.`
    : DETAIL_DEPTH_DIRECTIVE;

  // Inject context blocks if provided
  const contextBlocks: string[] = [];
  if (worldLore?.trim()) contextBlocks.push(`=== WORLD LORE SOURCE OF TRUTH ===\n${worldLore.trim()}`);
  if (characterDNA?.trim()) contextBlocks.push(`=== CHARACTER DNA REGISTRY ===\n${characterDNA.trim()}`);
  if (episodePlan?.trim()) contextBlocks.push(`=== EPISODE MASTER BLUEPRINT ===\n${episodePlan.trim()}`);

  const contextSection = contextBlocks.length > 0
    ? `\n\nSTORY STATE CONTEXT:\n${contextBlocks.join('\n\n')}`
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
 * Normalize and prepare model ID
 */
const normalizeModelId = (id: string | undefined): string => {
  if (!id) return "gemini-3.1-flash-lite";
  let normalized = id.toLowerCase().trim().replace(/^models\//, "");
  // Common aliases mapping to most capable modern models
  if (normalized === "gemini-flash" || normalized === "gemini-1.5-flash") return "gemini-3.1-flash";
  if (normalized === "gemini-pro" || normalized === "gemini-1.5-pro") return "gemini-3.1-pro";
  // Allow gemini-3.x and gemini-2.x modern models to pass through natively
  return normalized;
};

/**
 * Robust AI Call Utility with built-in retries, timeouts, and error handling.
 * Optional context parameters allow story state injection for consistent generation.
 */
export async function generateText(
  model: string,
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.85,
  maxTokens: number = 2048,
  topP: number = 0.95,
  topK: number = 40,
  timeoutMs: number = 180000,
  worldLore?: string | null,
  characterDNA?: string | null,
  episodePlan?: string | null,
  requestLabel?: string // optional label to prevent cross-module deduplication
): Promise<string> {
  const detailedSystemInstruction = composeDetailedSystemInstruction(
    systemInstruction,
    worldLore,
    characterDNA,
    episodePlan
  );
  
  // Include requestLabel in the key so different modules never collide with each other
  const requestKey = JSON.stringify({ label: requestLabel || null, model, prompt, systemInstruction: detailedSystemInstruction, temperature, maxTokens, topP, topK });
  
  // 1. Check Memory Cache
  const cachedResult = getCachedResponse(requestKey);
  if (cachedResult) {
    logger.info(`Cache hit for model ${model}. Returning cached response.`);
    // Simulate generation events so the UI still updates
    broadcastAIStart(model);
    broadcastAIMetadata({
      text: cachedResult,
      model,
      latency: 0,
      fallbacks: []
    });
    return cachedResult;
  }

  // 2. Check In-Flight Requests
  if (inFlightRequests.has(requestKey)) {
    logger.info('Duplicate generation request detected. Reusing existing in-flight request.');
    return inFlightRequests.get(requestKey)!;
  }

  const generationPromise = (async () => {
    const startTime = performance.now();
    broadcastAIStart(model);

    logger.info(`Starting generation request for model: ${model}`);
    
    // Neural Context Audit with detailed metrics
    const auditMetrics = {
      "World Lore Sync": detailedSystemInstruction.includes("WORLD LORE SOURCE OF TRUTH") ? `ACTIVE ✅ (${worldLore?.length || 0} chars)` : "NONE ❌",
      "Cast DNA Sync": detailedSystemInstruction.includes("CHARACTER DNA REGISTRY") ? `ACTIVE ✅ (${characterDNA?.length || 0} chars)` : "NONE ❌",
      "Episode Plan Sync": detailedSystemInstruction.includes("EPISODE MASTER BLUEPRINT") ? `ACTIVE ✅ (${episodePlan?.length || 0} chars)` : "NONE ❌",
      "Total Instruction Volume": `${detailedSystemInstruction.length} chars`,
      "User Prompt Volume": `${prompt.length} chars`,
      "Combined Context Size": `${detailedSystemInstruction.length + prompt.length} chars`,
    };

    // Emit a structured context trace for UI/telemetry
    try {
      const trace = traceContextFromInstruction(detailedSystemInstruction);
      AI_EVENTS.dispatchEvent(new CustomEvent('ai_context_trace', { detail: { model, trace } }));
      studioGroup('AI CORE', 'Context Trace', 'system');
      console.log(trace);
      studioEnd();
    } catch (e) {
      logger.warn('Context tracer failed', e);
    }

    studioGroup('AI CORE', `Neural Context Audit: ${model}`, 'system');
    Object.entries(auditMetrics).forEach(([key, value]) => {
      studioLog("AI CORE", `${key}: ${value}`, 'info');
    });
    studioEnd();

    logger.group(`Request Payload`);
    console.log("%cSystem Instruction:", "color: #94a3b8;", detailedSystemInstruction);
    console.log("%cUser Prompt:", "color: #94a3b8;", prompt);
    logger.end();

    if (!prompt?.trim()) {
      throw new ValidationError("Prompt is required for AI generation.");
    }

    const primaryModel = normalizeModelId(model);
    const modelFallbacks = [
      primaryModel,
      ...[
        "gemini-3.1-flash-lite",  // Standard default, massive daily quota
        "gemini-3.1-flash",       // Highly recommended
        "gemini-3.5-flash",       // Advanced flash
        "gemini-2.5-flash",       // Primary real model — fast & capable
        "gemini-2.5-flash-lite",  // Lightweight fallback
        "gemma-4-26b",            // Open weights, large daily quota
        "gemma-4-31b",            // Advanced reasoning, large quota
        "gemma-3-27b"             // Last resort open weights
      ].filter(m => m !== primaryModel)
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
          prompt,
          systemInstruction: detailedSystemInstruction,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          top_k: topK
        };

        studioLog("AI CORE", `Trying model: ${currentModel}`, 'info');
        
        const isAgent = ["antigravity", "deep-research-pro", "computer-use-preview"].includes(normalizeModelId(currentModel));
        const activeEndpoint = isAgent ? "/api/agent" : "/api/text";
        const activeDirectUrl = isAgent 
          ? `${BACKEND_BASE_URL.replace(/\/+$|^\s+|\s+$/g, '')}/api/agent`
          : BACKEND_GENERATE_URL;

        let response: Response | null = null;
        try {
          response = await fetch(activeEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
        } catch (fetchError: any) {
          const fetchErrorMessage = fetchError?.message?.toString() || "";
          if (fetchError instanceof TypeError || fetchErrorMessage.includes('Failed to fetch') || fetchErrorMessage.includes('ERR_EMPTY_RESPONSE')) {
            logger.warn(`/api proxy fetch failed, retrying direct backend URL: ${activeDirectUrl}`);
            response = await fetch(activeDirectUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
          } else {
            throw fetchError;
          }
        } finally {
          clearTimeout(timeoutId);
        }

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
          } else if (response.status === 500 || response.status === 502) {
            logger.warn("Backend proxy may be unavailable or misconfigured. Ensure the FastAPI server is running.");
          } else if (response.status === 503 || msg.includes("UNAVAILABLE")) {
            logAIUserHint("The backend or Gemini service is temporarily unavailable. Wait briefly and retry.");
          }

          const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
          if (nextModel) broadcastAIFallback(currentModel, msg, nextModel);

          lastError = new Error(msg);
          continue; 
        }

        const data = await response.json();
        const text = data.text;
        
        if (!text) throw new Error("AI returned an empty response.");

        const totalLatency = performance.now() - startTime;
        logger.success(`Success! Model: ${currentModel} | Latency: ${totalLatency.toFixed(2)}ms`);

        broadcastAIMetadata({
          text,
          model: currentModel,
          latency: data.latency_ms || totalLatency,
          fallbacks: attemptedFallbacks
        });

        // Async validation
        try {
          const engine = new ValidationEngine();
          const validation = engine.validate(detailedSystemInstruction, text);
          AI_EVENTS.dispatchEvent(new CustomEvent('ai_validation', { detail: { model: currentModel, validation } }));
          if (!validation.isValid) {
            logger.warn(`Validation flagged issues (score: ${validation.score})`, validation.violations);
          }
        } catch (valErr) {
          logger.warn('Validation engine failed:', valErr);
        }

        setCachedResponse(requestKey, text);
        return text;
      } catch (error: any) {
        if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId);
        
        const errMessage = error?.message || String(error);
        logger.warn(`Model ${currentModel} failed: ${errMessage}`);

        if (errMessage.includes('Failed to fetch') || errMessage.includes('ERR_EMPTY_RESPONSE')) {
          logAIUserHint("The backend proxy fetch failed. Confirm that the frontend dev server can reach /api/generate and that the backend is running.");
          throw new NetworkError("Backend proxy unreachable. Ensure the backend is running and Vite proxy /api is configured.");
        }

        const nextModel = modelFallbacks[modelFallbacks.indexOf(currentModel) + 1];
        if (nextModel) broadcastAIFallback(currentModel, errMessage, nextModel);

        lastError = error instanceof Error ? error : new Error(errMessage);
        continue;
      }
    }

    if (lastError) {
      const errMessage = lastError.message;
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

export async function generateImage(
  prompt: string,
  model: string = "stable-image/generate/core"
): Promise<string> {
  const startTime = performance.now();
  logger.info(`Starting image generation request for model: ${model}`);

  const modelFallbacks = [
    model,
    "stable-image/generate/core",
    "black-forest-labs/flux-1-schnell",
    "stabilityai/stable-diffusion-3-5-large",
  ].filter((item, pos, self) => self.indexOf(item) == pos);

  let lastError: Error | null = null;

  for (const currentModel of modelFallbacks) {
    logger.info(`Trying image model: ${currentModel}`);
    const payload = { prompt, model: currentModel };
    let response: Response | null = null;

    try {
      response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (fetchError: any) {
      const fetchErrorMessage = fetchError?.message?.toString() || "";
      if (fetchError instanceof TypeError || fetchErrorMessage.includes("Failed to fetch") || fetchErrorMessage.includes("ERR_EMPTY_RESPONSE")) {
        logger.warn(`/api proxy fetch failed, retrying direct backend URL: ${BACKEND_GENERATE_IMAGE_URL}`);
        try {
          response = await fetch(BACKEND_GENERATE_IMAGE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (e: any) {
          lastError = e;
          continue;
        }
      } else {
        lastError = fetchError;
        continue;
      }
    }

    if (!response || !response.ok) {
      const errorData = await response?.json().catch(() => ({})) || {};
      lastError = new Error(errorData.detail || errorData.error || `Failed to generate image with ${currentModel}.`);
      continue;
    }

    const data = await response.json();
    const latency = performance.now() - startTime;
    logger.success(`Image generated in ${latency.toFixed(2)}ms with model ${currentModel}`);

    return data.text || data.image_data;
  }
  
  throw lastError || new Error("All image generation models failed.");
}

/**
 * Stream AI Response from the backend.
 */
export async function* streamText(
  model: string,
  prompt: string,
  systemInstruction: string,
  temperature: number = 0.85,
  maxTokens: number = 2048,
  topP: number = 0.95,
  topK: number = 40,
  worldLore?: string | null,
  characterDNA?: string | null,
  episodePlan?: string | null
): AsyncGenerator<string> {
  const detailedSystemInstruction = composeDetailedSystemInstruction(
    systemInstruction,
    worldLore,
    characterDNA,
    episodePlan
  );

  const payload = {
    model,
    prompt,
    systemInstruction: detailedSystemInstruction,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    top_k: topK
  };

  const isAgent = ["antigravity", "deep-research-pro", "computer-use-preview"].includes(normalizeModelId(model));
  const activeEndpoint = isAgent ? "/api/agent" : "/api/text";
  const payloadWithStream = { ...payload, stream: true };

  const response = await fetch(activeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadWithStream)
  });

  if (!response.ok) {
    throw new Error(`Streaming failed: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6).trim();
        if (dataStr === "[DONE]") return;
        let parsedData: any;
        try {
          parsedData = JSON.parse(dataStr);
        } catch (e) {
          console.error("Failed to parse stream data:", dataStr, e);
          continue;
        }
        if (parsedData?.error) throw new Error(parsedData.error);
        if (parsedData?.text) yield parsedData.text;
      }
    }
  }
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
