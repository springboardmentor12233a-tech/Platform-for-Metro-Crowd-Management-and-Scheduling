import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";


const AuthContext = createContext(null);


// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {

  // ----------------------------------------------------------
  // USER
  // ----------------------------------------------------------

  const [user, setUser] = useState(() => {

      try {

          const stored =
              sessionStorage.getItem("metro_user");

          return stored
              ? JSON.parse(stored)
              : null;

      } catch {

          return null;
      }
  });


  // ----------------------------------------------------------
  // ACCESS TOKEN
  // ----------------------------------------------------------

  const [token, setToken] = useState(
      () =>
          sessionStorage.getItem(
              "metro_access_token"
          ) || null
  );


  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = useCallback(
      (userData, accessToken, authData = {}) => {

          setUser(userData);
          setToken(accessToken);


          // --------------------------------------------------
          // USER
          // --------------------------------------------------

          sessionStorage.setItem(
              "metro_user",
              JSON.stringify(userData)
          );


          // --------------------------------------------------
          // ACCESS TOKEN
          // --------------------------------------------------

          sessionStorage.setItem(
              "metro_access_token",
              accessToken
          );


          // --------------------------------------------------
          // REFRESH TOKEN
          // --------------------------------------------------

          if (authData.refresh_token) {

              sessionStorage.setItem(
                  "metro_refresh_token",
                  authData.refresh_token
              );
          }


          // --------------------------------------------------
          // ROLE
          // --------------------------------------------------

          const role =
              userData?.role ||
              authData?.role;

          if (role) {

              sessionStorage.setItem(
                  "metro_role",
                  role
              );
          }


          // --------------------------------------------------
          // USER ID
          // --------------------------------------------------

          if (userData?.id) {

              sessionStorage.setItem(
                  "metro_user_id",
                  userData.id
              );
          }
      },
      []
  );


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = useCallback(() => {

      setUser(null);
      setToken(null);


      sessionStorage.removeItem(
          "metro_user"
      );

      sessionStorage.removeItem(
          "metro_access_token"
      );

      sessionStorage.removeItem(
          "metro_refresh_token"
      );

      sessionStorage.removeItem(
          "metro_role"
      );

      sessionStorage.removeItem(
          "metro_user_id"
      );

  }, []);


  // ==========================================================
  // AUTHENTICATED
  // ==========================================================

  const isAuthenticated =
      Boolean(token && user);


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (

      <AuthContext.Provider
          value={{
              user,
              token,
              login,
              logout,
              isAuthenticated,
          }}
      >

          {children}

      </AuthContext.Provider>
  );
}


// ============================================================
// USE AUTH CONTEXT
// ============================================================

export function useAuthContext() {

  const ctx =
      useContext(AuthContext);

  if (!ctx) {

      throw new Error(
          "useAuthContext must be used inside <AuthProvider>"
      );
  }

  return ctx;
}


export default AuthContext;