import { apiRequest } from '@/lib/api-utils';

export interface CinematicShot {
  id: string;
  type: string;
  action: string;
}

export interface VocalProfile {
  name: string;
  levels: number;
}

export interface AnalysisResponse {
  shot_list: CinematicShot[];
  lenses: string[];
  energy_levels: number[];
  tension_score: number;
  vocal_profiles: VocalProfile[];
  bgm_track: string;
}

/**
 * Sends a script to the Neural Engine for technical production analysis.
 */
export async function analyzeScript(script: string, model: string = "gemini-2.5-flash"): Promise<AnalysisResponse> {
  return await apiRequest<AnalysisResponse>("/api/ai/analyze", {
    method: 'POST',
    body: JSON.stringify({ script, model })
  });
}
