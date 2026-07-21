import { useState } from "react";
import {
  MdNotificationsNone,
  MdLogout,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="bg-white rounded-3xl shadow-md px-8 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          {greeting}, {user?.name}
        </h2>

        <p className="text-slate-500 mt-1">
          Welcome back to MetroFlow
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <MdNotificationsNone
            size={30}
            className="text-slate-700 hover:text-indigo-600 transition"
          />

          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 hover:bg-slate-100 rounded-xl p-2 transition"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="text-left hidden md:block">
              <h3 className="font-semibold">
                {user?.name}
              </h3>

              <p className="text-sm text-slate-500">
                {user?.role}
              </p>
            </div>

            <MdKeyboardArrowDown />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
              <div className="p-4">
                <h3 className="font-semibold">
                  {user?.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {user?.email}
                </p>

                <span className="inline-block mt-3 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-4 flex items-center gap-3 hover:bg-red-50 text-red-600"
              >
                <MdLogout size={22} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}