import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/dashboard";

function Dashboard() {

  const [dashboard, setDashboard] = useState({
    stations: 0,
    passengers: 0,
    predictions: 0,
    peak_hour: ""
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "rgba(255,255,255,0.92)",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "40px",
          }}
        >
          🚇 AI MetroFlow Dashboard
        </h1>

        {/* Dashboard Cards */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "50px",
          }}
        >
          <DashboardCard
            title="Total Stations"
            value={dashboard.stations}
          />

          <DashboardCard
            title="Today's Passengers"
            value={dashboard.passengers}
          />

          <DashboardCard
            title="Predictions Made"
            value={dashboard.predictions}
          />

          <DashboardCard
            title="Peak Hour"
            value={dashboard.peak_hour}
          />
        </div>

        {/* Quick Actions */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2>Quick Actions</h2>

          <br />

          <Link to="/prediction">
            <button style={{ width: "250px" }}>
              Crowd Prediction
            </button>
          </Link>

          <br /><br />

          <Link to="/analytics">
            <button style={{ width: "250px" }}>
              Analytics
            </button>
          </Link>

          <br /><br />

          <Link to="/monitoring">
            <button style={{ width: "250px" }}>
              Monitoring
            </button>
          </Link>

          <br /><br />

          <Link to="/reports">
            <button style={{ width: "250px" }}>
              Reports
            </button>
          </Link>

          <br /><br />

          <Link to="/alerts">
            <button style={{ width: "250px" }}>
              Alerts
            </button>
          </Link>

          <br /><br />

          <Link to="/schedule">
            <button style={{ width: "250px" }}>
              Schedule
            </button>
          </Link>
        </div>

        {/* AI Recommendation */}

        <div
          style={{
            background: "#F4F8FF",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ color: "#1565C0" }}>
            🤖 AI Recommendation
          </h2>

          <ul
            style={{
              fontSize: "18px",
              lineHeight: "2",
            }}
          >
            <li>Increase train frequency during peak hours.</li>
            <li>Deploy additional staff at Airport Station.</li>
            <li>Open extra ticket counters.</li>
            <li>Broadcast passenger announcements.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;