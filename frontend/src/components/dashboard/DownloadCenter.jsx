function DownloadCenter() {
  const downloadFile = (type) => {
    window.open(`http://127.0.0.1:8000/download/${type}`, "_blank");
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "25px",
        marginTop: "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
      }}
    >
      <h2>📥 Download Center</h2>

      <p style={{ color: "#64748b" }}>
        Export Metro Analytics and AI Reports.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => downloadFile("pdf")}
          style={buttonStyle}
        >
          📄 Download PDF
        </button>

        <button
          onClick={() => downloadFile("excel")}
          style={buttonStyle}
        >
          📊 Download Excel
        </button>

        <button
          onClick={() => downloadFile("csv")}
          style={buttonStyle}
        >
          📑 Download CSV
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 25px",
  cursor: "pointer",
  fontWeight: "600",
};

export default DownloadCenter;