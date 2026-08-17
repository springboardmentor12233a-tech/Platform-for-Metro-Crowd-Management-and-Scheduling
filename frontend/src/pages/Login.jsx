import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;

      localStorage.setItem("token", access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 font-sans selection:bg-blue-500 selection:text-white px-4">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 filter scale-105 transform transition-all duration-1000"
        style={{ backgroundImage: `url('/metro_bg.png')` }}
      />

      {/* Dark Navy & Blue Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/95" />

      {/* Metro Visual Accent: Geometric Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Metro Visual Accent: Subtle Animated Metro Route Lines SVG */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="routeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="routeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Metro Line 1 */}
        <path 
          d="M -100 200 C 300 150, 400 450, 800 350 S 1400 600, 2000 500" 
          fill="none" 
          stroke="url(#routeGrad1)" 
          strokeWidth="3" 
          filter="url(#glow)"
        />
        {/* Animated Dashed Metro Track Line */}
        <path 
          d="M -100 200 C 300 150, 400 450, 800 350 S 1400 600, 2000 500" 
          fill="none" 
          stroke="#60a5fa" 
          strokeWidth="2" 
          className="animate-route-dash"
          opacity="0.7"
        />

        {/* Secondary Metro Route Line */}
        <path 
          d="M -100 700 C 400 800, 700 500, 1100 650 S 1700 300, 2100 400" 
          fill="none" 
          stroke="url(#routeGrad2)" 
          strokeWidth="2.5" 
          strokeDasharray="6 6"
          filter="url(#glow)"
        />

        {/* Metro Station Nodes (Interactive circular indicators) */}
        <g filter="url(#glow)">
          <circle cx="340" cy="202" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="340" cy="202" r="3" fill="#38bdf8" className="animate-ping opacity-75" />

          <circle cx="800" cy="350" r="8" fill="#0f172a" stroke="#60a5fa" strokeWidth="3" />
          <circle cx="800" cy="350" r="3" fill="#60a5fa" />

          <circle cx="1230" cy="558" r="7" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
        </g>
      </svg>

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-7 sm:p-9 animate-fade-in-up">
        
        {/* Top Header Badge & Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Metro Train Logo Icon Badge */}
          <div className="relative mb-4 group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-65 blur transition duration-300 group-hover:opacity-100" />
            <div className="relative w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="3" width="16" height="16" rx="2" />
                <path d="M4 11h16" />
                <path d="M12 3v8" />
                <circle cx="8" cy="15" r="1" fill="currentColor" />
                <circle cx="16" cy="15" r="1" fill="currentColor" />
                <path d="m8 19-3 3" />
                <path d="m16 19 3 3" />
              </svg>
            </div>
          </div>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            OPERATIONS CONTROL CENTER
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">Flow</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to access your operator control panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Operator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                placeholder="operator@metroflow.com"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full pl-10 pr-11 py-3 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.018 10.018 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.115-3.486a3 3 0 11-4.243-4.243M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs animate-fade-in-up">
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-sm tracking-wide">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Control Center</span>
                  <svg className="w-4 h-4 text-cyan-200 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="mt-8 pt-5 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>256-bit Encrypted</span>
          </div>
          <span className="text-slate-400">v0.1.0-prod</span>
        </div>
      </div>
    </div>
  );
}

export default Login;