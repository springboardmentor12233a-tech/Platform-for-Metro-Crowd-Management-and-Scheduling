import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const stationService = {
  getStations() {
    return API.get("/stations");
  },
};

export default stationService;