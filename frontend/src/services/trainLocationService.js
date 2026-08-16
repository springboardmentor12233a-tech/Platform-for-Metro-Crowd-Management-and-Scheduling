import api from "./api";

export const getTrainLocations = async () => {
    const response = await api.get("/train-location/");
    return response.data;
};

export default {
    getTrainLocations,
};