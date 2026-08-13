import { NavLink } from "react-router-dom";
import {
  FaGaugeHigh,
  FaChartLine,
  FaPeopleGroup,
  FaFileLines,
  FaCalendarDays,
  FaClock,
  FaClockRotateLeft,
  FaTriangleExclamation,
  FaRobot,
  FaBell,
  FaChartPie,
  FaMapLocationDot,
} from "react-icons/fa6";
import "../styles/Sidebar.css";

const navigation = [
  ["/dashboard", "Dashboard", FaGaugeHigh],
  ["/prediction", "Prediction", FaChartLine],
  ["/monitoring", "Monitoring", FaPeopleGroup],
  ["/reports", "Reports", FaFileLines],
  ["/schedule", "Schedule", FaCalendarDays],
  ["/frequency", "Frequency", FaClock],
  ["/history", "Prediction History", FaClockRotateLeft],
];

const aiNavigation = [
  ["/emergency-announcement", "Emergency Announcement", FaTriangleExclamation],
  ["/smart-alerts", "Smart Alerts", FaRobot],
  ["/schedule-updates", "Schedule Updates", FaBell],
  ["/analytics-dashboard", "Analytics Dashboard", FaChartPie],
  ["/heatmap", "Congestion Heatmap", FaMapLocationDot],
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo"><FaTrainIcon /></div>
        <div>
          <h2>MetroFlow</h2>
          <span>SMART MOBILITY</span>
        </div>
      </div>

      <div className="sidebar-section-title">MAIN MENU</div>
      <nav>
        {navigation.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-title ai-title">AI & ANALYTICS</div>
      <nav>
        {aiNavigation.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <div>
          <strong>System Online</strong>
          <small>MetroFlow Services</small>
        </div>
      </div>
    </aside>
  );
}

function FaTrainIcon() {
  return <span className="train-mark">🚇</span>;
}

export default Sidebar;
