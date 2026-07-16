import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  /** Initialise from localStorage so the session persists across reloads */
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('metro_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(
    () => localStorage.getItem('metro_token') || null,
  )

  /**
   * Persist user + token to state and localStorage.
   * @param {Object} userData   — user object returned by the API
   * @param {string} accessToken — JWT access token
   */
  const login = useCallback((userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('metro_user', JSON.stringify(userData))
    localStorage.setItem('metro_token', accessToken)
  }, [])

  /** Clear all auth state and remove from storage */
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('metro_user')
    localStorage.removeItem('metro_token')
  }, [])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuthContext — consume AuthContext.
 * Throws if called outside AuthProvider.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
