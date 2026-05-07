import { apiRequest } from '@/lib/api-utils';

const BASE = '/api/world/systems';

export const systemsApi = {
  get: async (userId: string, projectId?: number) => {
    return apiRequest(
      `${BASE}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      { method: 'GET', label: 'Get Systems' }
    );
  },
  update: async (userId: string, content: string, prompt?: string, projectId?: number) => {
    return apiRequest(
      `${BASE}/${userId}${projectId ? `?project_id=${projectId}` : ''}`,
      {
        method: 'POST',
        label: 'Update Systems',
        body: JSON.stringify({ content, prompt, project_id: projectId })
      }
    );
  },
  generate: async (userId: string, projectId: number) => {
    return apiRequest(
      `${BASE}/generate/${userId}?project_id=${projectId}`,
      { method: 'POST', label: 'Generate Systems' }
    );
  }
};
