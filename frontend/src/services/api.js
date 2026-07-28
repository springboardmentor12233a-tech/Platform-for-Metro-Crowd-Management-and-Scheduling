import api from "./axios";

/* ============================
   Dashboard Summary
============================ */

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

/* ============================
   Passenger Trend
============================ */

export const getPassengerTrend = async () => {
  const response = await api.get("/dashboard/passenger-trend");
  return response.data;
};

/* ============================
   Revenue Analysis
============================ */

export const getRevenueAnalysis = async () => {
  const response = await api.get("/dashboard/revenue-analysis");
  return response.data;
};

/* ============================
   Ticket Distribution
============================ */

export const getTicketDistribution = async () => {
  const response = await api.get("/dashboard/ticket-distribution");
  return response.data;
};

/* ============================
   Busiest Stations
============================ */

export const getBusiestStations = async () => {
  const response = await api.get("/dashboard/busiest-stations");
  return response.data;
};

/* ============================
   Top Routes
============================ */

export const getTopRoutes = async () => {
  const response = await api.get("/dashboard/top-routes");
  return response.data;
};
// Generate Report
export const generateReport = async (payload) => {
    const response = await api.post("/reports/generate", payload);
    return response.data;
};

// Report History
export const getReportHistory = async () => {
    const response = await api.get("/reports/history");
    return response.data;
};

// PDF
export const exportPdfReport = async (id) => {
    const response = await api.get(`/reports/pdf/${id}`, {
        responseType: "blob",
    });

    return response;
};

// CSV
export const exportCsvReport = async (id) => {
    const response = await api.get(`/reports/csv/${id}`, {
        responseType: "blob",
    });

    return response;
};

// Excel
export const exportExcelReport = async (id) => {
    const response = await api.get(`/reports/excel/${id}`, {
        responseType: "blob",
    });

    return response;
};