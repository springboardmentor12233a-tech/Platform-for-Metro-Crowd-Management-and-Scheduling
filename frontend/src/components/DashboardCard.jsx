function DashboardCard({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        borderRadius: "12px",
        padding: "20px",
        minWidth: "220px",
        boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;