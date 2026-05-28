import { apiRequest } from '@/lib/api-utils';

export interface AudioRequest {
  text: string;
  language?: string;
  tld?: string;
}

export const generateAudio = async (request: AudioRequest) => {
  return apiRequest<any>('/api/audio', {
    method: 'POST',
    label: 'Generate Audio',
    body: JSON.stringify(request)
  });
};
