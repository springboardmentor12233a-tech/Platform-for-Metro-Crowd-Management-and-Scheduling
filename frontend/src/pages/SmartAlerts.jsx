import { useEffect, useState } from "react";
import api from "../services/api";
import "../components/AI/AIStyles.css";
import AILayout from "../components/AI/AILayout";

function SmartAlerts() {
  const [station, setStation] = useState("");
  const [passengers, setPassengers] = useState("");
  const [capacity, setCapacity] = useState("");
  const [crowd, setCrowd] = useState("Medium");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load full station list from existing backend API
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

  const generateAlert = async () => {
    if (!station || !passengers || !capacity) {
      setError("Please fill all the fields.");
      return;
    }

    if (Number(passengers) < 0 || Number(capacity) <= 0) {
      setError("Please enter valid passenger and capacity values.");
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      setError("");

      const res = await api.post("/alerts/generate", {
        station: station,
        passengers: Number(passengers),
        capacity: Number(capacity),
        crowd: crowd,
      });

      console.log("Smart Alert Response:", res.data);

      if (res.data.success) {
        setResponse(res.data.alert);
      } else {
        setError("Unable to generate smart alert.");
      }
    } catch (err) {
      console.error("Smart alert error:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to connect to the server.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyAlert = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      alert("Alert copied successfully.");
    } catch (err) {
      console.error("Copy error:", err);
      setError("Unable to copy alert.");
    }
  };

  const clearAll = () => {
    setStation("");
    setPassengers("");
    setCapacity("");
    setCrowd("Medium");
    setResponse("");
    setError("");
  };

  return (
    <AILayout
      title="🚨 AI Smart Alert Generator"
      subtitle="Generate intelligent metro alerts using Groq Llama 3.3"
    >

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

      <div className="ai-form">

        {/* Station */}

        <div className="ai-group">
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

        {/* Crowd Level */}

        <div className="ai-group">
          <label>Crowd Level</label>

          <select
            value={crowd}
            onChange={(e) => {
              setCrowd(e.target.value);
              setError("");
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Passenger Count */}

        <div className="ai-group">
          <label>Passenger Count</label>

          <input
            type="number"
            min="0"
            placeholder="Enter passenger count"
            value={passengers}
            onChange={(e) => {
              setPassengers(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Station Capacity */}

        <div className="ai-group">
          <label>Station Capacity</label>

          <input
            type="number"
            min="1"
            placeholder="Enter station capacity"
            value={capacity}
            onChange={(e) => {
              setCapacity(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Generate Button */}

        <div className="ai-full">

          <button
            className="generate-btn"
            onClick={generateAlert}
            disabled={loading || stationsLoading}
          >
            {loading
              ? "Generating Smart Alert..."
              : "🤖 Generate Smart Alert"}
          </button>

        </div>

      </div>

      {/* AI Response */}

      {response && (
        <div className="response-card">

          <h2>
            🤖 AI Generated Smart Alert
          </h2>

          <textarea
            rows={12}
            value={response}
            readOnly
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "8px",
              resize: "none",
              border: "1px solid #ddd",
              background: "#ffffff",
              lineHeight: "1.6",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <div className="response-buttons">

            <button
              className="copy-btn"
              onClick={copyAlert}
            >
              📋 Copy Alert
            </button>

            <button
              className="clear-btn"
              onClick={clearAll}
            >
              🗑 Clear
            </button>

          </div>

          <div className="ai-footer">
            🤖 Generated using{" "}
            <strong>Groq Llama 3.3 70B</strong>
          </div>

        </div>
      )}

    </AILayout>
  );
}

export default SmartAlerts;