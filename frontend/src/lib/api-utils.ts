export class ApiError extends Error {
  constructor(public message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

import { emitNeuralSignal, persistLogHistory, studioLog, signalBus } from './dev-console-logs';
export type { NeuralSignalEvent } from './dev-console-logs';

import JSON5 from 'json5';

export function cleanJson(content: string): any {
  if (!content) return null;

  // 1. Initial Markdown Cleanup
  let cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Find the first occurrence of '{' or '['
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIndex = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  if (startIndex === -1) {
    // Fallback: Just try to parse the whole thing if no braces found
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      studioLog('System', 'Failed to parse JSON content (no structure found)', 'error', content);
      throw new ApiError('Invalid AI output format. No JSON structure detected.');
    }
  }

  // 3. Extract potential JSON block from the start point
  let potentialJson = cleaned.slice(startIndex);
  
  // 4. Try straightforward parse with sanitization
  const sanitized = sanitizeJson(potentialJson);
  try {
    return JSON.parse(sanitized);
  } catch (_firstError) {
    // Try JSON5 as a more permissive parser before entering repair flows
    try {
      return JSON5.parse(sanitized);
    } catch (json5err) {
      // continue to repair logic
    }
  }
    // 5. If straightforward parse fails, try finding the last matching closer
    const lastBrace = potentialJson.lastIndexOf('}');
    const lastBracket = potentialJson.lastIndexOf(']');
    const endIndex = Math.max(lastBrace, lastBracket);
    
    if (endIndex !== -1) {
      const trimmed = potentialJson.slice(0, endIndex + 1);
      try {
        return JSON.parse(sanitizeJson(trimmed));
      } catch (_secondError) {
        // Still failing, proceed to repair logic
      }
    }
    
    // 6. Attempt Strategy A: Direct closure of unclosed keys/strings and brace matching
    try {
      const repairedA = repairTruncatedJson(potentialJson, false);
      const fullySanitizedA = sanitizeJson(repairedA);
      try {
        return JSON.parse(fullySanitizedA);
      } catch (e) {
        try {
          return JSON5.parse(fullySanitizedA);
        } catch (e2) {
          // fall through to next strategy
        }
      }
    } catch (_errA) {
      // 7. Fallback to Strategy B: Backtracking to last complete structural delimiter
      try {
        const repairedB = repairTruncatedJson(potentialJson, true);
        const fullySanitizedB = sanitizeJson(repairedB);
        try {
          return JSON.parse(fullySanitizedB);
        } catch (e) {
          try {
            return JSON5.parse(fullySanitizedB);
          } catch (e2) {
            throw e2 || reportError;
          }
        }
      } catch (repairError) {
        studioLog('System', 'Failed to parse JSON content after all repair attempts', 'error', { content, repairError });
        throw new ApiError('Invalid AI output format. JSON structure is too corrupted to repair.');
      }
    }
  }

/**
 * Fixes common structural errors in AI-generated JSON, 
 * such as single quotes used for delimiters or unescaped newlines in strings.
 */
function sanitizeJson(s: string): string {
  if (!s) return s;
  
  let result = s.trim();
  
  // Replace structural single quotes with double quotes
  // 1. Single quotes for keys: { 'key': ... } or , 'key': ...
  result = result.replace(/([{,]\s*)'([^']*)'(\s*:)/g, '$1"$2"$3');
  
  // 2. Single quotes for string values: : 'value'
  result = result.replace(/(:\s*)'([^']*)'(\s*[,}\]])/g, '$1"$2"$3');
  
  // 3. Single quotes in arrays: [ 'value1', 'value2' ]
  // This is tricky because of nested structures, but we can do a basic pass
  result = result.replace(/([\[,]\s*)'([^']*)'(\s*[,\]])/g, '$1"$2"$3');

  // 4. Quote unquoted object keys: { key: or , key:
  // Matches keys that are valid identifier-like tokens
  result = result.replace(/([{,]\s*)([A-Za-z0-9_\-\$]+)\s*:/g, '$1"$2":');

  // Fix unescaped newlines inside double-quoted strings
  // This is a common AI error where it puts a real newline instead of \n
  let inside = false;
  let escaped = false;
  let output = "";
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    if (escaped) {
      output += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      output += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      inside = !inside;
      output += char;
      continue;
    }
    if (inside && char === '\r') {
      if (result[i + 1] === '\n') {
        i++;
      }
      output += '\\n';
      continue;
    }
    if (inside && char === '\n') {
      output += '\\n';
      continue;
    }
    output += char;
  }
  result = output;
  
  return result;
}

/**
 * Attempts to close an incomplete JSON string that was truncated mid-output.
 * Handles unclosed arrays, objects, and strings.
 * Has both backtrack and direct closure modes to maximize recovered content.
 */
function repairTruncatedJson(raw: string, forceBacktrack: boolean): string {
  // 1. Initial cleanup
  let s = raw.trimEnd();
  
  // 2. Track nesting and string state
  const stack: string[] = [];
  let inString = false;
  let escape = false;
  let lastValidIndex = -1;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    
    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }
    
    if (ch === '"') {
      inString = !inString;
      if (!inString) {
        // We just closed a string, this is a valid cut point
        lastValidIndex = i;
      }
      continue;
    }
    
    if (inString) continue;

    if (ch === '{' || ch === '[') {
      stack.push(ch);
      lastValidIndex = i;
    } else if (ch === '}' || ch === ']') {
      if (stack.length > 0) {
        const last = stack[stack.length - 1];
        if ((ch === '}' && last === '{') || (ch === ']' && last === '[')) {
          stack.pop();
          lastValidIndex = i;
        }
      }
    } else if (ch === ',') {
      lastValidIndex = i;
    }
  }

  // 3. Backtrack to last safe index if requested
  if (forceBacktrack && lastValidIndex !== -1 && lastValidIndex < s.length - 1) {
    s = s.slice(0, lastValidIndex + 1);
  }

  // 4. Strip trailing commas/colons unconditionally before suffix synthesis
  s = s.trimEnd();
  while (s.endsWith(',') || s.endsWith(':')) {
    s = s.slice(0, -1).trimEnd();
  }

  // 5. Re-verify the stack and string state for suffix generation
  const finalStack: string[] = [];
  let finalInString = false;
  let finalEscape = false;
  
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (finalEscape) { finalEscape = false; continue; }
    if (ch === '\\' && finalInString) { finalEscape = true; continue; }
    if (ch === '"') { finalInString = !finalInString; continue; }
    if (finalInString) continue;
    if (ch === '{' || ch === '[') finalStack.push(ch);
    else if (ch === '}' || ch === ']') {
      if (finalStack.length > 0) {
        const last = finalStack[finalStack.length - 1];
        if ((ch === '}' && last === '{') || (ch === ']' && last === '[')) {
          finalStack.pop();
        }
      }
    }
  }

  if (finalInString) {
    if (finalEscape) s += '"';
    s += '"';
  }
  
  // Clean up any trailing comma after closing string
  s = s.trimEnd();
  while (s.endsWith(',') || s.endsWith(':')) {
    s = s.slice(0, -1).trimEnd();
  }

  // Close open brackets in reverse order
  for (let i = finalStack.length - 1; i >= 0; i--) {
    s += finalStack[i] === '{' ? '}' : ']';
  }

  return s;
}

const trimTrailingSlash = (value: string) => value.replace(/\/$|^\s+|\s+$/g, '');
const viteEnv = (import.meta as any)?.env ?? {};
export const API_BASE_URL = viteEnv.VITE_API_BASE_URL
  ? trimTrailingSlash(viteEnv.VITE_API_BASE_URL)
  : '';

type BackendStatus = 'unknown' | 'online' | 'offline';

let cachedBackendStatus: BackendStatus = 'unknown';
let cachedBackendStatusAt = 0;
let backendHealthPromise: Promise<boolean> | null = null;

function shouldRefreshBackendStatus() {
  if (cachedBackendStatus === 'unknown') return true;
  const age = Date.now() - cachedBackendStatusAt;
  return cachedBackendStatus === 'online' ? age > 15000 : age > 5000;
}

export async function isBackendOnline(forceRefresh = false): Promise<boolean> {
  if (!forceRefresh && !shouldRefreshBackendStatus()) {
    return cachedBackendStatus === 'online';
  }

  if (backendHealthPromise) {
    return backendHealthPromise;
  }

  backendHealthPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const response = await fetch('/_orchestrator/health', { signal: controller.signal });
      if (!response.ok) {
        cachedBackendStatus = 'offline';
        cachedBackendStatusAt = Date.now();
        return false;
      }

      const data = await response.json().catch(() => null);
      const online = data?.backend?.status === 'ONLINE';
      cachedBackendStatus = online ? 'online' : 'offline';
      cachedBackendStatusAt = Date.now();
      return online;
    } catch {
      cachedBackendStatus = 'offline';
      cachedBackendStatusAt = Date.now();
      return false;
    } finally {
      clearTimeout(timeoutId);
      backendHealthPromise = null;
    }
  })();

  return backendHealthPromise;
}

/**
 * Returns the correct WebSocket base URL for backend connections.
 * In development the Vite dev server proxy may NOT forward WebSocket traffic,
 * so we connect directly to the backend port (3050).
 * In production we use the same host as the page (wss:// for https).
 */
export function getBackendWsUrl(path: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // If a backend URL is configured (e.g. http://127.0.0.1:3050) use that host
  if (API_BASE_URL) {
    const backendHost = API_BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}//${backendHost}${path}`;
  }
  // Dev fallback: Vite runs on :5173 / :3000 but backend is on :3050
  const isDev = viteEnv.MODE === 'development' || 
                 viteEnv.DEV === true || 
                 viteEnv.VITE_ENV === 'development' || 
                 window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1';

  if (isDev) {
    // In development, use the same host (the proxy) for WebSockets
    // The proxy in server.ts/vite will handle the upgrade.
    return `${protocol}//${window.location.host}${path}`;
  }
  // Production: same origin
  return `${protocol}//${window.location.host}${path}`;
}

async function getAuthToken(): Promise<string | null> {
  try {
    // Return backend token (custom)
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

const pendingRequests = new Map<string, Promise<any>>();

export async function apiRequest<T>(url: string, options?: RequestInit & { timeout?: number; label?: string }): Promise<T> {
  const { timeout = 30000, label, ...fetchOptions } = options || {};
  const method = fetchOptions.method || 'GET';
  const displayLabel = label ? label.toUpperCase() : `${method} ${url}`;
  
  // Deduplicate GET requests
  const requestKey = `${method}:${url}`;
  if (method === 'GET' && pendingRequests.has(requestKey)) {
    studioLog('Frontend', `DEDUPLICATED: ${displayLabel}`, 'manhwa', undefined, {
      source: 'api-utils',
      category: 'network',
      action: 'dedupe',
      tags: [method, requestKey],
      summary: `Deduplicated ${displayLabel}`,
    });
    return pendingRequests.get(requestKey);
  }

  const promise = (async () => {
    const start = Date.now();
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    const finalUrl = url.startsWith('http')
      ? url
      : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
    const token = await getAuthToken();

    if (!API_BASE_URL && url.startsWith('/api')) {
      const backendOnline = await isBackendOnline();
      if (!backendOnline) {
        throw new ApiError('Backend service is offline', 503, { url, displayLabel });
      }
    }

    studioLog('Frontend', `${label ? 'REQUESTING' : 'SENDING'}: ${displayLabel}`, 'anime', undefined, {
      source: 'api-utils',
      category: 'network',
      action: method.toLowerCase(),
      tags: [method, url],
      summary: `${method} ${displayLabel}`,
    });

    try {
      const response = await fetch(finalUrl, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });

      const duration = Date.now() - start;
      const signalId = response.headers.get('X-Signal-ID') || 'NO-SIGNAL';

      // Dispatch to Signal Bus
      emitNeuralSignal({
        signalId,
        method,
        url,
        status: response.status,
        duration,
        source: 'api-utils',
        category: 'network',
        summary: `${method} ${displayLabel}`,
        tags: [signalId, method],
      });
      persistLogHistory();

      if (!response.ok) {
        studioLog('Backend', `ERROR [${signalId}]: ${response.status} ${response.statusText} (${duration}ms)`, 'error', undefined, {
          source: 'api-utils',
          category: 'network-error',
          action: 'response-error',
          tags: [signalId, method],
          summary: `${method} ${displayLabel} failed with ${response.status}`,
        });
        let errorData;
        try {
          const raw = await response.json();
          errorData = raw.data || raw;
        } catch {
          errorData = { detail: response.statusText };
        }
        
        const message = errorData.detail || errorData.error || 'API Request failed';
        throw new ApiError(message, response.status, { ...errorData, signalId });
      }

      studioLog('Backend', `SUCCESS [${signalId}]: ${displayLabel} | Status: ${response.status} (${duration}ms)`, 'success', undefined, {
        source: 'api-utils',
        category: 'network-success',
        action: 'response-ok',
        tags: [signalId, method],
        summary: `${method} ${displayLabel} completed successfully`,
      });
      persistLogHistory();
      return await response.json();
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      const errorName = error?.name;
      const errorMessage = error?.message || String(error);

      if (errorName === 'AbortError' || errorMessage.toLowerCase().includes('aborted')) {
        if (options?.signal?.aborted) {
          throw new ApiError('Generation stopped by user', 499);
        }
        throw new ApiError(`Request timed out after ${timeout}ms`, 408);
      }

      studioLog('System', `NETWORK ERROR: ${errorMessage}`, 'error', undefined, {
        source: 'api-utils',
        category: 'network-exception',
        action: 'request-failed',
        tags: [method, url],
        summary: `${method} ${displayLabel} threw a network error`,
      });
      persistLogHistory();
      throw new ApiError(errorMessage || 'Network error');
    } finally {
      clearTimeout(id);
      if (method === 'GET') pendingRequests.delete(requestKey);
    }
  })();

  if (method === 'GET') {
    pendingRequests.set(requestKey, promise);
  }

  return promise;
}



