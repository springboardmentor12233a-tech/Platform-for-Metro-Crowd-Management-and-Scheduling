import React from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register everything required for the Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsChart({ data }) {
  console.log("STATISTICS DATA:", data);
  console.log(
    "LINE DISTRIBUTION:",
    data?.line_distribution
  );

  // ============================================
  // GET LINE-WISE STATION DATA
  // ============================================

  const lineDistribution =
    data?.line_distribution || [];

  // ============================================
  // PREPARE CHART LABELS
  // ============================================

  const labels = lineDistribution.map(
    (item) => item.line
  );

  // ============================================
  // PREPARE STATION COUNTS
  // ============================================

  const stationCounts = lineDistribution.map(
    (item) => item.stations
  );

  // ============================================
  // CHART DATA
  // ============================================

  const chartData = {
    labels: labels,

    datasets: [
      {
        label: "Number of Stations",
        data: stationCounts,

        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#7c3aed",
          "#ef4444",
          "#06b6d4",
          "#f97316",
          "#ec4899",
          "#dc2626",
          "#8b5cf6",
          "#14b8a6",
        ],

        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  // ============================================
  // CHART OPTIONS
  // ============================================

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: "top",
      },

      title: {
        display: true,
        text: "Metro Line-wise Station Distribution",

        font: {
          size: 18,
          weight: "bold",
        },

        padding: {
          bottom: 20,
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
        title: {
          display: true,
          text: "Metro Line",
        },

        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,

          font: {
            size: 11,
          },
        },
      },

      y: {
        beginAtZero: true,

        title: {
          display: true,
          text: "Number of Stations",
        },

        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (!lineDistribution.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "450px",

          background: "#ffffff",

          padding: "20px",

          borderRadius: "12px",

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1)",

          boxSizing: "border-box",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          color: "#64748b",

          fontSize: "16px",
        }}
      >
        Loading metro line distribution...
      </div>
    );
  }

  // ============================================
  // BAR CHART
  // ============================================

  return (
    <div
      style={{
        width: "100%",
        height: "450px",

        background: "#ffffff",

        padding: "20px",

        borderRadius: "12px",

        boxShadow:
          "0 4px 12px rgba(0,0,0,0.1)",

        boxSizing: "border-box",
      }}
    >
      <Bar
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default StatisticsChart;