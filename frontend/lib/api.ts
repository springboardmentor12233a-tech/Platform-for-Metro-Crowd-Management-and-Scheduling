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

  // Get crowd status for one station
  async getCrowdStatus(stationId: number, hour?: string) {
    try {
      const url = hour
        ? `${API_BASE_URL}/api/crowd/station/${stationId}?hour=${hour}`
        : `${API_BASE_URL}/api/crowd/station/${stationId}`;

      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Failed to get crowd status:", error);
      return { error: "Failed to fetch" };
    }
  },

  async getAIRecommendation(
    station: string,
    predictedPassengers: number,
    peakHour: boolean
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            station: station,
            predicted_passengers: predictedPassengers,
            peak_hour: peakHour,
          }),
        }
      );

      return await response.json();

    } catch (error) {
      console.error("AI Recommendation failed:", error);
      return {
        status: "error",
        recommendation: "Unable to generate recommendation.",
      };
    }
  },

  // Get all stations crowd status
  async getAllStations(hour?: string) {
    try {
      const url = hour
        ? `${API_BASE_URL}/api/crowd/all-stations?hour=${hour}`
        : `${API_BASE_URL}/api/crowd/all-stations`;

      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("Failed to get all stations:", error);
      return { error: "Failed to fetch" };
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
  async getAlerts(hour?: string, stationId?: number) {
    try {
      let url = `${API_BASE_URL}/api/alerts/active`;

      const params = new URLSearchParams();

      if (hour) {
        params.append("hour", hour);
      }

      if (stationId) {
        params.append("station_id", stationId.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      return await response.json();

    } catch (error) {
      console.error("Failed to get alerts:", error);
      return { error: "Failed to fetch" };
    }
  },

  // Get top stations
  getTopStations: async (limit = 5, hour = 17) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/statistics/top-stations?limit=${limit}&hour=${hour}`
      );

      return await response.json();
    } catch (error) {
      console.error("Failed to get top stations:", error);
      return { error: "Failed to fetch" };
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
  getKpi: async (hour = 17) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/kpi?hour=${hour}`);
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
  async getStationDetails(stationId: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/crowd/station/${stationId}`
      );

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch station details:", error);
      return { error: "Failed to fetch" };
    }
  },
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false };
    }
  },

  async getSchedulingDashboard(hour: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scheduling/dashboard?hour=${hour}`
      );

      return await response.json();
    } catch (error) {
      console.error("Scheduling dashboard failed:", error);

      return {
        predicted_passengers: 0,
        current_frequency: 5,
        recommended_frequency: 5,
        required_trains: 0,
        platform_load: "Unknown",
        peak_hour: {
          priority: "NORMAL",
          optimized_passengers: 0,
        },
        schedule: [],
      };
    }
  },
  // Chat with AI Assistant
  async chatWithAI(question: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || `AI request failed: ${response.status}`
        );
      }

      return data;

    } catch (error) {
      console.error("AI Chat Error:", error);
      throw error;
    }
  },
  async simulateDelay(
    startHour: number,
    endHour: number,
    frequency: number,
    delayMinutes: number
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scheduling/delay?start_hour=${startHour}&end_hour=${endHour}&frequency=${frequency}&delay_minutes=${delayMinutes}`
      );

      return await response.json();

    } catch (error) {

      console.error("Delay simulation failed:", error);

      return {
        error: "Failed to simulate delay",
      };
    }
  }
};


