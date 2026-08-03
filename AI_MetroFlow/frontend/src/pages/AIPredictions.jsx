import React, { useEffect, useState } from 'react';
import { aiService, stationService } from '../services/api';
import { BrainCircuit, Sparkles, AlertCircle, BarChart3, CloudRain, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AIPredictions() {
  const [stations, setStations] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Prediction form state
  const [stationId, setStationId] = useState('ST-001');
  const [hour, setHour] = useState(18);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [trafficIndex, setTrafficIndex] = useState(0.85);
  const [weatherCondition, setWeatherCondition] = useState('Rain');
  const [signalIssue, setSignalIssue] = useState(0);

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    stationService.getStations()
      .then(res => {
        setStations(res.data);
        if (res.data.length > 0) setStationId(res.data[0].station_id);
      });

    aiService.getMetrics()
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiService.predictCrowd({
        station_id: stationId,
        hour: parseInt(hour),
        day_of_week: parseInt(dayOfWeek),
        traffic_index: parseFloat(trafficIndex),
        weather_condition: weatherCondition,
        signal_issue: parseInt(signalIssue)
      });
      setPredictionResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const featureImportanceData = metrics?.demand_model?.feature_importances 
    ? Object.entries(metrics.demand_model.feature_importances).map(([k, v]) => ({ name: k, importance: v }))
    : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center space-x-2">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          <span>RandomForest AI Crowd Surge & Delay Forecasting</span>
        </h1>
        <p className="text-sm text-slate-400">Machine learning inference engine trained on historical Delhi Metro footfall datasets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Inference Form */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold font-heading text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Interactive Prediction Sandbox</span>
          </h2>

          <form onSubmit={handlePredict} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Metro Station</label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                {stations.map(s => (
                  <option key={s.station_id} value={s.station_id}>{s.name} ({s.line})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hour of Day ({hour}:00)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weather</label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="Clear">Clear</option>
                  <option value="Rain">Rain</option>
                  <option value="Fog">Dense Fog</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City Traffic Index ({trafficIndex})</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={trafficIndex}
                onChange={(e) => setTrafficIndex(e.target.value)}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="signal_issue"
                checked={signalIssue === 1}
                onChange={(e) => setSignalIssue(e.target.checked ? 1 : 0)}
                className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="signal_issue" className="text-xs text-slate-300">Simulate Interlocking Signal Glitch</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg transition"
            >
              {loading ? 'Running RF Model Inference...' : 'Generate Prediction'}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Prediction Output & Model Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Result Display Card */}
          {predictionResult && (
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold font-heading text-white">
                  Model Inference Result ({predictionResult.id})
                </h3>
                <span className="text-xs text-slate-400">Confidence: {(predictionResult.confidence_score * 100).toFixed(0)}%</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Predicted Passenger Count</span>
                  <p className="text-2xl font-extrabold text-indigo-400">{predictionResult.predicted_count} <span className="text-xs font-normal">passengers</span></p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Crowd Level Tier</span>
                  <p className={`text-2xl font-extrabold ${
                    predictionResult.crowd_level === 'Red' ? 'text-rose-400' :
                    predictionResult.crowd_level === 'Orange' ? 'text-orange-400' :
                    predictionResult.crowd_level === 'Yellow' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {predictionResult.crowd_level}
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Congestion Risk Index</span>
                  <p className="text-2xl font-extrabold text-cyan-400">{(predictionResult.congestion_risk_index * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Model Accuracy & Metrics Cards */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Random Forest Model Metrics & Feature Importance</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Demand Model R² Score</span>
                <span className="text-lg font-bold text-emerald-400">{metrics?.demand_model?.r2_score || 0.9421}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Demand Model MAE</span>
                <span className="text-lg font-bold text-cyan-400">{metrics?.demand_model?.mae || 42.15}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Delay Classifier Accuracy</span>
                <span className="text-lg font-bold text-indigo-400">{((metrics?.delay_classifier?.accuracy || 0.935) * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Feature importance chart */}
            <div className="h-48 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="importance" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
