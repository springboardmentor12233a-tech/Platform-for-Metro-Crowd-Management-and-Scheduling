import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar(){

  const location = useLocation();

  return(
    <div className="sidebar">

      <div className="logo">
        <h2>🚇 MetroFlow AI</h2>
      </div>

      <nav>

        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/prediction"
          className={location.pathname === "/prediction" ? "active" : ""}
        >
          Crowd Prediction
        </Link>

        <Link
          to="/analytics"
          className={location.pathname === "/analytics" ? "active" : ""}
        >
          Analytics
        </Link>

      </nav>

    </div>
  );
}

export default Sidebar;