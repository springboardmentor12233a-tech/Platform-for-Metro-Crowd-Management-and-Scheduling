import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});

export const predictDelay = async (data) => {
    const response = await API.post("/predict/delay", data);
    return response.data;
};