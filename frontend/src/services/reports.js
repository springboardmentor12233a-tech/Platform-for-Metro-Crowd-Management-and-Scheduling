import API from "./api";

export const getReports = async () => {
    const response = await API.get("/reports");
    return response.data;
};