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
      className="space-y-5"
    >
      {/* =========================================================
          ERROR MESSAGE
      ========================================================= */}
      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl

            border
            border-red-400/20

            bg-red-500/[0.08]

            px-4
            py-3

            backdrop-blur-xl

            shadow-[0_8px_25px_rgba(0,0,0,0.25)]

            animate-[fadeIn_0.2s_ease-out]
          "
        >
          <AlertCircle
            size={17}
            className="
              mt-0.5
              shrink-0
              text-red-400
            "
          />

          <p
            className="
              text-xs
              font-medium
              leading-5
              text-red-300
            "
          >
            {error}
          </p>
        </div>
      )}

      {/* =========================================================
          EMAIL
      ========================================================= */}
      <div>
        <GlassInput
          label="Email Address"
          name="email"
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (error) {
              setError("");
            }
          }}
          autoComplete="email"
          disabled={loading}
          required
        />
      </div>

      {/* =========================================================
          PASSWORD
      ========================================================= */}
      <div>
        <GlassInput
          label="Password"
          name="password"
          icon={Lock}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);

            if (error) {
              setError("");
            }
          }}
          autoComplete="current-password"
          disabled={loading}
          required
        />
      </div>

      {/* =========================================================
          REMEMBER ME + FORGOT PASSWORD
      ========================================================= */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          pt-0.5
        "
      >
        {/* Remember Me */}
        <label
          className="
            group
            flex
            cursor-pointer
            items-center
            gap-2.5
            select-none
          "
        >
          <span
            className="
              relative
              flex
              h-[17px]
              w-[17px]
              shrink-0
              items-center
              justify-center
            "
          >
            <input
              type="checkbox"
              checked={remember}
              disabled={loading}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              className="
                peer
                h-[17px]
                w-[17px]
                cursor-pointer
                appearance-none
                rounded-[4px]

                border
                border-white/20

                bg-white/[0.07]

                transition-all
                duration-200

                checked:border-cyan-400
                checked:bg-cyan-500

                hover:border-white/35

                focus:outline-none
                focus:ring-2
                focus:ring-cyan-400/20

                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />

            {/* Custom check */}
            <svg
              viewBox="0 0 12 12"
              className="
                pointer-events-none
                absolute
                h-3
                w-3
                scale-0
                text-white
                opacity-0
                transition-all
                duration-150
                peer-checked:scale-100
                peer-checked:opacity-100
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 6l2.2 2.2L9.5 3.5" />
            </svg>
          </span>

          <span
            className="
              text-xs
              font-medium
              text-slate-400

              transition-colors
              duration-200

              group-hover:text-slate-200

              sm:text-[13px]
            "
          >
            Remember me
          </span>
        </label>

        {/* Forgot Password */}
        <Link
          to="/forgot-password"
          className="
            whitespace-nowrap

            text-xs
            font-semibold
            text-cyan-400

            transition-all
            duration-200

            hover:text-cyan-300

            hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]

            sm:text-[13px]
          "
        >
          Forgot password?
        </Link>
      </div>

      {/* =========================================================
          SIGN IN BUTTON
      ========================================================= */}
      <div className="pt-0.5">
        <PrimaryButton
          type="submit"
          loading={loading}
        >
          Sign In
        </PrimaryButton>
      </div>
    </form>
  );
}