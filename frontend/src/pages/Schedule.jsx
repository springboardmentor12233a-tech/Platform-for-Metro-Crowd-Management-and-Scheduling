import { useEffect, useState } from "react";

function Schedule() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("aiForecastHistory") || "[]"
    );

    if (history.length > 0) {
      setForecast(history[0]);
    }
  }, []);

  // =========================================
  // DEFAULT DEMO VALUES
  // =========================================

  const predictedPassengers =
    Number(forecast?.predicted_passengers) || 0;

  const occupancy =
    Number(forecast?.estimated_occupancy_percent) || 0;

  const crowdLevel =
    forecast?.crowd_level || "No Forecast";

  const riskLevel =
    forecast?.risk_level || "Unknown";

  const station =
    forecast?.station || "No station selected";

  const forecastTime =
    forecast?.time || "--:--";

  // =========================================
  // AI SCHEDULING DECISION
  // =========================================

  let currentFrequency = 5;
  let recommendedFrequency = 5;
  let status = "Maintain Service";
  let action =
    "Current train frequency is sufficient for expected demand.";

  if (occupancy > 85 || riskLevel.toLowerCase() === "high") {
    recommendedFrequency = 8;
    status = "Increase Service";
    action =
      "High passenger demand detected. Increase train frequency and prepare crowd-control measures.";
  } else if (occupancy > 70) {
    recommendedFrequency = 6;
    status = "Increase Service";
    action =
      "Elevated passenger demand detected. Increase train frequency moderately during the forecast period.";
  } else if (occupancy >= 40) {
    recommendedFrequency = 5;
    status = "Monitor Demand";
    action =
      "Passenger demand is manageable. Maintain the current frequency and monitor crowd conditions.";
  } else {
    recommendedFrequency = 4;
    status = "Normal Operation";
    action =
      "Low passenger demand detected. Current service capacity is sufficient.";
  }

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusColor = () => {
    if (status === "Increase Service") {
      return "#d32f2f";
    }

    if (status === "Monitor Demand") {
      return "#f57c00";
    }

    return "#2e7d32";
  };

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            marginBottom: "8px",
            color: "#123b68",
          }}
        >
          🚆 AI Train Scheduling
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "15px",
          }}
        >
          AI-assisted train frequency recommendations
          based on predicted passenger demand.
        </p>
      </div>

      {/* =====================================
          NO FORECAST
      ===================================== */}

      {!forecast && (
        <div
          className="card"
          style={{
            padding: "25px",
            marginBottom: "20px",
            borderLeft: "5px solid #1976d2",
          }}
        >
          <h2>⚠️ No AI Forecast Available</h2>

          <p>
            Run an AI Passenger Demand Forecast from
            the AI Prediction page first.
          </p>
        </div>
      )}

      {/* =====================================
          FORECAST SUMMARY
      ===================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        {/* STATION */}

        <div
          className="card"
          style={{ padding: "20px" }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            Forecast Station
          </p>

          <h2
            style={{
              margin: 0,
              color: "#123b68",
            }}
          >
            {station}
          </h2>

          <small>
            Forecast time: {forecastTime}
          </small>
        </div>

        {/* PASSENGERS */}

        <div
          className="card"
          style={{ padding: "20px" }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            Predicted Passengers
          </p>

          <h1
            style={{
              margin: 0,
              color: "#1976d2",
            }}
          >
            {predictedPassengers
              ? predictedPassengers.toLocaleString()
              : "--"}
          </h1>

          <small>
            AI forecast
          </small>
        </div>

        {/* OCCUPANCY */}

        <div
          className="card"
          style={{ padding: "20px" }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            Estimated Occupancy
          </p>

          <h1
            style={{
              margin: 0,
              color: "#123b68",
            }}
          >
            {occupancy
              ? `${occupancy.toFixed(2)}%`
              : "--"}
          </h1>

          <small>
            Derived from AI demand
          </small>
        </div>

        {/* CROWD */}

        <div
          className="card"
          style={{ padding: "20px" }}
        >
          <p
            style={{
              color: "#64748b",
              marginBottom: "8px",
            }}
          >
            Forecast Crowd
          </p>

          <h1
            style={{
              margin: 0,
              color:
                crowdLevel === "High"
                  ? "#d32f2f"
                  : crowdLevel === "Medium"
                  ? "#f57c00"
                  : "#2e7d32",
            }}
          >
            {crowdLevel}
          </h1>

          <small>
            Risk: {riskLevel}
          </small>
        </div>
      </div>

      {/* =====================================
          SCHEDULING DECISION
      ===================================== */}

      <div
        className="card"
        style={{
          padding: "25px",
          marginBottom: "20px",
          borderLeft:
            `5px solid ${getStatusColor()}`,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#123b68",
          }}
        >
          🤖 AI Scheduling Decision
        </h2>

        <p
          style={{
            color: "#64748b",
          }}
        >
          Recommended train frequency based on
          predicted passenger demand and estimated
          occupancy.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {/* CURRENT */}

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <p
              style={{
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Current Frequency
            </p>

            <h2
              style={{
                margin: 0,
                color: "#123b68",
              }}
            >
              Every {currentFrequency} Minutes
            </h2>

            <small>
              12 trains/hour
            </small>
          </div>

          {/* RECOMMENDED */}

          <div
            style={{
              padding: "20px",
              background: "#eff6ff",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
            }}
          >
            <p
              style={{
                color: "#1e40af",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              AI Recommended
            </p>

            <h2
              style={{
                margin: 0,
                color: "#123b68",
              }}
            >
              Every {recommendedFrequency} Minutes
            </h2>

            <small>
              Approximately{" "}
              {Math.round(
                60 / recommendedFrequency
              )} trains/hour
            </small>
          </div>

          {/* STATUS */}

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <p
              style={{
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Operational Status
            </p>

            <h2
              style={{
                margin: 0,
                color: getStatusColor(),
              }}
            >
              {status}
            </h2>

            <small>
              Based on AI forecast
            </small>
          </div>
        </div>
      </div>

      {/* =====================================
          AI RECOMMENDATION
      ===================================== */}

      <div
        className="card"
        style={{
          padding: "25px",
          marginBottom: "20px",
          background: "#f8fbff",
          border: "1px solid #bfdbfe",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#123b68",
          }}
        >
          💡 Recommended Operational Action
        </h2>

        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.7",
            color: "#334155",
          }}
        >
          {action}
        </p>
      </div>

      {/* =====================================
          PEAK HOURS
      ===================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        <div
          className="card"
          style={{ padding: "22px" }}
        >
          <h2>🌅 Morning Peak</h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            07:00 AM – 10:00 AM
          </p>

          <p>
            Higher passenger demand is expected
            during morning commuting hours.
          </p>
        </div>

        <div
          className="card"
          style={{ padding: "22px" }}
        >
          <h2>🌆 Evening Peak</h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            05:00 PM – 08:00 PM
          </p>

          <p>
            Monitor passenger flow and adjust
            service frequency when required.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Schedule;