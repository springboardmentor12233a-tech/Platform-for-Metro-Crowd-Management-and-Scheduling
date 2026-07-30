import { useState } from "react";
import "../styles/Frequency.css";

function Frequency() {
  const [search, setSearch] = useState("");

  const frequencyData = [
    {
      id: 1,
      station: "Rajiv Chowk",
      line: "Blue Line",
      interval: "3 min",
      peak: "2 min",
      offPeak: "5 min",
      waiting: "2 min",
    },
    {
      id: 2,
      station: "AIIMS",
      line: "Yellow Line",
      interval: "4 min",
      peak: "3 min",
      offPeak: "6 min",
      waiting: "3 min",
    },
    {
      id: 3,
      station: "New Delhi",
      line: "Yellow Line",
      interval: "5 min",
      peak: "3 min",
      offPeak: "7 min",
      waiting: "4 min",
    },
    {
      id: 4,
      station: "Noida City Centre",
      line: "Blue Line",
      interval: "6 min",
      peak: "4 min",
      offPeak: "8 min",
      waiting: "5 min",
    },
  ];

  const filtered = frequencyData.filter(
    (item) =>
      item.station.toLowerCase().includes(search.toLowerCase()) ||
      item.line.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="frequency-page">

      <h1>🚆 Train Frequency Dashboard</h1>

      <div className="summary-cards">

        <div className="summary-card">
          <h3>Total Stations</h3>
          <h2>{frequencyData.length}</h2>
        </div>

        <div className="summary-card blue">
          <h3>Average Interval</h3>
          <h2>4.5 min</h2>
        </div>

        <div className="summary-card green">
          <h3>Peak Frequency</h3>
          <h2>2 min</h2>
        </div>

      </div>

      <input
        className="search-box"
        placeholder="Search Station or Line..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>

        <thead>
          <tr>
            <th>Station</th>
            <th>Metro Line</th>
            <th>Train Interval</th>
            <th>Peak Hours</th>
            <th>Off Peak</th>
            <th>Estimated Waiting</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.station}</td>
              <td>{item.line}</td>
              <td>{item.interval}</td>
              <td>{item.peak}</td>
              <td>{item.offPeak}</td>
              <td>{item.waiting}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Frequency;