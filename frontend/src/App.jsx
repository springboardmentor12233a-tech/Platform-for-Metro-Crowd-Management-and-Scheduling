import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import TicketBooking from "./pages/TicketBooking";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Trains from "./pages/Trains";
import Stations from "./pages/Stations";
import Schedules from "./pages/Schedules";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [data, setData] = useState(null);
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [metroLines, setMetroLines] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  // ============================================
  // LOAD DASHBOARD DATA
  // ============================================

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API}/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Dashboard request failed");
        }

        return res.json();
      })
      .then((result) => {
        console.log("DASHBOARD DATA:", result);
        setData(result);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
      });
  }, [isLoggedIn]);

  // ============================================
  // LOAD STATIONS
  // ============================================

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API}/metro-stations`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Stations request failed");
        }

        return res.json();
      })
      .then((result) => {
        console.log("STATIONS DATA:", result);
        setStations(result);
      })
      .catch((err) => {
        console.error("Stations error:", err);
      });
  }, [isLoggedIn]);

  // ============================================
  // LOAD SCHEDULES
  // ============================================

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API}/metro-schedule`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Schedule request failed");
        }

        return res.json();
      })
      .then((result) => {
        console.log("SCHEDULE DATA:", result);
        setSchedules(result);
      })
      .catch((err) => {
        console.error("Schedule error:", err);
      });
  }, [isLoggedIn]);

  // ============================================
  // LOAD TRAINS
  // ============================================

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API}/trains`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Trains request failed");
        }

        return res.json();
      })
      .then((result) => {
        console.log("TRAINS DATA:", result);
        setTrains(result);
      })
      .catch((err) => {
        console.error("Trains error:", err);
      });
  }, [isLoggedIn]);

  // ============================================
  // LOAD METRO LINES
  // ============================================

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`${API}/metro-lines`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Metro lines request failed");
        }

        return res.json();
      })
      .then((result) => {
        console.log("METRO LINES DATA:", result);
        setMetroLines(result);
      })
      .catch((err) => {
        console.error("Metro lines error:", err);
      });
  }, [isLoggedIn]);

  // ============================================
  // LOGIN
  // ============================================

  const handleLogin = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    setIsLoggedIn(false);

    setData(null);
    setStations([]);
    setTrains([]);
    setSchedules([]);
    setMetroLines([]);
  };

  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            {data ? (
              <Dashboard data={data} />
            ) : (
              <div
                style={{
                  color: "white",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <h2>Loading dashboard...</h2>
                <p>
                  Fetching data from FastAPI backend...
                </p>
              </div>
            )}
          </ProtectedLayout>
        }
      />

      {/* STATIONS */}
      <Route
        path="/stations"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Stations stations={stations} />
          </ProtectedLayout>
        }
      />

      {/* TRAINS */}
      <Route
        path="/trains"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Trains trains={trains} />
          </ProtectedLayout>
        }
      />

      {/* SCHEDULES */}
      <Route
        path="/schedules"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Schedules schedules={schedules} />
          </ProtectedLayout>
        }
      />

      {/* AI PREDICTION */}
      <Route
        path="/prediction"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Prediction />
          </ProtectedLayout>
        }
      />

      {/* ANALYTICS */}
      <Route
        path="/analytics"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Analytics />
          </ProtectedLayout>
        }
      />

      {/* TICKET BOOKING */}
      <Route
        path="/ticket-booking"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <TicketBooking />
          </ProtectedLayout>
        }
      />

      {/* PAYMENT */}
      <Route
        path="/payment"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Payment />
          </ProtectedLayout>
        }
      />

      {/* REPORTS */}
      <Route
        path="/reports"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Reports />
          </ProtectedLayout>
        }
      />

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <ProtectedLayout
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          >
            <Settings />
          </ProtectedLayout>
        }
      />

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

// =========================================================
// PROTECTED LAYOUT
// =========================================================

function ProtectedLayout({
  children,
  isLoggedIn,
  onLogout,
}) {
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return (
    <div
      className="metro-app-background"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#020617",
      }}
    >

      {/* SIDEBAR */}
      <Sidebar onLogout={onLogout} />

      {/* MAIN CONTENT */}
      <div
        className="container"
        style={{
          marginLeft: "250px",
          padding: "20px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >

        {/* NAVBAR */}
        <Navbar />

        {/* LOGOUT BUTTON */}
        <div
          style={{
            textAlign: "right",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={onLogout}
            style={{
              background: "#dc2626",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        {/* CURRENT PAGE */}
        {children}

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "50px",
            paddingBottom: "20px",
            color: "#cbd5e1",
          }}
        >
          <hr
            style={{
              borderColor:
                "rgba(148,163,184,0.25)",
            }}
          />

          <h3>
            Metro Crowd Management & Scheduling System
          </h3>

          <p>
            Developed using React + FastAPI
          </p>

          <p>
            Infosys Springboard Internship Project
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;