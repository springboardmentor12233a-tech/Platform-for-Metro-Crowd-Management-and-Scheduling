// Central API client with JWT interceptors and error handling

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API = `${BASE_URL}/api/v1`;

function getToken() {
  return localStorage.getItem('metroflow_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('metroflow_token');
    localStorage.removeItem('metroflow_user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---- Auth ----
export const authApi = {
  login: (username, password) => {
    const form = new URLSearchParams({ username, password });
    return fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(err.detail || 'Login failed');
      }
      return res.json();
    });
  },
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
};

// ---- Stations ----
export const stationsApi = {
  list: () => request('/stations/'),
  get: (id) => request(`/stations/${id}`),
  create: (data) => request('/stations/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/stations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ---- Schedules ----
export const schedulesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/schedules/${qs ? '?' + qs : ''}`);
  },
  create: (data) => request('/schedules/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  optimize: (stationId) => request(`/schedules/optimize?station_id=${stationId}`, { method: 'POST' }),
};

// ---- Crowd ----
export const crowdApi = {
  live: (stationId) => request(`/crowd/${stationId}/live`),
  forecast: (data) => request('/crowd/forecast', { method: 'POST', body: JSON.stringify(data) }),
  forecast24h: (stationId) => request(`/crowd/${stationId}/forecast-24h`),
};

// ---- Alerts ----
export const alertsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/alerts/${qs ? '?' + qs : ''}`);
  },
  create: (data) => request('/alerts/', { method: 'POST', body: JSON.stringify(data) }),
  resolve: (id) => request(`/alerts/${id}/resolve`, { method: 'POST' }),
};

// ---- Analytics ----
export const analyticsApi = {
  summary: () => request('/analytics/summary'),
  peakHours: () => request('/analytics/peak-hours'),
  stationMetrics: () => request('/analytics/station-metrics'),
  exportReport: () => {
    const token = getToken();
    return fetch(`${API}/analytics/export-reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
