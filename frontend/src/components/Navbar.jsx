import { FaTrain, FaCircleUser } from "react-icons/fa6";

function Navbar() {
  const name = localStorage.getItem("name") || "User";

  return (
    <header className="top-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo"><FaTrain /></div>
        <div>
          <h2>MetroFlow</h2>
          <span>Metro Crowd Management</span>
        </div>
      </div>

      <div className="navbar-user">
        <FaCircleUser className="navbar-user-icon" />
        <div>
          <strong>{name}</strong>
          <span>Authorized User</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
