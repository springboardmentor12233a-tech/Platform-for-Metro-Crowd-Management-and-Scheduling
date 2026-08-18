function AIInsights({ data }) {

  if (!data) {
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
        <h3 style={{ color: "#0f172a" }}>
          🤖 AI Operational Insights
        </h3>

        <p style={{ color: "#64748b" }}>
          Loading AI insights...
        </p>
      </div>
    );
  }

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

      <h3
        style={{
          marginBottom: "18px",
          color: "#0f172a",
        }}
      >
        🤖 AI Operational Insights
      </h3>


      <ul
        style={{
          paddingLeft: "18px",
          lineHeight: 1.9,
          color: "#334155",
        }}
      >

        <li>
          Current congestion risk is{" "}
          <b>{data.prediction}</b>.
        </li>


        <li>
          <b>{data.busiest_line}</b> currently has the
          highest number of stations in the available
          metro dataset.
        </li>


        <li>
          The{" "}
          <b>{data.busiest_line}</b>{" "}
          contains{" "}
          <b>{data.busiest_line_stations}</b>{" "}
          stations.
        </li>


        <li>
          The system currently has{" "}
          <b>{data.total_trains}</b>{" "}
          train records available for monitoring.
        </li>


        <li>
          {data.recommendation}
        </li>

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
        AI Confidence: {data.ai_confidence}%
      </div>

    </div>
  );
}

export default AIInsights;