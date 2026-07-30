import api from "./api";

export const generateAnnouncement = async (data) => {
    const response = await api.post("/announcements/generate", data);
    return response.data;
};