import { useEffect, useState } from "react";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);
  const chartData = {
  labels: ["Stations", "Trains", "Schedules"],
  datasets: [
    {
      label: "Metro Statistics",
      data: [data?.stations || 0, data?.trains || 0, data?.schedules || 0],
    },
  ],
};

  return (
    <div className="container">
      <div className="header">
  <h1>🚆 Metro Crowd Management Dashboard</h1>
  <p>Infosys Springboard Internship Project</p>
</div>
      {data ? (
  <>
    <div className="cards">
      <div className="card">
        <h2>🚉 Stations</h2>
        <p>{data.stations}</p>
      </div>

      <div className="card">
        <h2>🚆 Trains</h2>
        <p>{data.trains}</p>
      </div>

      <div className="card">
        <h2>📅 Schedules</h2>
        <p>{data.schedules}</p>
      </div>

      <div className="card">
        <h2>👥 Crowd Status</h2>
        <p>{data.crowd_status}</p>
      </div>
    </div>

    {/* <div style={{ width: "700px", margin: "40px auto" }}>
      <Bar data={chartData} />
    </div> */}
  </>
) : (
  <h2>Loading...</h2>
)}
<footer style={{ marginTop: "50px", color: "#666" }}>
  <hr />
  
</footer>
<footer>
  <hr />
  <h3>Metro Crowd Management & Scheduling System</h3>
  <p>Developed using React + FastAPI</p>
  <p>Infosys Springboard Internship Project</p>
</footer>
    </div>
  );
}

export default App;

