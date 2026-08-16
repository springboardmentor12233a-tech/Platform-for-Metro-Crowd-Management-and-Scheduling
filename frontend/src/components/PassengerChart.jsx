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

function PassengerChart() {
  const data = {
    labels: [
      "6 AM",
      "8 AM",
      "10 AM",
      "12 PM",
      "2 PM",
      "4 PM",
      "6 PM",
      "8 PM",
    ],
    datasets: [
      {
        label: "Passenger Flow",
        data: [1200, 3200, 2500, 2800, 3100, 4200, 5100, 3900],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25,118,210,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default PassengerChart;