import api from './api';
import { ApiResponse, Announcement } from '../types/api';

export const announcementService = {
  getActive: async (): Promise<Announcement[]> => {
    const response = await api.get<ApiResponse<Announcement[]>>('/announcements/active');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch announcements');
  },

  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get<ApiResponse<Announcement[]>>('/announcements');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch announcements');
  },

  create: async (announcement: {
    title: string;
    message: string;
    type?: string;
    isActive?: boolean;
    expiresAt?: string;
  }): Promise<Announcement> => {
    const response = await api.post<ApiResponse<Announcement>>('/announcements', announcement);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create announcement');
  },

  update: async (id: string, announcement: {
    title?: string;
    message?: string;
    type?: string;
    isActive?: boolean;
    expiresAt?: string;
  }): Promise<Announcement> => {
    const response = await api.put<ApiResponse<Announcement>>(`/announcements/${id}`, announcement);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update announcement');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/announcements/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete announcement');
    }
  },
};
