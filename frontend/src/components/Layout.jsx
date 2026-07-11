import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background nebula glowing rings */}
      <div className="absolute -top-40 left-[20%] w-[600px] h-[600px] rounded-full bg-violet-500/5 dark:bg-violet-500/8 blur-[130px] pointer-events-none"></div>
      <div className="absolute -bottom-40 right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/8 blur-[130px] pointer-events-none"></div>

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="pl-64 min-h-screen flex flex-col relative z-10">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page content */}
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
