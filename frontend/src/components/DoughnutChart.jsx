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

  const prediction = data?.prediction || "Moderate";

  // Risk levels
  const riskLevels = [
    "Low",
    "Moderate",
    "High",
  ];

  const chartData = {
    labels: riskLevels,

    datasets: [
      {
        label: "AI Crowd Risk",

        // Visual representation of the three
        // possible risk levels
        data: [1, 1, 1],

        backgroundColor: [
          "#16a34a",
          "#f59e0b",
          "#dc2626",
        ],

        borderColor: "#ffffff",

        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    plugins: {

      legend: {
        position: "bottom",

        labels: {
          padding: 15,

          usePointStyle: true,
        },
      },

      title: {
        display: true,

        text: "AI Crowd Risk Status",

        font: {
          size: 18,
          weight: "bold",
        },
      },

      tooltip: {
        callbacks: {

          label: function (context) {

            const level = context.label;

            if (level === prediction) {
              return ` Current Risk: ${level}`;
            }

            return ` Risk Level: ${level}`;
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

        boxShadow:
          "0 4px 12px rgba(0,0,0,.1)",

        boxSizing: "border-box",

        position: "relative",
      }}
    >

      <Doughnut
        data={chartData}
        options={options}
      />

      {/* Center AI Status */}
      <div
        style={{
          position: "absolute",

          top: "50%",

          left: "50%",

          transform:
            "translate(-50%, -55%)",

          textAlign: "center",

          pointerEvents: "none",
        }}
      >

        <div
          style={{
            fontSize: "13px",

            color: "#64748b",

            marginBottom: "5px",
          }}
        >
          Current Risk
        </div>

        <div
          style={{
            fontSize: "22px",

            fontWeight: "700",

            color:
              prediction === "Low"
                ? "#16a34a"
                : prediction === "Moderate"
                ? "#f59e0b"
                : "#dc2626",
          }}
        >
          {prediction}
        </div>

      </div>

    </div>
  );
}

export default DoughnutChart;