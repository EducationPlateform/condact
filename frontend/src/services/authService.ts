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
    // #region agent log
    try{const base=api.defaults?.baseURL||'unknown';const fullUrl=`${base}/auth/login`;fetch('http://127.0.0.1:7244/ingest/de8b7576-bb72-4e08-ad15-b90eab22bd1d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c5b622'},body:JSON.stringify({sessionId:'c5b622',location:'authService.ts:login',message:'Login request starting',data:{baseURL:base,fullUrl},timestamp:Date.now(),hypothesisId:'A,C'})}).catch(()=>{});}catch(_){}
    // #endregion
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email: data.email, password: data.password });
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
    // #region agent log
    try{const base=api.defaults?.baseURL||'unknown';const fullUrl=`${base}/auth/register`;fetch('http://127.0.0.1:7244/ingest/de8b7576-bb72-4e08-ad15-b90eab22bd1d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c5b622'},body:JSON.stringify({sessionId:'c5b622',location:'authService.ts:register',message:'Register request starting',data:{baseURL:base,fullUrl},timestamp:Date.now(),hypothesisId:'A,C'})}).catch(()=>{});}catch(_){}
    // #endregion
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.success && response.data.data) {
      const persistent = (data as RegisterData & { rememberMe?: boolean }).rememberMe !== false;
      const token = (response.data.data.token || '').trim();
      tokenStorage(persistent).setItem('token', token);
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
    sessionStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  },
};
