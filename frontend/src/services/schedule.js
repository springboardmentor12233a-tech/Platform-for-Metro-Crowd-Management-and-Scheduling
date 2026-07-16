import API from "./api";

export const getSchedule = async () => {
  const response = await API.get("/schedule");
  return response.data;
};