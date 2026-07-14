import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background is clean and flat based on index.css */}

      {/* Sidebar navigation */}
      <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />

      {/* Main content area */}
      <div className="md:pl-64 min-h-screen flex flex-col relative z-10 w-full transition-all duration-300">
        {/* Top Navbar */}
        <Navbar toggleMobileMenu={toggleMobileMenu} />

        {/* Dynamic page content */}
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
