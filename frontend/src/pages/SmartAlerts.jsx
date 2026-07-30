import { useState } from "react";
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

  const stations = [
    "Visakhapatnam",
    "Rajiv Chowk",
    "Ameerpet",
    "Miyapur",
    "Secunderabad",
    "LB Nagar",
    "Raidurg",
    "Nagole",
  ];

  const generateAlert = async () => {
    if (!station || !passengers || !capacity) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
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
        setResponse("Unable to generate smart alert.");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        alert(
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data, null, 2)
        );
      } else {
        alert("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyAlert = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      alert("Alert copied successfully.");
    } catch {
      alert("Unable to copy alert.");
    }
  };

  const clearAll = () => {
    setStation("");
    setPassengers("");
    setCapacity("");
    setCrowd("Medium");
    setResponse("");
  };

  return (
    <AILayout
      title="🚨 AI Smart Alert Generator"
      subtitle="Generate intelligent metro alerts using Groq Llama 3.3"
    >
      <div className="ai-form">

        <div className="ai-group">
          <label>Metro Station</label>

          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="">Select Station</option>

            {stations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="ai-group">
          <label>Crowd Level</label>

          <select
            value={crowd}
            onChange={(e) => setCrowd(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="ai-group">
          <label>Passenger Count</label>

          <input
            type="number"
            placeholder="Enter passenger count"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
          />
        </div>

        <div className="ai-group">
          <label>Station Capacity</label>

          <input
            type="number"
            placeholder="Enter station capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>

        <div className="ai-full">
          <button
            className="generate-btn"
            onClick={generateAlert}
            disabled={loading}
          >
            {loading
              ? "Generating Smart Alert..."
              : "🤖 Generate Smart Alert"}
          </button>
        </div>
      </div>

      {response && (
        <div className="response-card">

          <h2>🤖 AI Generated Smart Alert</h2>

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
            }}
          />          <div className="response-buttons">

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
            🤖 Generated using <strong>Groq Llama 3.3 70B</strong>
          </div>

        </div>
      )}

    </AILayout>
  );
}

export default SmartAlerts;