import api from "./api";

export const getCrowd = async () => {
  const response = await api.get("/crowd");
  return response.data;
};

export const addCrowd = async (data) => {
  const response = await api.post("/crowd", data);
  return response.data;
};

export const updateCrowd = async (id, data) => {
  const response = await api.put(`/crowd/${id}`, data);
  return response.data;
};

export const deleteCrowd = async (id) => {
  return await api.delete(`/crowd/${id}`);
};