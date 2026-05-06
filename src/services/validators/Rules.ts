/**
 * Rules registry for validation engine.
 * This file contains enumerations or simple helpers for rule identifiers.
 */
export const RULES = {
  FORMAT_SECTION_MISSING: 'FORMAT_SECTION_MISSING',
  TITLE_COUNT: 'TITLE_COUNT',
  TAG_COUNT: 'TAG_COUNT',
  SCENE_FIELD_MISSING: 'SCENE_FIELD_MISSING',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE'
} as const;

export type RuleKey = keyof typeof RULES;

export default RULES;
