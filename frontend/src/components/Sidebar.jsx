import {
  LayoutDashboard,
  TrainFront,
  MapPinned,
  CalendarDays,
  BrainCircuit,
  BarChart3,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "linear-gradient(180deg,#0f172a,#1e293b)",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        boxShadow: "5px 0 20px rgba(0,0,0,0.25)",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "25px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#38bdf8",
            fontWeight: "700",
          }}
        >
          🚆 Metro AI
        </h2>

        <p
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            marginTop: "8px",
          }}
        >
          Crowd Management System
        </p>
      </div>

      {/* Menu */}
      <div style={{ marginTop: "20px" }}>
        <Menu
          to="/dashboard"
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
        />

        <Menu
          to="/stations"
          icon={<MapPinned size={20} />}
          text="Stations"
        />

        <Menu
          to="/trains"
          icon={<TrainFront size={20} />}
          text="Trains"
        />

        <Menu
          to="/schedules"
          icon={<CalendarDays size={20} />}
          text="Schedules"
        />

        <Menu
          to="/ticket-booking"
          icon={<Ticket size={20} />}
          text="Ticket Booking"
        />

        <Menu
          to="/prediction"
          icon={<BrainCircuit size={20} />}
          text="AI Prediction"
        />

        <Menu
          to="/analytics"
          icon={<BarChart3 size={20} />}
          text="Analytics"
        />

        <Menu
          to="/settings"
          icon={<Settings size={20} />}
          text="Settings"
        />

        {/* Logout */}
        <div
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "15px 25px",
            cursor: "pointer",
            transition: "0.3s",
            marginTop: "10px",
            borderLeft: "5px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#7f1d1d";
            e.currentTarget.style.borderLeft = "5px solid #ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderLeft =
              "5px solid transparent";
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

function Menu({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "15px 25px",
        cursor: "pointer",
        transition: "0.3s",
        textDecoration: "none",
        color: "white",
        background: isActive ? "#334155" : "transparent",
        borderLeft: isActive
          ? "5px solid #38bdf8"
          : "5px solid transparent",
      })}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}

export default Sidebar;