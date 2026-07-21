// ==========================================
// Risk Thresholds
// ==========================================

const RISK = {
  LOW: 35,
  MEDIUM: 60,
  HIGH: 80,
};

// ==========================================
// AI Actions
// ==========================================

const ACTIONS = {
  LOW: [
    "Continue normal operations.",
    "Maintain current train frequency.",
    "Monitor passenger inflow.",
  ],

  MEDIUM: [
    "Increase platform monitoring.",
    "Prepare standby train.",
    "Deploy additional staff.",
    "Monitor passenger queues.",
  ],

  HIGH: [
    "Increase train frequency immediately.",
    "Activate crowd diversion plan.",
    "Deploy emergency response team.",
    "Open additional entry gates.",
    "Broadcast congestion advisory.",
  ],
};

// ==========================================
// Helpers
// ==========================================

function randomItem(items) {
  return items[
    Math.floor(Math.random() * items.length)
  ];
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

// ==========================================
// Calculate Risk Score
// ==========================================

export function calculateRiskScore(station) {
  const occupancy =
    station.occupancy ?? 0;

  const passengers =
    station.passengers ??
    station.total_passengers ??
    0;

  const utilization =
    station.capacity
      ? (passengers / station.capacity) * 100
      : occupancy;

  const score =
    occupancy * 0.6 +
    utilization * 0.4;

  return Math.round(
    clamp(score, 0, 100)
  );
}

// ==========================================
// Risk Level
// ==========================================

export function getRiskLevel(score) {
  if (score >= RISK.HIGH) {
    return "HIGH";
  }

  if (score >= RISK.MEDIUM) {
    return "MEDIUM";
  }

  return "LOW";
}

// ==========================================
// AI Confidence
// ==========================================

export function calculateConfidence(score) {
  let confidence = 70;

  confidence += score * 0.25;

  return Math.round(
    clamp(confidence, 70, 99)
  );
}

// ==========================================
// Peak Hour Prediction
// ==========================================

export function predictPeakStatus(station) {
  const occupancy =
    station.occupancy ?? 0;

  if (occupancy >= 85) {
    return "Peak congestion expected within 10 minutes.";
  }

  if (occupancy >= 65) {
    return "Passenger volume likely to increase over the next 20 minutes.";
  }

  if (occupancy >= 40) {
    return "Traffic expected to remain moderate.";
  }

  return "Normal passenger flow expected.";
}

// ==========================================
// Generate Recommendation
// ==========================================

export function generateRecommendation(station) {
  const score =
    calculateRiskScore(station);

  const risk =
    getRiskLevel(score);

  const confidence =
    calculateConfidence(score);

  return {
    station:
      station.station_name ||
      station.station ||
      station.name ||
      "Unknown Station",

    risk,

    riskScore: score,

    confidence,

    action:
      randomItem(
        ACTIONS[risk]
      ),

    prediction:
      predictPeakStatus(
        station
      ),

    occupancy:
      station.occupancy ??
      0,

    passengers:
      station.passengers ??
      station.total_passengers ??
      0,
  };
}

// ==========================================
// Dashboard AI Insight
// ==========================================

export function generateDashboardInsight(
  stations = []
) {
  if (!stations.length) {
    return null;
  }

  const recommendations =
    stations.map((station) =>
      generateRecommendation({
        ...station,
        station:
          station.station_name ||
          station.station ||
          station.name,

        passengers:
          station.passengers ??
          station.total_passengers ??
          0,

        occupancy:
          station.occupancy ??
          Math.min(
            Math.round(
              (
                (station.passengers ??
                  station.total_passengers ??
                  0) /
                (station.capacity ??
                  10000)
              ) * 100
            ),
            100
          ),

        capacity:
          station.capacity ??
          10000,
      })
    );

  recommendations.sort(
    (a, b) =>
      b.riskScore -
      a.riskScore
  );

  return recommendations[0];
}