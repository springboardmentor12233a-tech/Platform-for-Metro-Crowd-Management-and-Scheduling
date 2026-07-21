import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getPredictionHistory = async () => {
  const response = await API.get("/prediction-history/");
  return response.data;
};