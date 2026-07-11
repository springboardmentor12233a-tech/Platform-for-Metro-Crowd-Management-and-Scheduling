import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useWebSockets } from '../context/WebSocketContext';
import { Sun, Moon, Bell, Shield, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { realTimeData, wsConnected } = useWebSockets();
  const [showAlerts, setShowAlerts] = useState(false);

  const activeAlerts = realTimeData?.alerts || [];

  return (
    <header className="h-16 glass-panel border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* Search / Page title placeholder */}
      <div>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 hidden sm:block">
          AI MetroFlow Operations Center
        </h2>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* WebSocket Connection Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
          {wsConnected ? (
            <>
              <Wifi size={14} className="text-green-500 animate-pulse" />
              <span>Live Stream Connected</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-red-500" />
              <span>Stream Disconnected</span>
            </>
          )}
        </div>

        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all duration-200"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Alerts Bell Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-all relative duration-200"
            title="System Alerts"
          >
            <Bell size={20} />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-xl glass-panel border border-slate-200 dark:border-slate-800 py-3 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm">System Alerts ({activeAlerts.length})</span>
                <Link to="/alerts" onClick={() => setShowAlerts(false)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    No active system alerts.
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="px-4 py-3 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50 last:border-b-0 flex flex-col gap-1 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          alert.level === 'Critical' ? 'text-red-500' : 'text-orange-500'
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-[9px] opacity-60">
                          {alert.timestamp.includes('T') ? alert.timestamp.split('T')[1].substring(0, 8) : 'Now'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
