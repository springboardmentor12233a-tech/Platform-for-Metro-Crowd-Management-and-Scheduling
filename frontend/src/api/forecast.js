import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function getForecast(data) {
  const response = await axios.post(`${API}/forecast/predict`, data);
  return response.data;
}