import api from './api';
import { ApiResponse, Video } from '../types/api';

export const videoService = {
  upload: async (lectureId: string, file: File): Promise<Video> => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('lectureId', lectureId);
    const response = await api.post<ApiResponse<Video>>('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload video');
  },

  getById: async (videoId: string): Promise<Video> => {
    const response = await api.get<ApiResponse<Video>>(`/videos/${videoId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch video');
  },

  getStreamUrl: (videoId: string): string => {
    return `/api/videos/${videoId}/stream`;
  },

  delete: async (videoId: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/videos/${videoId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete video');
    }
  },
};
