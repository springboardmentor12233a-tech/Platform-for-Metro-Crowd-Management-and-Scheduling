import api from "./axios";

export const getLiveDashboard = async () => {
  const response = await api.get("/live-dashboard/");
  return response.data;
};