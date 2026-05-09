import { useState, useEffect, useRef } from 'react';

/**
 * useSceneReveal
 * Returns how many scene rows are currently visible (count grows over time).
 * Pass `total` = total number of rows; pass `scriptKey` = a value that changes
 * when a new script is generated (so the reveal restarts).
 *
 * @param total       - Total number of data rows (excluding header)
 * @param scriptKey   - Changes whenever a new script arrives (e.g. first 40 chars)
 * @param intervalMs  - How fast each new row appears (default 120ms)
 */
export function useSceneReveal(
  total: number,
  scriptKey: string | null | undefined,
  intervalMs = 120
): number {
  const [visibleCount, setVisibleCount] = useState(0);
  const prevKeyRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    // Reset when a new script arrives
    if (scriptKey !== prevKeyRef.current) {
      prevKeyRef.current = scriptKey;
      setVisibleCount(0);
    }
  }, [scriptKey]);

  useEffect(() => {
    if (visibleCount >= total) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => Math.min(c + 1, total));
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [visibleCount, total, intervalMs]);

  return visibleCount;
}
