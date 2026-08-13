import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/aiPages.css";

function EmergencyAnnouncement() {
  const [station, setStation] = useState("");
  const [incident, setIncident] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all stations from the existing backend API
  useEffect(() => {
    const loadStations = async () => {
      try {
        setStationsLoading(true);
        setError("");

        const response = await api.get("/prediction/stations");

        setStations(response.data.stations || []);
      } catch (error) {
        console.error("Error loading stations:", error);

        setError(
          "Unable to load metro stations. Please make sure the backend is running."
        );
      } finally {
        setStationsLoading(false);
      }
    };

    loadStations();
  }, []);

  const generateAnnouncement = async () => {
    if (!station || !incident) {
      setError("Please select a station and describe the incident.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnnouncement("");

      const response = await api.post("/announcements/generate", {
        station,
        incident,
        severity,
      });

      if (typeof response.data === "string") {
        setAnnouncement(response.data);
      } else if (response.data?.announcement) {
        setAnnouncement(response.data.announcement);
      } else if (response.data?.response) {
        setAnnouncement(response.data.response);
      } else {
        setAnnouncement(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error("Emergency announcement error:", error);

      const message =
        error.response?.data?.detail ||
        "Unable to generate the emergency announcement.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyAnnouncement = async () => {
    if (!announcement) return;

    try {
      await navigator.clipboard.writeText(announcement);
      alert("Announcement copied successfully.");
    } catch (error) {
      console.error("Copy error:", error);
      setError("Unable to copy the announcement.");
    }
  };

  const clearFields = () => {
    setStation("");
    setIncident("");
    setSeverity("Medium");
    setAnnouncement("");
    setError("");
  };

  return (
    <div className="ai-page">

      {/* Header */}

      <div className="ai-header">
        <h2>🚨 AI Emergency Announcement</h2>

        <p>
          Generate professional emergency announcements for metro
          passengers using AI.
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

      {/* Form */}

      <div className="ai-card">

        <h3 className="section-title">
          Emergency Announcement Details
        </h3>

        {/* Station */}

        <div className="form-group">
          <label>Metro Station</label>

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

            {stations.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Incident */}

        <div className="form-group">
          <label>Emergency / Incident</label>

          <textarea
            rows={5}
            value={incident}
            onChange={(e) => {
              setIncident(e.target.value);
              setError("");
            }}
            placeholder="Describe the emergency or incident..."
          />
        </div>

        {/* Severity */}

        <div className="form-group">
          <label>Severity Level</label>

          <select
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value);
              setError("");
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Generate Button */}

        <button
          className="primary-btn"
          onClick={generateAnnouncement}
          disabled={loading || stationsLoading}
          style={{
            opacity:
              loading || stationsLoading ? 0.7 : 1,
            cursor:
              loading || stationsLoading
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading
            ? "🤖 Generating Announcement..."
            : "🤖 Generate AI Announcement"}
        </button>

      </div>

      {/* Generated Result */}

      {announcement && (
        <div className="ai-card">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <div>

              <h3
                className="section-title"
                style={{ marginBottom: "8px" }}
              >
                📢 Generated Announcement
              </h3>

              <div className="info-row">

                <span className="chip">
                  📍 {station}
                </span>

                <span className="chip">
                  ⚠️ {severity} Severity
                </span>

              </div>

            </div>
          </div>

          {/* Announcement */}

          <div className="result-box">
            {announcement}
          </div>

          {/* Buttons */}

          <div className="action-buttons">

            <button
              className="copy-btn"
              onClick={copyAnnouncement}
            >
              📋 Copy
            </button>

            <button
              className="clear-btn"
              onClick={clearFields}
            >
              🗑 Clear
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default EmergencyAnnouncement;