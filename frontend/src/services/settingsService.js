import api from "./api";


// ============================================================
// GET SETTINGS
// ============================================================

export const getSettings = async () => {

    const response = await api.get(
        "/settings/"
    );

    return response.data;
};


// ============================================================
// UPDATE SETTINGS
// ============================================================

export const updateSettings = async (
    settings
) => {

    const response = await api.put(
        "/settings/",
        settings
    );

    return response.data;
};