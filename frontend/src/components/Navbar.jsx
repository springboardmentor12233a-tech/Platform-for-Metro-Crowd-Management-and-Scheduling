import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🚇 AI MetroFlow
      </div>

      <div className="nav-links">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/prediction"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Prediction
        </NavLink>

        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Monitoring
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Analytics
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Reports
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Alerts
        </NavLink>

        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Schedule
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;