import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password, remember);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            disabled={loading}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              py-3
              pl-12
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-200
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-500/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              py-3
              pl-12
              pr-12
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-200
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-500/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition
              hover:text-white
              disabled:opacity-50
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Remember + Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-300 select-none">
          <input
            type="checkbox"
            checked={remember}
            disabled={loading}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded accent-cyan-500"
          />

          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="
            text-sm
            font-medium
            text-cyan-400
            transition
            hover:text-cyan-300
          "
        >
          Forgot Password?
        </Link>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          py-3
          font-semibold
          text-white
          transition-all
          duration-200
          hover:scale-[1.02]
          hover:shadow-xl
          hover:shadow-cyan-500/30
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:scale-100
        "
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}