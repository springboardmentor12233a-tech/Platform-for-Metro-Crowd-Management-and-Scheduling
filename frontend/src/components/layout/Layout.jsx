import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out
          ${collapsed ? "ml-[90px]" : "ml-[280px]"}
        `}
      >
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;