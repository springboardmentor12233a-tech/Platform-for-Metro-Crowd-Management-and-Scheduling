import {
  FaBuilding,
  FaTriangleExclamation,
  FaGaugeHigh,
  FaCircleCheck,
  FaDatabase,
} from "react-icons/fa6";

const iconMap = {
  Stations: FaBuilding,
  "High Crowd": FaTriangleExclamation,
  "Medium Crowd": FaGaugeHigh,
  "Low Crowd": FaCircleCheck,
  "Total Records": FaDatabase,
};

function DashboardCard({ title, value, color }) {
  const Icon = iconMap[title] || FaGaugeHigh;

  return (
    <div className="dashboard-stat-card" style={{ "--card-accent": color }}>
      <div className="stat-card-top">
        <div className="stat-icon"><Icon /></div>
        <span className="stat-status">LIVE</span>
      </div>
      <p>{title}</p>
      <h2>{value ?? 0}</h2>
      <div className="stat-card-line" />
    </div>
  );
}

export default DashboardCard;
