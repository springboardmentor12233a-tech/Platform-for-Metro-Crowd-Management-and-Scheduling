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

  const lineDistribution = data?.line_distribution || [];

  const chartData = {
    labels: lineDistribution.map((item) => item.line),

    datasets: [
      {
        label: "Stations",
        data: lineDistribution.map((item) => item.stations),

        // Different colors for each metro line
        backgroundColor: [
          "#2563eb", // Blue Line
          "#60a5fa", // Blue Line branch
          "#16a34a", // Green Line
          "#4ade80", // Green Line branch
          "#6b7280", // Grey Line
          "#d946ef", // Magenta Line
          "#f97316", // Orange Line
          "#ec4899", // Pink Line
          "#dc2626", // Red Line
          "#7c3aed", // Violet Line
          "#eab308", // Yellow Line
        ],

        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "right",

        labels: {
          padding: 15,
          usePointStyle: true,
        },
      },

      title: {
        display: true,
        text: "Overall dataset composition",
        font: {
          size: 18,
          weight: "bold",
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {

            const line = context.label;
            const stations = context.raw;

            return `${line}: ${stations} stations`;
          },
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
        boxShadow: "0 4px 12px rgba(0,0,0,.1)",
        boxSizing: "border-box",
      }}
    >

      <Pie
        data={chartData}
        options={options}
      />

    </div>
  );
}

export default PieChart;