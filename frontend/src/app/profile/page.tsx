"use client";

import React, { useState, useEffect } from "react";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { User, LogOut, ShieldCheck, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("metroflow_token");
    localStorage.removeItem("metroflow_user");
    router.push("/");
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin": return "System Administrator. Full access to write/update and delete master-data registers, promote roles, and resolve critical incidents.";
      case "manager": return "Traffic Manager. Operational control over line routing, train schedule adjustments, dashboard analytics, and alert broadcasts.";
      default: return "Passenger Observer. Read-only passenger-facing views. General traveler assistance support links.";
    }
  };

  return (
    <CommandCenterLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan">
            OPERATOR SETTINGS
          </h1>
          <p className="text-xs text-slate-500 font-mono">Manage connection configuration and identity logs</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] p-6 shadow-md space-y-6">
          <div className="flex items-center space-x-4 border-b border-slate-850 pb-4">
            <div className="h-14 w-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-cyan-400">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-slate-200">{user?.fullName}</h2>
              <span className="rounded bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-widest mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-slate-400">
              <Mail size={15} className="text-cyan-400" />
              <span>Email: <strong className="text-slate-200">{user?.email}</strong></span>
            </div>

            <div className="flex items-start space-x-2 text-slate-400 leading-relaxed">
              <ShieldCheck size={15} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Scope limits: <br />
                <p className="text-slate-500 text-[11px] mt-1">{getRoleDescription(user?.role)}</p>
              </span>
            </div>
          </div>

          <div className="border-t border-slate-850 pt-5 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 rounded-lg border border-red-800 bg-red-950/20 py-2.5 px-4 font-mono text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all uppercase"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
