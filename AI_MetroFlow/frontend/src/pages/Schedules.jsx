import React, { useEffect, useState } from 'react';
import { scheduleService } from '../services/api';
import { Clock, Sliders, Zap, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Frequency optimizer form state
  const [routeName, setRouteName] = useState('Yellow Line Northbound');
  const [timeWindow, setTimeWindow] = useState('Peak Morning');
  const [targetOccupancy, setTargetOccupancy] = useState(80);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    scheduleService.getSchedules()
      .then(res => setSchedules(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setOptimizing(true);
    try {
      const res = await scheduleService.optimizeFrequency({
        route_name: routeName,
        time_window: timeWindow,
        target_max_occupancy: parseFloat(targetOccupancy)
      });
      setOptimizationResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Operations Dispatch & Headway Scheduling</h1>
        <p className="text-sm text-slate-400">Timetable platform assignment & frequency optimization engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule Timetable Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Active Train Schedules ({schedules.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Schedule ID</th>
                  <th className="p-3">Train</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Dep - Arr</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {schedules.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-mono font-semibold text-indigo-300">{sc.id}</td>
                    <td className="p-3 text-white font-medium">{sc.train_id}</td>
                    <td className="p-3 text-slate-300">{sc.route_name}</td>
                    <td className="p-3 text-slate-300">{sc.departure_time} - {sc.arrival_time}</td>
                    <td className="p-3 font-semibold text-cyan-400">Platform {sc.platform}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sc.status === 'On Time' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {sc.status} {sc.delay_minutes > 0 && `(+${sc.delay_minutes}m)`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Frequency Optimizer Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold font-heading text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>AI Headway Frequency Optimizer</span>
          </h2>

          <form onSubmit={handleOptimize} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Route</label>
              <select
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Yellow Line Northbound">Yellow Line Northbound</option>
                <option value="Red Line Eastbound">Red Line Eastbound</option>
                <option value="Blue Line Express">Blue Line Express</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Time Window</label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Peak Morning">Peak Morning (08:00 - 10:30)</option>
                <option value="Peak Evening">Peak Evening (17:00 - 20:00)</option>
                <option value="Off-Peak">Off-Peak Hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Occupancy Limit ({targetOccupancy}%)</label>
              <input
                type="range"
                min="50"
                max="95"
                value={targetOccupancy}
                onChange={(e) => setTargetOccupancy(e.target.value)}
                className="w-full accent-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={optimizing}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:from-amber-400 hover:to-amber-500 transition"
            >
              {optimizing ? 'Calculating Optimal Dispatch...' : 'Run Optimization Algorithm'}
            </button>
          </form>

          {/* Results Output */}
          {optimizationResult && (
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="text-xs font-bold text-amber-400">Headway Recommendation Output</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Recommended Headway</span>
                  <span className="text-lg font-bold text-cyan-400">{optimizationResult.recommended_headway_minutes} mins</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Fleet Count Needed</span>
                  <span className="text-lg font-bold text-emerald-400">{optimizationResult.recommended_train_count} cars</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 pt-1">
                Estimated crowd reduction: <span className="font-semibold text-emerald-400">+{optimizationResult.crowd_reduction_percent}%</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
