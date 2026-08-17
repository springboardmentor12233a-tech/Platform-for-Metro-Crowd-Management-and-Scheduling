import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('metroflow_token');
    const savedUser = localStorage.getItem('metroflow_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  async function login(username, password) {
    const response = await loginRequest(username, password);
    localStorage.setItem('metroflow_token', response.access_token);
    localStorage.setItem('metroflow_user', JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem('metroflow_token');
    localStorage.removeItem('metroflow_user');
    setUser(null);
    setToken(null);
  }

  const value = useMemo(() => ({ user, token, login, logout, isAuthenticated: Boolean(token) }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
