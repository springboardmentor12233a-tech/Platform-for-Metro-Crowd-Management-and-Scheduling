import api from "./axios";

export const getPredictionHistory = async () => {
  const response = await api.get("/history/");
  return response.data;
};