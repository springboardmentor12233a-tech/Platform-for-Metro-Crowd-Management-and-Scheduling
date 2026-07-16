import { Link } from "react-router-dom";
import { FaTrain } from "react-icons/fa";

function Navbar() {

  return (

    <nav className="navbar-custom">

      <div className="navbar-logo">
        <FaTrain />
        <span style={{ marginLeft: "8px" }}>MetroFlow</span>
      </div>

      <div>

        <Link to="/">Home</Link>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/prediction">Prediction</Link>

        <Link to="/schedule">Schedule</Link>

        <Link to="/monitor">Monitoring</Link>

        <Link to="/forecast">Forecast</Link>

        <Link to="/report">Reports</Link>

      </div>

    </nav>

  );

}

export default Navbar;