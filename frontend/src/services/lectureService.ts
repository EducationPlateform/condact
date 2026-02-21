import api from './api';
import { ApiResponse, Lecture } from '../types/api';

export const lectureService = {
  getAll: async (): Promise<Lecture[]> => {
    const response = await api.get<ApiResponse<Lecture[]>>('/lectures');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lectures');
  },

  create: async (data: any, video?: File): Promise<Lecture> => {
    // Force a new FormData to ensure it's fresh
    const formData = new FormData();
    
    // Explicitly append fields matching the backend CreateLectureRequest properties
    formData.append('GroupId', data.groupId || '');
    formData.append('Title', data.title || '');
    formData.append('Description', data.description || '');
    formData.append('ScheduledDate', data.scheduledDate || '');
    formData.append('IsPublished', String(data.isPublished ?? false));
    formData.append('Order', String(data.order ?? 0));
    formData.append('Grade', data.grade || '');

    if (video) {
      formData.append('Video', video);
    }

    // Do NOT set Content-Type header manually; Axios will do it with the correct boundary
    const response = await api.post<ApiResponse<Lecture>>('/lectures', formData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create lecture');
  },

  getByGroup: async (groupId: string): Promise<Lecture[]> => {
    const response = await api.get<ApiResponse<Lecture[]>>(`/lectures/group/${groupId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lectures');
  },

  getById: async (id: string): Promise<Lecture> => {
    const response = await api.get<ApiResponse<Lecture>>(`/lectures/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lecture');
  },

  update: async (id: string, data: Partial<Lecture>): Promise<Lecture> => {
    const response = await api.put<ApiResponse<Lecture>>(`/lectures/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update lecture');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`/lectures/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete lecture');
    }
  },

  uploadPDFs: async (lectureId: string, files: File[]): Promise<{ pdfFiles: string[] }> => {
    const formData = new FormData();
    formData.append('lectureId', lectureId);
    files.forEach((file) => {
      formData.append('pdfs', file);
    });
    const response = await api.post<ApiResponse<{ pdfFiles: string[] }>>(
      `/lectures/${lectureId}/pdfs`,
      formData
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload PDFs');
  },

  downloadPDF: (lectureId: string, filename: string): string => {
    return `/api/lectures/${lectureId}/pdfs/${filename}`;
  },
};
