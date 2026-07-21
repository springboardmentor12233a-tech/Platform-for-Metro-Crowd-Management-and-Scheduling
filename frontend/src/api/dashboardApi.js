import api from "./axios";

// ===============================
// Dashboard
// ===============================

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getBusiestStations = async () => {
  const response = await api.get("/dashboard/busiest-stations");
  return response.data;
};

export const getPassengerTrend = async () => {
  const response = await api.get("/dashboard/passenger-trend");
  return response.data;
};

export const getTicketDistribution = async () => {
  const response = await api.get("/dashboard/ticket-distribution");
  return response.data;
};

export const getRevenueAnalysis = async () => {
  const response = await api.get("/dashboard/revenue-analysis");
  return response.data;
};

export const getTopRoutes = async () => {
  const response = await api.get("/dashboard/top-routes");
  return response.data;
};

// ===============================
// Live Dashboard
// ===============================

export const getLiveDashboard = async () => {
  const response = await api.get("/live-dashboard/");
  return response.data;
};

// ===============================
// Crowd Monitoring
// ===============================

export const getLiveCrowdMonitoring = async () => {
  const response = await api.get("/crowd-monitoring/live");
  return response.data;
};

export const getNetworkSummary = async () => {
  const response = await api.get("/crowd-monitoring/summary");
  return response.data;
};