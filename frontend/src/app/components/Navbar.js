"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/schedules", label: "Schedules", color: "bg-green-600 hover:bg-green-700" },
    { href: "/predict", label: "Crowd Prediction", color: "bg-blue-600 hover:bg-blue-700" },
    { href: "/insights", label: "AI Insights", color: "bg-indigo-600 hover:bg-indigo-700" },
    { href: "/alerts", label: "Alerts", color: "bg-red-600 hover:bg-red-700" },
    { href: "/analytics", label: "Analytics", color: "bg-purple-600 hover:bg-purple-700" },
    { href: "/heatmap", label: "Heatmap", color: "bg-orange-600 hover:bg-orange-700" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-slate-900 text-lg mr-3">MetroFlow</span>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`text-white px-3 py-1.5 rounded-lg text-sm font-medium ${
              link.color || "bg-slate-700 hover:bg-slate-800"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {username ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Logged in as <strong>{username}</strong> ({role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/login"
          className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          Login
        </a>
      )}
    </nav>
  );
}