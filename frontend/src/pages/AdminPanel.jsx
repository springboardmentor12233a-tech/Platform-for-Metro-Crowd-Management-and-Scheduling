import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { ShieldCheck, UserCheck, UserMinus, Trash2, ShieldAlert } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch operations team users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/auth/users/${user.id}/status`, { status: nextStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to toggle status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this operational user account permanently?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Loading users database...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-blue-500" />
          <span>Operational Control Center</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Administrator panel to audit team access rights, active/inactive staff roles, and delete user profiles.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-200 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert size={16} className="text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Users table */}
      <GlassmorphicCard hoverEffect={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 opacity-60">
                <th className="pb-3 font-bold">Staff Member</th>
                <th className="pb-3 font-bold">Email</th>
                <th className="pb-3 font-bold">Authorized Role</th>
                <th className="pb-3 font-bold text-center">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-200/20 dark:hover:bg-slate-800/20 transition-all">
                  <td className="py-4 font-bold text-sm text-slate-800 dark:text-slate-200">{u.name}</td>
                  <td className="py-4 font-semibold opacity-75">{u.email}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                          u.status === 'Active'
                            ? 'bg-slate-200 dark:bg-slate-800 hover:text-red-500'
                            : 'bg-slate-200 dark:bg-slate-800 hover:text-green-500'
                        }`}
                        title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.status === 'Active' ? <UserMinus size={14} /> : <UserCheck size={14} />}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:text-red-500 transition-colors"
                        title="Delete Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default AdminPanel;
