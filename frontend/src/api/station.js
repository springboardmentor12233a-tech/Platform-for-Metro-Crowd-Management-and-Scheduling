import api from "./axios";

export const getAllStations = async () => {
  const response = await api.get("/stations/");
  return response.data;
};