import api from "./axios";

/* ==========================================
   MetroFlow AI Chat
========================================== */

export const chatWithAI = async (
  prompt,
  context = {}
) => {
  try {
    const response = await api.post(
      "/ai/chat",
      {
        prompt,
        context,
      },
      {
        timeout: 60000,
      }
    );

    return response.data.response;
  } catch (error) {
    console.error("AI Chat Error:", error);

    throw (
      error.response?.data ??
      error.message ??
      "Unable to connect to MetroFlow AI."
    );
  }
};

/* ==========================================
   Generate Recommendation
========================================== */

export const generateRecommendation = async (
  payload
) => {
  try {
    const response = await api.post(
      "/ai/recommendation",
      payload,
      {
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Recommendation Error:", error);

    throw (
      error.response?.data ??
      error.message ??
      "Failed to generate recommendation."
    );
  }
};

/* ==========================================
   Recommendation History
========================================== */

export const getAIHistory = async () => {
  try {
    const response = await api.get(
      "/ai/history"
    );

    return response.data;
  } catch (error) {
    console.error("History Error:", error);

    throw (
      error.response?.data ??
      error.message ??
      "Unable to fetch history."
    );
  }
};