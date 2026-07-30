import { useState } from "react";
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

  const metroLines = [
    "Blue Line",
    "Red Line",
    "Green Line",
    "Orange Line",
  ];

  const generateScheduleUpdate = async () => {
    if (!station || !line || !delay || !reason) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
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
        setResponse("Unable to generate schedule update.");
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

  const copyUpdate = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      alert("Schedule update copied successfully.");
    } catch {
      alert("Unable to copy schedule update.");
    }
  };

  const clearAll = () => {
    setStation("");
    setLine("");
    setDelay("");
    setReason("");
    setResponse("");
  };

  return (
    <AILayout
      title="🚆 AI Schedule Update Generator"
      subtitle="Generate intelligent passenger announcements using Groq Llama 3.3"
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
          <label>Metro Line</label>

          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
          >
            <option value="">Select Line</option>

            {metroLines.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="ai-group">
          <label>Delay (Minutes)</label>

          <input
            type="number"
            placeholder="Enter delay in minutes"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          />
        </div>

        <div className="ai-group">
          <label>Reason</label>

          <input
            type="text"
            placeholder="Ex: Heavy Passenger Crowd"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="ai-full">
          <button
            className="generate-btn"
            onClick={generateScheduleUpdate}
            disabled={loading}
          >
            {loading
              ? "Generating Schedule Update..."
              : "🤖 Generate Schedule Update"}
          </button>
        </div>

      </div>

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
            🤖 Generated using <strong>Groq • Llama 3.3 70B</strong>
          </div>

        </div>
      )}

    </AILayout>
  );
}

export default ScheduleUpdates;