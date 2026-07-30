function AIAssistant({ data }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "white",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 30px rgba(37,99,235,.3)",
      }}
    >
      <h2>🤖 AI Metro Assistant</h2>

      <p>AI Analysis Completed Successfully</p>

      <hr
        style={{
          border: "1px solid rgba(255,255,255,.2)",
        }}
      />

      <h3>Live Insights</h3>

      <ul style={{ lineHeight: "30px" }}>
        <li>🚉 Total Stations : {data.total_stations}</li>

        <li>🚆 Active Trains : {data.total_trains}</li>

        <li>👥 Expected Passenger Count : {data.passengers_today}</li>

        <li>🤖 Crowd Prediction : {data.prediction}</li>
      </ul>

      <button
        style={{
          marginTop: "15px",
          padding: "12px 25px",
          background: "white",
          color: "#2563eb",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Generate AI Report
      </button>
    </div>
  );
}

export default AIAssistant;