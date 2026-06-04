import { apiRequest } from '@/lib/api-utils';

export interface ManifestRequest {
    project_id: number;
    limit?: number;
    model?: string;
}

export const manifestScenes = async (request: ManifestRequest) => {
    return apiRequest('/api/scenes/manifest', {
        method: 'POST',
        label: 'Manifest Scenes',
        body: JSON.stringify(request)
    });
};

export const getScenes = async (projectId: number) => {
    return apiRequest(`/api/scenes?project_id=${projectId}`, {
        method: 'GET',
        label: 'Get Scenes'
    });
};
