import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMonitoring } from "../services/monitoring";

function Monitoring() {

  const [stations, setStations] = useState([]);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await getMonitoring();
      setStations(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBadgeColor = (level) => {
    if (level === "High") return "#D32F2F";
    if (level === "Medium") return "#F9A825";
    return "#2E7D32";
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#eef4fb",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "40px",
          }}
        >
          🚉 Live Station Monitoring
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "25px",
          }}
        >
          {stations.map((station, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 5px 15px rgba(0,0,0,.2)",
              }}
            >
              <h2 style={{ color: "#1565C0" }}>
                🚉 {station.station}
              </h2>

              <p>
                <strong>Passenger Count:</strong>{" "}
                {station.passenger_count}
              </p>

              <p>
                <strong>Occupancy:</strong>{" "}
                {station.occupancy}%
              </p>

              <div
                style={{
                  width: "100%",
                  height: "15px",
                  background: "#ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    width: `${station.occupancy}%`,
                    height: "100%",
                    background: "#1565C0",
                  }}
                ></div>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  color: "white",
                  background: getBadgeColor(station.crowd_level),
                  fontWeight: "bold",
                }}
              >
                {station.crowd_level} Crowd
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Monitoring;