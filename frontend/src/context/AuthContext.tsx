import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  register: (email: string, password: string, name: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
}

const AUTH_USER_KEY = 'auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  const t = localStorage.getItem('token') || sessionStorage.getItem('token');
  return t ? t.trim() : null;
}

function getStorageWithToken(): Storage {
  return localStorage.getItem('token') ? localStorage : sessionStorage;
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token) {
        const tryGetMe = async (): Promise<User | null> => {
          try {
            return await authService.getMe();
          } catch {
            return null;
          }
        };
        let userData = await tryGetMe();
        if (userData == null) {
          await new Promise((r) => setTimeout(r, 500));
          userData = await tryGetMe();
        }
        if (userData) {
          setUser(userData);
          getStorageWithToken().setItem(AUTH_USER_KEY, JSON.stringify(userData));
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem(AUTH_USER_KEY);
          sessionStorage.removeItem(AUTH_USER_KEY);
          setUser(null);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const handleAuth401 = () => {
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
    };
    window.addEventListener('auth:401', handleAuth401);
    return () => window.removeEventListener('auth:401', handleAuth401);
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const { user } = await authService.login({ email, password, rememberMe });
    setUser(user);
    const storage = rememberMe !== false ? localStorage : sessionStorage;
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  };

  const register = async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
    const { user } = await authService.register({ email, password, name, role });
    setUser(user);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
