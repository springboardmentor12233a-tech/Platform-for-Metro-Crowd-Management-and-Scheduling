import api from "./axios";

export const getScheduleRecommendation = async (predictedPassengers) => {
  const response = await api.post("/schedule/recommend", {
    predicted_passengers: predictedPassengers,
  });

  return response.data;
};