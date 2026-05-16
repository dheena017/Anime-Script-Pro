import { apiRequest } from '@/lib/api-utils';

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

// Factory function to create standardized CRUD methods for each lore module
const createLoreModule = (moduleName: string) => ({
  get: async (userId: string, projectId?: number) => {
    const res = await apiRequest<any>(
      `${API_BASE}/${moduleName}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      { method: 'GET', label: `Get World ${moduleName}` }
    );
    return res.data;
  },
  update: async (userId: string, content: string, prompt?: string, projectId?: number) => {
    const res = await apiRequest<any>(
      `${API_BASE}/${moduleName}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      {
        method: 'POST',
        label: `Update World ${moduleName}`,
        body: JSON.stringify({ content, prompt, project_id: projectId })
      }
    );
    return res.data;
  },
  generate: async (userId: string, projectId?: number, body?: any) => {
    const res = await apiRequest<any>(
      `${API_BASE}/${moduleName}/generate/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      { 
        method: 'POST', 
        label: `Generate World ${moduleName}`,
        body: body ? JSON.stringify(body) : undefined
      }
    );
    return res.data;
  }
});

export const worldApi = {
  // Legacy unified endpoints (still useful for full sync)
  getLore: async (userId: string, projectId?: number): Promise<WorldLore | null> => {
    const res = await apiRequest<any>(`${API_BASE}/manifest/${userId}`, {
      method: 'GET',
      label: 'Get World Lore',
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
    return res.data;
  },

  // Modular endpoints via Factory
  manifest: createLoreModule('manifest'),
  history: createLoreModule('history'),
  factions: createLoreModule('factions'),
  powers: createLoreModule('powers'),
  architecture: createLoreModule('architecture'),
  atlas: createLoreModule('atlas'),
  culture: createLoreModule('culture'),
  systems: createLoreModule('systems')
};
