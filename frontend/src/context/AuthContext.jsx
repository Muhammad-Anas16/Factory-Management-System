import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/resources';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fms_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('fms_token')));

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('fms-auth-expired', handleExpired);
    return () => window.removeEventListener('fms-auth-expired', handleExpired);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('fms_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.me();
        const nextUser = response.data?.data?.user ?? response.data?.data ?? response.data?.user ?? null;
        setUser(nextUser);
        localStorage.setItem('fms_user', JSON.stringify(nextUser));
      } catch {
        localStorage.removeItem('fms_token');
        localStorage.removeItem('fms_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const data = response.data?.data || response.data;
    const token = data?.token || data?.accessToken;
    const nextUser = data?.user || data;
    if (!token) throw new Error('Login response did not include an authentication token.');
    localStorage.setItem('fms_token', token);
    localStorage.setItem('fms_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Local logout should still succeed if the API call is unavailable.
    }
    localStorage.removeItem('fms_token');
    localStorage.removeItem('fms_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authApi.me();
    const nextUser = response.data?.data?.user ?? response.data?.data ?? response.data?.user ?? null;
    setUser(nextUser);
    localStorage.setItem('fms_user', JSON.stringify(nextUser));
    return nextUser;
  };

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
