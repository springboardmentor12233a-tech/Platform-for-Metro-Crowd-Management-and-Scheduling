import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('metroflow_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(!!localStorage.getItem('metroflow_token'));

  useEffect(() => {
    const token = localStorage.getItem('metroflow_token');
    if (token && !user) {
      authApi.me()
        .then((u) => { setUser(u); localStorage.setItem('metroflow_user', JSON.stringify(u)); })
        .catch(() => { localStorage.removeItem('metroflow_token'); localStorage.removeItem('metroflow_user'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const tokenData = await authApi.login(username, password);
    localStorage.setItem('metroflow_token', tokenData.access_token);
    const me = await authApi.me();
    localStorage.setItem('metroflow_user', JSON.stringify(me));
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('metroflow_token');
    localStorage.removeItem('metroflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
