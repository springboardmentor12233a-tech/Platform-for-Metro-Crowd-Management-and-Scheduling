function StationCard({ station, occupancy }) {
  let color = "#2e7d32";

  if (occupancy >= 90) color = "#d32f2f";
  else if (occupancy >= 75) color = "#f57c00";

  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <strong>{station}</strong>
        <span>{occupancy}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: `${occupancy}%`,
            height: "100%",
            background: color,
            borderRadius: "8px",
            transition: "0.5s",
          }}
        />
      </div>
    </div>
  );
}

export default StationCard;