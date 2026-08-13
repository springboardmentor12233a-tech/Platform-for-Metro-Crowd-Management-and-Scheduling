import { useEffect, useState } from "react";
import { getLiveSnapshot, getLiveStatus } from "../services/realtimeApi";

function LiveDatasetMonitoring() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [snapshotRes, statusRes] = await Promise.all([
        getLiveSnapshot(25),
        getLiveStatus(),
      ]);
      setRecords(snapshotRes.data.records || []);
      setStatus(statusRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Dataset service is not running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Live Crowd Monitoring</h1>
          <p>Dataset-driven real-time replay</p>
        </div>
        <strong style={{ color: "#2e7d32" }}>● LIVE DATASET</strong>
      </div>

      {status && (
        <p>
          Dataset Date: <b>{status.current_date}</b> | Last Refresh:{" "}
          {new Date(status.last_checked).toLocaleTimeString()}
        </p>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Station</th>
                <th>Line</th>
                <th>Passengers</th>
                <th>Crowd Level</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, index) => (
                <tr key={`${item.station}-${index}`}>
                  <td>{item.station}</td>
                  <td>{item.line}</td>
                  <td>{Number(item.passenger_demand).toFixed(0)}</td>
                  <td>{item.crowd_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LiveDatasetMonitoring;
