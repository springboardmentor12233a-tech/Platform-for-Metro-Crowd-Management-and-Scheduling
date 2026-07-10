function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        width: "220px",
        background: "#1565C0",
        color: "white",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;