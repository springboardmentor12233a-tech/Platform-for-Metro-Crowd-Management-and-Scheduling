import api from "./axios";

export const getPredictionHistory = async () => {
  const response = await api.get("/prediction-history/");
  return response.data;
};