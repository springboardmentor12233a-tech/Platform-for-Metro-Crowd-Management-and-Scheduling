import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const trainScheduleOptimizerService = {
  // Get stations
  getStations() {
    return API.get("/stations");
  },

  // Train schedule optimization
  optimize(data) {
    return API.post(
      "/schedule-optimizer/optimize",
      data
    );
  },
};

export default trainScheduleOptimizerService;