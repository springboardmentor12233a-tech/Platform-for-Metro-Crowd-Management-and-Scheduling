"use client";

import { useState, FormEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { setTokens } from "@/lib/auth";

// ── Backend contract ────────────────────────────────────
// POST /api/v1/auth/login
// Request:  { email: string, password: string }
// Response: { access_token: string, refresh_token: string, token_type: "bearer" }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Form state ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── UI state ──
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Shake the card on error ──
  const shakeCard = () => {
    const card = cardRef.current;
    if (!card) return;
    card.classList.add(styles.shaking);
    card.addEventListener("animationend", () => {
      card.classList.remove(styles.shaking);
    }, { once: true });
  };

  // ── Submit handler ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.detail ?? `Authentication failed (${res.status})`;
        throw new Error(message);
      }

      const data = await res.json();

      // Store tokens — localStorage for now; swap to httpOnly cookies later
      setTokens(data.access_token, data.refresh_token);

      // Show success state briefly, then redirect
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      shakeCard();
    } finally {
      if (!isSuccess) {
        setIsLoading(false);
      }
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
          <p className={styles.brandSubtitle}>System Access Terminal</p>
        </div>

        {/* ── Login Card ── */}
        <div className={styles.card} ref={cardRef}>
          <div className={styles.cardAccent} />

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Error Message */}
            <div
              className={`${styles.errorBox} ${error ? styles.visible : ""}`}
              role="alert"
            >
              <span className={`material-symbols-outlined ${styles.errorIcon}`}>
                error
              </span>
              <span>{error}</span>
            </div>

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="login-email">
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  badge
                </span>
                <input
                  id="login-email"
                  className={styles.inputField}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isSuccess}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="login-password">
                Password
              </label>
              <div className={styles.inputWrapper}>
                <span
                  className={`material-symbols-outlined ${styles.inputIcon}`}
                >
                  lock
                </span>
                <input
                  id="login-password"
                  className={styles.inputField}
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isSuccess}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${styles.submitBtn} ${isSuccess ? styles.success : ""}`}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <div className={styles.spinner} />
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  SUCCESS
                </>
              ) : (
                <span>INITIALIZE UPLINK</span>
              )}
            </button>

            {/* Register link */}
            <div className={styles.registerLink}>
              <Link href="/register">New user? Register</Link>
            </div>
          </form>

          {/* Footer Links */}
          <div className={styles.footerDivider}>
            <Link href="#">Request system access</Link>
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
