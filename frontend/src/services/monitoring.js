import API from "./api";

export const getMonitoring = async () => {

    const response = await API.get("/monitoring");

    return response.data;

};