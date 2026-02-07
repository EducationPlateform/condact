import api from './api';
import { ApiResponse, Exam } from '../types/api';

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const response = await api.get<ApiResponse<Exam[]>>('/exams');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch exams');
  },

  create: async (exam: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam> => {
    const response = await api.post<ApiResponse<Exam>>('/exams', exam);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create exam');
  },

  getById: async (id: string): Promise<Exam> => {
    const response = await api.get<ApiResponse<Exam>>(`/exams/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch exam');
  },

  getByLecture: async (lectureId: string): Promise<Exam> => {
    const response = await api.get<ApiResponse<Exam>>(`/exams/lecture/${lectureId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch exam');
  },

  update: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const response = await api.put<ApiResponse<Exam>>(`/exams/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update exam');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/exams/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete exam');
    }
  },
};
