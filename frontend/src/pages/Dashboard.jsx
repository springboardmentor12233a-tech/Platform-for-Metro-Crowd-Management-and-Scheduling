import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_stations: 0,
    high_demand: 0,
    medium_demand: 0,
    low_demand: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(
          "/reports/traffic-analysis?day_type=Weekday"
        );

        console.log("API Response:", response.data);

        if (response.data && response.data.summary) {
          setSummary(response.data.summary);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f5f5f5",
            minHeight: "100vh",
          }}
        >
          <h1>Dashboard</h1>
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              <DashboardCard
                title="Stations"
                value={summary.total_stations}
                color="#1976D2"
              />

              <DashboardCard
                title="High Demand"
                value={summary.high_demand}
                color="#E53935"
              />

              <DashboardCard
                title="Medium Demand"
                value={summary.medium_demand}
                color="#FB8C00"
              />

              <DashboardCard
                title="Low Demand"
                value={summary.low_demand}
                color="#43A047"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;