function KpiCard({ title, value, color, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "110px",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "14px",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: "10px 0 0",
            color: "#0b1e3d",
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          fontSize: "38px",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default KpiCard;