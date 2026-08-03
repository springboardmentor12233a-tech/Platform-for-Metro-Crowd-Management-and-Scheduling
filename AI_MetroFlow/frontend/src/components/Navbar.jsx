import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Bell, Wifi, WifiOff, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected } = useWebSocket();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Title / Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white">
            M
          </div>
          <span className="font-heading font-bold text-lg tracking-wide text-white">
            AI <span className="text-cyan-400">MetroFlow</span>
          </span>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          Delhi Rapid Transit Network
        </span>
      </div>

      {/* Connection status & User Profile */}
      <div className="flex items-center space-x-5">
        {/* WebSocket status pill */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${
          connected 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        }`}>
          {connected ? <Wifi className="w-3.5 h-3.5 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{connected ? 'Live WS Stream' : 'Connecting...'}</span>
        </div>

        {/* User Card & Logout */}
        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-200">{user.name}</p>
              <p className="text-xs text-indigo-400 flex items-center justify-end space-x-1">
                <ShieldCheck className="w-3 h-3 inline" />
                <span>{user.role}</span>
              </p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
