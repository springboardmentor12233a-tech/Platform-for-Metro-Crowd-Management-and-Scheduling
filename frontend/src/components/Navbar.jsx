import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#0D47A1",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>🚇 AI MetroFlow</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/dashboard">Dashboard</Link>
        <Link style={linkStyle} to="/prediction">Prediction</Link>
        <Link style={linkStyle} to="/monitoring">Monitoring</Link>
        <Link style={linkStyle} to="/analytics">Analytics</Link>
        <Link style={linkStyle} to="/about">About</Link>
        <Link style={linkStyle} to="/reports">Reports</Link>
      <Link style={linkStyle} to="/schedule">Schedule</Link>
      <Link style={linkStyle} to="/alerts">Alerts</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

export default Navbar;