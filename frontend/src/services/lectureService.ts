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

  create: async (data: Partial<Lecture>, video?: File): Promise<Lecture> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !(value instanceof Blob)) {
          // If it's a nested object (like group), we might not want to stringify it directly
          // but for creation we usually send just the ID.
          // Based on CreateLectureRequest on backend, it expects simple fields.
          return;
        }
        formData.append(key, value.toString());
      }
    });

    if (video) {
      formData.append('video', video);
    }

    const response = await api.post<ApiResponse<Lecture>>('/lectures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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
