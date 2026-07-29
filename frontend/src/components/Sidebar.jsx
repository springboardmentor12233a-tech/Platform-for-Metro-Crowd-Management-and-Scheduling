import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  CalendarDays, 
  BrainCircuit, 
  FileSpreadsheet, 
  Train, 
  Building2, 
  Settings, 
  ShieldAlert,
  LogOut,
  Activity,
  TrendingUp,
  Sliders,
  BellRing,
  Megaphone
} from 'lucide-react';

const Sidebar = ({ isOpen, closeMenu }) => {
  const { user, logout } = useAuth();
  
  const userRole = user?.role || 'Guest';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Metro Map', path: '/map', icon: Map, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Crowd Monitoring', path: '/crowd', icon: Users, roles: ['Admin', 'Metro Operator', 'Analyst'] },

    { name: 'Live Monitoring', path: '/live-monitoring', icon: Activity, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Scheduling', path: '/scheduling', icon: CalendarDays, roles: ['Admin', 'Metro Operator'] },
    { name: 'Frequency Adjustment', path: '/frequency-adjustment', icon: Sliders, roles: ['Admin', 'Metro Operator'] },
    { name: 'AI Prediction', path: '/ai-prediction', icon: BrainCircuit, roles: ['Admin', 'Analyst'] },
    { name: 'Passenger Forecast', path: '/passenger-forecast', icon: TrendingUp, roles: ['Admin', 'Analyst'] },
    { name: 'Analytics Reports', path: '/analytics-reports', icon: FileSpreadsheet, roles: ['Admin', 'Analyst'] },
    { name: 'Congestion Heatmap', path: '/heatmap', icon: Map, roles: ['Admin', 'Analyst'] },

    { name: 'System Alerts', path: '/alerts', icon: BellRing, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Stations', path: '/stations', icon: Building2, roles: ['Admin', 'Metro Operator'] },
    { name: 'Trains', path: '/trains', icon: Train, roles: ['Admin', 'Metro Operator'] },
    { name: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['Admin'] },
    { name: 'Admin Panel', path: '/admin', icon: ShieldAlert, roles: ['Admin'] },

    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Metro Operator', 'Analyst'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--card)]/80 backdrop-blur-xl border-r border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col h-screen`}
      >
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--border)] flex items-center gap-3 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white font-extrabold text-xl relative">
          MF
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-cyan-500 blur-lg opacity-40"></div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight gradient-text">
            MetroFlow
          </h1>
          <p className="text-[10px] font-semibold text-cyan-500 dark:text-cyan-400 uppercase tracking-widest">
            AI Platform
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90 text-white shadow-lg shadow-violet-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-cyan-500/10 hover:text-violet-600 dark:hover:text-cyan-400 hover:shadow-md hover:shadow-violet-500/5'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Gradient Divider */}
      <div className="mx-4 gradient-divider"></div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[var(--border)] flex flex-col gap-3">
        <Link to="/profile" className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-cyan-500/10 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-violet-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500/15 to-cyan-500/15 text-violet-500 dark:text-cyan-400 uppercase border border-violet-500/20">
              {userRole}
            </span>
          </div>
        </Link>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-rose-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
