export interface ProductionUnit {
  sess: number;
  ep: number;
  scen: number;
}

/**
 * Generates a flat array of objects representing every combination 
 * of session, episode, and scene.
 * 
 * The logic ensures that scenes increment first, then episodes, and finally sessions.
 * 
 * Example:
 * (1, 1, 1), (1, 1, 2) ... (1, 1, maxSCEN)
 * (1, 2, 1), (1, 2, 2) ... (1, 2, maxSCEN)
 * ...
 * (2, 1, 1) ...
 * 
 * @param maxSESS - Maximum number of sessions
 * @param maxEP - Maximum number of episodes per session
 * @param maxSCEN - Maximum number of scenes per episode
 * @returns Array of ProductionUnit objects
 */
export function generateProductionSequences(
  maxSESS: number, 
  maxEP: number, 
  maxSCEN: number
): ProductionUnit[] {
  const result: ProductionUnit[] = [];

  for (let s = 1; s <= maxSESS; s++) {
    for (let e = 1; e <= maxEP; e++) {
      for (let sc = 1; sc <= maxSCEN; sc++) {
        result.push({
          sess: s,
          ep: e,
          scen: sc
        });
      }
    }
  }

  return result;
}



