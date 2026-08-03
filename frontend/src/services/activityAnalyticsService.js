import api from "./axios";

export const getAnalytics = async () => {
  const response = await api.get(
    "/activity-logs/analytics"
  );

  return response.data;
};