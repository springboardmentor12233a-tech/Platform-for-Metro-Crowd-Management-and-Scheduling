import axios from "axios";

const realtimeApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

export const getLiveSnapshot = (limit = 25) =>
  realtimeApi.get(`/data/snapshot?limit=${limit}`);

export const getLiveStatus = () =>
  realtimeApi.get("/data/status");

export const getDashboardData = () =>
  realtimeApi.get("/data/dashboard");

export const getHeatmapData = () =>
  realtimeApi.get("/data/heatmap");

export const getStations = () =>
  realtimeApi.get("/data/stations");

export const predictCrowd = (station, target_date) =>
  realtimeApi.post("/data/predict", {
    station,
    target_date,
  });

export default realtimeApi;
