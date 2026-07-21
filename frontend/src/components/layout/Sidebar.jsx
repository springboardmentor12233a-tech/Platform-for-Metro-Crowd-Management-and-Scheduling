import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdGroups,
  MdCalendarMonth,
  MdAnalytics,
  MdSettings,
  MdDirectionsSubway,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdPsychology,
  MdTimeline,
  MdHistory,
  MdAltRoute,
  MdNotificationImportant,
} from "react-icons/md";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
    roles: ["Admin", "Operator", "Analyst", "Member"],
  },
  {
    name: "Crowd Monitoring",
    path: "/crowd",
    icon: <MdGroups />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "Schedule",
    path: "/schedule",
    icon: <MdCalendarMonth />,
    roles: ["Admin", "Operator"],
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <MdAnalytics />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "AI Prediction",
    path: "/prediction",
    icon: <MdPsychology />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "Forecasting",
    path: "/forecast",
    icon: <MdTimeline />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "Smart Scheduling",
    path: "/smart-schedule",
    icon: <MdAltRoute />,
    roles: ["Admin", "Operator"],
  },
  {
    name: "Prediction History",
    path: "/prediction-history",
    icon: <MdHistory />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "AI Alerts",
    path: "/alerts",
    icon: <MdNotificationImportant />,
    roles: ["Admin", "Operator", "Analyst"],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <MdSettings />,
    roles: ["Admin"],
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(user?.role)
  );

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        h-screen
        bg-[#060B26]
        text-white
        shadow-2xl
        flex
        flex-col
        z-50
        transition-all
        duration-500
        ease-in-out
        ${collapsed ? "w-[90px]" : "w-[280px]"}
      `}
    >
      {/* Logo */}

      <div className="border-b border-slate-800 px-5 py-6">
        <div
          className={`
            flex
            items-center
            transition-all
            duration-500
            ${collapsed ? "justify-center" : "gap-4"}
          `}
        >
          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-gradient-to-br
              from-indigo-500
              to-violet-600
              flex
              items-center
              justify-center
              shadow-lg
              transition-transform
              duration-300
              hover:scale-110
            "
          >
            <MdDirectionsSubway className="text-2xl" />
          </div>

          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >
            <h1 className="text-3xl font-bold whitespace-nowrap">
              MetroFlow
            </h1>

            <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
              AI Metro Operations
            </p>
          </div>
        </div>
      </div>

      {/* User Card */}

      {!collapsed && user && (
        <div className="px-4 pt-5">
          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="overflow-hidden">
                <h3 className="font-semibold truncate">
                  {user.name}
                </h3>

                <p className="text-xs text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-3 py-6">
        {filteredMenus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) => `
              flex
              items-center
              ${collapsed ? "justify-center" : "gap-4"}
              px-4
              py-4
              rounded-2xl
              mb-3
              transition-all
              duration-300
              group
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30"
                  : "hover:bg-slate-800 hover:translate-x-1"
              }
            `}
          >
            <div
              className="
                text-2xl
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {menu.icon}
            </div>

            <span
              className={`
                whitespace-nowrap
                overflow-hidden
                transition-all
                duration-500
                font-medium
                text-[16px]
                ${
                  collapsed
                    ? "w-0 opacity-0"
                    : "w-auto opacity-100"
                }
              `}
            >
              {menu.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* AI Status */}

      <div className="px-4 pb-5">
        <div
          className="
            rounded-3xl
            bg-gradient-to-br
            from-indigo-600
            to-purple-700
            shadow-xl
            transition-all
            duration-500
            overflow-hidden
          "
        >
          {collapsed ? (
            <div className="py-6 flex justify-center text-4xl">
              🤖
            </div>
          ) : (
            <div className="p-5">
              <p className="text-sm opacity-90">
                ✨ AI Status
              </p>

              <div className="flex items-center gap-2 mt-3">
                <h2 className="text-3xl font-bold">
                  Active
                </h2>

                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              </div>

              <p className="text-sm opacity-90 mt-3">
                All AI services are operational
              </p>

              <div className="mt-5 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-5xl">
                  🤖
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}

      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            py-3
            hover:bg-slate-800
            transition-all
            duration-300
          "
        >
          {collapsed ? (
            <MdKeyboardDoubleArrowRight size={24} />
          ) : (
            <>
              <MdKeyboardDoubleArrowLeft size={24} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}