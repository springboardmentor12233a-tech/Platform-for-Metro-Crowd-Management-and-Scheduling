/**
 * Login Page
 * Dual-panel login: left branding panel + right auth form with JWT.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, Loader2, AlertCircle, Train } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";

const features = [
  {
    icon: "🚇",
    title: "Real-time Monitoring",
    desc: "Live crowd density across all stations",
  },
  {
    icon: "📊",
    title: "Predictive Analytics",
    desc: "AI-powered passenger flow forecasting",
  },
  {
    icon: "🔔",
    title: "Smart Alerts",
    desc: "Instant notifications for critical events",
  },
];

const demoCredentials = [
  { role: "Admin", email: "admin@metro.com", password: "admin123" },
  { role: "Operator", email: "operator@metro.com", password: "operator123" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@metro.com",
    password: "admin123",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await authService.login(form.email, form.password);
  
      console.log("Backend Response:", response);
      console.log("Backend Data:", response.data);
  
      login(response.data.user, response.data.access_token);
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      console.error("Response:", err.response);
  
      setError(
        err.response?.data?.detail || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-r border-slate-800">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(6,182,212,0.12),_transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(14,165,233,0.07),_transparent_70%)]" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Train size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-tight">
                Metro CMS
              </div>
              <div className="text-slate-400 text-sm">
                Crowd Management System
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Smarter Metro
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Crowd Control
            </span>
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed max-w-sm">
            Monitor passenger density, optimize train schedules, and respond to
            incidents — all from a single unified dashboard.
          </p>

          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {f.title}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}

          {/* Status indicator */}
          <div className="mt-12 flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System operational — All 6 stations online
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Train size={18} className="text-white" />
            </div>
            <span className="text-white font-bold">Metro CMS</span>
          </div>

          <div className="glass-card p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back
              </h1>
              <p className="text-slate-400 text-sm">
                Sign in to your Metro CMS account
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                  placeholder="you@metro.com"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="login-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs font-medium mb-2.5">
                Demo Credentials — click to fill:
              </p>
              <div className="space-y-2">
                {demoCredentials.map((c) => (
                  <button
                    key={c.email}
                    id={`demo-${c.role.toLowerCase()}`}
                    type="button"
                    onClick={() => fillDemo(c.email, c.password)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600/50"
                  >
                    <span className="text-cyan-400 text-xs font-semibold">
                      {c.role}
                    </span>
                    <span className="text-slate-400 text-xs ml-2 font-mono">
                      {c.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
