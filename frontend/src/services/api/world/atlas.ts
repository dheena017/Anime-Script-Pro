import { apiRequest } from '@/lib/api-utils';

const BASE = '/api/world/atlas';

export const atlasApi = {
  get: async (userId: string, projectId?: number) => {
    return apiRequest(
      `${BASE}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      { method: 'GET', label: 'Get Atlas' }
    );
  },
  update: async (userId: string, content: string, prompt?: string, projectId?: number) => {
    return apiRequest(
      `${BASE}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      {
        method: 'POST',
        label: 'Update Atlas',
        body: JSON.stringify({ content, prompt, project_id: projectId })
      }
    );
  },
  generate: async (userId: string, projectId: number) => {
    return apiRequest(
      `${BASE}/generate/${userId}?project_id=${projectId}`,
      { method: 'POST', label: 'Generate Atlas' }
    );
  }
};
