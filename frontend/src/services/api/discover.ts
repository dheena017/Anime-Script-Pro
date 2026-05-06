import { apiRequest } from '@/lib/api-utils';

export interface DiscoverItem {
  id: number;
  title: string;
  category: string;
  likes: number;
  views: number;
  created_at: string;
}

export const discoverService = {
  async getDiscoverItems(): Promise<DiscoverItem[]> {
    try {
      return await apiRequest<DiscoverItem[]>('/api/discover');
    } catch (e) {
      console.error("Error fetching discover items:", e);
      return [];
    }
  }
};
