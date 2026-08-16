import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, Train, Users, Calendar, BarChart2, Bell, Settings,
  TrainFront, ChevronLeft, ChevronRight, LogOut, MonitorSmartphone, Zap, Bot
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { getInitials } from "../utils/helpers";

const adminNavItems = [
  { to: ROUTES.OPERATIONS_DASHBOARD, label: "Operations Dashboard", icon: MonitorSmartphone },
  { to: ROUTES.CROWD_PREDICTION, label: "Crowd Prediction", icon: Activity },
  { to: ROUTES.RIDERSHIP_PREDICTION, label: "Ridership Prediction", icon: Users },
  { to: ROUTES.FREQUENCY_ADJUSTMENT, label: "Frequency Adjustment", icon: TrainFront },
  { to: ROUTES.TRAIN_STATUS, label: "Train Status", icon: Train },
  { to: ROUTES.DELAY_PREDICTION, label: "Delay Prediction", icon: Zap },
  { to: ROUTES.SCHEDULE_OPTIMIZER, label: "Train Schedule Optimizer", icon: Bot },
  { to: ROUTES.SCHEDULES, label: "Schedules", icon: Calendar },
  { to: ROUTES.ANALYTICS, label: "Analytics", icon: BarChart2 },
  { to: ROUTES.ALERTS, label: "Alerts", icon: Bell, badge: 3 },
  { to: ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

const userNavItems = [
  { to: "/user-dashboard", label: "Dashboard", icon: MonitorSmartphone },
  { to: "/user-dashboard/train-status", label: "Train Status", icon: Train },
  { to: "/user-dashboard/schedules", label: "Schedules", icon: Calendar },
  { to: "/user-dashboard/crowd-prediction", label: "Crowd Prediction", icon: Activity },
  { to: "/user-dashboard/alerts", label: "Alerts", icon: Bell },
  { to: "/user-dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isItemActive = (to) => {
    if (to === "/user-dashboard") return location.pathname === "/user-dashboard";
    if (isAdmin && to === ROUTES.OPERATIONS_DASHBOARD) {
      return location.pathname === "/" || location.pathname === ROUTES.OPERATIONS_DASHBOARD;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <aside
      className="flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex-shrink-0 relative"
      style={{ width: collapsed ? "72px" : "260px" }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            M
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-slate-900 dark:text-white font-bold text-sm leading-none truncate">
                Metro CMS
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs leading-none mt-1 truncate">
                Crowd Management
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand Button (When Collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center justify-center py-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200 dark:border-slate-800"
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => {
          const isActive = isItemActive(to);
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`nav-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              
              {/* Badges */}
              {badge && !collapsed && (
                <span className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {badge}
                </span>
              )}
              {badge && collapsed && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-default">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-bold flex-shrink-0">
              {user ? getInitials(user.full_name || user.name || user.username || "User") : "U"}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-slate-900 dark:text-white text-xs font-semibold truncate">
                {user?.full_name || user?.name || user?.username || "Metro User"}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs capitalize truncate mt-0.5">
                {user?.role || "user"}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}