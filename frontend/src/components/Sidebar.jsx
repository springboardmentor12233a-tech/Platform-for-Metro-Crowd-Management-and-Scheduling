import { NavLink } from "react-router-dom";

function Sidebar() {
const handleLogout = () => {
  localStorage.removeItem("metroflowAuthenticated");
  localStorage.removeItem("metroflowUser");

  window.location.href = "/login";
};
  return (
    <div className="sidebar">

      <div className="logo">
        MetroFlow AI
      </div>

      <div className="menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Dashboard
        </NavLink>

        <NavLink
          to="/prediction"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           AI Prediction
        </NavLink>

        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Monitoring
        </NavLink>

        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Schedule
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Notifications & Alerts
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Reports
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
           Prediction History
        </NavLink>

      </div>
<button
  className="logout-button"
  onClick={handleLogout}
>
  🚪 Logout
</button>
    </div>
  );
}

export default Sidebar;