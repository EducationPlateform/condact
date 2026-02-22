import api from './api';
import { ApiResponse, User } from '../types/api';

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
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

const tokenStorage = (persistent: boolean) => (persistent ? localStorage : sessionStorage);

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', { email: data.email, password: data.password });
    if (response.data.success && response.data.data) {
      const authData = response.data.data;
      const token = (authData.token ?? '').trim();
      if (!token) {
        throw new Error(
          response.data.message || 'Server did not return a token. Ensure the API is running and the frontend proxy target matches the backend (e.g. https://localhost:7067).'
        );
      }
      const persistent = data.rememberMe !== false;
      tokenStorage(persistent).setItem('token', token);
      return authData;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    if (response.data.success && response.data.data) {
      const persistent = (data as RegisterData & { rememberMe?: boolean }).rememberMe !== false;
      const token = (response.data.data.token || '').trim();
      tokenStorage(persistent).setItem('token', token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get user');
  },

  logout: (): void => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  },
};
