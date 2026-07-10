import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>MetroFlow</h2>

      <div>
        <Link
          to="/dashboard"
          style={{ color: "white", textDecoration: "none", marginRight: "20px" }}
        >
          Dashboard
        </Link>

        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Logout
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
