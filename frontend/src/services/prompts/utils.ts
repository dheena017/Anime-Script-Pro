import * as JSON5 from "json5";
import { cleanJson } from "@/lib/api-utils";

export function validateTextInput(
  value: unknown,
  fieldName: string,
  minimumLength = 1,
): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length < minimumLength) {
    throw new Error(
      `${fieldName} must be at least ${minimumLength} characters long.`,
    );
  }

  return trimmed;
}

export function validatePositiveInteger(
  value: unknown,
  fieldName: string,
  maximumValue?: number,
): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  if (typeof maximumValue === "number" && (value as number) > maximumValue) {
    throw new Error(`${fieldName} must be ${maximumValue} or fewer.`);
  }

  return value as number;
}

export function limitPromptSize(
  value: string | undefined,
  maxChars: number,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}\n\n[Truncated to keep synthesis within model limits.]`;
}

export function extractJsonBlock(
  text: string,
  openChar: "{" | "[",
  closeChar: "}" | "]",
): string | null {
  const startIndex = text.indexOf(openChar);
  if (startIndex < 0) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let stringDelimiter: '"' | "'" | null = null;

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === stringDelimiter) {
        inString = false;
        stringDelimiter = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      inString = true;
      stringDelimiter = character;
      continue;
    }

    if (character === openChar) {
      depth += 1;
      continue;
    }

    if (character === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

export function stripMarkdownFences(text: string): string {
  return text
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

export function findWrappedObjectCandidate(
  value: unknown,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidateKeys = [
    "detailed_episode_spec",
    "result",
    "data",
    "payload",
    "output",
  ];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      return candidate as Record<string, unknown>;
    }
  }

  return value as Record<string, unknown>;
}

export function findWrappedArrayCandidate(value: unknown): unknown[] | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  const candidateKeys = ["result", "data", "payload", "output", "items"];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function escapeJsonStringNewlines(value: string | null | undefined): string {
  if (typeof value !== "string") {
    return typeof value === "object" && value !== null ? JSON.stringify(value) : "";
  }

  let inString = false;
  let escaped = false;
  let result = "";

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString && (char === "\n" || char === "\r")) {
      result += "\\n";
      if (char === "\r" && value[i + 1] === "\n") {
        i += 1;
      }
      continue;
    }
    result += char;
  }

  return result;
}

export function repairTruncatedJsonText(raw: string): string {
  if (!raw) return "";

  let content = raw.replace(/\r\n/g, "\n");
  let inString = false;
  let escaped = false;
  const stack: string[] = [];

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack.length > 0) {
        const last = stack[stack.length - 1];
        if ((char === "}" && last === "{") || (char === "]" && last === "[")) {
          stack.pop();
        }
      }
    }
  }

  if (escaped) {
    content = content.slice(0, -1);
  }

  if (inString) {
    content += '"';
  }

  content = content.trimEnd().replace(/[,:]\s*$/, "");

  for (let i = stack.length - 1; i >= 0; i -= 1) {
    content += stack[i] === "{" ? "}" : "]";
  }

  return content;
}

export function parseStructuredJson<T>(
  text: string,
  expectedShape: "array" | "object",
): T | null {
  const tryParse = (value: string): any | null => {
    try {
      return JSON.parse(value);
    } catch {
      try {
        return JSON5.parse(value);
      } catch {
        return null;
      }
    }
  };

  const normalizeContent = (source: string): string => {
    const stripped = stripMarkdownFences(source);
    const extracted = extractJsonBlock(
      stripped,
      expectedShape === "array" ? "[" : "{",
      expectedShape === "array" ? "]" : "}",
    );
    const target = extracted ?? stripped;
    const cleaned = cleanJson(target);
    return escapeJsonStringNewlines(typeof cleaned === "string" ? cleaned : JSON.stringify(cleaned));
  };

  const parseCandidate = (candidate: string): any | null => {
    const parsed = tryParse(candidate);
    if (parsed) return parsed;

    try {
      const cleaned = cleanJson(candidate);
      const candidateString = typeof cleaned === "string" ? cleaned : JSON.stringify(cleaned);
      const cleanedParsed = tryParse(candidateString);
      if (cleanedParsed) return cleanedParsed;
    } catch {
    }

    const repaired = repairTruncatedJsonText(candidate);
    return tryParse(repaired);
  };

  try {
    const openChar = expectedShape === "array" ? "[" : "{";
    const closeChar = expectedShape === "array" ? "]" : "}";
    const stripped = stripMarkdownFences(text);
    const extracted = extractJsonBlock(stripped, openChar as "[" | "{", closeChar as "]" | "}");

    if (extracted) {
      const candidate = escapeJsonStringNewlines(cleanJson(extracted));
      const parsed = parseCandidate(candidate);
      if (parsed) {
        if (expectedShape === "array" && Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === "object" && parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as unknown as T;
        if (expectedShape === "array") {
          const wrappedArray = findWrappedArrayCandidate(parsed);
          if (wrappedArray) return wrappedArray as unknown as T;
        }
        if (expectedShape === "object") {
          const wrappedObject = findWrappedObjectCandidate(parsed);
          if (wrappedObject) return wrappedObject as unknown as T;
        }
      }
    }
  } catch {
  }

  try {
    const normalized = normalizeContent(text);
    const parsed = parseCandidate(normalized);
    if (expectedShape === "array") {
      if (Array.isArray(parsed)) return parsed as unknown as T;
      const potentialArray = findWrappedArrayCandidate(parsed);
      if (potentialArray) return potentialArray as unknown as T;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject && Array.isArray((nestedObject as any).items)) {
          return (nestedObject as any).items as unknown as T;
        }
      }
    } else {
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const nestedObject = findWrappedObjectCandidate(parsed);
        if (nestedObject) return nestedObject as unknown as T;
      }
    }
    return parsed as unknown as T;
  } catch (err) {
    console.error("parseLooseJson failed:", err);
    return null;
  }
}
