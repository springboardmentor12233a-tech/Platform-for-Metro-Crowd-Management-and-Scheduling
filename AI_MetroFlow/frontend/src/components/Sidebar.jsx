import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  BrainCircuit, 
  FileText, 
  Users, 
  Activity 
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Live Network Map', icon: MapPin, path: '/map' },
    { label: 'Schedules & Dispatch', icon: Clock, path: '/schedules' },
    { label: 'AI Forecasting', icon: BrainCircuit, path: '/ai-predictions' },
    { label: 'Reports & Export', icon: FileText, path: '/reports' },
  ];

  if (user && user.role === 'Admin') {
    navItems.push({ label: 'Staff Management', icon: Users, path: '/users' });
  }

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between hidden md:flex">
      <div className="py-6 px-4 space-y-6">
        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Operations Command
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700/90 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 rounded-xl glass-panel border border-slate-800 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-xs text-indigo-400 font-semibold">
          <Activity className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Surge Prevention Mode</span>
        </div>
        <p className="text-xs text-slate-400">Headway Optimization active across 6 lines.</p>
      </div>
    </aside>
  );
}
