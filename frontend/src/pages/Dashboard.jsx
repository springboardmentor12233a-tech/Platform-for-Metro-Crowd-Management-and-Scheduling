import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_stations: 0,
    high_crowd: 0,
    medium_crowd: 0,
    low_crowd: 0,
    total_passengers: 0,
  });

  const [topStations, setTopStations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/data/dashboard");

        setSummary({
          total_stations: response.data.total_stations,
          high_crowd: response.data.high_demand,
          medium_crowd: response.data.medium_demand,
          low_crowd: response.data.low_demand,
          total_passengers: response.data.total_passengers,
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ============================================================
  // FETCH TOP CROWDED STATIONS
  // ============================================================

  useEffect(() => {
    const fetchTopStations = async () => {
      try {
        const response = await api.get(
          "/data/snapshot?limit=50"
        );

        const records = response.data.records || [];

        const sortedStations = [...records]
          .sort(
            (a, b) =>
              Number(b.passenger_demand || 0) -
              Number(a.passenger_demand || 0)
          )
          .slice(0, 5);

        setTopStations(sortedStations);
      } catch (error) {
        console.error("Top Stations Error:", error);
      }
    };

    fetchTopStations();
  }, []);

  // ============================================================
  // FETCH USER
  // ============================================================

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

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ============================================================
  // CROWD PERCENTAGES
  // ============================================================

  const totalStations = summary.total_stations || 0;

  const highPercentage =
    totalStations > 0
      ? (summary.high_crowd / totalStations) * 100
      : 0;

  const mediumPercentage =
    totalStations > 0
      ? (summary.medium_crowd / totalStations) * 100
      : 0;

  const lowPercentage =
    totalStations > 0
      ? (summary.low_crowd / totalStations) * 100
      : 0;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="dashboard-page">

      <Navbar />

      <section className="dashboard-main">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="dashboard-heading">

          <div>

            <span className="eyebrow">
              METRO OPERATIONS
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Monitor station activity and crowd
              conditions from one place.
            </p>

          </div>

          <button
            className="dashboard-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>


        {/* ======================================================
            USER SUMMARY
        ====================================================== */}

        {user && (

          <div className="user-summary">

            <div className="user-avatar">

              {user.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            <div>

              <strong>
                Welcome, {user.name}
              </strong>

              <span>
                {user.email} • {user.role}
              </span>

            </div>

            <div className="online-label">

              <span />

              Online

            </div>

          </div>

        )}


        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading ? (

          <div className="dashboard-loading">

            <div className="loading-ring" />

            <p>
              Loading dashboard data...
            </p>

          </div>

        ) : (

          <>

            {/* ==================================================
                STAT CARDS
            ================================================== */}

            <div className="dashboard-stat-grid">

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
                title="Total Passengers"
                value={summary.total_passengers}
                color="#6A1B9A"
              />

            </div>


            {/* ==================================================
                ANALYTICS
            ================================================== */}

            <div className="dashboard-analytics">


              {/* =================================================
                  MODERN CROWD DISTRIBUTION
              ================================================= */}

              <div className="analytics-card crowd-distribution-card">

                <div className="analytics-title-row">

                  <div>

                    <h2>
                      Crowd Distribution
                    </h2>

                    <p>
                      Current station crowd classification
                    </p>

                  </div>

                  <div className="distribution-total">

                    <strong>
                      {totalStations}
                    </strong>

                    <span>
                      Stations
                    </span>

                  </div>

                </div>


                {/* Distribution Overview */}

                <div className="distribution-overview">

                  {/* Circle */}

                  <div
                    className="distribution-circle"
                    style={{
                      "--percentage": `${highPercentage}%`,
                    }}
                  >

                    <div className="distribution-circle-inner">

                      <strong>
                        {Math.round(highPercentage)}%
                      </strong>

                      <span>
                        High
                      </span>

                    </div>

                  </div>


                  {/* Distribution Information */}

                  <div className="distribution-info">


                    {/* HIGH */}

                    <div className="distribution-item">

                      <div className="distribution-item-top">

                        <div className="distribution-name">

                          <span className="distribution-dot high-dot" />

                          <span>
                            High Crowd
                          </span>

                        </div>

                        <strong>
                          {summary.high_crowd}
                        </strong>

                      </div>

                      <div className="distribution-track">

                        <div
                          className="distribution-fill high-fill"
                          style={{
                            width: `${highPercentage}%`,
                          }}
                        />

                      </div>

                      <span className="distribution-percent">

                        {highPercentage.toFixed(1)}%

                      </span>

                    </div>


                    {/* MEDIUM */}

                    <div className="distribution-item">

                      <div className="distribution-item-top">

                        <div className="distribution-name">

                          <span className="distribution-dot medium-dot" />

                          <span>
                            Medium Crowd
                          </span>

                        </div>

                        <strong>
                          {summary.medium_crowd}
                        </strong>

                      </div>

                      <div className="distribution-track">

                        <div
                          className="distribution-fill medium-fill"
                          style={{
                            width: `${mediumPercentage}%`,
                          }}
                        />

                      </div>

                      <span className="distribution-percent">

                        {mediumPercentage.toFixed(1)}%

                      </span>

                    </div>


                    {/* LOW */}

                    <div className="distribution-item">

                      <div className="distribution-item-top">

                        <div className="distribution-name">

                          <span className="distribution-dot low-dot" />

                          <span>
                            Low Crowd
                          </span>

                        </div>

                        <strong>
                          {summary.low_crowd}
                        </strong>

                      </div>

                      <div className="distribution-track">

                        <div
                          className="distribution-fill low-fill"
                          style={{
                            width: `${lowPercentage}%`,
                          }}
                        />

                      </div>

                      <span className="distribution-percent">

                        {lowPercentage.toFixed(1)}%

                      </span>

                    </div>

                  </div>

                </div>


                {/* Mini Status Cards */}

                <div className="crowd-mini-cards">

                  <div className="crowd-mini-card high-mini">

                    <span>
                      🔴
                    </span>

                    <div>

                      <strong>
                        {summary.high_crowd}
                      </strong>

                      <small>
                        High
                      </small>

                    </div>

                  </div>


                  <div className="crowd-mini-card medium-mini">

                    <span>
                      🟠
                    </span>

                    <div>

                      <strong>
                        {summary.medium_crowd}
                      </strong>

                      <small>
                        Medium
                      </small>

                    </div>

                  </div>


                  <div className="crowd-mini-card low-mini">

                    <span>
                      🟢
                    </span>

                    <div>

                      <strong>
                        {summary.low_crowd}
                      </strong>

                      <small>
                        Low
                      </small>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  TOP CROWDED STATIONS
              ================================================= */}

              <div className="analytics-card">

                <h2>
                  Top Crowded Stations
                </h2>

                <p>
                  Stations with highest passenger demand
                </p>


                <div className="top-stations-list">

                  {topStations.length > 0 ? (

                    topStations.map(
                      (station, index) => (

                        <div
                          className="top-station-item"
                          key={`${station.station}-${index}`}
                        >

                          <div className="top-station-rank">

                            #{index + 1}

                          </div>


                          <div className="top-station-info">

                            <strong>
                              {station.station}
                            </strong>

                            <span>
                              {station.crowd_level} Crowd
                            </span>

                          </div>


                          <div className="top-station-demand">

                            {station.passenger_demand}

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <div className="top-stations-empty">

                      Loading station information...

                    </div>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                OPERATIONAL SUMMARY
            ================================================== */}

            <div className="dashboard-summary-card">

              <div className="summary-header">

                <div>

                  <h2>
                    Operational Summary
                  </h2>

                  <p>
                    Current crowd monitoring overview
                  </p>

                </div>

                <span className="live-pill">

                  <span />

                  Live Data

                </span>

              </div>


              <div className="summary-table-wrap">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Metric
                      </th>

                      <th>
                        Value
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td>
                        Total Stations
                      </td>

                      <td>
                        {summary.total_stations}
                      </td>

                    </tr>


                    <tr>

                      <td>
                        High Crowd
                      </td>

                      <td>
                        {summary.high_crowd}
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Medium Crowd
                      </td>

                      <td>
                        {summary.medium_crowd}
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Low Crowd
                      </td>

                      <td>
                        {summary.low_crowd}
                      </td>

                    </tr>


                    <tr>

                      <td>
                        Total Passengers
                      </td>

                      <td>
                        {summary.total_passengers}
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}

      </section>

    </div>
  );
}

export default Dashboard;