import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminCredentials, CurrentUser, UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: CurrentUser | null;
  role: UserRole | null;
  isAdmin: boolean;
  isManager: boolean;
  credentials: AdminCredentials;
  login: (username: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  updateAdminCredentials: (newUsername: string, newPassword: string) => { success: boolean; error?: string };
  updateManagerCredentials: (newUsername: string, newPassword: string) => { success: boolean; error?: string };
  updateCredentials: (newUsername: string, newPassword: string) => { success: boolean; error?: string };
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'tasty2025',
  restaurantName: 'TASTY — Hilversum',
  managerUsername: 'manager',
  managerPasswordHash: 'tasty123',
};

const CREDS_KEY = 'tasty_admin_credentials_v1';
const SESSION_KEY = 'tasty_admin_session_v1';
const USER_KEY = 'tasty_admin_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    try {
      const stored = localStorage.getItem(CREDS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CREDENTIALS,
          ...parsed,
          managerUsername: parsed.managerUsername || DEFAULT_CREDENTIALS.managerUsername,
          managerPasswordHash: parsed.managerPasswordHash || DEFAULT_CREDENTIALS.managerPasswordHash,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CREDENTIALS;
  });

  const [user, setUser] = useState<CurrentUser | null>(() => {
    try {
      const isAuth = localStorage.getItem(SESSION_KEY) === 'true';
      if (!isAuth) return null;
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) return JSON.parse(storedUser);
      // Fallback default admin if previously logged in
      return {
        username: 'admin',
        displayName: 'المدير العام',
        role: 'admin',
      };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CREDS_KEY, JSON.stringify(credentials));
  }, [credentials]);

  const isAuthenticated = !!user;
  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';

  const login = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Admin Account
    if (cleanUser === credentials.username.toLowerCase() && cleanPass === credentials.passwordHash) {
      const adminUser: CurrentUser = {
        username: credentials.username,
        displayName: 'المدير العام (أدمن)',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      const updated = { ...credentials, lastLogin: new Date().toISOString() };
      setCredentials(updated);
      return { success: true, role: 'admin' as UserRole };
    }

    // 2. Check Manager / Supervisor Account
    const mgrUser = (credentials.managerUsername || 'manager').toLowerCase();
    const mgrPass = credentials.managerPasswordHash || 'tasty123';
    if (cleanUser === mgrUser && cleanPass === mgrPass) {
      const managerUser: CurrentUser = {
        username: credentials.managerUsername || 'manager',
        displayName: 'مدير الصالة والمشرف',
        role: 'manager',
      };
      setUser(managerUser);
      localStorage.setItem(SESSION_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(managerUser));
      return { success: true, role: 'manager' as UserRole };
    }

    return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string) => {
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

    if (user?.role === 'admin') {
      const updatedUser = { ...user, username: cleanUser };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  const updateManagerCredentials = (newUsername: string, newPassword: string) => {
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
      managerUsername: cleanUser,
      managerPasswordHash: cleanPass,
    };
    setCredentials(updated);

    if (user?.role === 'manager') {
      const updatedUser = { ...user, username: cleanUser };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  // Backward-compatible alias
  const updateCredentials = updateAdminCredentials;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        isAdmin,
        isManager,
        credentials,
        login,
        logout,
        updateAdminCredentials,
        updateManagerCredentials,
        updateCredentials,
      }}
    >
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

export const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin }) => {
  const { isAuthenticated, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // If a route requires Admin role and current user is Manager, redirect away to operational page
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/sales" replace />;
  }

  return children;
};

