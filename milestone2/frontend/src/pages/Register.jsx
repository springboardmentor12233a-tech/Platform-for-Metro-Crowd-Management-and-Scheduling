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

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group z-10">
        
        {/* Subtle glowing orb inside the card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-violet-500/30 transition-all duration-700"></div>

        <div className="flex flex-col items-center gap-4 mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] text-white">
            <Train size={28} />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Create Account
            </h2>
            <p className="text-xs font-bold text-cyan-400 mt-2 uppercase tracking-[0.2em]">
              Join AI MetroFlow Platform
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-semibold flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <div className="p-1.5 bg-red-500/20 rounded-lg">
              <ShieldAlert size={16} className="text-red-400" />
            </div>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-200 text-xs font-semibold flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <div className="p-1.5 bg-green-500/20 rounded-lg">
              <ShieldCheck size={16} className="text-green-400" />
            </div>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Full Name</label>
            <div className="relative group/input">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/20 border border-white/5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Email Address</label>
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-violet-400 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/20 border border-white/5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Password</label>
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-cyan-400 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/20 border border-white/5 text-white placeholder-slate-600 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:bg-black/40 focus:ring-4 focus:ring-cyan-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Select Operational Role</label>
            <div className="grid grid-cols-3 gap-3">
              {['Admin', 'Metro Operator', 'Analyst'].map((r) => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-2 rounded-2xl border text-[11px] font-bold transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 active:scale-[0.96] ${
                      isActive
                        ? 'bg-gradient-to-br from-violet-600/30 to-cyan-600/30 border-violet-500/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                        : 'bg-black/20 border-white/5 text-slate-400 hover:text-white hover:bg-black/40 hover:border-white/10'
                    }`}
                  >
                    {r === 'Admin' && <Shield size={18} className={isActive ? 'text-violet-400' : 'text-slate-500'} />}
                    {r === 'Metro Operator' && <Train size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />}
                    {r === 'Analyst' && <TrendingUp size={18} className={isActive ? 'text-violet-400' : 'text-slate-500'} />}
                    <span className="tracking-wide">{r === 'Metro Operator' ? 'Operator' : r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-sm tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-8"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400 font-medium">
          <p className="flex items-center justify-center gap-1.5">
            <span>Already have an account?</span>
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
