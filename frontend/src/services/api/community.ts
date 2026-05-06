import { apiRequest } from '@/lib/api-utils';

// Fallback user ID for development
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface CommunityPost {
  id: number;
  user_id: string;
  author_id?: string;
  author_name?: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  category?: string;
  comments_count?: number;
  is_active: boolean;
  created_at: string;
}

export const communityService = {
  async getUserId() {
    return LOCAL_STRATEGIC_USER;
  },

  async getPosts(limit: number = 20, offset: number = 0): Promise<CommunityPost[]> {
    try {
      return await apiRequest<CommunityPost[]>(`/api/community?limit=${limit}&offset=${offset}`);
    } catch (e) {
      console.error("Error fetching community posts:", e);
      return [];
    }
  },

  async createPost(title: string, content: string): Promise<CommunityPost | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<CommunityPost>('/api/community', {
        method: 'POST',
        body: JSON.stringify({ title, content, user_id })
      });
    } catch (e) {
      console.error("Error creating community post:", e);
      return null;
    }
  },

  async likePost(postId: number): Promise<{ status: string; likes: number } | null> {
    try {
      return await apiRequest<{ status: string; likes: number }>(`/api/community/${postId}/like`, {
        method: 'POST'
      });
    } catch (e) {
      console.error("Error liking community post:", e);
      return null;
    }
  }
};



