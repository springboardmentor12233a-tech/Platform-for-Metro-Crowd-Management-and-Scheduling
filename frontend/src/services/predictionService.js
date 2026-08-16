import api from "./api";
export const predictDelay = async (data) => {
    const response = await api.post(
        "/delay-prediction/predict",
        data
    );

    return response.data;
};

export default {
    predictDelay,
};