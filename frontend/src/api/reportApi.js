import axios from "./axios";

export const generateReport = async () => {
    const { data } = await axios.post("/reports/generate");
    return data;
};