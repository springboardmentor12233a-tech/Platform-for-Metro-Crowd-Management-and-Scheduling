import { Link } from "react-router-dom";

function Sidebar() {
  const linkStyle = {
    display: "block",
    color: "white",
    textDecoration: "none",
    margin: "18px 0",
    fontSize: "18px",
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#263238",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>Navigation</h2>

      <hr />

      <Link to="/" style={linkStyle}>
        🏠 Dashboard
      </Link>

      <Link to="/prediction" style={linkStyle}>
        📊 Crowd Prediction
      </Link>

      <Link to="/forecast" style={linkStyle}>
        🚉 Demand Forecast
      </Link>

      <Link to="/schedule" style={linkStyle}>
        🚆 Train Schedule
      </Link>

      <Link to="/frequency" style={linkStyle}>
        🚄 Frequency Adjustment
      </Link>

      <Link to="/monitoring" style={linkStyle}>
        📡 Live Monitoring
      </Link>

      <Link to="/reports" style={linkStyle}>
        📈 Traffic Reports
      </Link>
      <Link to="/history" style={linkStyle}>
        🕘 Prediction History
      </Link>
    </div>
  );
}

export default Sidebar;