import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Zap,
  Loader2,
  AlertCircle,
  Train,
  ShieldCheck,
  Chrome,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";

import metroImage from "../assets/metro.avif";

// ============================================================
// FEATURES
// ============================================================

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

// ============================================================
// ADMIN DEMO CREDENTIALS
// ============================================================

const demoCredentials = [
  {
    role: "Admin",
    username: "admin",
    password: "test1234",
  },
];

// ============================================================
// LOGIN COMPONENT
// ============================================================

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const googleButtonRef = useRef(null);

  // ============================================================
  // ADMIN FORM
  // ============================================================

  const [form, setForm] = useState({
    username: "admin",
    password: "test1234",
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // LOAD GOOGLE IDENTITY SERVICES
  // ============================================================

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          "VITE_GOOGLE_CLIENT_ID is not configured."
        );
        return;
      }

      // Clear previously rendered button
      googleButtonRef.current.innerHTML = "";

      // Initialize Google
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });

      // Render Google button
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 360,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        }
      );
    };

    // Google script already loaded
    if (window.google) {
      initializeGoogle();
      return;
    }

    // Check whether script already exists
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        initializeGoogle
      );

      return () => {
        existingScript.removeEventListener(
          "load",
          initializeGoogle
        );
      };
    }

    // Load Google script
    const script = document.createElement("script");

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;

    script.onerror = () => {
      console.error(
        "Failed to load Google Identity Services."
      );
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // ============================================================
  // ADMIN LOGIN
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Call backend
      const response =
        await authService.adminLogin(
          form.username,
          form.password
        );

      console.log(
        "Admin login response:",
        response
      );

      // Save JWT
      authService.saveAuth(response);

      // Update auth context
      login(
        {
          id: response.user_id || null,
          username: form.username,
          role: response.role,
        },
        response.access_token
      );

      // Redirect
      navigate("/");

    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Invalid admin username or password."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // GOOGLE LOGIN CALLBACK
  // ============================================================

  const handleGoogleCredential =
    async (credentialResponse) => {
      setGoogleLoading(true);
      setError("");

      try {
        if (
          !credentialResponse ||
          !credentialResponse.credential
        ) {
          throw new Error(
            "Google did not return a valid credential."
          );
        }

        console.log(
          "Google credential received."
        );

        // Send Google token to backend
        const response =
          await authService.googleLogin(
            credentialResponse.credential
          );

        console.log(
          "Google login response:",
          response
        );

        // Save JWT
        authService.saveAuth(response);

        // Update auth context
        login(
          {
            id: response.user_id || null,
            email: response.email || null,
            full_name:
              response.full_name || null,
            role: response.role || "user",
          },
          response.access_token
        );

        // Redirect
        navigate("/");

      } catch (err) {
        console.error(
          "Google login error:",
          err
        );

        const message =
          err.response?.data?.detail ||
          err.message ||
          "Google Sign-In failed. Please try again.";

        setError(message);

      } finally {
        setGoogleLoading(false);
      }
    };

  // ============================================================
  // FILL DEMO ADMIN
  // ============================================================

  const fillDemo = (
    username,
    password
  ) => {
    setForm({
      username,
      password,
    });

    setError("");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ========================================================
          FULL SCREEN METRO BACKGROUND
      ======================================================== */}

      <img
        src={metroImage}
        alt="Metro background"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-center
        "
      />

      {/* ========================================================
          DARK OVERLAY
      ======================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
          backdrop-blur-[2px]
        "
      />

      {/* ========================================================
          GRADIENT OVERLAY
      ======================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-slate-950/70
          via-slate-950/30
          to-cyan-950/40
        "
      />

      {/* ========================================================
          CENTER CONTENT
      ======================================================== */}

      <div
        className="
          relative
          z-10
          min-h-screen
          w-full
          flex
          items-center
          justify-center
          px-4
          py-8
        "
      >

        {/* ======================================================
            LOGIN CONTAINER
        ====================================================== */}

        <div className="w-full max-w-md">

          {/* ====================================================
              LOGO / BRAND
          ==================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              mb-6
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                flex
                items-center
                justify-center
                shadow-2xl
                shadow-cyan-500/30
                mb-3
              "
            >
              <Train
                size={26}
                className="text-white"
              />
            </div>

            <div className="text-center">

              <div
                className="
                  text-white
                  font-bold
                  text-2xl
                  tracking-tight
                "
              >
                Metro CMS
              </div>

              <div
                className="
                  text-slate-300
                  text-sm
                  mt-1
                "
              >
                Crowd Management System
              </div>

            </div>

          </div>

          {/* ====================================================
              LOGIN CARD
          ==================================================== */}

          <div
            className="
              rounded-3xl
              bg-slate-950/85
              backdrop-blur-xl
              border
              border-white/15
              shadow-2xl
              shadow-black/40
              p-7
              sm:p-8
            "
          >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="text-center mb-7">

              <h1
                className="
                  text-2xl
                  font-bold
                  text-white
                  mb-2
                "
              >
                Welcome back
              </h1>

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Sign in to your Metro CMS account
              </p>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  flex
                  items-start
                  gap-2
                  bg-red-500/10
                  border
                  border-red-500/30
                  text-red-400
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  mb-6
                "
              >

                <AlertCircle
                  size={16}
                  className="
                    flex-shrink-0
                    mt-0.5
                  "
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mb-4
                "
              >

                <ShieldCheck
                  size={17}
                  className="text-cyan-400"
                />

                <h2
                  className="
                    text-white
                    font-semibold
                    text-sm
                  "
                >
                  Admin Login
                </h2>

              </div>

              <form
                id="login-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Username */}

                <div>

                  <label
                    htmlFor="username"
                    className="
                      block
                      text-slate-300
                      text-sm
                      font-medium
                      mb-1.5
                    "
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        username:
                          e.target.value,
                      }))
                    }
                    className="
                      w-full
                      bg-slate-800/80
                      border
                      border-slate-600
                      rounded-xl
                      px-4
                      py-3
                      text-white
                      text-sm
                      placeholder-slate-500
                      focus:outline-none
                      focus:border-cyan-500
                      focus:ring-1
                      focus:ring-cyan-500/50
                      transition-colors
                    "
                    placeholder="admin"
                  />

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="
                      block
                      text-slate-300
                      text-sm
                      font-medium
                      mb-1.5
                    "
                  >
                    Password
                  </label>

                  <div className="relative">

                    <input
                      id="password"
                      type={
                        showPwd
                          ? "text"
                          : "password"
                      }
                      required
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          password:
                            e.target.value,
                        }))
                      }
                      className="
                        w-full
                        bg-slate-800/80
                        border
                        border-slate-600
                        rounded-xl
                        px-4
                        py-3
                        pr-10
                        text-white
                        text-sm
                        placeholder-slate-500
                        focus:outline-none
                        focus:border-cyan-500
                        focus:ring-1
                        focus:ring-cyan-500/50
                        transition-colors
                      "
                      placeholder="••••••••"
                    />

                    <button
                      type="button"
                      id="toggle-password"
                      onClick={() =>
                        setShowPwd(
                          (value) => !value
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        hover:text-white
                        transition-colors
                      "
                    >

                      {showPwd ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                    </button>

                  </div>

                </div>

                {/* Admin Button */}

                <button
                  id="login-btn"
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-2
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    hover:from-cyan-400
                    hover:to-blue-500
                    text-white
                    font-semibold
                    py-3
                    transition-all
                    shadow-lg
                    shadow-cyan-500/20
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />

                      Sign in as Admin
                    </>
                  )}

                </button>

              </form>

            </div>

            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-3
                my-7
              "
            >

              <div
                className="
                  flex-1
                  h-px
                  bg-slate-700
                "
              />

              <span
                className="
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                "
              >
                OR
              </span>

              <div
                className="
                  flex-1
                  h-px
                  bg-slate-700
                "
              />

            </div>

            {/* ==================================================
                GOOGLE USER LOGIN
            ================================================== */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mb-3
                "
              >

                <Chrome
                  size={17}
                  className="text-blue-400"
                />

                <h2
                  className="
                    text-white
                    font-semibold
                    text-sm
                  "
                >
                  User Login
                </h2>

              </div>

              <p
                className="
                  text-slate-400
                  text-xs
                  text-center
                  mb-4
                "
              >
                Sign in securely with your Google
                account.
              </p>

              {/* Google Button */}

              <div
                className="
                  w-full
                  flex
                  justify-center
                  min-h-[44px]
                "
              >

                <div
                  ref={googleButtonRef}
                />

              </div>

              {googleLoading && (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-3
                    text-slate-400
                    text-xs
                  "
                >

                  <Loader2
                    size={14}
                    className="animate-spin"
                  />

                  Signing in with Google...

                </div>
              )}

            </div>

            {/* ==================================================
                DEMO ADMIN
            ================================================== */}

            <div
              className="
                mt-7
                p-4
                bg-slate-800/60
                rounded-xl
                border
                border-slate-700
              "
            >

              <p
                className="
                  text-slate-400
                  text-xs
                  font-medium
                  mb-2.5
                "
              >
                Demo Admin Credentials — click to
                fill:
              </p>

              <div className="space-y-2">

                {demoCredentials.map(
                  (credential) => (
                    <button
                      key={credential.username}
                      id={`demo-${credential.role.toLowerCase()}`}
                      type="button"
                      onClick={() =>
                        fillDemo(
                          credential.username,
                          credential.password
                        )
                      }
                      className="
                        w-full
                        text-left
                        px-3
                        py-2
                        rounded-lg
                        bg-slate-700/50
                        hover:bg-slate-700
                        transition-colors
                        border
                        border-slate-600/50
                      "
                    >

                      <span
                        className="
                          text-cyan-400
                          text-xs
                          font-semibold
                        "
                      >
                        {credential.role}
                      </span>

                      <span
                        className="
                          text-slate-400
                          text-xs
                          ml-2
                          font-mono
                        "
                      >
                        {credential.username}
                      </span>

                    </button>
                  )
                )}

              </div>

            </div>

            {/* ==================================================
                SECURITY MESSAGE
            ================================================== */}

            <div
              className="
                mt-5
                text-center
                text-slate-500
                text-xs
              "
            >
              Admin access uses secure JWT
              authentication.
              <br />
              User access is authenticated through
              Google.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}