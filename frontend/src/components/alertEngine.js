export function generateAlerts(prediction) {
  // =========================================================
  // SYSTEM READY
  // =========================================================

  if (!prediction) {
    return [
      {
        id: "system-ready",
        level: "SYSTEM",
        title: "System Ready",
        station: "Metro Network",
        message:
          "Run an AI passenger forecast to generate operational alerts.",
        severity: "normal",
      },
    ];
  }

  // =========================================================
  // SUPPORT CURRENT AI FORECAST RESPONSE
  // =========================================================

  const station =
    prediction.station ||
    prediction.Station ||
    "Metro Network";

  const occupancy = Number(
    prediction.estimated_occupancy_percent ??
    prediction["Occupancy (%)"] ??
    0
  );

  const crowdLevel =
    prediction.crowd_level ||
    prediction["Crowd Level"] ||
    "Unknown";

  const riskLevel =
    prediction.risk_level ||
    prediction["Delay Risk"] ||
    "Low";

  const predictedPassengers = Number(
    prediction.predicted_passengers ??
    prediction["Predicted Passengers"] ??
    0
  );

  const peakPeriod =
    prediction.peak_period ??
    false;

  const recommendation =
    prediction.ai_recommendation ||
    prediction["AI Recommendation"] ||
    "Monitor passenger conditions.";

  const alerts = [];

  // =========================================================
  // 1. CROWD / OCCUPANCY ALERT
  // =========================================================

  if (occupancy >= 85) {
    alerts.push({
      id: "critical-crowd",
      level: "CRITICAL",
      title: "Critical Crowd Alert",
      station: station,
      message:
        `Estimated occupancy is ${occupancy.toFixed(
          2
        )}%. Immediate crowd-control measures and increased train frequency are recommended.`,
      severity: "critical",
    });
  } else if (occupancy >= 70) {
    alerts.push({
      id: "high-crowd",
      level: "HIGH",
      title: "High Crowd Alert",
      station: station,
      message:
        `Estimated occupancy is ${occupancy.toFixed(
          2
        )}%. Passenger density is high. Consider increasing train frequency.`,
      severity: "high",
    });
  } else if (occupancy >= 60) {
    alerts.push({
      id: "moderate-crowd",
      level: "MODERATE",
      title: "Moderate Crowd Warning",
      station: station,
      message:
        `Estimated occupancy is ${occupancy.toFixed(
          2
        )}%. Passenger demand is elevated. Continue monitoring passenger flow.`,
      severity: "moderate",
    });
  } else {
    alerts.push({
      id: "normal-crowd",
      level: "NORMAL",
      title: "Normal Passenger Flow",
      station: station,
      message:
        `Estimated occupancy is ${occupancy.toFixed(
          2
        )}%. Passenger demand is within a manageable operating range.`,
      severity: "normal",
    });
  }

  // =========================================================
  // 2. RISK ALERT
  // =========================================================

  const normalizedRisk =
    String(riskLevel).toLowerCase();

  if (
    normalizedRisk === "high" ||
    normalizedRisk === "critical"
  ) {
    alerts.push({
      id: "high-risk",
      level: "CRITICAL",
      title: "High Operational Risk",
      station: station,
      message:
        "The AI forecast indicates high operational risk. Immediate monitoring and service intervention may be required.",
      severity: "critical",
    });
  } else if (
    normalizedRisk === "moderate" ||
    normalizedRisk === "medium"
  ) {
    alerts.push({
      id: "moderate-risk",
      level: "HIGH",
      title: "High Operational Risk",
      station: station,
      message:
        "The AI forecast indicates moderate operational risk. Continue monitoring passenger demand and train conditions.",
      severity: "high",
    });
  }

  // =========================================================
  // 3. PEAK PERIOD ALERT
  // =========================================================

  if (
    peakPeriod === true ||
    String(peakPeriod).toLowerCase() === "yes" ||
    String(peakPeriod).toLowerCase() === "true"
  ) {
    alerts.push({
      id: "peak-period",
      level: "INFO",
      title: "Peak Period Detected",
      station: station,
      message:
        "The selected forecast falls within a peak passenger-demand period. Monitor passenger flow and service frequency.",
      severity: "moderate",
    });
  }

  // =========================================================
  // 4. AI RECOMMENDATION ALERT
  // =========================================================

  alerts.push({
    id: "ai-recommendation",
    level: "AI",
    title: "AI Operational Recommendation",
    station: station,
    message: recommendation,
    severity: "normal",
  });

  // =========================================================
  // 5. PASSENGER DEMAND INFORMATION
  // =========================================================

  if (predictedPassengers > 0) {
    alerts.push({
      id: "passenger-demand",
      level: "INFO",
      title: "AI Passenger Demand Forecast",
      station: station,
      message:
        `The AI model forecasts approximately ${predictedPassengers.toLocaleString()} passengers for the selected period.`,
      severity: "normal",
    });
  }

  // =========================================================
  // RETURN ALERTS
  // =========================================================

  return alerts;
}