import { apiRequest } from '@/lib/api-utils';

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'SUCCESS' | 'WARNING';
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      return await apiRequest<Notification[]>(`/api/notifications/${userId}`, {
        method: 'GET',
        label: 'Get Notifications'
      });
    } catch (e) {
      console.error("Error fetching notifications:", e);
      return [];
    }
  },

  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      await apiRequest(`/api/notifications/${notificationId}/read`, { method: 'POST' });
      return true;
    } catch (e) {
      console.error("Error marking notification as read:", e);
      return false;
    }
  },

  async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      await apiRequest(`/api/notifications/${notificationId}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.error("Error deleting notification:", e);
      return false;
    }
  }
};



