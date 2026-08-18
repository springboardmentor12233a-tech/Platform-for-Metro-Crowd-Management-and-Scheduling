import { useEffect, useMemo, useState } from "react";

function Schedule() {
  const [forecast, setForecast] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // =========================================
  // LOAD LATEST AI FORECAST
  // =========================================

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = () => {
    try {
      const history = JSON.parse(
        localStorage.getItem("aiForecastHistory") || "[]"
      );

      if (history.length > 0) {
        // Use the latest forecast
        setForecast(history[0]);
      } else {
        setForecast(null);
      }
    } catch (error) {
      console.error("Unable to load AI forecast:", error);
      setForecast(null);
    }
  };

  // =========================================
  // FORECAST DATA
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

  const peakPeriod =
    forecast?.peak_period ?? false;

  // =========================================
  // SCHEDULING DECISION
  // =========================================

  const schedulingDecision = useMemo(() => {
    let currentFrequency = 5;
    let recommendedFrequency = 5;
    let status = "Maintain Service";
    let action =
      "Current train frequency is sufficient for expected demand.";

    if (
      occupancy > 85 ||
      riskLevel.toLowerCase() === "high"
    ) {
      recommendedFrequency = 3;
      status = "Critical Service Increase";
      action =
        "Very high passenger demand detected. Increase service frequency and activate crowd-management measures.";
    } else if (occupancy > 70) {
      recommendedFrequency = 4;
      status = "Increase Service";
      action =
        "High passenger demand detected. Increase train frequency during the forecast period.";
    } else if (occupancy >= 40) {
      recommendedFrequency = 5;
      status = "Monitor Demand";
      action =
        "Passenger demand is manageable. Maintain normal service and monitor crowd conditions.";
    } else {
      recommendedFrequency = 7;
      status = "Normal Operation";
      action =
        "Low passenger demand detected. A wider headway can be maintained while monitoring demand.";
    }

    return {
      currentFrequency,
      recommendedFrequency,
      status,
      action,
    };
  }, [occupancy, riskLevel]);

  const {
    currentFrequency,
    recommendedFrequency,
    status,
    action,
  } = schedulingDecision;

  // =========================================
  // FREQUENCY CALCULATION
  // =========================================

  const trainsPerHour = Math.round(
    60 / recommendedFrequency
  );

  const currentTrainsPerHour = Math.round(
    60 / currentFrequency
  );

  // =========================================
  // STATUS COLOR
  // =========================================

  const getStatusColor = () => {
    if (status === "Critical Service Increase") {
      return "#b91c1c";
    }

    if (status === "Increase Service") {
      return "#d32f2f";
    }

    if (status === "Monitor Demand") {
      return "#f57c00";
    }

    return "#2e7d32";
  };

  // =========================================
  // TIME UTILITIES
  // =========================================

  const convertToMinutes = (timeString) => {
    if (!timeString || !timeString.includes(":")) {
      return null;
    }

    const parts = timeString.split(":");

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return null;
    }

    return hours * 60 + minutes;
  };

  const formatTime = (totalMinutes) => {
    const minutesInDay = 24 * 60;

    const normalized =
      ((totalMinutes % minutesInDay) + minutesInDay) %
      minutesInDay;

    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;

    const period = hours >= 12 ? "PM" : "AM";

    const displayHour =
      hours % 12 === 0 ? 12 : hours % 12;

    return `${String(displayHour).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")} ${period}`;
  };

  // =========================================
  // GENERATE TRAIN SCHEDULE
  // =========================================

  const generateSchedule = () => {
    if (!forecast) {
      setSchedule([]);
      return;
    }

    const startMinutes =
      convertToMinutes(forecastTime);

    if (startMinutes === null) {
      console.warn(
        "Invalid forecast time. Schedule cannot be generated."
      );
      setSchedule([]);
      return;
    }

    const generatedSchedule = [];

    // Generate a one-hour operational schedule
    for (
      let minuteOffset = 0;
      minuteOffset < 60;
      minuteOffset += recommendedFrequency
    ) {
      const trainNumber =
        101 + generatedSchedule.length;

      const arrivalMinutes =
        startMinutes + minuteOffset;

      const departureMinutes =
        arrivalMinutes + 1;

      generatedSchedule.push({
        trainId: `MF-${trainNumber}`,
        station,
        arrival: formatTime(arrivalMinutes),
        departure: formatTime(departureMinutes),
        headway: `${recommendedFrequency} min`,
        demand: crowdLevel,
        occupancy: occupancy,
        status:
          occupancy > 85
            ? "Priority"
            : occupancy > 70
            ? "Increased Service"
            : "Scheduled",
      });
    }

    setSchedule(generatedSchedule);
  };

  // Generate schedule whenever forecast changes
  useEffect(() => {
    generateSchedule();
  }, [
    forecast,
    recommendedFrequency,
    forecastTime,
    station,
    crowdLevel,
    occupancy,
  ]);

  // =========================================
  // NO FORECAST
  // =========================================

  if (!forecast) {
    return (
      <div style={{ padding: "10px" }}>
        <div style={{ marginBottom: "25px" }}>
          <h1
            style={{
              marginBottom: "8px",
              color: "#123b68",
            }}
          >
             AI Train Scheduling
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

        <div
          className="card"
          style={{
            padding: "30px",
            borderLeft: "5px solid #1976d2",
          }}
        >
          <h2> No AI Forecast Available</h2>

          <p style={{ color: "#64748b" }}>
            Run an AI Passenger Demand Forecast from
            the AI Prediction page first.
          </p>

          <button
            onClick={loadForecast}
            style={{
              marginTop: "15px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🔄 Refresh Forecast
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN PAGE
  // =========================================

  return (
    <div style={{ padding: "10px" }}>
      {/* HEADER */}

      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: "8px",
              color: "#123b68",
            }}
          >
             AI Train Scheduling
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "15px",
              margin: 0,
            }}
          >
            AI-powered train frequency and timetable
            recommendations based on passenger demand.
          </p>
        </div>

        <button
          onClick={loadForecast}
          style={{
            padding: "11px 18px",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            background: "#eff6ff",
            color: "#1d4ed8",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🔄 Refresh AI Forecast
        </button>
      </div>

      {/* FORECAST SUMMARY */}

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

          <small>AI forecast</small>
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

      {/* SCHEDULING DECISION */}

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
           AI Scheduling Decision
        </h2>

        <p style={{ color: "#64748b" }}>
          The scheduling engine converts the AI
          passenger-demand forecast into a recommended
          service frequency.
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
              Approximately {currentTrainsPerHour} trains/hour
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
              Approximately {trainsPerHour} trains/hour
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

      {/* OPERATIONAL ACTION */}

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
           Recommended Operational Action
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

        <div
          style={{
            marginTop: "15px",
            padding: "12px 15px",
            background: "#ffffff",
            borderRadius: "8px",
            color: "#475569",
            fontSize: "14px",
          }}
        >
          <strong>Planning window:</strong> 60 minutes
          starting from the forecast time.
        </div>
      </div>

      {/* GENERATED TRAIN SCHEDULE */}

      <div
        className="card"
        style={{
          padding: "25px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#123b68",
              }}
            >
               Generated Train Schedule
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: 0,
              }}
            >
              Recommended timetable for {station}
            </p>
          </div>

          <div
            style={{
              padding: "10px 15px",
              background: "#eff6ff",
              borderRadius: "8px",
              color: "#1e40af",
              fontWeight: "600",
            }}
          >
            {schedule.length} trains / hour
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "750px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f1f5f9",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "14px" }}>
                  Train ID
                </th>

                <th style={{ padding: "14px" }}>
                  Station
                </th>

                <th style={{ padding: "14px" }}>
                  Arrival
                </th>

                <th style={{ padding: "14px" }}>
                  Departure
                </th>

                <th style={{ padding: "14px" }}>
                  Headway
                </th>

                <th style={{ padding: "14px" }}>
                  Demand
                </th>

                <th style={{ padding: "14px" }}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {schedule.map((train) => (
                <tr
                  key={train.trainId}
                  style={{
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "700",
                      color: "#123b68",
                    }}
                  >
                    {train.trainId}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {train.station}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {train.arrival}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {train.departure}
                  </td>

                  <td style={{ padding: "14px" }}>
                    {train.headway}
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background:
                          train.demand === "High"
                            ? "#fee2e2"
                            : train.demand === "Medium"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          train.demand === "High"
                            ? "#b91c1c"
                            : train.demand === "Medium"
                            ? "#b45309"
                            : "#166534",
                      }}
                    >
                      {train.demand}
                    </span>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background:
                          train.status === "Priority"
                            ? "#fee2e2"
                            : train.status ===
                              "Increased Service"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          train.status === "Priority"
                            ? "#b91c1c"
                            : train.status ===
                              "Increased Service"
                            ? "#b45309"
                            : "#166534",
                      }}
                    >
                      {train.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PEAK HOURS */}

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
          <h2> Morning Peak</h2>

          <p style={{ color: "#64748b" }}>
            07:00 AM – 10:00 AM
          </p>

          <p>
            Higher passenger demand is expected during
            morning commuting hours. MetroFlow can
            recommend increased service frequency when
            predicted occupancy rises.
          </p>
        </div>

        <div
          className="card"
          style={{ padding: "22px" }}
        >
          <h2> Evening Peak</h2>

          <p style={{ color: "#64748b" }}>
            05:00 PM – 08:00 PM
          </p>

          <p>
            Passenger flow should be monitored and
            service frequency adjusted according to
            predicted demand.
          </p>
        </div>
      </div>

      {/* DISCLAIMER */}

      <div
        style={{
          marginTop: "20px",
          padding: "14px 18px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "10px",
          color: "#9a3412",
          fontSize: "13px",
        }}
      >
        <strong>Decision-support notice:</strong>{" "}
        MetroFlow provides AI-assisted scheduling
        recommendations based on predicted passenger
        demand. It does not directly control real-world
        train operations.
      </div>
    </div>
  );
}

export default Schedule;