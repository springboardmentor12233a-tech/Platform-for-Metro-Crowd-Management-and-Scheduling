import api from "./api";

// Emergency Announcement
export const generateAnnouncement = async (data) => {
  const response = await api.post("/announcements/generate", data);
  return response.data;
};

// Smart Alert
export const generateAlert = async (data) => {
  const response = await api.post("/alerts/generate", data);
  return response.data;
};

// Schedule Update
export const generateScheduleUpdate = async (data) => {
  const response = await api.post("/schedule-updates/generate", data);
  return response.data;
};

// Operational Insight
export const generateOperationalInsight = async (data) => {
  const response = await api.post("/operational-insights/generate", data);
  return response.data;
};

// Analytics
export const generateAnalytics = async (data) => {
  const response = await api.post("/analytics/generate", data);
  return response.data;
};