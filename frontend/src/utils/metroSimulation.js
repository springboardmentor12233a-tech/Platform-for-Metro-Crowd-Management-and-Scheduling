// ==========================================
// MetroFlow Simulation Engine
// ==========================================

// Crowd levels used throughout the application
const CROWD_LEVELS = [
  "Low",
  "Medium",
  "High",
];

// AI recommendations
const AI_RECOMMENDATIONS = [
  "Increase train frequency by 2 trains.",
  "Deploy additional security staff.",
  "Open additional ticket counters.",
  "Redirect passengers to alternate routes.",
  "Increase platform announcements.",
  "Reduce dwell time by 20 seconds.",
  "Dispatch crowd management personnel.",
  "Monitor station closely for the next 30 minutes.",
];

// Sample incident titles
const INCIDENTS = [
  "High Passenger Density",
  "Platform Congestion",
  "Train Delay",
  "Escalator Maintenance",
  "Medical Assistance Required",
  "Security Alert",
  "Ticket Counter Queue",
];

// ==========================================
// Random Number
// ==========================================

export function randomBetween(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

// ==========================================
// Clamp Value
// ==========================================

export function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

// ==========================================
// Crowd Level Calculator
// ==========================================

export function calculateCrowdLevel(
  occupancy
) {
  if (occupancy >= 85) return "High";

  if (occupancy >= 60) return "Medium";

  return "Low";
}

// ==========================================
// Simulate One Station
// ==========================================

export function simulateStation(station) {
  const occupancyChange = randomBetween(
    -8,
    8
  );

  const passengerChange =
    randomBetween(-250, 350);

  const occupancy = clamp(
    station.occupancy + occupancyChange,
    5,
    100
  );

  const passengers = Math.max(
    0,
    (station.passengers || 0) +
      passengerChange
  );

  return {
    ...station,
    occupancy,
    passengers,
    crowd_level:
      calculateCrowdLevel(occupancy),
  };
}

// ==========================================
// Simulate All Stations
// ==========================================

export function simulateStations(
  stations
) {
  return stations.map(simulateStation);
}
// ==========================================
// Generate Random Incident
// ==========================================

export function generateIncident(stations) {
  if (!stations.length) return null;

  // ~25% chance of generating an incident
  if (Math.random() > 0.25) return null;

  const station =
    stations[randomBetween(0, stations.length - 1)];

  const title =
    INCIDENTS[randomBetween(0, INCIDENTS.length - 1)];

  const priority =
    station.crowd_level === "High"
      ? "high"
      : station.crowd_level === "Medium"
      ? "medium"
      : "low";

  return {
    id: `incident-${Date.now()}`,
    title,
    station: station.station,
    message: `${title} detected at ${station.station}. Current occupancy is ${station.occupancy}%.`,
    priority,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    read: false,
  };
}

// ==========================================
// Generate Notification
// ==========================================

export function generateNotification(incident) {
  if (!incident) return null;

  return {
    id: `notification-${Date.now()}`,
    title: incident.title,
    message: incident.message,
    priority: incident.priority,
    time: incident.time,
    read: false,
  };
}

// ==========================================
// AI Recommendation
// ==========================================

export function generateRecommendation(stations) {
  if (!stations.length) return null;

  const highCrowdStations = stations.filter(
    (station) => station.crowd_level === "High"
  );

  if (highCrowdStations.length > 0) {
    const station =
      highCrowdStations[
        randomBetween(
          0,
          highCrowdStations.length - 1
        )
      ];

    return `AI recommends deploying additional trains and crowd management staff at ${station.station}.`;
  }

  return AI_RECOMMENDATIONS[
    randomBetween(
      0,
      AI_RECOMMENDATIONS.length - 1
    )
  ];
}

// ==========================================
// Dashboard Summary Simulation
// ==========================================

export function simulateDashboard(dashboard) {
  return {
    ...dashboard,

    total_passengers: Math.max(
      0,
      dashboard.total_passengers +
        randomBetween(-500, 800)
    ),

    total_revenue: Math.max(
      0,
      dashboard.total_revenue +
        randomBetween(1500, 7000)
    ),

    total_trips: Math.max(
      0,
      dashboard.total_trips +
        randomBetween(0, 4)
    ),
  };
}
// ==========================================
// Run Complete Simulation Cycle
// ==========================================

export function runSimulation({
  stations,
  dashboard,
}) {
  // 1. Simulate station activity
  const updatedStations =
    simulateStations(stations);

  // 2. Simulate dashboard KPIs
  const updatedDashboard =
    simulateDashboard(dashboard);

  // 3. Generate AI recommendation
  const aiRecommendation =
    generateRecommendation(updatedStations);

  // 4. Generate random incident
  const incident =
    generateIncident(updatedStations);

  // 5. Generate notification
  const notification =
    generateNotification(incident);

  return {
    stations: updatedStations,
    dashboard: updatedDashboard,
    incident,
    notification,
    aiRecommendation,
  };
}

// ==========================================
// Simulation Interval
// ==========================================

export const SIMULATION_INTERVAL = 5000;

// ==========================================
// Export Constants
// ==========================================

export {
  CROWD_LEVELS,
  AI_RECOMMENDATIONS,
  INCIDENTS,
};
