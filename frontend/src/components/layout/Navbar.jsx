import { FiBell, FiChevronDown, FiDownload, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();          // Clears token & user from AuthContext
    navigate("/");     // Redirect to login page
  };

  return (
    <header className="h-24 bg-white shadow-sm flex items-center justify-end px-10 gap-5">

      <button className="flex items-center gap-2 px-5 py-3 rounded-xl border bg-white hover:shadow transition">
        📅
        <span>5 Jul, 2026</span>
        <FiChevronDown />
      </button>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition">
        <FiDownload />
        Export Report
      </button>

      <button className="relative w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
        <FiBell size={20} />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          3
        </span>
      </button>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <p className="font-semibold">{user?.name || "User"}</p>
          <p className="text-sm text-gray-500">{user?.role || "Member"}</p>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition"
      >
        <FiLogOut />
        Sign Out
      </button>

    </header>
  );
}

export default Navbar;