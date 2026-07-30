function AIInsights() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        marginTop: "28px",
      }}
    >
      <h3 style={{ marginBottom: "18px", color: "#0f172a" }}>
        🤖 AI Operational Insights
      </h3>

      <ul style={{ paddingLeft: "18px", lineHeight: 1.8, color: "#334155" }}>
        <li>High crowd expected at <b>Rajiv Chowk</b> between 8:00–9:30 AM.</li>
        <li>Blue Line passenger volume increased by <b>18%</b> compared to yesterday.</li>
        <li>AI recommends adding <b>one extra train</b> during morning peak hours.</li>
        <li>System congestion risk is currently <b>Moderate</b>.</li>
      </ul>

      <div
        style={{
          marginTop: "18px",
          padding: "14px",
          borderRadius: "12px",
          background: "#eff6ff",
          color: "#1d4ed8",
          fontWeight: "600",
        }}
      >
        AI Confidence: 92%
      </div>
    </div>
  );
}

export default AIInsights;