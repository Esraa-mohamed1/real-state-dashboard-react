import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setToken(parsed.token);
        setUser(parsed.user);
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    localStorage.setItem('auth', JSON.stringify(data));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout, loading, isAuthenticated: !!token }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 