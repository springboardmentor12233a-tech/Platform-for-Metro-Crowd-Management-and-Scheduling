import api from "./api";

export const predictSchedule = async (data) => {
    const response = await api.post(
        "/schedule-prediction/predict",
        data
    );

    return response.data;
};

export default {
    predictSchedule,
};