import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAnalytics } from "../services/analytics";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

function Analytics() {
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setChartData(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Professional color palette
  const colors = [
    "#1565C0",
    "#2E7D32",
    "#EF6C00",
    "#8E24AA",
    "#D32F2F",
    "#00838F",
    "#F9A825",
    "#5E35B1",
    "#3949AB",
    "#00897B",
  ];

  // Bar Chart Data
  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Average Passenger Count",
        data: chartData.values,
        backgroundColor: colors,
        borderColor: "#0D47A1",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: colors,
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  // Common Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "MetroFlow Analytics",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background: "#eef4fb",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "40px",
          }}
        >
          📊 MetroFlow Analytics Dashboard
        </h1>

        {/* Bar Chart */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "40px",
            boxShadow: "0px 5px 15px rgba(0,0,0,.2)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#1565C0",
            }}
          >
            Passenger Count by Station
          </h2>

          <Bar data={barData} options={options} />
        </div>

        {/* Pie Chart */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0px 5px 15px rgba(0,0,0,.2)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#1565C0",
            }}
          >
            Crowd Distribution
          </h2>

          <div
            style={{
              width: "450px",
              margin: "auto",
            }}
          >
            <Pie data={pieData} options={options} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;