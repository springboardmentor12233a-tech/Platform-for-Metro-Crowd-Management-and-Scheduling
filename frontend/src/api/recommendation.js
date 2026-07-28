import api from "./axios";

export const getRecommendationHistory = async () => {
    const response = await api.get("/ai/history");
    return response.data;
};