import { useEffect, useState } from "react";
import api from "../services/api";
import "../components/AI/AIStyles.css";
import AILayout from "../components/AI/AILayout";

function ScheduleUpdates() {
  const [station, setStation] = useState("");
  const [line, setLine] = useState("");
  const [delay, setDelay] = useState("");
  const [reason, setReason] = useState("");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState("");

  const metroLines = [
    "Blue Line",
    "Red Line",
    "Green Line",
    "Yellow Line",
    "Orange Line",
    "Violet Line",
    "Magenta Line",
    "Pink Line",
    "Grey Line",
    "Rapid Metro",
  ];

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

  const generateScheduleUpdate = async () => {
    if (!station || !line || !delay || !reason) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      setError("");

      const res = await api.post("/schedule-updates/generate", {
        station,
        line,
        delay: Number(delay),
        reason,
      });

      console.log("Schedule Update Response:", res.data);

      if (res.data.success) {
        setResponse(res.data.schedule_update);
      } else {
        setError("Unable to generate schedule update.");
      }
    } catch (err) {
      console.error("Schedule update error:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to connect to server.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyUpdate = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      alert("Schedule update copied successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to copy schedule update.");
    }
  };

  const clearAll = () => {
    setStation("");
    setLine("");
    setDelay("");
    setReason("");
    setResponse("");
    setError("");
  };

  return (
    <AILayout
      title="🚆 AI Schedule Update Generator"
      subtitle="Generate intelligent passenger announcements using Groq Llama 3.3"
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

        {/* Metro Station */}

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

        {/* Metro Line */}

        <div className="ai-group">
          <label>Metro Line</label>

          <select
            value={line}
            onChange={(e) => {
              setLine(e.target.value);
              setError("");
            }}
          >
            <option value="">Select Line</option>

            {metroLines.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Delay */}

        <div className="ai-group">
          <label>Delay (Minutes)</label>

          <input
            type="number"
            min="1"
            placeholder="Enter delay in minutes"
            value={delay}
            onChange={(e) => {
              setDelay(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Reason */}

        <div className="ai-group">
          <label>Reason</label>

          <input
            type="text"
            placeholder="Ex: Heavy Passenger Crowd"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Generate */}

        <div className="ai-full">
          <button
            className="generate-btn"
            onClick={generateScheduleUpdate}
            disabled={loading || stationsLoading}
          >
            {loading
              ? "Generating Schedule Update..."
              : "🤖 Generate Schedule Update"}
          </button>
        </div>

      </div>

      {/* Response */}

      {response && (
        <div className="response-card">

          <h2>🚆 AI Generated Schedule Update</h2>

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
              onClick={copyUpdate}
            >
              📋 Copy Update
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
            <strong>Groq • Llama 3.3 70B</strong>
          </div>

        </div>
      )}

    </AILayout>
  );
}

export default ScheduleUpdates;