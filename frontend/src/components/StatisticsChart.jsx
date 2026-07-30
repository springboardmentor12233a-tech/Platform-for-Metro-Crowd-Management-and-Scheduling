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

function StatisticsChart({ data }) {
  const chartData = {
    labels: ["Stations", "Trains", "Schedules"],
    datasets: [
      {
        label: "Metro Statistics",
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
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Metro Statistics Overview",
      },
    },
  };

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "900px",
        margin: "40px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StatisticsChart;