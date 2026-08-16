import api from "./api";

const crowdService = {
  getStations: () => api.get("/stations/"),
  predictCrowd: (data) => api.post("/crowd-predictions/predict", data),
};

export default crowdService;