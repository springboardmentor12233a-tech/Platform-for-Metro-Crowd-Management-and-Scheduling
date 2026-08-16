import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const trainStatusService = {
  async getAllTrains() {
    const response = await API.get("/train-status/");
    // Return the actual data array directly
    return response.data; 
  },
};

export default trainStatusService;