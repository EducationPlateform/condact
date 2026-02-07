import api from './api';
import { ApiResponse, Homework } from '../types/api';

export const homeworkService = {
  getAll: async (): Promise<Homework[]> => {
    const response = await api.get<ApiResponse<Homework[]>>('/homework');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch homeworks');
  },

  create: async (homework: Omit<Homework, 'id' | 'createdAt'>): Promise<Homework> => {
    const response = await api.post<ApiResponse<Homework>>('/homework', homework);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create homework');
  },

  getById: async (id: string): Promise<Homework> => {
    const response = await api.get<ApiResponse<Homework>>(`/homework/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch homework');
  },

  getByLecture: async (lectureId: string): Promise<Homework> => {
    const response = await api.get<ApiResponse<Homework>>(`/homework/lecture/${lectureId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch homework');
  },

  update: async (id: string, data: Partial<Homework>): Promise<Homework> => {
    const response = await api.put<ApiResponse<Homework>>(`/homework/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update homework');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/homework/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete homework');
    }
  },
};
