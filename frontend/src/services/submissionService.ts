import api from './api';
import { ApiResponse, Submission } from '../types/api';

export const submissionService = {
  submitHomework: async (homeworkId: string, answers: Record<string, any>): Promise<Submission> => {
    const response = await api.post<ApiResponse<Submission>>('/submissions/homework', {
      homeworkId,
      answers,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to submit homework');
  },

  submitExam: async (examId: string, answers: Record<string, any>): Promise<Submission> => {
    const response = await api.post<ApiResponse<Submission>>('/submissions/exam', {
      examId,
      answers,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to submit exam');
  },

  getById: async (submissionId: string): Promise<Submission> => {
    const response = await api.get<ApiResponse<Submission>>(`/submissions/${submissionId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch submission');
  },

  getAll: async (params?: { studentId?: string; lectureId?: string }): Promise<Submission[]> => {
    const response = await api.get<ApiResponse<Submission[]>>('/submissions', { params });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch submissions');
  },

  updateScore: async (submissionId: string, score: number): Promise<Submission> => {
    const response = await api.put<ApiResponse<Submission>>(`/submissions/${submissionId}/score`, {
      score,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update score');
  },
};
