import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const ridershipService = {

  getStations() {
    return API.get("/stations");
  },

  predictRidership(data) {
    return API.post(
      "/ridership-predictions/predict",
      data
    );
  },
};

export default ridershipService;