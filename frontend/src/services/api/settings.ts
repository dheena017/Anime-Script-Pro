import { apiRequest } from '@/lib/api-utils';

// Fallback user ID for development
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  handle: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  updated_at: string;
}

export interface UserBalance {
  user_id: string;
  credits: number;
  current_tier: string;
  total_generations: number;
}

export interface MediaAsset {
  id: string;
  user_id: string;
  asset_type: 'IMAGE' | 'VIDEO' | 'SCRIPT';
  url: string;
  thumbnail_url?: string;
  metadata: any;
  created_at: string;
}

export interface AIModelSettings {
  primary_engine?: string;
  temperature?: number;
  swarm_mode?: boolean;
  cinematic_enforcer?: boolean;
  system_prompt?: string;
  gemini_api_key?: string;
  [key: string]: any;
}

export interface UserSettingsPayload {
  id?: number;
  user_id?: string;
  profile?: any;
  security?: any;
  notifications?: any;
  ai_models?: AIModelSettings;
  storage?: any;
  billing?: any;
  [key: string]: any;
}

export const settingsService = {
  async getUserId() {
    // We now rely on the backend to identify the user via the JWT token.
    // This function returns the local-dev ID as a default for URL construction.
    return LOCAL_STRATEGIC_USER;
  },

  // --- User Settings ---
  async getSettings(): Promise<UserSettingsPayload | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<UserSettingsPayload>(`/api/settings/${user_id}`);
    } catch (e) {
      console.error("Error fetching settings:", e);
      return null;
    }
  },

  async updateSettings(payload: any): Promise<UserSettingsPayload | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<UserSettingsPayload>(`/api/settings/${user_id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Error updating settings:", e);
      return null;
    }
  },

  // --- User Profile ---
  async getProfile(): Promise<UserProfile | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<UserProfile>(`/api/profiles/${user_id}`);
    } catch (e) {
      console.error("Error fetching profile:", e);
      return null;
    }
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<UserProfile>(`/api/profiles/${user_id}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Error updating profile:", e);
      return null;
    }
  },

  // --- Neural Balance & Tier ---
  async getBalance(): Promise<UserBalance | null> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<UserBalance>(`/api/balances/${user_id}`);
    } catch (e) {
      console.error("Error fetching balance:", e);
      return null;
    }
  },

  // --- Neural Assets & Media ---
  async getAssets(type?: string): Promise<MediaAsset[]> {
    try {
      const user_id = await this.getUserId();
      const url = type ? `/api/assets/${user_id}?asset_type=${type}` : `/api/assets/${user_id}`;
      return await apiRequest<MediaAsset[]>(url);
    } catch (e) {
      console.error("Error fetching assets:", e);
      return [];
    }
  },

  async getFavorites(): Promise<MediaAsset[]> {
    try {
      const user_id = await this.getUserId();
      return await apiRequest<MediaAsset[]>(`/api/favorites/${user_id}`);
    } catch (e) {
      console.error("Error fetching favorites:", e);
      return [];
    }
  },

  async toggleFavorite(asset_id: string): Promise<boolean> {
    try {
      const user_id = await this.getUserId();
      const response = await apiRequest<any>(`/api/favorites`, {
        method: 'POST',
        body: JSON.stringify({ user_id, asset_id })
      });
      return response.status === "added";
    } catch (e) {
      console.error("Error toggling favorite:", e);
      return false;
    }
  }
};




