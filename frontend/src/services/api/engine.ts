import { apiRequest } from '@/lib/api-utils';

const API_BASE = '/api/engine';

export interface EngineConfig {
  id?: number;
  user_id: string;
  selected_model: string;
  temperature: number;
  max_tokens: number;
  vibe: string;
  audience: string;
  updated_at?: string;
}

export interface TelemetryData {
  model: string;
  latency_ms: number;
  status: 'SUCCESS' | 'ERROR' | 'FALLBACK';
  endpoint: string;
  request_summary?: string;
  error_message?: string;
  metadata?: any;
}

export const engineApi = {
  getConfig: async (userId: string): Promise<EngineConfig> => {
    return apiRequest<EngineConfig>(`${API_BASE}/config/${userId}`, {
      method: 'GET',
      label: 'Get Engine Config'
    });
  },

  updateConfig: async (userId: string, update: Partial<EngineConfig>): Promise<EngineConfig> => {
    return apiRequest<EngineConfig>(`${API_BASE}/config/${userId}`, {
      method: 'POST',
      label: 'Update Engine Config',
      body: JSON.stringify(update)
    });
  },

  recordTelemetry: async (data: TelemetryData, userId?: string): Promise<void> => {
    await apiRequest(`${API_BASE}/telemetry${userId ? `?user_id=${userId}` : ''}`, {
      method: 'POST',
      label: 'Record Telemetry',
      body: JSON.stringify(data)
    });
  },

  getRecentTelemetry: async (limit: number = 50): Promise<any[]> => {
    return apiRequest<any[]>(`${API_BASE}/telemetry/recent?limit=${limit}`, {
      method: 'GET'
    });
  }
};



