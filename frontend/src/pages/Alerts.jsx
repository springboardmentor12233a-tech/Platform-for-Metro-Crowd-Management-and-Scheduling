import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAlerts } from "../services/alerts";

function Alerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.log(error);
    }
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
            color: "#D32F2F",
            marginBottom: "40px",
          }}
        >
          🚨 Metro Crowd Alerts
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "25px",
          }}
        >
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                background: "#FFF3F3",
                borderLeft: "8px solid #D32F2F",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,.2)",
              }}
            >
              <h2 style={{ color: "#D32F2F" }}>
                🚨 High Crowd Alert
              </h2>

              <p>
                <strong>Station:</strong> {alert.station}
              </p>

              <p>
                <strong>Time:</strong> {alert.time}
              </p>

              <p>
                <strong>Status:</strong> {alert.message}
              </p>

              <hr />

              <h3>Recommended Action</h3>

              <ul>
                <li>🚆 Increase Train Frequency</li>
                <li>👮 Deploy Extra Staff</li>
                <li>📢 Passenger Announcement</li>
                <li>🎫 Open Extra Ticket Counters</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Alerts;