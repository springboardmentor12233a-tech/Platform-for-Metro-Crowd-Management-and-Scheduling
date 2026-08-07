import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
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
          transition-all
          duration-300
          ease-in-out
          min-h-screen
          ${
            collapsed
              ? "ml-[90px] w-[calc(100%-90px)]"
              : "ml-[280px] w-[calc(100%-280px)]"
          }
        `}
      >
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;