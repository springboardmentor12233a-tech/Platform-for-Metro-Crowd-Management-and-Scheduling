import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Reports.css";

function Reports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setError("");

      const response = await api.get("/data/heatmap");

      const records = response.data.records || [];

      const formattedReports = records.map((item, index) => ({
        id: index + 1,
        station: item.station,
        line: item.line || "Unknown",
        passengers: Math.round(item.passenger_demand || 0),
        crowd: item.crowd_level || "Unknown",
      }));

      setReports(formattedReports);
    } catch (err) {
      console.error("Reports Error:", err);

      setError(
        "Unable to load report data. Please make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = reports.filter((report) =>
    report.station.toLowerCase().includes(search.toLowerCase())
  );

  const totalPassengers = reports.reduce(
    (sum, item) => sum + item.passengers,
    0
  );

  const highCrowd = reports.filter(
    (item) => item.crowd === "High"
  ).length;

  const mediumCrowd = reports.filter(
    (item) => item.crowd === "Medium"
  ).length;

  const lowCrowd = reports.filter(
    (item) => item.crowd === "Low"
  ).length;

  const getCrowdClass = (crowd) => {
    if (crowd === "High") return "crowd-high";
    if (crowd === "Medium") return "crowd-medium";
    if (crowd === "Low") return "crowd-low";
    return "crowd-unknown";
  };

  const exportCSV = () => {
    if (reports.length === 0) {
      alert("No report data available.");
      return;
    }

    const headers = [
      "Station",
      "Metro Line",
      "Passengers",
      "Crowd Level",
    ];

    const rows = reports.map((item) => [
      item.station,
      item.line,
      item.passengers,
      item.crowd,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "metro_crowd_report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="reports-page">

      {/* Header */}

      <div className="reports-header">

        <div>
          <span className="reports-eyebrow">
            METRO OPERATIONS
          </span>

          <h1>📊 Reports Dashboard</h1>

          <p>
            View and export current metro crowd monitoring reports.
          </p>
        </div>

        <button
          className="reports-refresh"
          onClick={fetchReports}
        >
          🔄 Refresh
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="reports-error">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}

      <div className="report-cards">

        <div className="report-card stations-card">
          <div className="report-card-label">
            Total Stations
          </div>

          <h2>{reports.length}</h2>

          <span>Live monitored stations</span>
        </div>

        <div className="report-card passenger-card">
          <div className="report-card-label">
            Total Passengers
          </div>

          <h2>{totalPassengers.toLocaleString()}</h2>

          <span>Current station demand</span>
        </div>

        <div className="report-card high-card">
          <div className="report-card-label">
            High Crowd
          </div>

          <h2>{highCrowd}</h2>

          <span>Stations with high demand</span>
        </div>

        <div className="report-card medium-card">
          <div className="report-card-label">
            Medium Crowd
          </div>

          <h2>{mediumCrowd}</h2>

          <span>Stations with medium demand</span>
        </div>

        <div className="report-card low-card">
          <div className="report-card-label">
            Low Crowd
          </div>

          <h2>{lowCrowd}</h2>

          <span>Stations with low demand</span>
        </div>

      </div>

      {/* Report Table */}

      <div className="reports-table-card">

        <div className="reports-table-header">

          <div>
            <h2>Metro Crowd Report</h2>

            <p>
              {reports.length} stations available
            </p>
          </div>

          <input
            className="search-box"
            placeholder="Search station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {loading ? (

          <div className="reports-loading">
            <div className="reports-spinner"></div>
            <p>Loading report data...</p>
          </div>

        ) : (

          <div className="reports-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Station</th>
                  <th>Metro Line</th>
                  <th>Passengers</th>
                  <th>Crowd Level</th>
                </tr>
              </thead>

              <tbody>

                {filtered.length > 0 ? (

                  filtered.map((item) => (

                    <tr key={item.id}>

                      <td>
                        #{item.id}
                      </td>

                      <td>
                        <strong>
                          {item.station}
                        </strong>
                      </td>

                      <td>
                        {item.line}
                      </td>

                      <td className="passenger-value">
                        {item.passengers.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`crowd-badge ${getCrowdClass(
                            item.crowd
                          )}`}
                        >
                          <span className="crowd-dot"></span>
                          {item.crowd}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="5"
                      className="no-reports"
                    >
                      No stations found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Export Buttons */}

      <div className="reports-actions">

        <button
          className="export-pdf"
          onClick={exportPDF}
        >
          📄 Export PDF
        </button>

        <button
          className="export-csv"
          onClick={exportCSV}
        >
          📊 Export CSV
        </button>

      </div>

    </div>
  );
}

export default Reports;