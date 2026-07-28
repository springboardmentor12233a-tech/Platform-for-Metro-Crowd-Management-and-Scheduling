"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

// ── Backend contract ────────────────────────────────────
// POST /api/v1/auth/register
// Request:  { email, password, full_name, role, phone? }
// Response: UserResponse { id, email, full_name, role, status, ... }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type StatusState = {
  type: "error" | "success";
  message: string;
} | null;

export default function RegisterPage() {
  const router = useRouter();

  // ── Form state ──
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── UI state ──
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  // ── Submit handler ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Client-side validation
    if (password.length < 8) {
      setStatus({
        type: "error",
        message: "Clearance denied: Security protocol requires 8+ characters.",
      });
      return;
    }

    if (!role) {
      setStatus({
        type: "error",
        message: "Clearance denied: Access level required.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.detail ?? `Registration failed (${res.status})`;
        throw new Error(message);
      }

      // Registration successful
      setStatus({
        type: "success",
        message: "Clearance granted. Redirecting to login sequence...",
      });

      // Redirect to login after brief success animation
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setStatus({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Ambient Grid Overlay */}
      <div className={styles.ambientGrid} />

      <div className={styles.content}>
        {/* ── Brand Header ── */}
        <div className={styles.brandArea}>
          <h1 className={styles.brandTitle}>METROFLOW</h1>
          <p className={styles.brandSubtitle}>Personnel Registration</p>
        </div>

        {/* ── Registration Card ── */}
        <div className={styles.card}>
          <div className={styles.cardAccent} />

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Status Message */}
            <div
              className={`${styles.statusBox} ${status ? styles.visible : ""} ${
                status?.type === "error" ? styles.error : ""
              } ${status?.type === "success" ? styles.success : ""}`}
              role="alert"
            >
              <span
                className={`material-symbols-outlined ${styles.statusIcon}`}
              >
                {status?.type === "error" ? "error" : "check_circle"}
              </span>
              <span>{status?.message}</span>
            </div>

            {/* Full Name */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="reg-fullname">
                Full Name
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  person
                </span>
                <input
                  id="reg-fullname"
                  className={styles.inputField}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="reg-email">
                Operational Email
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  mail
                </span>
                <input
                  id="reg-email"
                  className={styles.inputField}
                  type="email"
                  placeholder="operative@metroflow.ai"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="reg-password">
                Security Protocol (Password)
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  lock
                </span>
                <input
                  id="reg-password"
                  className={styles.inputField}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <span
                    className={`material-symbols-outlined ${styles.toggleIcon}`}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Role Dropdown */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="reg-role">
                Access Level (Role)
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  badge
                </span>
                <select
                  id="reg-role"
                  className={styles.selectField}
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    Select Clearance
                  </option>
                  <option value="viewer">Viewer (Monitoring Only)</option>
                  <option value="operator">Operator (Active Management)</option>
                  <option value="admin">Administrator (System Config)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className={`material-symbols-outlined ${styles.spinner}`}
                  >
                    sync
                  </span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Initialize Clearance</span>
                  <span
                    className={`material-symbols-outlined ${styles.btnArrow}`}
                  >
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Return to Login */}
          <div className={styles.footerDivider}>
            <Link href="/login">Return to Login Sequence</Link>
          </div>
        </div>

        {/* ── Global Status Footer ── */}
        <div className={styles.statusFooter}>
          <div className={styles.statusChip}>
            <span className={styles.statusDot} />
            <span className={styles.statusLabel}>Network Secure</span>
          </div>
          <p className={styles.copyright}>
            © 2026 METROFLOW AI OPS. ALL SYSTEMS OPERATIONAL.
          </p>
        </div>
      </div>
    </div>
  );
}
