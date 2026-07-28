import api from "./axios";

export const predictPassengers = async (data) => {
  const response = await api.post("/prediction/predict", data);
  return response.data;
};