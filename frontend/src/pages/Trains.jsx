import { useEffect, useState } from "react";

function Trains() {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("All Zones");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD TRAIN DATA FROM BACKEND
  // =========================================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/trains")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load trains");
        }

        return response.json();
      })
      .then((data) => {
        console.log("TRAIN DATA:", data);

        setTrains(data);
        setFilteredTrains(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Train loading error:", err);

        setError("Unable to load train data.");
        setLoading(false);
      });
  }, []);

  // =========================================================
  // GET UNIQUE ZONES
  // =========================================================

  const zones = [
    "All Zones",
    ...new Set(
      trains
        .map((train) => train?.["properties.zone"])
        .filter(Boolean)
    ),
  ];

  // =========================================================
  // SEARCH + ZONE FILTER
  // =========================================================

  useEffect(() => {
    let result = trains;

    const searchText = search.toLowerCase().trim();

    // Search train or zone
    if (searchText) {
      result = result.filter((train, index) => {
        const trainNumber = index + 1;

        const trainId =
          train?.["properties.train_id"] ||
          train?.["properties.train_number"] ||
          train?.["properties.number"] ||
          train?.train_id ||
          train?.id ||
          `Train ${trainNumber}`;

        const zoneName =
          train?.["properties.zone"] ||
          train?.["properties.Zone"] ||
          train?.properties?.zone ||
          "";

        return (
          String(trainId)
            .toLowerCase()
            .includes(searchText) ||
          `train ${trainNumber}`
            .toLowerCase()
            .includes(searchText) ||
          String(zoneName)
            .toLowerCase()
            .includes(searchText)
        );
      });
    }

    // Filter by selected zone
    if (zone !== "All Zones") {
      result = result.filter((train) => {
        const zoneName =
          train?.["properties.zone"] ||
          train?.["properties.Zone"] ||
          train?.properties?.zone ||
          "";

        return zoneName === zone;
      });
    }

    setFilteredTrains(result);
  }, [search, zone, trains]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          color: "#334155",
        }}
      >
        <h2>🚆 Loading Metro Trains...</h2>

        <p>
          Fetching train information from the backend...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        style={{
          padding: "50px",
          textAlign: "center",
          color: "#dc2626",
        }}
      >
        <h2>⚠️ {error}</h2>

        <p>
          Please make sure the FastAPI backend is running.
        </p>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <h1
        style={{
          color: "#0f172a",
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        🚆 Metro Trains
      </h1>

      <p
        style={{
          color: "#64748b",
          textAlign: "center",
          fontSize: "17px",
        }}
      >
        Explore metro train routes and operational information.
      </p>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        {/* TOTAL TRAINS */}

        <div style={summaryCard}>
          <h2>🚆</h2>

          <h2>{trains.length}</h2>

          <p>Total Train Records</p>
        </div>

        {/* TOTAL ZONES */}

        <div style={summaryCard}>
          <h2>📍</h2>

          <h2>{zones.length - 1}</h2>

          <p>Zones</p>
        </div>

        {/* MAPPED TRAINS */}

        <div style={summaryCard}>
          <h2>🗺️</h2>

          <h2>
            {
              trains.filter((train) => {
                const coordinates =
                  train?.["geometry.coordinates"] ||
                  train?.geometry?.coordinates ||
                  [];

                return (
                  Array.isArray(coordinates) &&
                  coordinates.length > 0
                );
              }).length
            }
          </h2>

          <p>Mapped Trains</p>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        {/* SEARCH */}

        <input
          type="text"
          placeholder="🔍 Search train or zone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            outline: "none",
          }}
        />

        {/* ZONE FILTER */}

        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          style={{
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            fontSize: "16px",
            background: "white",
          }}
        >
          {zones.map((item) => (
            <option key={item} value={item}>
              📍 {item}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================================
          TRAIN TABLE CARD
      ===================================================== */}

      <div
        style={{
          background: "white",
          marginTop: "25px",
          borderRadius: "18px",
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            padding: "22px",
            textAlign: "center",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <h2
            style={{
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            🚆 Train Information
          </h2>

          <p
            style={{
              color: "#64748b",
              margin: 0,
            }}
          >
            Showing{" "}
            {Math.min(filteredTrains.length, 100)}{" "}
            of {filteredTrains.length} matching trains
          </p>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#eff6ff",
                  textAlign: "left",
                }}
              >
                <th style={cellStyle}>#</th>

                <th style={cellStyle}>Train</th>

                <th style={cellStyle}>Zone</th>

                <th style={cellStyle}>Type</th>

                <th style={cellStyle}>Route Points</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrains
                .slice(0, 100)
                .map((train, index) => {
                  // -----------------------------------------
                  // TRAIN NUMBER
                  // -----------------------------------------

                  const trainNumber = index + 1;

                  // -----------------------------------------
                  // TRAIN ID
                  // -----------------------------------------

                  const trainId =
                    train?.["properties.train_id"] ||
                    train?.["properties.train_number"] ||
                    train?.["properties.number"] ||
                    train?.train_id ||
                    train?.id ||
                    `Train ${trainNumber}`;

                  // -----------------------------------------
                  // ZONE
                  // -----------------------------------------

                  const zoneName =
                    train?.["properties.zone"] ||
                    train?.["properties.Zone"] ||
                    train?.properties?.zone ||
                    "—";

                  // -----------------------------------------
                  // TRAIN TYPE
                  // -----------------------------------------

                  const trainType =
                    train?.["properties.type"] ||
                    train?.["properties.Type"] ||
                    train?.["properties.train_type"] ||
                    train?.properties?.train_type ||
                    "Metro Train";

                  // -----------------------------------------
                  // ROUTE COORDINATES
                  // -----------------------------------------

                  const coordinates =
                    train?.["geometry.coordinates"] ||
                    train?.geometry?.coordinates ||
                    [];

                  return (
                    <tr key={`${trainId}-${index}`}>
                      {/* NUMBER */}

                      <td style={cellStyle}>
                        {trainNumber}
                      </td>

                      {/* TRAIN */}

                      <td
                        style={{
                          ...cellStyle,
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        🚆 {trainId}
                      </td>

                      {/* ZONE */}

                      <td style={cellStyle}>
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#2563eb",
                            padding: "7px 14px",
                            borderRadius: "20px",
                            fontWeight: "600",
                          }}
                        >
                          {zoneName}
                        </span>
                      </td>

                      {/* TYPE */}

                      <td style={cellStyle}>
                        {trainType}
                      </td>

                      {/* ROUTE POINTS */}

                      <td style={cellStyle}>
                        📍{" "}
                        {Array.isArray(coordinates)
                          ? coordinates.length
                          : 0}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* =================================================
            NO RESULTS
        ================================================= */}

        {filteredTrains.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "30px",
              color: "#64748b",
            }}
          >
            No trains found.
          </p>
        )}

        {/* =================================================
            RECORD LIMIT
        ================================================= */}

        {filteredTrains.length > 100 && (
          <p
            style={{
              textAlign: "center",
              padding: "15px",
              color: "#64748b",
            }}
          >
            Showing first 100 records for faster performance.
          </p>
        )}
      </div>
    </div>
  );
}

// =========================================================
// TABLE CELL STYLE
// =========================================================

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#475569",
};

// =========================================================
// SUMMARY CARD STYLE
// =========================================================

const summaryCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 8px 25px rgba(0,0,0,.08)",
  color: "#2563eb",
};

export default Trains;