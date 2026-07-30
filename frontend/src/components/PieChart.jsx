import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function PieChart({ data }) {
  const chartData = {
    labels: ["Stations", "Trains", "Schedules"],
    datasets: [
      {
        data: [
  data.total_stations,
  data.total_trains,
  data.passengers_today,
],
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
        ],
      },
    ],
  };

  return (
    <div
      style={{
        width: "450px",
        margin: "40px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.1)",
      }}
    >
      <h3 style={{ textAlign: "center" }}>
        Metro Data Distribution
      </h3>

      <Pie data={chartData} />
    </div>
  );
}

export default PieChart;