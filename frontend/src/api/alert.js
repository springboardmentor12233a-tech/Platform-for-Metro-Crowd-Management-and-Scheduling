import api from "./axios";


/* =========================================================
   GET AI + MANUAL EMERGENCY ALERTS
========================================================= */

export const getAlerts = async () => {

  const response = await api.get(
    "/alerts/"
  );

  return response.data;
};


/* =========================================================
   CREATE MANUAL EMERGENCY ALERT
========================================================= */

export const createEmergencyAlert = async (
  alertData
) => {

  const response = await api.post(
    "/alerts/",
    alertData
  );

  return response.data;
};