import api from './api';
import { ApiResponse, Lecture } from '../types/api';

export const lectureService = {
  getAll: async (): Promise<Lecture[]> => {
    const response = await api.get<ApiResponse<Lecture[]>>('lectures');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lectures');
  },

  create: async (data: any, video?: File): Promise<Lecture> => {
    console.log("LectureService: FORCING FORM DATA VIA FETCH");
    const formData = new FormData();
    
    // Explicitly append fields matching the backend parameters
    formData.append('groupId', data.groupId || '');
    formData.append('title', data.title || '');
    formData.append('description', data.description || '');
    formData.append('scheduledDate', data.scheduledDate || '');
    formData.append('isPublished', String(data.isPublished ?? false));
    formData.append('order', String(data.order ?? 0));
    formData.append('grade', data.grade || '');

    if (video) {
      formData.append('video', video);
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const baseURL = (import.meta as any).env?.VITE_API_URL || '';
    const cleanBaseURL = baseURL ? (baseURL.endsWith('/') ? baseURL : `${baseURL}/`) : '/api/';
    const url = `${cleanBaseURL}lectures`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // We DO NOT set Content-Type; the browser MUST set it to multipart/form-data with a boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to create lecture');
    } catch (err: any) {
      console.error("LectureService Fetch Error:", err);
      throw err;
    }
  },

  getByGroup: async (groupId: string): Promise<Lecture[]> => {
    const response = await api.get<ApiResponse<Lecture[]>>(`lectures/group/${groupId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lectures');
  },

  getById: async (id: string): Promise<Lecture> => {
    const response = await api.get<ApiResponse<Lecture>>(`lectures/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch lecture');
  },

  update: async (id: string, data: Partial<Lecture>): Promise<Lecture> => {
    const response = await api.put<ApiResponse<Lecture>>(`lectures/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update lecture');
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse>(`lectures/${id}`);
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
      `lectures/${lectureId}/pdfs`,
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
