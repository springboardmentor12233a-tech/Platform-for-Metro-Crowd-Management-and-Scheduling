import { useEffect, useMemo, useState } from "react";

function Stations() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [line, setLine] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // LOAD STATIONS
  // ============================================

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/metro-stations"
        );

        if (!response.ok) {
          throw new Error("Failed to load stations");
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Invalid station data received");
        }

        setStations(result);
      } catch (err) {
        console.error("Stations error:", err);
        setError("Unable to load metro station data.");
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // ============================================
  // GET UNIQUE METRO LINES
  // ============================================

  const lines = useMemo(() => {
    const uniqueLines = [
      ...new Set(
        stations
          .map((station) => station.Line)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueLines];
  }, [stations]);

  // ============================================
  // SEARCH + FILTER
  // ============================================

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const stationName =
        String(station.Station || "").toLowerCase();

      const metroLine =
        String(station.Line || "");

      const matchesSearch = stationName.includes(
        search.toLowerCase().trim()
      );

      const matchesLine =
        line === "All" || metroLine === line;

      return matchesSearch && matchesLine;
    });
  }, [stations, search, line]);

  // ============================================
  // LINE COUNT
  // ============================================

  const lineCount = lines.length - 1;

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingCard}>
          <div style={{ fontSize: "45px" }}>🚉</div>
          <h2 style={{ color: "#0f172a" }}>
            Loading Metro Stations...
          </h2>
          <p style={{ color: "#64748b" }}>
            Fetching station information from the backend.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={errorCard}>
          <div style={{ fontSize: "45px" }}>⚠️</div>

          <h2 style={{ color: "#dc2626" }}>
            Unable to Load Stations
          </h2>

          <p style={{ color: "#64748b" }}>
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            style={retryButton}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN PAGE
  // ============================================

  return (
    <div style={pageStyle}>

      {/* ============================================
          HEADER
      ============================================ */}

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>
            🚉 Metro Stations
          </h1>

          <p style={subtitleStyle}>
            Explore Delhi Metro stations, lines and
            geographical locations.
          </p>
        </div>
      </div>

      {/* ============================================
          SUMMARY CARDS
      ============================================ */}

      <div style={summaryGrid}>

        <div style={summaryCard}>
          <div style={summaryIcon}>🚉</div>

          <div>
            <p style={summaryLabel}>
              Total Stations
            </p>

            <h2 style={summaryValue}>
              {stations.length}
            </h2>
          </div>
        </div>

        <div style={summaryCard}>
          <div style={summaryIcon}>🚇</div>

          <div>
            <p style={summaryLabel}>
              Metro Lines
            </p>

            <h2 style={summaryValue}>
              {lineCount}
            </h2>
          </div>
        </div>

        <div style={summaryCard}>
          <div style={summaryIcon}>🔎</div>

          <div>
            <p style={summaryLabel}>
              Matching Stations
            </p>

            <h2 style={summaryValue}>
              {filteredStations.length}
            </h2>
          </div>
        </div>

      </div>

      {/* ============================================
          SEARCH + FILTER
      ============================================ */}

      <div style={filterCard}>

        <div style={{ flex: 2 }}>
          <label style={labelStyle}>
            Search Station
          </label>

          <input
            type="text"
            placeholder="🔍 Search by station name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>
            Metro Line
          </label>

          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
            style={inputStyle}
          >
            {lines.map((metroLine) => (
              <option
                key={metroLine}
                value={metroLine}
              >
                {metroLine}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ============================================
          STATION TABLE
      ============================================ */}

      <div style={tableCard}>

        <div style={tableHeader}>
          <div>
            <h2 style={tableTitle}>
              📍 Station Information
            </h2>

            <p style={tableSubtitle}>
              Showing {filteredStations.length} of{" "}
              {stations.length} stations
            </p>
          </div>

          {(search || line !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setLine("All");
              }}
              style={clearButton}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {filteredStations.length === 0 ? (
          <div style={emptyState}>
            <div style={{ fontSize: "45px" }}>
              🔍
            </div>

            <h3 style={{ color: "#0f172a" }}>
              No Stations Found
            </h3>

            <p style={{ color: "#64748b" }}>
              Try changing your search or metro line
              filter.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "750px",
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
                  <th style={cellStyle}>Station</th>
                  <th style={cellStyle}>Metro Line</th>
                  <th style={cellStyle}>Latitude</th>
                  <th style={cellStyle}>Longitude</th>
                </tr>
              </thead>

              <tbody>
                {filteredStations.map(
                  (station, index) => (
                    <tr
                      key={`${station.Station}-${index}`}
                      style={{
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "white";
                      }}
                    >
                      <td style={cellStyle}>
                        {index + 1}
                      </td>

                      <td
                        style={{
                          ...cellStyle,
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        🚉 {station.Station || "Unknown"}
                      </td>

                      <td style={cellStyle}>
                        <span style={lineBadge}>
                          {station.Line || "Unknown"}
                        </span>
                      </td>

                      <td style={cellStyle}>
                        {station.Latitude || "—"}
                      </td>

                      <td style={cellStyle}>
                        {station.Longitude || "—"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}

// ============================================
// STYLES
// ============================================

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "30px",
  boxSizing: "border-box",
  background: "#f8fafc",
};

const headerStyle = {
  marginBottom: "25px",
};

const titleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "32px",
  fontWeight: "700",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "16px",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const summaryCard = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const summaryIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "14px",
  background: "#eff6ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "26px",
};

const summaryLabel = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const summaryValue = {
  margin: "5px 0 0",
  color: "#2563eb",
  fontSize: "28px",
};

const filterCard = {
  background: "white",
  padding: "22px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  display: "flex",
  gap: "20px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#334155",
  fontWeight: "600",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
};

const tableCard = {
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const tableHeader = {
  padding: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
};

const tableTitle = {
  margin: 0,
  color: "#0f172a",
};

const tableSubtitle = {
  margin: "6px 0 0",
  color: "#64748b",
};

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  color: "#475569",
};

const lineBadge = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "20px",
  background: "#eff6ff",
  color: "#2563eb",
  fontWeight: "600",
  fontSize: "13px",
};

const clearButton = {
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  padding: "9px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const loadingCard = {
  background: "white",
  borderRadius: "16px",
  padding: "60px",
  textAlign: "center",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
};

const errorCard = {
  ...loadingCard,
};

const retryButton = {
  marginTop: "15px",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const emptyState = {
  padding: "60px 20px",
  textAlign: "center",
};

export default Stations;