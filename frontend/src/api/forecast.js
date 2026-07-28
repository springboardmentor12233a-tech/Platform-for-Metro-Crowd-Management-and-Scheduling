import api from "./axios";

export const getForecast = async (data) => {
  const response = await api.post("/forecast/predict", data);
  return response.data;
};