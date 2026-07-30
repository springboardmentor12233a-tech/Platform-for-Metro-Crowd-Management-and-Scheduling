import {
  LayoutDashboard,
  TrainFront,
  MapPinned,
  CalendarDays,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
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
  icon={<LayoutDashboard size={20} />}
  text="Dashboard"
  active={activePage === "dashboard"}
  onClick={() => setActivePage("dashboard")}
/>
<Menu
  icon={<MapPinned size={20} />}
  text="Stations"
  active={activePage === "stations"}
  onClick={() => setActivePage("stations")}
/>

       <Menu
  icon={<TrainFront size={20} />}
  text="Trains"
  active={activePage === "trains"}
  onClick={() => setActivePage("trains")}
/>

        <Menu
  icon={<CalendarDays size={20} />}
  text="Schedules"
  active={activePage === "schedules"}
  onClick={() => setActivePage("schedules")}
/>

<Menu
  icon={<BrainCircuit size={20} />}
  text="AI Prediction"
  active={activePage === "prediction"}
  onClick={() => setActivePage("prediction")}
/>
        <Menu
  icon={<BarChart3 size={20} />}
  text="Analytics"
  active={activePage === "analytics"}
  onClick={() => setActivePage("analytics")}
/>
        <Menu
  icon={<Settings size={20} />}
  text="Settings"
  active={activePage === "settings"}
  onClick={() => setActivePage("settings")}
/>

        <Menu
          icon={<LogOut size={20} />}
          text="Logout"
          active={false}
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

function Menu({ icon, text, onClick, active }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "15px 25px",
        cursor: "pointer",
        transition: ".3s",
        background: active ? "#334155" : "transparent",
        borderLeft: active
          ? "5px solid #38bdf8"
          : "5px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#334155";
        e.currentTarget.style.borderLeft = "5px solid #38bdf8";
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderLeft =
            "5px solid transparent";
        }
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default Sidebar;