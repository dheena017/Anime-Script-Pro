import { apiRequest } from '@/lib/api-utils';

export interface ServerRenderJobRequest {
  episode_package: Record<string, any>;
  generate_assets?: boolean;
}

export interface ServerRenderJobCreateResponse {
  status: 'accepted' | string;
  jobId: string;
  queueSize: number;
}

export interface ServerRenderJobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | string;
  created_at: number;
  updated_at: number;
  user_id: string;
  generate_assets: boolean;
  download_url?: string | null;
  filename?: string | null;
  error?: string | null;
}

export interface ServerRenderJobDeleteResponse {
  status: 'ok' | string;
  jobId: string;
  message: string;
}

export const seriesRenderService = {
  createRenderJob: async (payload: ServerRenderJobRequest): Promise<ServerRenderJobCreateResponse> => {
    return apiRequest<ServerRenderJobCreateResponse>('/api/series/episodes/render/jobs', {
      method: 'POST',
      label: 'Create Episode Render Job',
      body: JSON.stringify(payload),
    });
  },

  getRenderJobStatus: async (jobId: string): Promise<ServerRenderJobStatus> => {
    return apiRequest<ServerRenderJobStatus>(`/api/series/episodes/render/jobs/${jobId}`, {
      method: 'GET',
      label: `Episode Render Job Status [${jobId}]`,
    });
  },

  deleteRenderJob: async (jobId: string): Promise<ServerRenderJobDeleteResponse> => {
    return apiRequest<ServerRenderJobDeleteResponse>(`/api/series/episodes/render/jobs/${jobId}`, {
      method: 'DELETE',
      label: `Delete Episode Render Job [${jobId}]`,
    });
  },
};
