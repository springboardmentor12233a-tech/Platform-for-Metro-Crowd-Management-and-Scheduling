import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/aiPages.css";

function CongestionHeatmap() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations();

    const interval = setInterval(() => {
      fetchStations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStations = async () => {
    try {
      setError("");

      const res = await api.get("/data/heatmap");

      const records = res.data.records || [];

      const formattedStations = records.map((item, index) => ({
        id: index + 1,
        station: item.station,
        line: item.line || "Unknown",
        passengers: Math.round(item.passenger_demand || 0),
        crowd_level: item.crowd_level || "Unknown",
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      setStations(formattedStations);
    } catch (err) {
      console.error("Heatmap Error:", err);

      setError(
        "Unable to load metro congestion data. Please make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getColor = (level) => {
    switch (level) {
      case "Low":
        return "#22c55e";

      case "Medium":
        return "#eab308";

      case "High":
        return "#f97316";

      case "Critical":
        return "#ef4444";

      default:
        return "#94a3b8";
    }
  };

  return (
    <div className="ai-page">

      {/* Header */}

      <div className="ai-header">
        <h2>🗺 Metro Congestion Heatmap</h2>

        <p>
          Real-time crowd status across Delhi Metro stations.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
          }}
        >
          <h3>Loading congestion data...</h3>
          <p>
            Please wait while station crowd information is retrieved.
          </p>
        </div>
      ) : (

        <div className="heatmap-grid">

          {stations.length > 0 ? (

            stations.map((station) => (

              <div
                key={`${station.station}-${station.id}`}
                className="heatmap-card"
                style={{
                  borderTop: `8px solid ${getColor(
                    station.crowd_level
                  )}`,
                }}
              >

                {/* Station */}

                <h3>{station.station}</h3>

                {/* Line */}

                <p>
                  🚇 Line: {station.line}
                </p>

                {/* Passengers */}

                <p>
                  👥 Passengers:{" "}
                  {station.passengers.toLocaleString()}
                </p>

                {/* Crowd Level */}

                <p>
                  Crowd Level
                </p>

                <span
                  className="heat-badge"
                  style={{
                    background: getColor(
                      station.crowd_level
                    ),
                  }}
                >
                  {station.crowd_level}
                </span>

                {/* Coordinates */}

                {station.latitude && station.longitude && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginTop: "12px",
                    }}
                  >
                    📍 {Number(station.latitude).toFixed(5)},{" "}
                    {Number(station.longitude).toFixed(5)}
                  </p>
                )}

              </div>

            ))

          ) : (

            <div
              style={{
                textAlign: "center",
                padding: "40px",
                width: "100%",
              }}
            >
              <h3>No station data available</h3>
              <p>
                No congestion records were returned from the dataset service.
              </p>
            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default CongestionHeatmap;