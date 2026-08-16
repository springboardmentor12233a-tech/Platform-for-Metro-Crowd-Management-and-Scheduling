import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  
  const isAdmin = user?.role === "admin";

  return (
    // Removed the hardcoded bg-slate-900. 
    // It now transparently inherits the Light/Dark background from App.jsx
    <div className="flex h-screen overflow-hidden bg-transparent">
      
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        user={user}
        isAdmin={isAdmin}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setSidebarCollapsed((c) => !c)}
        />

        {/* Adjusted padding for better responsiveness on mobile vs desktop */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}