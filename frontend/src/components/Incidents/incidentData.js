const incidentData = [
  {
    id: 1,
    title: "Signal Failure",
    station: "Rajiv Chowk",
    line: "Blue Line",
    severity: "High",
    status: "Active",
    reported: "08:35 AM",
    eta: "12 mins",
    passengers: 1840,
    recommendation:
      "Dispatch maintenance team and reroute trains through alternate platform.",
  },
  {
    id: 2,
    title: "Heavy Crowd",
    station: "Kashmere Gate",
    line: "Yellow Line",
    severity: "Medium",
    status: "Monitoring",
    reported: "08:20 AM",
    eta: "25 mins",
    passengers: 1260,
    recommendation:
      "Increase train frequency by 15% during the next 30 minutes.",
  },
  {
    id: 3,
    title: "Train Delay",
    station: "Mandi House",
    line: "Blue Line",
    severity: "Low",
    status: "Resolved",
    reported: "07:50 AM",
    eta: "-",
    passengers: 620,
    recommendation:
      "Issue resolved. Resume normal scheduling.",
  },
];

export default incidentData;