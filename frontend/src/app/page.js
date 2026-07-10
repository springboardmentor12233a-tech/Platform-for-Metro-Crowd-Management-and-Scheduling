"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/stations")
      .then((res) => res.json())
      .then((data) => setStations(data));
  }, []);

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        MetroFlow — Station Dashboard
      </h1>
      <p style={{ color: "gray" }}>Live station data from backend</p>

      <div style={{ marginTop: "20px" }}>
        {stations.length === 0 ? (
          <p>No stations found. Add one via /docs first.</p>
        ) : (
          stations.map((station) => (
            <div
              key={station.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                {station.name}
              </h2>
              <p>Capacity: {station.capacity}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
