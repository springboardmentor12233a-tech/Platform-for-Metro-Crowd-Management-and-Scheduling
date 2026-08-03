import api from "./axios";

/**
 * Fetch all activity logs
 */
export const getActivityLogs = async () => {
  const response = await api.get("/activity-logs");
  return response.data;
};