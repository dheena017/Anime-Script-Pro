export class ApiError extends Error {
  constructor(public message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Global Signal Bus for real-time Neural events
export const signalBus = new EventTarget();

export interface NeuralSignalEvent {
  signalId: string;
  method: string;
  url: string;
  status: number;
  duration: number;
}

export function cleanJson(content: string): any {
  // Strip markdown backticks if present
  const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();

  // First pass: straightforward parse
  try {
    return JSON.parse(cleaned);
  } catch (_firstError) {
    // Second pass: attempt truncation repair
    // Strip anything after the last complete value (trailing comma, incomplete string, etc.)
    try {
      const repaired = repairTruncatedJson(cleaned);
      const result = JSON.parse(repaired);
      console.warn('[cleanJson] Repaired truncated JSON response. Some data may be missing.');
      return result;
    } catch (_repairError) {
      console.error('Failed to parse JSON content:', content);
      throw new ApiError('Invalid AI output format. Could not parse JSON.');
    }
  }
}

/**
 * Attempts to close an incomplete JSON string that was truncated mid-output.
 * Handles unclosed arrays, objects, and strings.
 */
function repairTruncatedJson(raw: string): string {
  // Remove trailing incomplete tokens: partial strings, trailing commas, dangling keys
  let s = raw
    .replace(/,\s*$/, '')           // trailing comma
    .replace(/,\s*[\]}]$/g, (m) => m.slice(m.indexOf(']') !== -1 ? m.indexOf(']') : m.indexOf('}')))
    .trimEnd();

  // Track open brackets/braces to know how many to close
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // If we ended up inside a string, close it
  if (inString) s += '"';

  // Remove trailing comma before we start closing
  s = s.replace(/,\s*$/, '');

  // Close any open brackets in reverse order
  for (let i = stack.length - 1; i >= 0; i--) {
    s += stack[i] === '{' ? '}' : ']';
  }

  return s;
}

const trimTrailingSlash = (value: string) => value.replace(/\/$|^\s+|\s+$/g, '');
const viteEnv = (import.meta as any)?.env ?? {};
export const API_BASE_URL = viteEnv.VITE_API_BASE_URL
  ? trimTrailingSlash(viteEnv.VITE_API_BASE_URL)
  : '';

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
    console.info(`%c[Frontend] %cDEDUPLICATED: ${displayLabel}`, 'color: #8b5cf6; font-weight: bold', 'color: #94a3b8');
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

    console.info(`%c[Frontend] %c${label ? 'REQUESTING' : 'SENDING'}: ${displayLabel}`, 'color: #3b82f6; font-weight: bold', 'color: #94a3b8');

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
      signalBus.dispatchEvent(new CustomEvent('neural_signal', {
        detail: { signalId, method, url, status: response.status, duration }
      }));

      if (!response.ok) {
        console.error(`%c[Backend] %cERROR [${signalId}]: ${response.status} ${response.statusText} (${duration}ms)`, 'color: #ef4444; font-weight: bold', 'color: #94a3b8');
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

      console.info(`%c[Backend] %cSUCCESS [${displayLabel}]: ${response.status} (${duration}ms)`, 'color: #10b981; font-weight: bold', 'color: #94a3b8');
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

      console.error(`%c[System] %cNETWORK ERROR: ${errorMessage}`, 'color: #f59e0b; font-weight: bold', 'color: #94a3b8');
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



