import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function getStoredToken(): string | null {
  const t = localStorage.getItem('token') || sessionStorage.getItem('token');
  return t ? t.trim() : null;
}

// Add token to requests (from localStorage or sessionStorage per "Remember me")
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors: on 401 clear token and notify app so AuthContext can set user to null.
// Skip clearing for /auth/me so initAuth can retry with the same token before giving up.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthMe = typeof error.config?.url === 'string' && error.config.url.includes('/auth/me');
      if (!isAuthMe) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('auth:401'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
