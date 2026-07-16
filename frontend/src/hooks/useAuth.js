/**
 * useAuth — thin convenience hook that wraps AuthContext.
 * Import this in components instead of importing AuthContext directly.
 *
 * @returns {{ user, token, login, logout, isAuthenticated }}
 */
import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  return useAuthContext()
}

export default useAuth
