import { ApiError, apiRequest } from '@/lib/api-utils';

const API_BASE = '/api/cast';

export interface CharacterCast {
  id?: number;
  user_id: string;
  project_id?: number;
  cast_list_blob: string | null;      // JSON string of characters
  relationships_blob: string | null;  // JSON string of social web
  dna_config_blob?: string | null;    // DNA Parameter history
  dynamics_blob?: string | null;      // Group dynamics analysis
  integrity_blob?: string | null;     // Narrative integrity report
  updated_at?: string;
  
  // Neural Seed Prompts
  num_characters?: number;
  prompt_cast?: string | null;
  prompt_relationships?: string | null;
}

export const characterApi = {
  /**
   * Retrieves the current cast and relationship data for a user/project.
   */
  getCast: async (userId: string, projectId?: number): Promise<CharacterCast | null> => {
    try {
      return await apiRequest<CharacterCast>(`${API_BASE}/${userId}`, {
        method: 'GET',
        label: 'Get Cast Manifest',
        headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Some local/dev backends do not expose /api/cast yet.
        return null;
      }
      throw error;
    }
  },

  /**
   * Updates or manifests the entire character system.
   */
  updateCast: async (userId: string, update: Partial<CharacterCast>, projectId?: number): Promise<CharacterCast> => {
    try {
      return await apiRequest<CharacterCast>(`${API_BASE}/${userId}`, {
        method: 'POST',
        label: 'Update Cast Manifest',
        body: JSON.stringify(update),
        headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // Graceful fallback when cast endpoint is unavailable in local/dev.
        return {
          user_id: userId,
          project_id: projectId,
          cast_list_blob: update.cast_list_blob ?? null,
          relationships_blob: update.relationships_blob ?? null,
          dna_config_blob: update.dna_config_blob ?? null,
          prompt_cast: update.prompt_cast ?? null,
          prompt_relationships: update.prompt_relationships ?? null,
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Diagnostic: Get history of cast iterations.
   */
  getHistory: async (userId: string, limit: number = 10): Promise<CharacterCast[]> => {
    try {
      return await apiRequest<CharacterCast[]>(`${API_BASE}/history/${userId}?limit=${limit}`, {
        method: 'GET',
        label: 'Get Cast History'
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }
};
