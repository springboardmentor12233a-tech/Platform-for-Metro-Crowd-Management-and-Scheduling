import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`
          flex-1
          transition-all
          duration-300
          ease-in-out
          overflow-x-hidden
          ${collapsed ? "ml-[90px]" : "ml-[280px]"}
        `}
      >
        <Navbar />

        <div className="px-10 py-8">
          {children}
        </div>
      </main>

    </div>
  );
}

export default Layout;