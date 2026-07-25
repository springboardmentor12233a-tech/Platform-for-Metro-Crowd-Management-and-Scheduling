import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_stations: 0,
    high_demand: 0,
    medium_demand: 0,
    low_demand: 0,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard summary
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(
          "/reports/traffic-analysis?day_type=Weekday"
        );

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

  // Fetch logged-in user
  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("User Error:", err));
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1>Dashboard</h1>

              {user && (
                <>
                  <h3>Welcome, {user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </>
              )}
            </div>

            <button
              onClick={logout}
              style={{
                padding: "10px 20px",
                background: "#E53935",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

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