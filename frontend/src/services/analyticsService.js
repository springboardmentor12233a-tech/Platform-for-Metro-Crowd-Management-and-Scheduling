import api from "./api";


/*
|--------------------------------------------------------------------------
| Analytics API Service
|--------------------------------------------------------------------------
|
| This service communicates with the prediction APIs.
|
*/


// ------------------------------------------------------------
// Crowd prediction
// ------------------------------------------------------------

export const getCrowdPredictions = async () => {

    const response = await api.get(
        "/crowd-predictions/"
    );

    return response.data;

};


// ------------------------------------------------------------
// Ridership prediction
// ------------------------------------------------------------

export const getRidershipPredictions = async () => {

    const response = await api.get(
        "/ridership-predictions/"
    );

    return response.data;

};


// ------------------------------------------------------------
// Frequency adjustment
// ------------------------------------------------------------

export const getFrequencyAdjustments = async () => {

    const response = await api.get(
        "/frequency-adjustment/"
    );

    return response.data;

};


// ------------------------------------------------------------
// Delay prediction
// ------------------------------------------------------------

export const getDelayPredictions = async () => {

    const response = await api.get(
        "/delay-prediction/"
    );

    return response.data;

};


// ------------------------------------------------------------
// Schedule predictions
// ------------------------------------------------------------

export const getSchedulePredictions = async () => {

    const response = await api.get(
        "/schedule-optimizer/"
    );

    return response.data;

};


// ------------------------------------------------------------
// Load everything
// ------------------------------------------------------------

export const getAnalyticsData = async () => {
    const results = await Promise.allSettled([
        getCrowdPredictions(),
        getRidershipPredictions(),
        getFrequencyAdjustments(),
        getDelayPredictions(),
        getSchedulePredictions(),
    ]);

    // 🐛 Add this debugging block to unmask hidden errors
    const endpoints = ["Crowd", "Ridership", "Frequency", "Delay", "Schedule"];
    results.forEach((res, index) => {
        if (res.status === "rejected") {
            console.error(`❌ ${endpoints[index]} API failed:`, res.reason.message || res.reason);
        } else if (!Array.isArray(res.value)) {
            console.warn(`⚠️ ${endpoints[index]} API returned an Object instead of an Array:`, res.value);
        }
    });

    return {
        crowd: results[0].status === "fulfilled" ? results[0].value : [],
        ridership: results[1].status === "fulfilled" ? results[1].value : [],
        frequency: results[2].status === "fulfilled" ? results[2].value : [],
        delay: results[3].status === "fulfilled" ? results[3].value : [],
        schedule: results[4].status === "fulfilled" ? results[4].value : [],
    };
};