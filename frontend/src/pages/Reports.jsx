import { useState } from "react";
import "../styles/Reports.css";

function Reports() {

  const reports = [
    {
      id: 1,
      station: "Rajiv Chowk",
      passengers: 920,
      crowd: "High",
      date: "29-07-2026"
    },
    {
      id: 2,
      station: "AIIMS",
      passengers: 510,
      crowd: "Medium",
      date: "29-07-2026"
    },
    {
      id: 3,
      station: "New Delhi",
      passengers: 180,
      crowd: "Low",
      date: "29-07-2026"
    },
    {
      id: 4,
      station: "Kashmere Gate",
      passengers: 1035,
      crowd: "High",
      date: "29-07-2026"
    }
  ];

  const [search, setSearch] = useState("");

  const filtered = reports.filter(report =>
    report.station.toLowerCase().includes(search.toLowerCase())
  );

  const totalPassengers = reports.reduce(
    (sum, item) => sum + item.passengers,
    0
  );

  const highCrowd = reports.filter(
    item => item.crowd === "High"
  ).length;

  return (
    <div className="reports-page">

      <h1>📊 Reports Dashboard</h1>

      <div className="report-cards">

        <div className="report-card">
          <h3>Total Predictions</h3>
          <h2>{reports.length}</h2>
        </div>

        <div className="report-card">
          <h3>Total Passengers</h3>
          <h2>{totalPassengers}</h2>
        </div>

        <div className="report-card">
          <h3>High Crowd Cases</h3>
          <h2>{highCrowd}</h2>
        </div>

      </div>

      <input
        className="search-box"
        placeholder="Search Station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>

        <thead>
          <tr>
            <th>Station</th>
            <th>Passengers</th>
            <th>Crowd</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map((item) => (

            <tr key={item.id}>

              <td>{item.station}</td>

              <td>{item.passengers}</td>

              <td>{item.crowd}</td>

              <td>{item.date}</td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="buttons">

        <button>📄 Export PDF</button>

        <button>📊 Export CSV</button>

      </div>

    </div>
  );
}

export default Reports;