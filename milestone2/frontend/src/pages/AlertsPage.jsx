import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { AlertOctagon, HelpCircle, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';

const AlertsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isOperator = user?.role === 'Metro Operator';
  const canModify = isAdmin || isOperator;

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Active');
  const [levelFilter, setLevelFilter] = useState('');
  
  // Resolve dialog states
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolvingId, setResolvingId] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alerts', {
        params: {
          status: statusFilter || undefined,
          level: levelFilter || undefined,
          limit: 30
        }
      });
      setAlerts(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, levelFilter]);

  const handleOpenResolve = (id) => {
    setResolvingId(id);
    setResolutionNotes('');
    setShowResolveForm(true);
  };

  const handleResolveAlert = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/alerts/${resolvingId}`, {
        status: 'Resolved',
        resolution_notes: resolutionNotes
      });
      setShowResolveForm(false);
      fetchAlerts();
    } catch (err) {
      alert('Failed to resolve alert.');
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Delete this alert log entry?")) return;
    try {
      await api.delete(`/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      alert('Failed to delete alert.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Alerts Log</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Real-time incident tracking, safety triggers, and resolution logs.
          </p>
        </div>
      </div>

      {/* Filters */}
      <GlassmorphicCard className="flex items-center gap-4 p-4 text-xs font-semibold" hoverEffect={false}>
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="opacity-60" />
          <span>Status Filter:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active Alerts</option>
          <option value="Resolved">Resolved logs</option>
        </select>

        <div className="flex items-center gap-2 ml-4">
          <span>Severity:</span>
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border cursor-pointer"
        >
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Warning">Warning</option>
          <option value="Info">Info</option>
        </select>
      </GlassmorphicCard>

      {/* Alerts feed list */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs font-semibold">Loading system alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500 font-semibold">No alerts registered.</div>
        ) : (
          alerts.map((alert) => (
            <GlassmorphicCard 
              key={alert.id} 
              className={`border-l-4 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.status === 'Resolved'
                  ? 'border-l-green-500/50 bg-slate-100/30 dark:bg-slate-900/10'
                  : alert.level === 'Critical'
                  ? 'border-l-red-500 bg-red-500/[0.02]'
                  : alert.level === 'Warning'
                  ? 'border-l-orange-500 bg-orange-500/[0.02]'
                  : 'border-l-blue-500 bg-blue-500/[0.02]'
              }`}
              hoverEffect={false}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    alert.level === 'Critical' ? 'bg-red-500/10 text-red-500' : alert.level === 'Warning' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Logged: {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {alert.message}
                </p>

                {alert.resolution_notes && (
                  <div className="text-xs p-2.5 rounded-lg bg-green-500/5 border border-green-500/10 text-green-200 mt-2">
                    <b>Resolution note:</b> {alert.resolution_notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {alert.status === 'Active' && canModify && (
                  <button 
                    onClick={() => handleOpenResolve(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-green-500/15"
                  >
                    <CheckCircle2 size={14} />
                    <span>Resolve</span>
                  </button>
                )}
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </GlassmorphicCard>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {showResolveForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg">Log Alert Resolution</h3>
            <form onSubmit={handleResolveAlert} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500">Operational Resolution Action Notes</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain what steps were taken to resolve this incident..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setShowResolveForm(false)} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">Mark Resolved</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
