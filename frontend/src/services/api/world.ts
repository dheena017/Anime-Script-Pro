import { apiRequest } from '@/lib/api-utils';
import { manifestApi } from './world/manifest';
import { historyApi } from './world/history';
import { factionsApi } from './world/factions';
import { powersApi } from './world/powers';
import { architectureApi } from './world/architecture';
import { atlasApi } from './world/atlas';
import { cultureApi } from './world/culture';
import { systemsApi } from './world/systems';

const API_BASE = '/api/world';

export interface WorldLore {
  id?: number;
  user_id: string;
  project_id?: number;
  manifest_blob?: string | null;
  history_blob?: string | null;
  factions_blob?: string | null;
  powers_blob?: string | null;
  architecture_blob?: string | null;
  atlas_blob?: string | null;
  culture_blob?: string | null;
  systems_blob?: string | null;

  prompt_manifest?: string | null;
  prompt_history?: string | null;
  prompt_factions?: string | null;
  prompt_powers?: string | null;
  prompt_architecture?: string | null;
  prompt_atlas?: string | null;
  prompt_culture?: string | null;
  prompt_systems?: string | null;

  updated_at?: string;

  // Backwards compatibility mappings for GeneratorContext
  full_lore_blob?: string | null;
  prompt_lore?: string | null;
}

export const worldApi = {
  // Legacy unified endpoints (still useful for full sync)
  getLore: async (userId: string, projectId?: number): Promise<WorldLore | null> => {
    return apiRequest<WorldLore>(`${API_BASE}/manifest/${userId}`, {
      method: 'GET',
      label: 'Get World Lore',
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  },

  updateLore: async (userId: string, update: Partial<WorldLore>, projectId?: number): Promise<WorldLore> => {
    return apiRequest<WorldLore>(`${API_BASE}/manifest/${userId}`, {
      method: 'POST',
      label: 'Update World Lore',
      body: JSON.stringify(update),
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  },

  // Modular exports
  manifest: manifestApi,
  history: historyApi,
  factions: factionsApi,
  powers: powersApi,
  architecture: architectureApi,
  atlas: atlasApi,
  culture: cultureApi,
  systems: systemsApi
};
