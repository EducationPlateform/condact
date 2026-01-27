import api from './api';
import { ApiResponse } from '../types/api';
import { DrmConfig } from '../hooks/useDrmPlayer';

export interface DrmConfigResponse {
  drmConfig: DrmConfig;
  licenseToken: string;
}

export const drmService = {
  getDrmConfig: async (videoId: string): Promise<DrmConfigResponse> => {
    const response = await api.get<ApiResponse<DrmConfigResponse>>(`/videos/${videoId}/drm-config`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get DRM configuration');
  },
};
