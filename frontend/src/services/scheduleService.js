import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const scheduleService = {
  getSchedules(skip = 0, limit = 100) {
    return API.get("/schedules/", {
      params: {
        skip,
        limit,
      },
    });
  },

  getAllSchedules() {
    return API.get("/schedules/", {
      params: {
        skip: 0,
        limit: 10000,
      },
    });
  },
};

export default scheduleService;