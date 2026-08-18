import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [lineData, setLineData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedLine, setSelectedLine] = useState("All");
  const [sortOrder, setSortOrder] = useState("highest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load analytics data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/charts")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load analytics data"
          );
        }

        return response.json();
      })
      .then((data) => {
        setLineData(data.line_distribution);
        setFilteredData(data.line_distribution);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load analytics data.");
        setLoading(false);
      });
  }, []);

  // Get unique metro lines
  const lines = [
    "All",
    ...new Set(
      lineData.map((item) => item.line)
    ),
  ];

  // Search + filter + sorting
  useEffect(() => {
    let result = [...lineData];

    // Search metro line
    if (search) {
      const searchText =
        search.toLowerCase();

      result = result.filter((item) =>
        item.line
          ?.toLowerCase()
          .includes(searchText)
      );
    }

    // Metro line filter
    if (selectedLine !== "All") {
      result = result.filter(
        (item) =>
          item.line === selectedLine
      );
    }

    // Sort
    if (sortOrder === "highest") {
      result.sort(
        (a, b) =>
          b.stations - a.stations
      );
    } else {
      result.sort(
        (a, b) =>
          a.stations - b.stations
      );
    }

    setFilteredData(result);
  }, [
    search,
    selectedLine,
    sortOrder,
    lineData,
  ]);

  // Total stations in current result
  const totalStations =
    filteredData.reduce(
      (total, item) =>
        total + item.stations,
      0
    );

  // Find busiest line
  const busiestLine =
    filteredData.length > 0
      ? filteredData.reduce(
          (max, item) =>
            item.stations > max.stations
              ? item
              : max
        )
      : null;

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedLine("All");
    setSortOrder("highest");
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}

      <h1
        style={{
          color: "#0f172a",
          textAlign: "center",
        }}
      >
        📊 Metro Analytics
      </h1>

      <p
        style={{
          color: "#64748b",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Analyze Delhi Metro station
        distribution and operational
        statistics.
      </p>

      {/* LOADING */}

      {loading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          Loading analytics data...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "#dc2626",
            textAlign: "center",
            marginTop: "40px",
            fontWeight: "600",
          }}
        >
          {error}
        </p>
      )}

      {/* ANALYTICS */}

      {!loading && !error && (
        <>
          {/* FILTER SECTION */}

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.08)",
              marginTop: "30px",
            }}
          >
            <h2
              style={{
                color: "#0f172a",
                marginBottom: "20px",
              }}
            >
              🔎 Analytics Filters
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr auto",
                gap: "15px",
              }}
            >
              {/* SEARCH */}

              <input
                type="text"
                placeholder="🔍 Search metro line..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={inputStyle}
              />

              {/* LINE FILTER */}

              <select
                value={selectedLine}
                onChange={(e) =>
                  setSelectedLine(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                {lines.map((line) => (
                  <option
                    key={line}
                    value={line}
                  >
                    🚇 {line}
                  </option>
                ))}
              </select>

              {/* SORT */}

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="highest">
                  ↕ Highest stations
                </option>

                <option value="lowest">
                  ↕ Lowest stations
                </option>
              </select>

              {/* RESET */}

              <button
                onClick={resetFilters}
                style={resetButtonStyle}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {/* TOTAL STATIONS */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                🚉
              </div>

              <h2 style={numberStyle}>
                {totalStations}
              </h2>

              <p style={labelStyle}>
                Total Stations
              </p>
            </div>

            {/* LINES */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                🚇
              </div>

              <h2 style={numberStyle}>
                {filteredData.length}
              </h2>

              <p style={labelStyle}>
                Metro Lines
              </p>
            </div>

            {/* BUSIEST LINE */}

            <div style={cardStyle}>
              <div style={iconStyle}>
                🏆
              </div>

              <h2
                style={{
                  color: "#2563eb",
                  fontSize: "22px",
                }}
              >
                {busiestLine?.line ||
                  "N/A"}
              </h2>

              <p style={labelStyle}>
                Busiest Line
              </p>

              {busiestLine && (
                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  {busiestLine.stations}{" "}
                  stations
                </small>
              )}
            </div>
          </div>

          {/* BAR CHART */}

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.08)",
              marginTop: "30px",
            }}
          >
            <h2
              style={{
                color: "#0f172a",
                marginBottom: "10px",
              }}
            >
              📈 Stations by Metro Line
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              Showing{" "}
              {filteredData.length} metro
              line(s).
            </p>

            {filteredData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={400}
              >
                <BarChart
                  data={filteredData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="line"
                    angle={-25}
                    textAnchor="end"
                    height={80}
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="stations"
                    fill="#2563eb"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  padding: "50px",
                  color: "#64748b",
                }}
              >
                No metro lines found.
              </p>
            )}
          </div>

          {/* TABLE */}

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.08)",
              marginTop: "30px",
            }}
          >
            <h2
              style={{
                color: "#0f172a",
              }}
            >
              📋 Line-wise Station
              Distribution
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Showing{" "}
              {filteredData.length} result(s)
            </p>

            <div
              style={{
                overflowX: "auto",
                marginTop: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#eff6ff",
                      textAlign:
                        "left",
                    }}
                  >
                    <th style={cellStyle}>
                      #
                    </th>

                    <th style={cellStyle}>
                      Metro Line
                    </th>

                    <th style={cellStyle}>
                      Stations
                    </th>

                    <th style={cellStyle}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map(
                    (item, index) => (
                      <tr key={item.line}>
                        <td
                          style={cellStyle}
                        >
                          {index + 1}
                        </td>

                        <td
                          style={cellStyle}
                        >
                          🚇 {item.line}
                        </td>

                        <td
                          style={{
                            ...cellStyle,
                            fontWeight:
                              "600",
                          }}
                        >
                          {item.stations}
                        </td>

                        <td
                          style={cellStyle}
                        >
                          {item.stations >=
                          30
                            ? "🟢 High"
                            : item.stations >=
                              15
                            ? "🟡 Medium"
                            : "🔵 Low"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {filteredData.length ===
              0 && (
              <p
                style={{
                  textAlign:
                    "center",
                  padding: "30px",
                  color: "#64748b",
                }}
              >
                No metro lines found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  background: "white",
};

const resetButtonStyle = {
  padding: "14px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow:
    "0 8px 25px rgba(0,0,0,.08)",
  textAlign: "center",
};

const iconStyle = {
  fontSize: "30px",
};

const numberStyle = {
  color: "#2563eb",
  fontSize: "30px",
  margin: "10px 0",
};

const labelStyle = {
  color: "#64748b",
  margin: 0,
};

const cellStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e2e8f0",
  color: "#475569",
};

export default Analytics;