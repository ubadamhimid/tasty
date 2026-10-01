import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminCredentials } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  credentials: AdminCredentials;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateCredentials: (newUsername: string, newPassword: string) => { success: boolean; error?: string };
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'tasty2025',
  restaurantName: 'TASTY — Hilversum',
};

const CREDS_KEY = 'tasty_admin_credentials_v1';
const SESSION_KEY = 'tasty_admin_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    try {
      const stored = localStorage.getItem(CREDS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CREDENTIALS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(CREDS_KEY, JSON.stringify(credentials));
  }, [credentials]);

  const login = (username: string, password: string) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === credentials.username && cleanPass === credentials.passwordHash) {
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, 'true');
      const updated = { ...credentials, lastLogin: new Date().toISOString() };
      setCredentials(updated);
      return { success: true };
    }
    return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();
    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'يرجى إدخال اسم مستخدم وكلمة مرور صالحة' };
    }
    if (cleanPass.length < 4) {
      return { success: false, error: 'كلمة المرور يجب أن لا تقل عن 4 خانات' };
    }

    const updated: AdminCredentials = {
      ...credentials,
      username: cleanUser,
      passwordHash: cleanPass,
    };
    setCredentials(updated);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, credentials, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};
