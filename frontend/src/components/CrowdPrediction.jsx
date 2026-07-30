function CrowdPrediction() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        marginBottom: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        🤖 AI Crowd Prediction
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "18px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#64748b" }}>Current Crowd</p>
          <h3 style={{ color: "#16a34a" }}>Medium 🟢</h3>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "18px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#64748b" }}>Prediction (30 mins)</p>
          <h3 style={{ color: "#dc2626" }}>High 🔴</h3>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "18px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#64748b" }}>Confidence</p>
          <h3>92%</h3>
        </div>

        <div
          style={{
            background: "#f8fafc",
            padding: "18px",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#64748b" }}>Risk Level</p>
          <h3 style={{ color: "#ea580c" }}>Moderate 🟠</h3>
        </div>
      </div>

      <div
        style={{
          marginTop: "25px",
          background: "#eff6ff",
          padding: "18px",
          borderRadius: "12px",
          borderLeft: "6px solid #2563eb",
        }}
      >
        <b>🤖 AI Recommendation</b>

        <p style={{ marginTop: "10px" }}>
          Increase train frequency on the busiest metro line to reduce crowd
          congestion during the next 30 minutes.
        </p>
      </div>

      <p
        style={{
          textAlign: "right",
          color: "#94a3b8",
          marginTop: "15px",
        }}
      >
        Updated just now
      </p>
    </div>
  );
}

export default CrowdPrediction;