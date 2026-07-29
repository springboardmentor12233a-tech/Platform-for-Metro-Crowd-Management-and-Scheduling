/**
 * crowdService — Crowd monitoring & AI prediction API calls.
 * Wraps the /crowd and /crowd-predictions endpoints.
 */

import api from "./api";

export const crowdService = {
  /**
   * Get crowd data for all stations.
   */
  getAllStations: () => api.get("/crowd"),

  /**
   * Get crowd data for one station.
   */
  getStation: (stationId) =>
    api.get(`/crowd/${stationId}`),

  /**
   * Get historical crowd data.
   */
  getStationHistory: (
    stationId,
    period = "today"
  ) =>
    api.get(
      `/crowd/${stationId}/history`,
      {
        params: { period },
      }
    ),

  // ======================================================
  // AI Crowd Prediction
  // ======================================================

  /**
   * Get all stations from database.
   */
  getStations: () =>
    api.get("/stations"),

  /**
   * Predict crowd using AI model.
   *
   * @param {Object} data
   */
  predictCrowd: (data) =>
    api.post(
      "/crowd-predictions/predict",
      data
    ),
};

export default crowdService;