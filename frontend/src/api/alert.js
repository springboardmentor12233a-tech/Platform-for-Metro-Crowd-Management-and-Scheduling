import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getAlerts = async () => {
  const response = await API.get("/alerts/");
  return response.data;
};