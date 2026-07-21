import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getStations = async () => {
  const response = await API.get("/stations/");
  return response.data;
};