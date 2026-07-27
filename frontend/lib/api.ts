const API_BASE_URL = 'http://localhost:8000';

export const apiService = {
  // Health check
  async getHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error' };
    }
  },

  // Get crowd status for a station
  async getCrowdStatus(stationId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowd/station/${stationId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get crowd status:', error);
      return { error: 'Failed to fetch' };
    }
  },

  // Get 24-hour forecast
  async getForecast() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/forecast/tomorrow`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get forecast:', error);
      return { error: 'Failed to fetch' };
    }
  },

  // Get active alerts
  async getAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/active`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get alerts:', error);
      return { error: 'Failed to fetch' };
    }
  },

  // Get top stations
  async getTopStations(limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics/top-stations?limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get top stations:', error);
      return { error: 'Failed to fetch' };
    }
  },

  // Get hourly pattern
  async getHourlyPattern() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics/hourly-pattern`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get hourly pattern:', error);
      return { error: 'Failed to fetch' };
    }
  },
  // Get KPI data
  async getKpi() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/kpi`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get KPI data:', error);
      return { error: 'Failed to fetch' };
    }
  },
  // Get LSTM prediction
  async getPrediction(last24Hours: number[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict/next-hour`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          last_24_hours: last24Hours,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get prediction:', error);
      return { error: 'Failed to fetch' };
    }
  },
};

export const aiService = {
  askQuestion: async (question: string) => {
    const response = await fetch(
      `http://localhost:8000/api/ai/chat?question=${encodeURIComponent(question)}`,
      { method: 'POST' }
    );
    return response.json();
  }
};
