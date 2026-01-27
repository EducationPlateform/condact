import api from './api';
import { ApiResponse, User } from '../types/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'teacher' | 'student';
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get user');
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },
};
