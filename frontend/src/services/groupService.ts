import api from './api';
import { ApiResponse, Group } from '../types/api';

export const groupService = {
  create: async (data: Partial<Group>): Promise<Group> => {
    const response = await api.post<ApiResponse<Group>>('/api/groups', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create group');
  },

  getAll: async (signal?: AbortSignal): Promise<Group[]> => {
    const response = await api.get<ApiResponse<Group[]>>('/api/groups', { signal });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch groups');
  },

  getById: async (id: string): Promise<Group> => {
    const response = await api.get<ApiResponse<Group>>(`/api/groups/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch group');
  },

  update: async (id: string, data: Partial<Group>): Promise<Group> => {
    const response = await api.put<ApiResponse<Group>>(`/api/groups/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update group');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/api/groups/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete group');
    }
  },

  addStudent: async (groupId: string, studentId: string): Promise<Group> => {
    const response = await api.post<ApiResponse<Group>>(`/api/groups/${groupId}/students`, {
      studentId,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add student');
  },

  removeStudent: async (groupId: string, studentId: string): Promise<Group> => {
    const response = await api.delete<ApiResponse<Group>>(`/api/groups/${groupId}/students`, {
      data: { studentId },
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to remove student');
  },
};
