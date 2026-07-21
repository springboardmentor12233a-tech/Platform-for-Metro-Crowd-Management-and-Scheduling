const metroState = {
  dashboard: {
    totalPassengers: 248734,
    activeTrains: 126,
    activeIncidents: 3,
    revenueToday: 1542000,
  },

  stations: [
    {
      id: 1,
      name: "Rajiv Chowk",
      crowdLevel: "High",
      occupancy: 92,
      status: "Crowded",
      line: "Blue",
    },
    {
      id: 2,
      name: "Kashmere Gate",
      crowdLevel: "Medium",
      occupancy: 71,
      status: "Busy",
      line: "Yellow",
    },
  ],

  incidents: [],

  schedules: [],

  analytics: {},
};

export default metroState;