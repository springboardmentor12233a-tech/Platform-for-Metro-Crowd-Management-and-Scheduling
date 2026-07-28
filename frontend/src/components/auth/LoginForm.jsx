import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Lock, Mail } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import GlassInput from "./GlassInput";
import PrimaryButton from "./PrimaryButton";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      {/* Error */}
      {error && (
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            backdrop-blur-xl
          "
        >
          <AlertCircle
            size={18}
            className="text-red-400 shrink-0"
          />

          <p className="text-sm font-medium text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Email */}
      <GlassInput
        label="Email Address"
        name="email"
        icon={Mail}
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        disabled={loading}
        required
      />

      {/* Password */}
      <GlassInput
        label="Password"
        name="password"
        icon={Lock}
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        disabled={loading}
        required
      />

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={remember}
            disabled={loading}
            onChange={(e) =>
              setRemember(e.target.checked)
            }
            className="
              h-4
              w-4
              rounded
              border-white/20
              bg-white/10
              accent-cyan-500
            "
          />

          <span
            className="
              text-sm
              text-slate-300
              transition-colors
              group-hover:text-white
            "
          >
            Remember me
          </span>
        </label>

        <Link
          to="/forgot-password"
          className="
            text-sm
            font-medium
            text-cyan-400
            transition-all
            duration-300
            hover:text-cyan-300
            hover:underline
            underline-offset-4
          "
        >
          Forgot password?
        </Link>
      </div>

      {/* Button */}
      <PrimaryButton
        type="submit"
        loading={loading}
      >
        Sign In
      </PrimaryButton>
    </form>
  );
}