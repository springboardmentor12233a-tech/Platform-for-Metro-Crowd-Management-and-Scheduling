import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data }) {
  const chartData = {
    labels: ["Stations", "Trains", "Schedules"],
    datasets: [
      {
        label: "Metro Dataset",
       data: [
  data.total_stations,
  data.total_trains,
  data.passengers_today,
],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.1)",
      }}
    >
      <Line data={chartData} />
    </div>
  );
}

export default LineChart;