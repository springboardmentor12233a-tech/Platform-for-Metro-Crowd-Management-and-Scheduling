import { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";

import GlassInput from "./GlassInput";
import PrimaryButton from "./PrimaryButton";

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    onSubmit(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
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
            className="shrink-0 text-red-400"
          />

          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      <GlassInput
        label="Email Address"
        name="email"
        icon={Mail}
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        disabled={loading}
        required
      />

      <PrimaryButton
        type="submit"
        loading={loading}
      >
        Send Reset Link
      </PrimaryButton>
    </form>
  );
}