'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Map,
  Activity,
  Radio,
  CalendarClock,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Metro Map",
    icon: Map,
    href: "/metro-map",
  },
  {
    title: "Crowd Monitoring",
    icon: Activity,
    href: "/crowd-monitoring",
  },
  {
    title: "Live Monitoring",
    icon: Radio,
    href: "/live-monitoring",
  },
  {
    title: "Scheduling",
    icon: CalendarClock,
    href: "/scheduling",
  },
  {
    title: "Frequency Adjustment",
    icon: CalendarClock,
    href: "/frequency-adjustment",
  },
  {
    title: "AI Prediction",
    icon: BrainCircuit,
    href: "/ai-prediction",
  },
  {
    title: "Passenger Flow Forecast",
    icon: Activity,
    href: "/forecast",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Statistics",
    icon: BarChart3,
    href: "/statistics",
  },
  {
    title: "Platform Admin",
    icon: Settings,
    href: "/admin",
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };
  return (
    <aside
      className={`${open ? "w-72" : "w-20"
        } fixed left-0 top-0 h-screen transition-all duration-300 bg-slate-900 border-r border-slate-800 overflow-hidden flex flex-col z-50`}
    >

      <div className="p-4 border-b border-slate-800">

        <button
          onClick={() => setOpen(!open)}
          className="text-white mb-4"
        >
          <Menu size={24} />
        </button>

        {open && (
          <>
            <h1 className="text-2xl font-bold text-cyan-400">
              MetroFlow AI
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Operations Center
            </p>
          </>
        )}

      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">

        {menu
          .filter((item) => !item.adminOnly || userRole === "admin")
          .map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition
      ${pathname === item.href
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                  }`}
              >
                <Icon size={20} />

                {open && (
                  <span>
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}

      </nav>

      <div className="mt-auto w-full p-4 border-t border-slate-800">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
        >

          <LogOut size={20} />

          {open && "Logout"}

        </button>

      </div>

    </aside>
  );
}