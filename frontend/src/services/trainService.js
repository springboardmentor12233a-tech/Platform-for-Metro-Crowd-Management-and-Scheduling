/**
 * trainService — Train, Schedule, Alert, and Analytics API calls.
 * Consolidates all operational data endpoints.
 */
import api from './api'

export const trainService = {
  /* ── Trains ─────────────────────────────────────────────── */

  /**
   * Fetch all trains, with optional query params (line, status, page).
   * @param {Object} params
   * @returns {Promise}
   */
  getAllTrains: (params) => api.get('/trains', { params }),

  /**
   * Fetch a single train by ID.
   * @param {string|number} trainId
   * @returns {Promise}
   */
  getTrain: (trainId) => api.get(`/trains/${trainId}`),

  /* ── Schedules ───────────────────────────────────────────── */

  /**
   * Fetch schedules, optionally filtered by line/date.
   * @param {Object} params
   * @returns {Promise}
   */
  getSchedules: (params) => api.get('/schedules', { params }),

  /**
   * Fetch a single schedule entry.
   * @param {string|number} scheduleId
   * @returns {Promise}
   */
  getSchedule: (scheduleId) => api.get(`/schedules/${scheduleId}`),

  /* ── Alerts ──────────────────────────────────────────────── */

  /**
   * Fetch all alerts, optionally filtered.
   * @param {Object} params — severity, resolved, station_id, etc.
   * @returns {Promise}
   */
  getAlerts: (params) => api.get('/alerts', { params }),

  /**
   * Mark an alert as resolved.
   * @param {string|number} alertId
   * @returns {Promise}
   */
  resolveAlert: (alertId) => api.patch(`/alerts/${alertId}/resolve`),

  /* ── Analytics ───────────────────────────────────────────── */

  /**
   * Fetch aggregated analytics data.
   * @param {string} period — 'today' | 'week' | 'month'
   * @returns {Promise}
   */
  getAnalytics: (period) => api.get('/analytics', { params: { period } }),

  /**
   * Fetch hourly passenger flow data.
   * @param {string} date — ISO date string
   * @returns {Promise}
   */
  getHourlyFlow: (date) => api.get('/analytics/hourly', { params: { date } }),
}

export default trainService
