import { useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiDownload,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../../context/AuthContext";
import NotificationDrawer from "../common/NotificationDrawer";
import useMetro from "../../hooks/useMetro";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useMetro();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("MetroVision Dashboard Report", 20, 20);

    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: [
        ["Total Passengers", "125000"],
        ["Revenue", "₹2.8 Cr"],
        ["Stations", "142"],
        ["AI Accuracy", "98%"],
      ],
    });

    doc.save("MetroVision_Report.pdf");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="px-4 md:px-6 lg:px-8 py-4">

        <div className="flex flex-wrap items-center justify-end gap-3">

          {/* Date */}

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            customInput={
              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  hover:shadow
                  transition
                "
              >
                📅

                <span className="hidden sm:inline">
                  {selectedDate.toLocaleDateString("en-IN")}
                </span>

                <FiChevronDown />
              </button>
            }
          />

          {/* Export */}

          <button
            onClick={handleExport}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-2.5
              text-white
              hover:bg-indigo-700
              transition
            "
          >
            <FiDownload />

            <span className="hidden md:inline">
              Export Report
            </span>
          </button>

          {/* Notification */}

          <div className="relative">
            <button
              onClick={() => setNotificationOpen(true)}
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow
                hover:bg-slate-100
                transition
              "
            >
              <FiBell size={20} />

              {notifications.length > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    text-xs
                    text-white
                  "
                >
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User */}

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
              "
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="hidden xl:block">
                <p className="font-semibold">
                  {user?.name}
                </p>

                <p className="text-sm text-slate-500">
                  {user?.role}
                </p>
              </div>
            </button>

            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  rounded-2xl
                  border
                  bg-white
                  shadow-xl
                  z-50
                "
              >
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50"
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50"
                >
                  ⚙ Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-500
              px-5
              py-2.5
              text-white
              hover:bg-red-600
              transition
            "
          >
            <FiLogOut />

            <span className="hidden lg:inline">
              Sign Out
            </span>
          </button>

        </div>

      </div>
      </header>

      <NotificationDrawer
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}

export default Navbar;