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

  // Get line-wise station data
  const lineDistribution = data?.line_distribution || [];

  const chartData = {
    labels: lineDistribution.map(
      (item) => item.line
    ),

    datasets: [
      {
        label: "Number of Stations",

        data: lineDistribution.map(
          (item) => item.stations
        ),

        borderColor: "#2563eb",

        backgroundColor: "rgba(37, 99, 235, 0.15)",

        pointBackgroundColor: "#2563eb",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,

        pointRadius: 6,

        pointHoverRadius: 8,

        borderWidth: 3,

        tension: 0.35,

        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "top",
      },

      title: {
        display: true,

        text: "Comparison/trend of major metrics",

        font: {
          size: 18,
          weight: "bold",
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {

            return ` Stations: ${context.raw}`;
          },
        },
      },
    },

    scales: {

      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },

        title: {
          display: true,
          text: "Metro Lines",
        },
      },

      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Number of Stations",
        },

        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "450px",

        background: "#fff",

        padding: "20px",

        borderRadius: "12px",

        boxShadow:
          "0 4px 12px rgba(0,0,0,.1)",

        boxSizing: "border-box",
      }}
    >

      <Line
        data={chartData}
        options={options}
      />

    </div>
  );
}

export default LineChart;