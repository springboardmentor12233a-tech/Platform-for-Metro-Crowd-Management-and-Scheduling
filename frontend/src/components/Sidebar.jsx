function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#263238",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>Navigation</h2>

      <hr />

      <p>🏠 Dashboard</p>

      <p>📊 Crowd Prediction</p>

      <p>🚉 Demand Forecast</p>

      <p>🚆 Train Schedule</p>

      <p>🚄 Frequency Adjustment</p>

      <p>📡 Live Monitoring</p>

      <p>📈 Traffic Reports</p>
    </div>
  );
}

export default Sidebar;