// =============================================
// MetroFlow API Service
// =============================================

// Backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API = `${BASE_URL}/api/v1`;

// =============================================
// Helpers
// =============================================

function getToken() {
  return localStorage.getItem("metroflow_token");
}

function logoutUser() {
  localStorage.removeItem("metroflow_token");
  localStorage.removeItem("metroflow_user");

  // Hash Router Navigation
  window.location.hash = "/";
}

// =============================================
// Generic Request Function
// =============================================

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

  // Unauthorized
  if (response.status === 401 || response.status === 403) {
    logoutUser();
    throw new Error("Session expired. Please login again.");
  }

  // No Content
  if (response.status === 204) {
    return null;
  }

  // Error Handling
  if (!response.ok) {
    let error = {};

    try {
      error = await response.json();
    } catch {
      error = { detail: "Unknown server error." };
    }

    throw new Error(
      error.detail ||
      error.message ||
      `Request failed (${response.status})`
    );
  }

  return response.json();
}

// =============================================
// Authentication APIs
// =============================================

export const authApi = {
  async login(username, password) {
    const form = new URLSearchParams({
      username,
      password,
    });

    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    if (!response.ok) {
      let error = {};

      try {
        error = await response.json();
      } catch {
        error = { detail: "Login failed." };
      }

      throw new Error(
        error.detail ||
        error.message ||
        "Invalid username or password."
      );
    }

    return response.json();
  },

  register(data) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me() {
    return request("/auth/me");
  },
};

// =============================================
// Station APIs
// =============================================

export const stationsApi = {
  list() {
    return request("/stations/");
  },

  get(id) {
    return request(`/stations/${id}`);
  },

  create(data) {
    return request("/stations/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return request(`/stations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return request(`/stations/${id}`, {
      method: "DELETE",
    });
  },
};

// =============================================
// Schedule APIs
// =============================================

export const schedulesApi = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();

    return request(`/schedules/${query ? `?${query}` : ""}`);
  },

  create(data) {
    return request("/schedules/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return request(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return request(`/schedules/${id}`, {
      method: "DELETE",
    });
  },

  optimize(stationId) {
    return request(`/schedules/optimize?station_id=${stationId}`, {
      method: "POST",
    });
  },
};

// =============================================
// Crowd APIs
// =============================================

export const crowdApi = {
  live(stationId) {
    return request(`/crowd/${stationId}/live`);
  },

  forecast(data) {
    return request("/crowd/forecast", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forecast24h(stationId) {
    return request(`/crowd/${stationId}/forecast-24h`);
  },
};

// =============================================
// Alert APIs
// =============================================

export const alertsApi = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();

    return request(`/alerts/${query ? `?${query}` : ""}`);
  },

  create(data) {
    return request("/alerts/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resolve(id) {
    return request(`/alerts/${id}/resolve`, {
      method: "POST",
    });
  },
};

// =============================================
// Analytics APIs
// =============================================

export const analyticsApi = {
  summary() {
    return request("/analytics/summary");
  },

  peakHours() {
    return request("/analytics/peak-hours");
  },

  stationMetrics() {
    return request("/analytics/station-metrics");
  },

  async exportReport() {
    const token = getToken();

    const response = await fetch(`${API}/analytics/export-reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export analytics report.");
    }

    return response.blob();
  },
};