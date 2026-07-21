import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setSuccess(
        res.data.message ||
          "Password reset instructions have been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">

        <h1 className="text-3xl font-bold text-white">
          Forgot Password
        </h1>

        <p className="mt-2 text-slate-400">
          Enter your email to receive a password reset link.
        </p>

        {success && (
          <div className="mt-6 rounded-xl bg-green-500/10 border border-green-500/30 p-3 text-green-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300">
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>

            <label className="mb-2 block text-slate-300">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                required
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white"
              />

            </div>

          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 text-white font-semibold"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>

        </form>

        <Link
          to="/"
          className="mt-8 flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft size={16} />

          Back to Login
        </Link>

      </div>

    </div>
  );
}