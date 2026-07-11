import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Train, ShieldAlert, Shield, TrendingUp, Sparkles, Activity, Brain } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Metro Operator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, role);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Background ambient glowing rings */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse pointer-events-none"></div>

      {/* Left Side: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-white/5 bg-slate-950/30">
        {/* Top Brand Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
            <Train size={20} />
          </div>
          <span className="text-lg font-black tracking-tight text-white uppercase">AI MetroFlow</span>
        </div>

        {/* Center Brand Text */}
        <div className="my-auto space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> AI-Powered Operations
          </div>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
            AI Platform for <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Metro Crowd Management</span> and Scheduling
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-semibold">
            Optimizing urban transit schedules, predicting station inflows, and coordinating fleet dispatches using deep reinforcement learning models and real-time WebSocket telemetries.
          </p>

          {/* Decorative Feature Cards */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-xs text-slate-300 font-bold">
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all">
              <Activity size={16} className="text-cyan-400" />
              <span>Real-time Density</span>
            </div>
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all">
              <Brain size={16} className="text-violet-400" />
              <span>AI Demand Forecasts</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="text-xs text-slate-500 relative z-10 font-bold">
          &copy; {new Date().getFullYear()} AI MetroFlow. All rights reserved.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
          {/* Header (visible on mobile where brand panel is hidden) */}
          <div className="flex flex-col items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
              <Train size={24} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tight text-white">
                AI MetroFlow
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Crowd Management & Scheduling
              </p>
            </div>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-black tracking-tight text-white">Sign In</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Access operations management console</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Select Access Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Admin', 'Metro Operator', 'Analyst'].map((r) => {
                  const isActive = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 px-2 rounded-xl border text-[11px] font-extrabold transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-[0.96] ${
                        isActive
                          ? 'bg-violet-600/20 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-white/10'
                      }`}
                    >
                      {r === 'Admin' && <Shield size={16} className={isActive ? 'text-violet-400' : 'text-slate-500'} />}
                      {r === 'Metro Operator' && <Train size={16} className={isActive ? 'text-violet-400' : 'text-slate-500'} />}
                      {r === 'Analyst' && <TrendingUp size={16} className={isActive ? 'text-violet-400' : 'text-slate-500'} />}
                      <span>{r === 'Metro Operator' ? 'Operator' : r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@metroflow.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-xs text-slate-300">
            <p className="flex items-center justify-center gap-1.5">
              <span>New account?</span>
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
