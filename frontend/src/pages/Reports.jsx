import { useEffect, useState } from "react";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Report...</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h1>📄 Metro System Report</h1>

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <h3>Summary</h3>

        <p>
          <strong>Total Stations:</strong>{" "}
          {report.total_stations}
        </p>

        <p>
          <strong>Total Trains:</strong>{" "}
          {report.total_trains}
        </p>

        <p>
          <strong>Passengers Today:</strong>{" "}
          {report.passengers_today}
        </p>

        <p>
          <strong>Busiest Line:</strong>{" "}
          {report.busiest_line}
        </p>

        <p>
          <strong>Busiest Line Stations:</strong>{" "}
          {report.busiest_line_stations}
        </p>

        <p>
          <strong>AI Prediction:</strong>{" "}
          {report.prediction}
        </p>

        <p>
          <strong>AI Confidence:</strong>{" "}
          {report.ai_confidence}%
        </p>

        <p>
          <strong>Recommendation:</strong>{" "}
          {report.recommendation}
        </p>
      </div>
    </div>
  );
}

export default Reports;