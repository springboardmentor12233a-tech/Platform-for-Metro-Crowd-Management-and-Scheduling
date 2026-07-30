import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_records: 0,
    total_stations: 0,
    high_crowd: 0,
    medium_crowd: 0,
    low_crowd: 0,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Summary
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Fetch Logged-in User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("User Error:", error);
      }
    };

    fetchUser();
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
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
              alignItems: "flex-start",
              marginBottom: "30px",
            }}
          >
            <div>
              <h1 style={{ color: "#1565C0" }}>
                Dashboard
              </h1>

              {user && (
                <>
                  <h3>Welcome, {user.name}</h3>

                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>

                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
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
            <h2>Loading Dashboard...</h2>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                <DashboardCard
                  title="Stations"
                  value={summary.total_stations}
                  color="#1976D2"
                />

                <DashboardCard
                  title="High Crowd"
                  value={summary.high_crowd}
                  color="#E53935"
                />

                <DashboardCard
                  title="Medium Crowd"
                  value={summary.medium_crowd}
                  color="#FB8C00"
                />

                <DashboardCard
                  title="Low Crowd"
                  value={summary.low_crowd}
                  color="#43A047"
                />

                <DashboardCard
                  title="Total Records"
                  value={summary.total_records}
                  color="#6A1B9A"
                />
              </div>

              <div
                style={{
                  marginTop: "35px",
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,.1)",
                }}
              >
                <h2>Dashboard Summary</h2>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#1976D2",
                        color: "white",
                      }}
                    >
                      <th style={{ padding: "12px" }}>
                        Metric
                      </th>

                      <th style={{ padding: "12px" }}>
                        Value
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{ padding: "12px" }}>
                        Total Stations
                      </td>

                      <td>{summary.total_stations}</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px" }}>
                        High Crowd
                      </td>

                      <td>{summary.high_crowd}</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px" }}>
                        Medium Crowd
                      </td>

                      <td>{summary.medium_crowd}</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px" }}>
                        Low Crowd
                      </td>

                      <td>{summary.low_crowd}</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px" }}>
                        Total Records
                      </td>

                      <td>{summary.total_records}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;