import api from "./axios";

export const getForecastDashboard = async () => {
  const res = await api.get("/forecast/dashboard");
  return res.data;
};

export const getForecast = async ({ station, forecast_date }) => {
  const res = await api.post("/forecast/predict", {
    station,
    forecast_date,
  });

  return res.data;
};