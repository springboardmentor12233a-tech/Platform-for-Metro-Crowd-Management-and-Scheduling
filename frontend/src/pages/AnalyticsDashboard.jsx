import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/aiPages.css";

function AnalyticsDashboard() {
  const [station, setStation] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [averageWaitTime, setAverageWaitTime] = useState("");
  const [alertsGenerated, setAlertsGenerated] = useState("");
  const [scheduleDelays, setScheduleDelays] = useState("");

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load complete station list
  useEffect(() => {
    const loadStations = async () => {
      try {
        setStationsLoading(true);
        setError("");

        const res = await api.get("/prediction/stations");

        setStations(res.data.stations || []);
      } catch (err) {
        console.error("Error loading stations:", err);

        setError(
          "Unable to load metro stations. Please make sure the backend is running."
        );
      } finally {
        setStationsLoading(false);
      }
    };

    loadStations();
  }, []);

  const generateReport = async () => {
    if (
      !station ||
      !passengerCount ||
      !averageWaitTime ||
      !alertsGenerated ||
      !scheduleDelays
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setReport("");
      setError("");

      const res = await api.post("/analytics/generate", {
        station,
        passenger_count: Number(passengerCount),
        average_wait_time: Number(averageWaitTime),
        alerts_generated: Number(alertsGenerated),
        schedule_delays: Number(scheduleDelays),
      });

      setReport(res.data.analytics_report);
    } catch (err) {
      console.error("Analytics error:", err);

      const message =
        err.response?.data?.detail ||
        "Failed to generate analytics.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyReport = async () => {
    if (!report) return;

    try {
      await navigator.clipboard.writeText(report);
      alert("Copied Successfully");
    } catch (err) {
      console.error(err);
      setError("Unable to copy report.");
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${station}_Analytics_Report.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setStation("");
    setPassengerCount("");
    setAverageWaitTime("");
    setAlertsGenerated("");
    setScheduleDelays("");
    setReport("");
    setError("");
  };

  return (
    <div className="ai-page">

      <div className="ai-header">

        <h2>📊 AI Analytics Dashboard</h2>

        <p>
          Generate AI-powered metro analytics and recommendations.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            border: "1px solid #ffcdd2",
            padding: "12px 15px",
            borderRadius: "9px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Dashboard Cards */}

      <div className="dashboard-cards">

        <div className="stat-card">
          <h3>👥 Passengers</h3>
          <p>{passengerCount || "--"}</p>
        </div>

        <div className="stat-card">
          <h3>⏱ Wait Time</h3>
          <p>{averageWaitTime || "--"} mins</p>
        </div>

        <div className="stat-card">
          <h3>🚨 Alerts</h3>
          <p>{alertsGenerated || "--"}</p>
        </div>

        <div className="stat-card">
          <h3>🚆 Delays</h3>
          <p>{scheduleDelays || "--"}</p>
        </div>

      </div>

      {/* Analytics Form */}

      <div className="ai-card">

        <h3 className="section-title">
          Today's Metro Analytics
        </h3>

        {/* Station */}

        <div className="form-group">

          <label>Station</label>

          <select
            value={station}
            onChange={(e) => {
              setStation(e.target.value);
              setError("");
            }}
            disabled={stationsLoading}
          >
            <option value="">
              {stationsLoading
                ? "Loading stations..."
                : "Select Station"}
            </option>

            {stations.map((s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>

        </div>

        {/* Passenger Count */}

        <div className="form-group">

          <label>Passenger Count</label>

          <input
            type="number"
            min="0"
            value={passengerCount}
            onChange={(e) => {
              setPassengerCount(e.target.value);
              setError("");
            }}
          />

        </div>

        {/* Average Wait Time */}

        <div className="form-group">

          <label>Average Wait Time</label>

          <input
            type="number"
            min="0"
            value={averageWaitTime}
            onChange={(e) => {
              setAverageWaitTime(e.target.value);
              setError("");
            }}
          />

        </div>

        {/* Alerts Generated */}

        <div className="form-group">

          <label>Alerts Generated</label>

          <input
            type="number"
            min="0"
            value={alertsGenerated}
            onChange={(e) => {
              setAlertsGenerated(e.target.value);
              setError("");
            }}
          />

        </div>

        {/* Schedule Delays */}

        <div className="form-group">

          <label>Schedule Delays</label>

          <input
            type="number"
            min="0"
            value={scheduleDelays}
            onChange={(e) => {
              setScheduleDelays(e.target.value);
              setError("");
            }}
          />

        </div>

        {/* Generate Button */}

        <button
          className="primary-btn"
          onClick={generateReport}
          disabled={loading || stationsLoading}
        >
          {loading
            ? "Generating..."
            : "🤖 Generate Analytics Report"}
        </button>

      </div>

      {/* Report */}

      {report && (

        <div className="ai-card">

          <h3 className="section-title">
            🤖 MetroFlow AI Analytics Report
          </h3>

          <div className="info-row">

            <span className="chip">
              📍 {station}
            </span>

            <span className="chip">
              👥 {passengerCount}
            </span>

            <span className="chip">
              ⏱ {averageWaitTime} mins
            </span>

            <span className="chip">
              🚨 {alertsGenerated}
            </span>

          </div>

          <div className="result-box">
            {report}
          </div>

          <div className="action-buttons">

            <button
              className="copy-btn"
              onClick={copyReport}
            >
              📋 Copy
            </button>

            <button
              className="download-btn"
              onClick={downloadReport}
            >
              💾 Download
            </button>

            <button
              className="clear-btn"
              onClick={clearData}
            >
              🗑 Clear
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AnalyticsDashboard;