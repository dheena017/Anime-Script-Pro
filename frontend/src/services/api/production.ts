import { apiRequest } from '@/lib/api-utils';

const API_BASE = '/api/production';

export interface ProjectContent {
  growth_strategy: string | null;
  distribution_plan: string | null;
  id?: number;
  user_id: string;
  project_id?: number;
  cast_profiles: string | null;
  cast_data: any;
  cast_relationships: string | null;
  scenes: any[];
  script_content: string | null;
  series_plan: any[] | null;
  storyboard: any;
  seo_metadata: string | null;
  custom_prompts: Record<string, string>;
  active_protocols: string[];
  screening_logs: any[];
  updated_at?: string;
}

export const productionApi = {
  getContent: async (userId: string, projectId?: number): Promise<ProjectContent | null> => {
    return apiRequest<ProjectContent>(`${API_BASE}/${userId}`, {
      method: 'GET',
      label: 'Get Production Content',
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  },

  updateContent: async (userId: string, update: Partial<ProjectContent>, projectId?: number): Promise<ProjectContent> => {
    return apiRequest<ProjectContent>(`${API_BASE}/${userId}`, {
      method: 'POST',
      label: 'Update Production Content',
      body: JSON.stringify(update),
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  }
};

