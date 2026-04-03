import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi } from '../services/api';
import type { AuthUser, UserRole } from '../types/index';
import { ROLE_PERMISSIONS as PERMISSIONS } from '../types/index';
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: keyof typeof PERMISSIONS['ADMIN']) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    const userData = await authApi.login(email, password);
    setUser(userData);
  }, []);
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);
  const hasPermission = useCallback(
    (permission: keyof typeof PERMISSIONS['ADMIN']): boolean => {
      if (!user) return false;
      const rolePerms = PERMISSIONS[user.role as UserRole];
      return rolePerms ? rolePerms[permission] : false;
    },
    [user]
  );
  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasPermission,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
