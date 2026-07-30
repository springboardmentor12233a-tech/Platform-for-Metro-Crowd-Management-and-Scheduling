import api from "./api";

export const generateScheduleUpdate = async (data) => {
    const response = await api.post("/schedule-updates/generate", data);
    return response.data;
};