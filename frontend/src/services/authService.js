/**
 * authService — Authentication API calls.
 * All functions return Axios promise objects.
 */
import api from './api'

export const authService = {
  /**
   * Log in with email + password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{data: {data: {user: Object, access_token: string}}}>}
   */
  login: (email, password) => api.post('/auth/login', { email, password }),

  /**
   * Invalidate the current session on the server.
   * @returns {Promise}
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Fetch the currently authenticated user's profile.
   * @returns {Promise<{data: {data: Object}}>}
   */
  getMe: () => api.get('/auth/me'),

  /**
   * Request a password-reset email.
   * @param {string} email
   * @returns {Promise}
   */
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
}

export default authService
