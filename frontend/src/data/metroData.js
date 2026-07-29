export const summaryData = [
  {
    title: "Total Stations",
    value: 25,
    color: "#1976d2",
    icon: "station",
  },
  {
    title: "Active Trains",
    value: 18,
    color: "#2e7d32",
    icon: "train",
  },
  {
    title: "Average Occupancy",
    value: "68%",
    color: "#ed6c02",
    icon: "people",
  },
  {
    title: "High Congestion",
    value: 4,
    color: "#d32f2f",
    icon: "warning",
  },
];

export const stationData = [
  {
    id: 1,
    station: "Rajiv Chowk",
    occupancy: 92,
    status: "High",
    recommendation: "Increase Train Frequency",
  },
  {
    id: 2,
    station: "Kashmere Gate",
    occupancy: 74,
    status: "Medium",
    recommendation: "Monitor Crowd",
  },
  {
    id: 3,
    station: "AIIMS",
    occupancy: 38,
    status: "Low",
    recommendation: "Normal Operation",
  },
  {
    id: 4,
    station: "Hauz Khas",
    occupancy: 61,
    status: "Medium",
    recommendation: "Monitor Crowd",
  },
  {
    id: 5,
    station: "Central Secretariat",
    occupancy: 87,
    status: "High",
    recommendation: "Deploy Extra Staff",
  },
];

export const alertData = [
  {
    id: 1,
    type: "High",
    message: "Rajiv Chowk is experiencing heavy congestion.",
  },
  {
    id: 2,
    type: "Medium",
    message: "Kashmere Gate passenger flow is increasing.",
  },
  {
    id: 3,
    type: "Low",
    message: "AIIMS station operating normally.",
  },
];