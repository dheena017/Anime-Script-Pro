import { apiRequest } from '@/lib/api-utils';

export interface SeoEntry {
  id?: number;
  keyword: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export const seoApi = {
  fetchEntries: async (): Promise<SeoEntry[]> => {
    try {
      return await apiRequest<SeoEntry[]>('/api/seo_entries', {
        method: 'GET',
        label: 'Fetch SEO Entries'
      });
    } catch (error) {
      console.error('fetchSeoEntries error:', error);
      return [];
    }
  },

  createEntry: async (seoEntry: SeoEntry): Promise<SeoEntry> => {
    return apiRequest<SeoEntry>('/api/seo_entries', {
      method: 'POST',
      label: 'Create SEO Entry',
      body: JSON.stringify(seoEntry),
    });
  },

  updateEntry: async (seoId: number, seoEntry: SeoEntry): Promise<SeoEntry> => {
    return apiRequest<SeoEntry>(`/api/seo/${seoId}`, {
      method: 'PUT',
      label: 'Update SEO Entry',
      body: JSON.stringify(seoEntry),
    });
  },

  deleteEntry: async (seoId: number): Promise<{ ok: true }> => {
    return apiRequest<{ ok: true }>(`/api/seo/${seoId}`, {
      method: 'DELETE',
      label: 'Delete SEO Entry'
    });
  }
};
