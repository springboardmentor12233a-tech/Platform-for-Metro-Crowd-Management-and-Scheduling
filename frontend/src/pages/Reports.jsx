function Reports() {
  return (
    <div>

      <h1>📄 MetroFlow AI Reports</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
        }}
      >

        <div className="card">
          <h2>📈 Total Predictions</h2>

          <h1 style={{ color: "#1976d2" }}>
            156
          </h1>

          <p>Predictions generated today</p>
        </div>

        <div className="card">
          <h2>👥 Average Occupancy</h2>

          <h1 style={{ color: "#43a047" }}>
            68%
          </h1>

          <p>Average passenger occupancy</p>
        </div>

        <div className="card">
          <h2>⚠ Delay Summary</h2>

          <h1 style={{ color: "#f57c00" }}>
            Medium
          </h1>

          <p>Current operational delay risk</p>
        </div>

        <div className="card">
          <h2>📊 AI Recommendation</h2>

          <p>
            Increase train frequency during
            morning and evening peak hours.
          </p>

          <button>
            Download Report
          </button>
        </div>

      </div>

    </div>
  );
}

export default Reports;