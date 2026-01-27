import api from './api';
import { ApiResponse } from '../types/api';

export interface SecurityViolation {
  id: string;
  studentId: string;
  lectureId: string;
  videoId?: string;
  violationType: string;
  details: string;
  detectedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface WatermarkData {
  watermarkData: string;
}

export const securityService = {
  reportViolation: async (
    lectureId: string,
    videoId: string | null,
    violationType: string,
    details?: any
  ): Promise<void> => {
    const response = await api.post<ApiResponse<void>>('/security/violation', {
      lectureId,
      videoId,
      violationType,
      details: details ? JSON.stringify(details) : '{}',
    });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to report violation');
    }
  },

  getWatermarkData: async (lectureId: string): Promise<WatermarkData> => {
    const response = await api.get<ApiResponse<WatermarkData>>(`/security/watermark/${lectureId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get watermark data');
  },

  getViolations: async (params?: {
    studentId?: string;
    lectureId?: string;
    videoId?: string;
  }): Promise<SecurityViolation[]> => {
    const response = await api.get<ApiResponse<SecurityViolation[]>>('/security/violations', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch violations');
  },
};
