import { useState } from "react";
import api from "../services/api";

function EmergencyAnnouncement() {
  const [station, setStation] = useState("");
  const [incident, setIncident] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);

  const stations = [
    "Ameerpet",
    "Miyapur",
    "Secunderabad",
    "LB Nagar",
    "Raidurg",
    "Nagole",
    "Kukatpally",
    "Uppal",
    "Madhapur",
  ];

  const generateAnnouncement = async () => {
    if (!station || !incident) {
      alert("Please fill all the fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/announcements/generate", {
        station,
        incident,
        severity,
      });

      // Backend returns plain text
      if (typeof response.data === "string") {
        setAnnouncement(response.data);
      }
      // Backend returns { announcement: "..." }
      else if (response.data.announcement) {
        setAnnouncement(response.data.announcement);
      }
      // Backend returns { response: "..." }
      else if (response.data.response) {
        setAnnouncement(response.data.response);
      } else {
        setAnnouncement(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail || "Server Error");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyAnnouncement = async () => {
    try {
      await navigator.clipboard.writeText(announcement);
      alert("Announcement copied successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  const clearFields = () => {
    setStation("");
    setIncident("");
    setSeverity("Medium");
    setAnnouncement("");
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#1565C0" }}>
        🚇 AI Emergency Announcement Generator
      </h1>

      <div
        style={{
          background: "#fff",
          marginTop: "25px",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          maxWidth: "800px",
        }}
      >
        <label>
          <strong>Station</strong>
        </label>

        <select
          value={station}
          onChange={(e) => setStation(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        >
          <option value="">Select Station</option>

          {stations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label>
          <strong>Incident</strong>
        </label>

        <textarea
          rows={4}
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
          placeholder="Describe the emergency..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        <label>
          <strong>Severity</strong>
        </label>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          onClick={generateAnnouncement}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#1976D2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading
            ? "Generating Announcement..."
            : "Generate AI Announcement"}
        </button>

        {announcement && (
          <>
            <h2
              style={{
                marginTop: "30px",
                color: "#1565C0",
              }}
            >
              📢 Generated Announcement
            </h2>

            <textarea
              readOnly
              rows={8}
              value={announcement}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                background: "#fafafa",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={copyAnnouncement}
                style={{
                  padding: "10px 18px",
                  background: "#2E7D32",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                📋 Copy
              </button>

              <button
                onClick={clearFields}
                style={{
                  padding: "10px 18px",
                  background: "#E53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑 Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmergencyAnnouncement;