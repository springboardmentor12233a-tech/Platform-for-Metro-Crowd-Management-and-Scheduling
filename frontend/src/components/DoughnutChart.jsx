import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function DoughnutChart({ data }) {
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

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Dataset Distribution",
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.1)",
      }}
    >
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default DoughnutChart;