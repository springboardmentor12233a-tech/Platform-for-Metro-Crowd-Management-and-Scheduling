import api from "../api/axios";

export const getCrowdData = async () => {
  const response = await api.get("/crowd-monitoring");
  return response.data;
};