import api from './api';
import { ApiResponse, StudentAccess } from '../types/api';

export const accessService = {
  grantAccess: async (studentId: string, lectureId: string, maxViews?: number): Promise<StudentAccess> => {
    const response = await api.post<ApiResponse<StudentAccess>>('access/grant', {
      studentId,
      lectureId,
      maxViews,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to grant access');
  },

  extendAccess: async (studentId: string, lectureId: string, additionalViews: number): Promise<StudentAccess> => {
    const response = await api.post<ApiResponse<StudentAccess>>('access/extend', {
      studentId,
      lectureId,
      additionalViews,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to extend access');
  },

  checkAccess: async (lectureId: string): Promise<StudentAccess> => {
    const response = await api.get<ApiResponse<StudentAccess>>(`access/check/${lectureId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to check access');
  },

  recordView: async (lectureId: string): Promise<{ maxViews: number; currentViews: number; remainingViews: number }> => {
    const response = await api.post<ApiResponse<{ maxViews: number; currentViews: number; remainingViews: number }>>(
      'access/record-view',
      { lectureId }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to record view');
  },

  redeemCode: async (lectureId: string, code: string): Promise<StudentAccess> => {
    const response = await api.post<ApiResponse<{ studentAccess: StudentAccess }>>('access/redeem', {
      lectureId,
      code,
    });
    if (response.data.success && response.data.data) {
      return response.data.data.studentAccess;
    }
    throw new Error(response.data.message || 'Failed to redeem code');
  },

  generateCode: async (lectureId: string, maxViews?: number, expiresAt?: string): Promise<{ code: string }> => {
    const response = await api.post<ApiResponse<{ code: string }>>('access/generate', {
      lectureId,
      maxViews,
      expiresAt,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to generate code');
  },
};
