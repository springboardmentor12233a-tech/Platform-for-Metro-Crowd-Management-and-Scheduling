import api from "./api";

export const getSummary = async () => {
    const res = await api.get("/dashboard/summary");
    return res.data;
};

export const getRecent = async () => {
    const res = await api.get("/dashboard/recent");
    return res.data;
};

export const getHighCrowd = async () => {
    const res = await api.get("/dashboard/high-crowd");
    return res.data;
};

export const getStations = async () => {
    const res = await api.get("/dashboard/stations");
    return res.data;
};