import { useEffect, useState } from "react";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [line, setLine] = useState("All");
  const [station, setStation] = useState("All");
  const [selectedTrain, setSelectedTrain] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load metro schedules
  useEffect(() => {
    fetch("http://127.0.0.1:8000/metro-schedule")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load schedules");
        }

        return response.json();
      })
      .then((data) => {
        setSchedules(data);
        setFilteredSchedules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load metro schedule data.");
        setLoading(false);
      });
  }, []);

  // Unique metro lines
  const lines = [
    "All",
    ...new Set(
      schedules.map((schedule) => schedule.Metro_Line)
    ),
  ];

  // Unique stations
  const stations = [
    "All",
    ...new Set(
      schedules.map((schedule) => schedule.Station_Name)
    ),
  ];

  // Unique trains
  const trainNumbers = [
    ...new Set(
      schedules.map(
        (schedule) => schedule.Train_Number
      )
    ),
  ];

  // Search and filter
  useEffect(() => {
    let result = schedules;

    // Search
    if (search) {
      const searchText = search.toLowerCase();

      result = result.filter(
        (schedule) =>
          schedule.Station_Name
            ?.toLowerCase()
            .includes(searchText) ||
          schedule.Train_Number
            ?.toLowerCase()
            .includes(searchText) ||
          schedule.Train_Name
            ?.toLowerCase()
            .includes(searchText)
      );
    }

    // Metro line filter
    if (line !== "All") {
      result = result.filter(
        (schedule) =>
          schedule.Metro_Line === line
      );
    }

    // Station filter
    if (station !== "All") {
      result = result.filter(
        (schedule) =>
          schedule.Station_Name === station
      );
    }

    // Train filter
    if (selectedTrain !== "All") {
      result = result.filter(
        (schedule) =>
          schedule.Train_Number === selectedTrain
      );
    }

    setFilteredSchedules(result);
  }, [
    search,
    line,
    station,
    selectedTrain,
    schedules,
  ]);

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
        📅 Metro Schedules
      </h1>

      <p
        style={{
          color: "#64748b",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Delhi Metro train schedules and station timings.
      </p>

      {/* SUMMARY */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 25px rgba(0,0,0,.08)",
          marginTop: "25px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2563eb" }}>
          🚆 {schedules.length}
        </h2>

        <p style={{ color: "#64748b" }}>
          Total Schedule Records
        </p>
      </div>

      {/* SEARCH + FILTERS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr 1fr 1fr",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        {/* SEARCH */}

        <input
          type="text"
          placeholder="🔍 Search train, number or station..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "14px",
            borderRadius: "10px",
            border:
              "1px solid #cbd5e1",
            fontSize: "16px",
          }}
        />

        {/* METRO LINE */}

        <select
          value={line}
          onChange={(e) =>
            setLine(e.target.value)
          }
          style={selectStyle}
        >
          {lines.map((metroLine) => (
            <option
              key={metroLine}
              value={metroLine}
            >
              🚇 {metroLine}
            </option>
          ))}
        </select>

        {/* STATION */}

        <select
          value={station}
          onChange={(e) =>
            setStation(e.target.value)
          }
          style={selectStyle}
        >
          {stations.map(
            (metroStation) => (
              <option
                key={metroStation}
                value={metroStation}
              >
                🚉 {metroStation}
              </option>
            )
          )}
        </select>

        {/* TRAIN */}

        <select
          value={selectedTrain}
          onChange={(e) =>
            setSelectedTrain(e.target.value)
          }
          style={selectStyle}
        >
          <option value="All">
            🚆 All Trains
          </option>

          {trainNumbers.map(
            (trainNumber) => (
              <option
                key={trainNumber}
                value={trainNumber}
              >
                🚆 {trainNumber}
              </option>
            )
          )}
        </select>
      </div>

      {/* SELECTED TRAIN DETAILS */}

      {selectedTrain !== "All" &&
        filteredSchedules.length > 0 && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,.08)",
              marginTop: "25px",
            }}
          >
            <h2
              style={{
                color: "#1d4ed8",
                marginBottom: "20px",
              }}
            >
              🚆 Selected Train Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "15px",
              }}
            >
              <div style={detailCard}>
                <strong>Train Number</strong>
                <span>
                  {selectedTrain}
                </span>
              </div>

              <div style={detailCard}>
                <strong>Train Name</strong>
                <span>
                  {
                    filteredSchedules[0]
                      .Train_Name
                  }
                </span>
              </div>

              <div style={detailCard}>
                <strong>Metro Line</strong>
                <span>
                  {
                    filteredSchedules[0]
                      .Metro_Line
                  }
                </span>
              </div>

              <div style={detailCard}>
                <strong>Total Stations</strong>
                <span>
                  {filteredSchedules.length}
                </span>
              </div>

              <div style={detailCard}>
                <strong>First Arrival</strong>
                <span>
                  {
                    filteredSchedules[0]
                      .Arrival
                  }
                </span>
              </div>

              <div style={detailCard}>
                <strong>Last Departure</strong>
                <span>
                  {
                    filteredSchedules[
                      filteredSchedules.length - 1
                    ].Departure
                  }
                </span>
              </div>
            </div>
          </div>
        )}

      {/* LOADING */}

      {loading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          Loading metro schedules...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "#dc2626",
            textAlign: "center",
            marginTop: "30px",
            fontWeight: "600",
          }}
        >
          {error}
        </p>
      )}

      {/* TABLE */}

      {!loading && !error && (
        <div
          style={{
            background: "white",
            marginTop: "25px",
            borderRadius: "16px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px",
            }}
          >
            <h2
              style={{
                color: "#0f172a",
              }}
            >
              🚇 Train Schedule Information
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Showing{" "}
              <strong>
                {filteredSchedules.length}
              </strong>{" "}
              schedule records
            </p>
          </div>

          <div
            style={{
              overflowX: "auto",
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
                    Train Number
                  </th>

                  <th style={cellStyle}>
                    Train Name
                  </th>

                  <th style={cellStyle}>
                    Metro Line
                  </th>

                  <th style={cellStyle}>
                    Station
                  </th>

                  <th style={cellStyle}>
                    Arrival
                  </th>

                  <th style={cellStyle}>
                    Departure
                  </th>

                  <th style={cellStyle}>
                    Platform
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSchedules.map(
                  (schedule, index) => (
                    <tr key={index}>
                      <td style={cellStyle}>
                        {
                          schedule.Train_Number
                        }
                      </td>

                      <td style={cellStyle}>
                        {
                          schedule.Train_Name
                        }
                      </td>

                      <td style={cellStyle}>
                        {
                          schedule.Metro_Line
                        }
                      </td>

                      <td style={cellStyle}>
                        🚉{" "}
                        {
                          schedule.Station_Name
                        }
                      </td>

                      <td style={cellStyle}>
                        🕐{" "}
                        {schedule.Arrival}
                      </td>

                      <td style={cellStyle}>
                        🕑{" "}
                        {schedule.Departure}
                      </td>

                      <td style={cellStyle}>
                        {
                          schedule.Platform
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* NO RESULTS */}

          {filteredSchedules.length ===
            0 && (
            <p
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#64748b",
              }}
            >
              No schedule records found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};

const detailCard = {
  padding: "15px",
  background: "#f8fafc",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  color: "#475569",
};

const cellStyle = {
  padding: "14px",
  borderBottom:
    "1px solid #e2e8f0",
  color: "#475569",
};

export default Schedules;