import api from "./axios";

/*
========================================
Gemini Recommendation
========================================
*/

export const generateRecommendation = async (data) => {
  const response = await api.post("/ai/recommendation", data);
  return response.data;
};

/*
========================================
Gemini Chat
========================================
*/

export const chatWithAI = async (prompt) => {
  const response = await api.post("/ai/chat", {
    prompt,
  });

  return response.data;
};

/*
========================================
Recommendation History
========================================
*/

export const getRecommendationHistory = async () => {
  const response = await api.get("/ai/history");
  return response.data;
};