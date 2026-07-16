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
    peak_hour: "",
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
          background: "#f4f8fc",
          padding: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1565C0",
            marginBottom: "10px",
          }}
        >
          🚇 AI MetroFlow Dashboard
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "gray",
            marginBottom: "40px",
          }}
        >
          AI Powered Metro Crowd Management & Scheduling Platform
        </p>

        {/* Dashboard Cards */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <DashboardCard
            title="🚉 Total Stations"
            value={dashboard.stations}
          />

          <DashboardCard
            title="👥 Today's Passengers"
            value={dashboard.passengers}
          />

          <DashboardCard
            title="📈 Predictions"
            value={dashboard.predictions}
          />

          <DashboardCard
            title="⏰ Peak Hour"
            value={dashboard.peak_hour}
          />
        </div>

        {/* Quick Actions */}

        <div
          style={{
            marginTop: "50px",
          }}
        >
          <h2 style={{ color: "#1565C0" }}>Quick Actions</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <Link to="/prediction">
              <button>🚆 Crowd Prediction</button>
            </Link>

            <Link to="/monitoring">
              <button>🚉 Monitoring</button>
            </Link>

            <Link to="/analytics">
              <button>📊 Analytics</button>
            </Link>

            <Link to="/reports">
              <button>📑 Reports</button>
            </Link>

            <Link to="/alerts">
              <button>🚨 Alerts</button>
            </Link>

            <Link to="/schedule">
              <button>🗓 Schedule</button>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            marginTop: "50px",
          }}
        >
          {/* AI Recommendation */}

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,.15)",
            }}
          >
            <h2 style={{ color: "#1565C0" }}>
              🤖 AI Recommendation
            </h2>

            <ul style={{ lineHeight: "2" }}>
              <li>Increase train frequency during peak hours.</li>
              <li>Deploy additional staff at Airport Station.</li>
              <li>Open extra ticket counters.</li>
              <li>Broadcast crowd announcements.</li>
            </ul>
          </div>

          {/* System Status */}

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,.15)",
            }}
          >
            <h2 style={{ color: "#1565C0" }}>
              📌 System Status
            </h2>

            <p>✅ AI Prediction Model : Active</p>
            <p>✅ Metro Monitoring : Running</p>
            <p>✅ Analytics Service : Connected</p>
            <p>✅ Alert System : Active</p>
            <p>✅ Schedule Optimization : Ready</p>
          </div>
        </div>

        {/* Recent Activity */}

        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,.15)",
          }}
        >
          <h2 style={{ color: "#1565C0" }}>
            📜 Recent Activity
          </h2>

          <ul style={{ lineHeight: "2" }}>
            <li>Prediction generated successfully.</li>
            <li>Monitoring data updated.</li>
            <li>Analytics refreshed.</li>
            <li>Schedule recommendations generated.</li>
            <li>Reports synchronized.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;