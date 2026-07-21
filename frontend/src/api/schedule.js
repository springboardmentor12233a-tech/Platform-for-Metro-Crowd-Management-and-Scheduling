import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getScheduleRecommendation = async (predictedPassengers) => {
  const response = await API.post("/schedule/recommend", {
    predicted_passengers: predictedPassengers,
  });

  return response.data;
};