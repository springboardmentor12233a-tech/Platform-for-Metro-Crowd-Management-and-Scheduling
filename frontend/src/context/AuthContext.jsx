import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginUser,
  logout as logoutUser,
  getCurrentUser,
} from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  /* ============================
        Restore Session
  ============================ */

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setUser(null);

      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
            Login
  ============================ */

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem(
      "accessToken",
      data.access_token
    );

    const currentUser = await getCurrentUser();

    localStorage.setItem(
      "user",
      JSON.stringify(currentUser)
    );

    setUser(currentUser);

    setIsAuthenticated(true);

    return currentUser;
  };

  /* ============================
            Logout
  ============================ */

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);

    setIsAuthenticated(false);
  };

  /* ============================
          Role Helpers
  ============================ */

  const hasRole = (...roles) => {
    if (!user) return false;

    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole("Admin");

  const isOperator = () => hasRole("Operator");

  const isAnalyst = () => hasRole("Analyst");

  const isMember = () => hasRole("Member");

  /* ============================
        Context Values
  ============================ */

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        isAuthenticated,

        login,

        logout,

        restoreSession,

        hasRole,

        isAdmin,

        isOperator,

        isAnalyst,

        isMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}