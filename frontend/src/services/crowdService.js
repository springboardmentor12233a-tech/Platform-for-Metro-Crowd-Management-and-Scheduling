/**
 * crowdService — Crowd monitoring API calls.
 * Wraps the /crowd endpoints of the Metro CMS REST API.
 */
import api from './api'

export const crowdService = {
  /**
   * Get crowd data for all stations.
   * @returns {Promise<{data: {data: Array}}>}
   */
  getAllStations: () => api.get('/crowd'),

  /**
   * Get detailed crowd data for a single station.
   * @param {string|number} stationId
   * @returns {Promise<{data: {data: Object}}>}
   */
  getStation: (stationId) => api.get(`/crowd/${stationId}`),

  /**
   * Get crowd history for a station (for analytics graphs).
   * @param {string|number} stationId
   * @param {string} period — 'today' | 'week' | 'month'
   * @returns {Promise}
   */
  getStationHistory: (stationId, period = 'today') =>
    api.get(`/crowd/${stationId}/history`, { params: { period } }),
}

export default crowdService
