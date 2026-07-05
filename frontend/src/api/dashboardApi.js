import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getDashboardSummary = async () => {
  const response = await API.get("/dashboard/summary");
  return response.data;
};

export const getBusiestStations = async () => {
  const response = await API.get("/dashboard/busiest-stations");
  return response.data;
};

export const getPassengerTrend = async () => {
  const response = await API.get("/dashboard/passenger-trend");
  return response.data;
};

export const getTicketDistribution = async () => {
  const response = await API.get("/dashboard/ticket-distribution");
  return response.data;
};

export const getRevenueAnalysis = async () => {
  const response = await API.get("/dashboard/revenue-analysis");
  return response.data;
};

export const getTopRoutes = async () => {
  const response = await API.get("/dashboard/top-routes");
  return response.data;
};