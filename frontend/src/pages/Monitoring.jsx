function Monitoring() {
  return (
    <div>

      <h1>📊 Live Metro Monitoring</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >

        <div className="card">
          <h2>👥 Passenger Count</h2>

          <h1 style={{ color: "#1976d2" }}>
            19,980
          </h1>

          <p>Current estimated passengers</p>
        </div>

        <div className="card">
          <h2>🚇 Train Occupancy</h2>

          <h1 style={{ color: "#2e7d32" }}>
            66%
          </h1>

          <p>Average occupancy today</p>
        </div>

        <div className="card">
          <h2>⚠ Delay Risk</h2>

          <h1 style={{ color: "#f57c00" }}>
            Medium
          </h1>

          <p>AI predicted operational delay</p>
        </div>

        <div className="card">
          <h2>🟢 System Status</h2>

          <h1 style={{ color: "#43a047" }}>
            Online
          </h1>

          <p>Metro monitoring active</p>
        </div>

      </div>

    </div>
  );
}

export default Monitoring;