import { ApiError, apiRequest } from '@/lib/api-utils';

const API_BASE = '/api/characters';

export interface CharacterManifest {
  id?: number;
  user_id: string;
  project_id?: number;
  character_list_blob: string | null;   // JSON string of characters
  relationships_blob: string | null;    // JSON string of social web
  dna_config_blob?: string | null;      // DNA Parameter history
  dynamics_blob?: string | null;        // Group dynamics analysis
  integrity_blob?: string | null;       // Narrative integrity report
  updated_at?: string;

  // Neural Seed Prompts
  num_characters?: number;
  prompt_characters?: string | null;
  prompt_relationships?: string | null;
}

export const characterApi = {
  /**
   * Retrieves the current character manifest and relationship data for a user/project.
   */
  getCharacters: async (userId: string, projectId?: number): Promise<CharacterManifest | null> => {
    try {
      return await apiRequest<CharacterManifest>(`${API_BASE}/${userId}`, {
        method: 'GET',
        label: 'Get Character Manifest',
        headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Updates or manifests the entire character system.
   */
  updateCharacters: async (userId: string, update: Partial<CharacterManifest>, projectId?: number): Promise<CharacterManifest> => {
    try {
      return await apiRequest<CharacterManifest>(`${API_BASE}/${userId}`, {
        method: 'POST',
        label: 'Update Character Manifest',
        body: JSON.stringify(update),
        headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Graceful fallback when character endpoint is unavailable in local/dev.
        return {
          user_id: userId,
          project_id: projectId,
          character_list_blob: update.character_list_blob ?? null,
          relationships_blob: update.relationships_blob ?? null,
          dna_config_blob: update.dna_config_blob ?? null,
          prompt_characters: update.prompt_characters ?? null,
          prompt_relationships: update.prompt_relationships ?? null,
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Diagnostic: Get history of character manifest iterations.
   */
  getHistory: async (userId: string, limit: number = 10): Promise<CharacterManifest[]> => {
    try {
      return await apiRequest<CharacterManifest[]>(`${API_BASE}/history/${userId}?limit=${limit}`, {
        method: 'GET',
        label: 'Get Character History'
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }
};
