function NetworkStatus() {
  const lines = [
    { name: "Blue Line", status: "Normal", color: "#2e7d32" },
    { name: "Yellow Line", status: "Busy", color: "#f57c00" },
    { name: "Red Line", status: "Normal", color: "#2e7d32" },
    { name: "Green Line", status: "Delay", color: "#d32f2f" },
  ];

  return (
    <div className="card">
      <h2>🚇 Metro Network Status</h2>

      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{line.name}</span>

          <span
            style={{
              color: line.color,
              fontWeight: "bold",
            }}
          >
            ● {line.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default NetworkStatus;