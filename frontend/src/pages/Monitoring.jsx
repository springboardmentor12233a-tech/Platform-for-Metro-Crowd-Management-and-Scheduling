import { useEffect, useState } from "react";
import { getCrowd } from "../services/crowdService";
import "../styles/Monitoring.css";

function Monitoring() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadStations = async () => {
    try {
      setLoading(true);

      const data = await getCrowd();

      setStations(data);

      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching crowd data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    const searchMatch = station.station_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const filterMatch =
      filter === "All"
        ? true
        : station.crowd_level.toLowerCase() === filter.toLowerCase();

    return searchMatch && filterMatch;
  });

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

  return (
    <div className="monitoring-page">

      <h1>🚇 Metro Crowd Monitoring</h1>

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

        <button onClick={loadStations}>
          🔄 Refresh
        </button>

      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Station</th>
              <th>Passengers</th>
              <th>Crowd Level</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>

            {filteredStations.length > 0 ? (
              filteredStations.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>

                  <td>{item.station_name}</td>

                  <td>{item.passenger_count}</td>

                  <td>{item.crowd_level}</td>

                  <td>
                    {item.crowd_level === "High" && "🔴 High"}

                    {item.crowd_level === "Medium" && "🟠 Medium"}

                    {item.crowd_level === "Low" && "🟢 Low"}
                  </td>

                  <td>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>

                </tr>

              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No monitoring records found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      )}

      <div className="updated-time">
        <strong>Last Refreshed :</strong> {lastUpdated}
      </div>

    </div>
  );
}

export default Monitoring;