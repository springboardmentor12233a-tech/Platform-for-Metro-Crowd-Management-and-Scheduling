import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('metroflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('metroflow_token');
      localStorage.removeItem('metroflow_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  getUsers: () => api.get('/auth/users'),
  toggleUserStatus: (userId, isActive) => api.put(`/auth/users/${userId}/status?is_active=${isActive}`),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`)
};

export const stationService = {
  getStations: (params) => api.get('/stations', { params }),
  getStation: (id) => api.get(`/stations/${id}`),
  createStation: (data) => api.post('/stations', data),
  updateStation: (id, data) => api.put(`/stations/${id}`, data),
  deleteStation: (id) => api.delete(`/stations/${id}`)
};

export const trainService = {
  getTrains: (params) => api.get('/trains', { params }),
  getTrain: (id) => api.get(`/trains/${id}`),
  createTrain: (data) => api.post('/trains', data),
  updateTrain: (id, data) => api.put(`/trains/${id}`, data),
  deleteTrain: (id) => api.delete(`/trains/${id}`)
};

export const scheduleService = {
  getSchedules: (params) => api.get('/schedules', { params }),
  createSchedule: (data) => api.post('/schedules', data),
  updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
  optimizeFrequency: (data) => api.post('/schedules/optimize-frequency', data)
};

export const aiService = {
  getMetrics: () => api.get('/metrics'),
  predictDemand: (data) => api.post('/demand', data),
  predictDelay: (data) => api.post('/delay', data),
  predictCrowd: (data) => api.post('/predict-crowd', data),
  forecastDemand: (stationId, timeframe) => api.post(`/forecast-demand?station_id=${stationId}&timeframe=${timeframe}`)
};

export const reportService = {
  getTrafficReport: () => api.get('/traffic-report'),
  getFrequencyReport: () => api.get('/frequency-report'),
  downloadReport: (format) => `/api/reports/generate?format=${format}`
};

export default api;
