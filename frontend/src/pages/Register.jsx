import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, Train, ShieldAlert, Shield, TrendingUp } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Metro Operator');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 text-white">
            <Train size={24} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Create Account
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Join AI MetroFlow Platform
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Select Operational Role</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-300">
          <p className="flex items-center justify-center gap-1.5">
            <span>Already have an account?</span>
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
