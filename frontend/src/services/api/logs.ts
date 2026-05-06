import { apiRequest } from '@/lib/api-utils';

export interface SystemLog {
  id?: number;
  timestamp?: string;
  source: string;
  message: string;
  level: string;
}

export const logsApi = {
  saveLog: async (source: string, message: string, level: string = "INFO"): Promise<SystemLog> => {
    return apiRequest<SystemLog>('/api/logs/', {
      method: 'POST',
      body: JSON.stringify({ source, message, level })
    });
  },

  getLogs: async (limit: number = 50): Promise<SystemLog[]> => {
    return apiRequest<SystemLog[]>(`/api/logs/?limit=${limit}`, {
      method: 'GET'
    });
  }
};



