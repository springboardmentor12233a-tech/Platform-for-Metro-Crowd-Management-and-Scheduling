import { useEffect, useState } from "react";
import { generateAlerts } from "../components/alertEngine";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();

    // Refresh alerts whenever the page becomes active
    const interval = setInterval(() => {
      loadAlerts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadAlerts = () => {
    try {
      const history = JSON.parse(
        localStorage.getItem("aiForecastHistory") || "[]"
      );

      if (history.length === 0) {
        setAlerts(generateAlerts(null));
        return;
      }

      // Latest AI forecast
      const latestForecast = history[0];

      const generatedAlerts =
        generateAlerts(latestForecast);

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error("Alert loading error:", error);

      setAlerts([
        {
          id: "system-error",
          level: "SYSTEM",
          title: "Alert System Error",
          station: "Metro Network",
          message:
            "Unable to load the latest AI forecast.",
          severity: "critical",
        },
      ]);
    }
  };

  const getAlertStyle = (severity) => {
    switch (severity) {
      case "critical":
        return {
          background: "#fef2f2",
          border: "#fecaca",
          accent: "#dc2626",
        };

      case "high":
        return {
          background: "#fff7ed",
          border: "#fed7aa",
          accent: "#ea580c",
        };

      case "moderate":
        return {
          background: "#fffbeb",
          border: "#fde68a",
          accent: "#d97706",
        };

      default:
        return {
          background: "#f0fdf4",
          border: "#bbf7d0",
          accent: "#16a34a",
        };
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case "critical":
        return "🔴";

      case "high":
        return "🟠";

      case "moderate":
        return "🟡";

      default:
        return "🟢";
    }
  };

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  const highCount = alerts.filter(
    (alert) => alert.severity === "high"
  ).length;

  return (
    <div
      style={{
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <div style={{ marginBottom: "25px" }}>
        <h1
          style={{
            marginBottom: "8px",
            color: "#123b68",
          }}
        >
          🔔 Notifications & Alerts
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          AI-generated operational alerts based on
          passenger demand, crowd conditions, risk
          levels and scheduling recommendations.
        </p>
      </div>

      {/* SUMMARY */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "25px",
        }}
      >
        <div
          className="card"
          style={{
            padding: "22px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            Total Alerts
          </p>

          <h1
            style={{
              margin: 0,
              color: "#123b68",
            }}
          >
            {alerts.length}
          </h1>
        </div>

        <div
          className="card"
          style={{
            padding: "22px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            Critical Alerts
          </p>

          <h1
            style={{
              margin: 0,
              color: "#dc2626",
            }}
          >
            {criticalCount}
          </h1>
        </div>

        <div
          className="card"
          style={{
            padding: "22px",
          }}
        >
          <p style={{ color: "#64748b" }}>
            High Priority
          </p>

          <h1
            style={{
              margin: 0,
              color: "#ea580c",
            }}
          >
            {highCount}
          </h1>
        </div>
      </div>

      {/* ALERT LIST */}

      <div
        className="card"
        style={{
          padding: "25px",
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
              Active Notifications
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              Latest alerts generated from MetroFlow
              AI predictions.
            </p>
          </div>

          <button
            onClick={loadAlerts}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#123b68",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Refresh Alerts
          </button>
        </div>

        {alerts.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No active alerts.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {alerts.map((alert) => {
              const style = getAlertStyle(
                alert.severity
              );

              return (
                <div
                  key={alert.id}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: style.background,
                    border: `1px solid ${style.border}`,
                    borderLeft:
                      `5px solid ${style.accent}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "15px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#123b68",
                        }}
                      >
                        {getIcon(alert.severity)}{" "}
                        {alert.title}
                      </h3>

                      <p
                        style={{
                          margin:
                            "6px 0 10px",
                          color: "#64748b",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {alert.station}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          color: "#334155",
                          lineHeight: "1.6",
                        }}
                      >
                        {alert.message}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "20px",
                        background:
                          style.background,
                        border:
                          `1px solid ${style.border}`,
                        color:
                          style.accent,
                        fontSize: "11px",
                        fontWeight: "800",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {alert.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INFORMATION */}

      <div
        className="card"
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#f8fbff",
          border: "1px solid #bfdbfe",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#123b68",
          }}
        >
          🤖 How MetroFlow Generates Alerts
        </h3>

        <p
          style={{
            color: "#475569",
            lineHeight: "1.7",
          }}
        >
          MetroFlow evaluates the latest AI passenger
          demand forecast, estimated occupancy, crowd
          level, operational risk and peak-period
          indicators. These conditions are converted
          into operational notifications for metro
          monitoring and decision support.
        </p>
      </div>
    </div>
  );
}

export default Alerts;