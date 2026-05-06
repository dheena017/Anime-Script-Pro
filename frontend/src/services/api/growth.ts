import axios from 'axios';

export interface GrowthStrategy {
  id: number;
  name: string;
  track: string;
  prompt: string;
  description: string;
  icon: string;
  created_at: string;
}

export const growthApi = {
  getStrategies: async (track?: string) => {
    const params = track ? { track } : {};
    const response = await axios.get<GrowthStrategy[]>('/api/growth/strategies', { params });
    return response.data;
  },

  generateStrategy: async (strategyId: number, scriptContent: string, model: string = "gemini-1.5-flash-latest") => {
    const response = await axios.post('/api/growth/generate/' + strategyId, {
      script_content: scriptContent,
      model: model
    });
    return response.data;
  }
};

