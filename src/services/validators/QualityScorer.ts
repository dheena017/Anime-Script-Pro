/**
 * Simple quality scorer utilities. Keeps scoring logic centralized.
 */
export function normalizeScore(raw: number): number {
  if (Number.isNaN(raw) || raw == null) return 0;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function combineScores(scores: number[]): number {
  if (!scores || scores.length === 0) return 0;
  const total = scores.reduce((s, v) => s + v, 0);
  return normalizeScore(total / scores.length);
}

export default { normalizeScore, combineScores };
