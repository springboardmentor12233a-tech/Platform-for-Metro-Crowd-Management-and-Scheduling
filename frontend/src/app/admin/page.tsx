"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommandCenterLayout from "@/components/CommandCenterLayout";
import { api } from "@/utils/api";
import { Users, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("metroflow_user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setCurrentUser(parsed);
      
      // Strict role check protection on mount
      if (parsed.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const data = await api.auth.getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      alert("Self privilege escalation or demotion is locked. Contact root admin.");
      return;
    }
    
    try {
      await api.auth.changeRole(userId, newRole);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user role.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Deleting own authenticated account is prohibited.");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this operator account?")) return;
    try {
      await api.auth.deleteUser(userId);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Could not delete user.");
    }
  };

  if (loading) {
    return (
      <CommandCenterLayout>
        <div className="flex h-full w-full items-center justify-center text-cyan-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="font-mono text-xs tracking-wider text-cyan-300">QUERYING OPERATOR DIRECTORY...</p>
          </div>
        </div>
      </CommandCenterLayout>
    );
  }

  return (
    <CommandCenterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyan-400 text-glow-cyan flex items-center space-x-2">
            <Users size={22} />
            <span>ROLE & IDENTITY PRIVILEGES</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono">Manage command console operator credentials and access permissions</p>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-slate-800 bg-[#070b19] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                  <th className="p-4">Operator Name</th>
                  <th className="p-4">Work Email</th>
                  <th className="p-4">System Role</th>
                  <th className="p-4 text-right">Delete Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-350">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-200">{u.fullName}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      {u.id === currentUser?.id ? (
                        <span className="rounded bg-red-950/80 border border-red-800/40 px-2.5 py-1 text-[10px] text-red-400 font-bold uppercase">
                          {u.role} (Current User)
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded bg-slate-900 border border-slate-800 py-1 px-3.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                        >
                          <option value="admin">Administrator</option>
                          <option value="manager">Traffic Manager</option>
                          <option value="user">Passenger Observer</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          title="Revoke and Delete credentials"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}
