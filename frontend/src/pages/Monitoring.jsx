import { useEffect, useState } from "react";
import {
  getLiveSnapshot,
  getLiveStatus,
} from "../services/realtimeApi";

import "../styles/Monitoring.css";

function Monitoring() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");
  const [isLive, setIsLive] = useState(false);

  // ============================================================
  // LOAD STATION DATA
  // ============================================================

  const loadStations = async () => {
    try {
      setError("");

      const response = await getLiveSnapshot(50);

      const records = response.data.records || [];

      const formattedStations = records.map((item, index) => ({
        id: index + 1,
        station_name: item.station || "Unknown Station",
        passenger_count: Math.round(item.passenger_demand || 0),
        crowd_level: item.crowd_level || "Unknown",
        timestamp: response.data.timestamp,
        line: item.line || "Unknown",
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      setStations(formattedStations);

      setLastUpdated(new Date().toLocaleString());
      setIsLive(true);
    } catch (error) {
      console.error("Error fetching dataset crowd data:", error);

      setIsLive(false);

      setError(
        "Unable to connect to the dataset service. Please make sure the FastAPI dataset server is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD DATASET STATUS
  // ============================================================

  const loadStatus = async () => {
    try {
      await getLiveStatus();
    } catch (error) {
      console.error("Error fetching dataset status:", error);
    }
  };

  // ============================================================
  // AUTO REFRESH
  // ============================================================

  useEffect(() => {
    loadStations();
    loadStatus();

    const interval = setInterval(() => {
      loadStations();
      loadStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredStations = stations.filter((station) => {
    const stationName = String(
      station.station_name || ""
    ).toLowerCase();

    const searchMatch = stationName.includes(
      search.toLowerCase()
    );

    const filterMatch =
      filter === "All"
        ? true
        : String(station.crowd_level || "").toLowerCase() ===
          filter.toLowerCase();

    return searchMatch && filterMatch;
  });

  // ============================================================
  // SUMMARY
  // ============================================================

  const totalStations = stations.length;

  const high = stations.filter(
    (s) => s.crowd_level === "High"
  ).length;

  const medium = stations.filter(
    (s) => s.crowd_level === "Medium"
  ).length;

  const low = stations.filter(
    (s) => s.crowd_level === "Low"
  ).length;

  const totalPassengers = stations.reduce(
    (total, station) =>
      total + Number(station.passenger_count || 0),
    0
  );

  // ============================================================
  // CROWD BADGE
  // ============================================================

  const getCrowdBadge = (level) => {
    if (level === "High") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 10px",
            borderRadius: "15px",
            background: "#ffebee",
            color: "#c62828",
            fontSize: "10px",
            fontWeight: "800",
          }}
        >
          🔴 High
        </span>
      );
    }

    if (level === "Medium") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 10px",
            borderRadius: "15px",
            background: "#fff3e0",
            color: "#ef6c00",
            fontSize: "10px",
            fontWeight: "800",
          }}
        >
          🟠 Medium
        </span>
      );
    }

    if (level === "Low") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 10px",
            borderRadius: "15px",
            background: "#e8f5e9",
            color: "#2e7d32",
            fontSize: "10px",
            fontWeight: "800",
          }}
        >
          🟢 Low
        </span>
      );
    }

    return (
      <span
        style={{
          padding: "6px 10px",
          borderRadius: "15px",
          background: "#f5f5f5",
          color: "#757575",
          fontSize: "10px",
          fontWeight: "700",
        }}
      >
        Unknown
      </span>
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="monitoring-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        <div>
          <span
            style={{
              color: "#1976d2",
              fontSize: "10px",
              fontWeight: "800",
              letterSpacing: "1.5px",
            }}
          >
            METRO OPERATIONS
          </span>

          <h1 style={{ marginBottom: "5px" }}>
            🚇 Metro Crowd Monitoring
          </h1>

          <p
            style={{
              color: "#718096",
              marginTop: 0,
              fontSize: "13px",
            }}
          >
            Monitor station crowd conditions and passenger demand
            in real time.
          </p>
        </div>

        {/* LIVE STATUS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isLive ? "#e8f5e9" : "#ffebee",
            color: isLive ? "#2e7d32" : "#c62828",
            padding: "9px 15px",
            borderRadius: "20px",
            fontWeight: "800",
            fontSize: "11px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isLive ? "#2dbb6f" : "#e53935",
            }}
          />

          {isLive ? "LIVE MONITORING" : "OFFLINE"}
        </div>
      </div>

      {/* ======================================================
          MONITORING INFO
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "#f5f9ff",
          border: "1px solid #dce8f7",
          padding: "12px 18px",
          borderRadius: "8px",
          margin: "15px 0",
          color: "#52647d",
          fontSize: "11px",
        }}
      >
        <span>
          <strong>🔄 Auto Refresh:</strong> Every 5 seconds
        </span>

        <span>
          <strong>📍 Stations:</strong> {totalStations}
        </span>

        <span>
          <strong>👥 Passengers:</strong>{" "}
          {totalPassengers.toLocaleString()}
        </span>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "12px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="summary-cards">

        <div className="card">
          <h3>Total Stations</h3>
          <p>{totalStations}</p>
        </div>

        <div className="card high">
          <h3>High Crowd</h3>
          <p>{high}</p>
        </div>

        <div className="card medium">
          <h3>Medium Crowd</h3>
          <p>{medium}</p>
        </div>

        <div className="card low">
          <h3>Low Crowd</h3>
          <p>{low}</p>
        </div>

      </div>

      {/* ======================================================
          CONTROLS
      ====================================================== */}

      <div className="controls">

        <input
          type="text"
          placeholder="Search Station..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={() => {
            loadStations();
            loadStatus();
          }}
        >
          🔄 Refresh
        </button>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      {loading ? (

        <div
          style={{
            textAlign: "center",
            padding: "50px",
            background: "#fff",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          <h2>Loading live monitoring data...</h2>

          <p>
            Please wait while the station data is retrieved.
          </p>
        </div>

      ) : (

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Station</th>
                <th>Line</th>
                <th>Passengers</th>
                <th>Crowd Level</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>

              {filteredStations.length > 0 ? (

                filteredStations.map((item) => (

                  <tr
                    key={`${item.station_name}-${item.id}`}
                  >

                    {/* ID */}

                    <td>
                      {item.id}
                    </td>

                    {/* STATION */}

                    <td>
                      <strong>
                        {item.station_name}
                      </strong>
                    </td>

                    {/* LINE */}

                    <td>
                      <span
                        style={{
                          color: "#52647d",
                          fontSize: "11px",
                        }}
                      >
                        {item.line}
                      </span>
                    </td>

                    {/* PASSENGERS */}

                    <td>
                      <strong
                        style={{
                          color: "#1565c0",
                        }}
                      >
                        {item.passenger_count.toLocaleString()}
                      </strong>
                    </td>

                    {/* CROWD LEVEL */}

                    <td>
                      {getCrowdBadge(
                        item.crowd_level
                      )}
                    </td>

                    {/* STATUS */}

                    <td>
                      {item.crowd_level === "High" && (
                        <span
                          style={{
                            color: "#c62828",
                            fontWeight: "700",
                            fontSize: "11px",
                          }}
                        >
                          🔴 High Alert
                        </span>
                      )}

                      {item.crowd_level === "Medium" && (
                        <span
                          style={{
                            color: "#ef6c00",
                            fontWeight: "700",
                            fontSize: "11px",
                          }}
                        >
                          🟠 Moderate
                        </span>
                      )}

                      {item.crowd_level === "Low" && (
                        <span
                          style={{
                            color: "#2e7d32",
                            fontWeight: "700",
                            fontSize: "11px",
                          }}
                        >
                          🟢 Normal
                        </span>
                      )}
                    </td>

                    {/* UPDATED */}

                    <td>
                      {item.timestamp
                        ? new Date(
                            item.timestamp
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="7">
                    No monitoring records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>
        </div>

      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="updated-time">

        <strong>Last Refreshed:</strong>{" "}

        {lastUpdated || "Not refreshed yet"}

      </div>

    </div>
  );
}

export default Monitoring;