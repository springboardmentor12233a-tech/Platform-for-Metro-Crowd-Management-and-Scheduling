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
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  const userRole = user?.role || 'Guest';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Metro Map', path: '/map', icon: Map, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Crowd Monitoring', path: '/crowd', icon: Users, roles: ['Admin', 'Metro Operator', 'Analyst'] },
    { name: 'Scheduling', path: '/scheduling', icon: CalendarDays, roles: ['Admin', 'Metro Operator'] },
    { name: 'AI Predictions', path: '/predictions', icon: BrainCircuit, roles: ['Admin', 'Analyst'] },
    { name: 'Analytics Reports', path: '/reports', icon: FileSpreadsheet, roles: ['Admin', 'Analyst'] },
    { name: 'Stations', path: '/stations', icon: Building2, roles: ['Admin', 'Metro Operator'] },
    { name: 'Trains', path: '/trains', icon: Train, roles: ['Admin', 'Metro Operator'] },
    { name: 'Admin Panel', path: '/admin', icon: ShieldAlert, roles: ['Admin'] },

    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Metro Operator', 'Analyst'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 text-white font-extrabold text-xl">
          MF
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
            MetroFlow
          </h1>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
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
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-violet-500 dark:hover:text-cyan-400'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <Link to="/profile" className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 uppercase">
              {userRole}
            </span>
          </div>
        </Link>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
