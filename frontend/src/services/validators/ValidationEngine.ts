export interface ValidationViolation {
  rule: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  violations: ValidationViolation[];
}

function extractBalancedJsonBlock(text: string, openChar: '{' | '[', closeChar: '}' | ']'): string | null {
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

      if (character === '\\') {
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

function parseLooseJson<T>(text: string, expectedShape: 'array' | 'object'): T | null {
  const normalized = (text || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  const openChar = expectedShape === 'array' ? '[' : '{';
  const closeChar = expectedShape === 'array' ? ']' : '}';
  const extracted = extractBalancedJsonBlock(normalized, openChar, closeChar);
  const candidateText = extracted || normalized;

  try {
    const parsed = JSON.parse(candidateText);
    if (expectedShape === 'array' && Array.isArray(parsed)) return parsed as T;
    if (expectedShape === 'object' && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as T;
  } catch {
    try {
      const parsed = JSON.parse(candidateText.replace(/,\s*([}\]])/g, '$1'));
      if (expectedShape === 'array' && Array.isArray(parsed)) return parsed as T;
      if (expectedShape === 'object' && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as T;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Simple, early-stage validation engine.
 * Focuses on format checks for metadata and scene outputs.
 */
export class ValidationEngine {
  determineType(systemInstruction: string): 'metadata' | 'scene' | 'series' | 'episodeDetail' | 'generic' {
    const s = (systemInstruction || '').toLowerCase();
    if (s.includes('detailed_episode_spec') || s.includes('cold_open') || s.includes('script_dialogue_teaser')) return 'episodeDetail';
    if (s.includes('episode') && s.includes('runtime')) return 'series';
    if (s.includes('title options') || s.includes('metadata') || s.includes('seo tags')) return 'metadata';
    if (s.includes('scene') && s.includes('narration')) return 'scene';
    return 'generic';
  }

  validate(systemInstruction: string, text: string): ValidationResult {
    const type = this.determineType(systemInstruction);
    if (type === 'metadata') return this.validateMetadata(text);
    if (type === 'scene') return this.validateScene(text);
    if (type === 'series') return this.validateSeries(text);
    if (type === 'episodeDetail') return this.validateEpisodeDetail(text);
    return this.validateGeneric(text);
  }

  validateSeries(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    const parsed = parseLooseJson<any[]>(text, 'array');

    if (!parsed) {
      violations.push({ rule: 'JSON_PARSE_ERROR', severity: 'error', message: 'Failed to parse Series JSON array.' });
    }

    if (parsed && !Array.isArray(parsed)) {
      violations.push({ rule: 'NOT_AN_ARRAY', severity: 'error', message: 'Series output should be a JSON array.' });
    }

    if (parsed && Array.isArray(parsed) && parsed.length === 0) {
      violations.push({ rule: 'EMPTY_ARRAY', severity: 'warning', message: 'Series array is empty.' });
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 30);
    return { isValid: violations.length === 0, score, violations };
  }

  validateEpisodeDetail(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    const parsed = parseLooseJson<any>(text, 'object');

    if (!parsed) {
      violations.push({ rule: 'JSON_PARSE_ERROR', severity: 'error', message: 'Failed to parse episode detail JSON object.' });
      return { isValid: false, score: 0, violations };
    }

    const episodeRoot = parsed.detailed_episode_spec && typeof parsed.detailed_episode_spec === 'object'
      ? parsed.detailed_episode_spec
      : parsed;

    if (!episodeRoot || typeof episodeRoot !== 'object' || Array.isArray(episodeRoot)) {
      violations.push({ rule: 'NOT_AN_OBJECT', severity: 'error', message: 'Episode detail output should be a JSON object.' });
      return { isValid: false, score: 0, violations };
    }

    const requiredKeys = ['cold_open', 'acts'];
    for (const key of requiredKeys) {
      if (!(key in episodeRoot)) {
        violations.push({ rule: 'EPISODE_DETAIL_KEY_MISSING', severity: 'error', message: `Missing JSON key: ${key}` });
      }
    }

    if (Array.isArray(episodeRoot.acts)) {
      if (episodeRoot.acts.length !== 3) {
        violations.push({ rule: 'ACT_COUNT', severity: 'warning', message: 'Episode detail should contain exactly 3 acts.' });
      }

      const actWithScenes = episodeRoot.acts.find((act: any) => !Array.isArray(act?.scenes) || act.scenes.length === 0);
      if (actWithScenes) {
        violations.push({ rule: 'EMPTY_ACT_SCENES', severity: 'warning', message: 'One or more acts are missing scenes.' });
      }
    } else {
      violations.push({ rule: 'ACTS_NOT_ARRAY', severity: 'error', message: 'Episode detail acts must be a JSON array.' });
    }

    const score = Math.max(0, 100 - violations.length * 20);
    return { isValid: violations.length === 0, score, violations };
  }

  validateMetadata(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    const lower = (text || '').toLowerCase();
    // Required sections
    const required = ['## title options', '## description', '## seo tags', '## thumbnail concepts', '## packaging notes'];
    let missing = 0;
    for (const h of required) {
      if (!lower.includes(h)) {
        missing++;
        violations.push({ rule: 'FORMAT_SECTION_MISSING', severity: 'error', message: `Missing section: ${h}` });
      }
    }

    // Check title count (simple heuristic)
    const titleSectionMatch = text.match(/##\s*Title Options[\s\S]*?(?=##|$)/i);
    let titleCount = 0;
    if (titleSectionMatch) {
      const lines = titleSectionMatch[0].split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      titleCount = lines.filter(l => /^\d+\./.test(l)).length;
      if (titleCount < 5) {
        violations.push({ rule: 'TITLE_COUNT', severity: 'warning', message: 'Expected 5 title options.' });
      }
    } else {
      violations.push({ rule: 'TITLE_SECTION', severity: 'error', message: 'Title section not found.' });
      missing++;
    }

    // Tags heuristic
    const tagsMatch = text.match(/##\s*SEO Tags[\s\S]*?(?=##|$)/i);
    let tagCount = 0;
    if (tagsMatch) {
      const tagLine = tagsMatch[0].split(/\r?\n/).slice(1).join(' ').trim();
      const tags = tagLine.split(',').map(t => t.trim()).filter(Boolean);
      tagCount = tags.length;
      if (tagCount < 10) {
        violations.push({ rule: 'TAG_COUNT', severity: 'warning', message: 'Fewer than expected tags (recommended 15-20).' });
      }
    } else {
      violations.push({ rule: 'TAGS_SECTION', severity: 'warning', message: 'SEO tags section not found.' });
    }

    const score = Math.max(0, 100 - (missing * 20) - (Math.max(0, 5 - titleCount) * 5) - (Math.max(0, 15 - tagCount) * 2));

    return { isValid: violations.length === 0, score, violations };
  }

  validateScene(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    const parsed = parseLooseJson<any>(text, 'object');

    if (!parsed || typeof parsed !== 'object') {
      // look for field keywords
      const lower = (text || '').toLowerCase();
      const needed = ['narration', 'visuals', 'sound'];
      for (const k of needed) {
        if (!lower.includes(k)) violations.push({ rule: 'SCENE_FIELD_MISSING', severity: 'error', message: `Missing scene field: ${k}` });
      }
      const score = Math.max(0, 60 - violations.length * 15);
      return { isValid: violations.length === 0, score, violations };
    }

    // Validate parsed object has keys
    const keys = Object.keys(parsed);
    const requiredKeys = ['narration','visuals','sound'];
    for (const k of requiredKeys) if (!keys.includes(k)) violations.push({ rule: 'SCENE_JSON_KEY_MISSING', severity: 'error', message: `Missing JSON key: ${k}` });

    const score = Math.max(0, 90 - violations.length * 20);
    return { isValid: violations.length === 0, score, violations };
  }

  validateGeneric(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    if (!text || text.trim().length === 0) violations.push({ rule: 'EMPTY_RESPONSE', severity: 'error', message: 'AI returned empty response.' });
    const score = violations.length ? 40 : 100;
    return { isValid: violations.length === 0, score, violations };
  }
}

export default ValidationEngine;
