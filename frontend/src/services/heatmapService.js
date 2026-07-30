import api from "./api";

export const getHeatmap = async () => {
    const res = await api.get("/heatmap/stations");
    return res.data;
};