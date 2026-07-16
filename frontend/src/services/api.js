/**
 * api.js — Centralised Axios instance for all HTTP calls.
 *
 * Features:
 *  • Base URL from VITE_API_BASE_URL env var (falls back to localhost:8000)
 *  • 15-second request timeout
 *  • Request interceptor: attaches JWT Bearer token from localStorage
 *  • Response interceptor: on 401, clears local session and redirects to /login
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* ── Request interceptor ─────────────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('metro_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ── Response interceptor ────────────────────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or token invalid — clear and redirect
      localStorage.removeItem('metro_token')
      localStorage.removeItem('metro_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
