import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

function Navbar() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

  const logout = () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("username");

    navigate("/");

  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link className="navbar-brand fw-bold" to="/dashboard">
          🚇 MetroFlow
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto align-items-center">

            {/* Dashboard */}
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            {/* Prediction */}
            <li className="nav-item">
              <Link className="nav-link" to="/prediction">
                Prediction
              </Link>
            </li>

            {/* Schedule */}
            <li className="nav-item">
              <Link className="nav-link" to="/schedule">
                Schedule
              </Link>
            </li>

            {/* Live Update */}
            <li className="nav-item">
              <Link className="nav-link" to="/schedule-update">
                Live Updates
              </Link>
            </li>

            {/* Forecast */}
            <li className="nav-item">
              <Link className="nav-link" to="/forecast">
                Forecast
              </Link>
            </li>

            {/* Announcement */}
            <li className="nav-item">
              <Link className="nav-link" to="/announcement">
                Announcement
              </Link>
            </li>

            {/* Notification Bell */}

            <li className="nav-item me-3">

              <Link
                className="nav-link position-relative"
                to="/notifications"
              >

                <FaBell size={20} />

                {notifications.length > 0 && (

                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >
                    {notifications.length}
                  </span>

                )}

              </Link>

            </li>

            {/* Admin Only */}

            {role === "admin" && (

              <>

                <li className="nav-item">
                  <Link className="nav-link" to="/monitoring">
                    Monitoring
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/report">
                    Report
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/analytics">
                    Analytics
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/heatmap">
                    Heatmap
                  </Link>
                </li>

              </>

            )}

            {/* Welcome */}

            <li className="nav-item ms-3">

              <span className="nav-link text-warning fw-bold">

                👋 Welcome {name}

              </span>

            </li>

            {/* Role */}

            <li className="nav-item">

              <span className="badge bg-info text-dark me-3">

                {role === "admin" ? "Admin" : "User"}

              </span>

            </li>

            {/* Logout */}

            <li className="nav-item">

              <button
                className="btn btn-danger"
                onClick={logout}
              >
                Logout
              </button>

            </li>
            

          </ul>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;