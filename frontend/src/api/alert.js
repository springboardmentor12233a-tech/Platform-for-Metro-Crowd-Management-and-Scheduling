import api from "../api/axios";

/* ============================
   Get AI Alerts
============================ */

export const getAlerts = async () => {
  const response = await api.get("/alerts/");
  return response.data;
};