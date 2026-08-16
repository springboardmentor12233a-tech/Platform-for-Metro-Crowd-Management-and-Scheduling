import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const frequencyAdjustmentService = {
  async getStations() {
    return API.get("/frequency-adjustment/stations");
  },

  async recommendFrequency(data) {
    return API.post(
      "/frequency-adjustment/recommend",
      data
    );
  },
};

export default frequencyAdjustmentService;