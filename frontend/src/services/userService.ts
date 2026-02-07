import api from './api';
import { ApiResponse, User } from '../types/api';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch users');
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch user');
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update user');
  },

  getStudents: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    if (response.data.success && response.data.data) {
      // The backend already filters by students if the user is a teacher,
      // but we can add an extra layer of safety here just in case.
      return response.data.data.filter(u => u.role === 'student');
    }
    throw new Error(response.data.message || 'Failed to fetch students');
  },
};
