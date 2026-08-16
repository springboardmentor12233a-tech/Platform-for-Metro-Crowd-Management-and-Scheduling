function AlertCard({ level, station, message, color }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "16px 18px",
        marginTop: "10px",
        background: "#ffffff",
        borderRadius: "12px",
        borderLeft: `5px solid ${color || "#64748b"}`,
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
      }}
    >
      {/* Alert Level */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: color || "#334155",
        }}
      >
        {level}
      </div>

      {/* Station / Route */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#334155",
        }}
      >
        {station}
      </div>

      {/* Alert Message */}
      <div
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#64748b",
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default AlertCard;