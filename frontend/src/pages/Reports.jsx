import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReports } from "../services/reports";

function Reports() {

  const [report, setReport] = useState({
    total_predictions: 0,
    highest_crowded_station: "",
    average_passengers: 0,
    peak_hour_records: 0,
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReport(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    background: "white",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,.2)",
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#eef4fb",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "40px",
          }}
        >
          📊 MetroFlow Reports Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          <div style={cardStyle}>
            <h2>📈 Total Predictions</h2>
            <h1>{report.total_predictions}</h1>
          </div>

          <div style={cardStyle}>
            <h2>🚉 Highest Crowded Station</h2>
            <h1>{report.highest_crowded_station}</h1>
          </div>

          <div style={cardStyle}>
            <h2>👥 Average Passengers</h2>
            <h1>{report.average_passengers}</h1>
          </div>

          <div style={cardStyle}>
            <h2>⏰ Peak Hour Records</h2>
            <h1>{report.peak_hour_records}</h1>
          </div>
        </div>

        <div
          style={{
            marginTop: "50px",
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,.2)",
          }}
        >
          <h2 style={{ color: "#1565C0" }}>📋 Project Summary</h2>

          <ul style={{ fontSize: "18px", lineHeight: "2" }}>
            <li>Total AI Predictions Generated Successfully.</li>
            <li>Station with highest passenger traffic identified.</li>
            <li>Average passenger count calculated.</li>
            <li>Peak-hour records analyzed.</li>
            <li>Supports intelligent metro scheduling decisions.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Reports;