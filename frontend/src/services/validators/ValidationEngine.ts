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

/**
 * Simple, early-stage validation engine.
 * Focuses on format checks for metadata and scene outputs.
 */
export class ValidationEngine {
  determineType(systemInstruction: string): 'metadata' | 'scene' | 'series' | 'generic' {
    const s = (systemInstruction || '').toLowerCase();
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
    return this.validateGeneric(text);
  }

  validateSeries(text: string): ValidationResult {
    const violations: ValidationViolation[] = [];
    let parsed: any = null;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
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
    // Prefer JSON scene output
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // try to extract JSON block
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
      if (fenced) {
        try { parsed = JSON.parse(fenced); } catch {}
      }
    }

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
