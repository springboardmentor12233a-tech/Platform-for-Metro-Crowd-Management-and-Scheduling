/**
 * Metro CMS Login
 *
 * Authentication:
 * 1. Admin    -> username + password
 * 2. User     -> Google Sign-In
 */

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


  // ----------------------------------------------------------
  // ADMIN FORM
  // ----------------------------------------------------------

  const [form, setForm] = useState({
    username: "admin",
    password: "test1234",
  });


  // ----------------------------------------------------------
  // UI STATE
  // ----------------------------------------------------------

  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================================
  // LOAD GOOGLE IDENTITY SERVICES
  // ==========================================================

  useEffect(() => {

    const initializeGoogle = () => {

      if (
        !window.google ||
        !googleButtonRef.current
      ) {
        return;
      }


      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID;


      if (!clientId) {

        console.error(
          "VITE_GOOGLE_CLIENT_ID is not configured."
        );

        return;
      }


      // Clear previously rendered button

      googleButtonRef.current.innerHTML = "";


      // ------------------------------------------------------
      // INITIALIZE GOOGLE
      // ------------------------------------------------------

      window.google.accounts.id.initialize({

        client_id: clientId,

        callback: handleGoogleCredential,

      });


      // ------------------------------------------------------
      // RENDER GOOGLE BUTTON
      // ------------------------------------------------------

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


    // --------------------------------------------------------
    // LOAD GOOGLE SCRIPT
    // --------------------------------------------------------

    const existingScript =
      document.querySelector(
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


    const script =
      document.createElement("script");


    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;

    script.defer = true;


    script.onload =
      initializeGoogle;


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


  // ==========================================================
  // ADMIN LOGIN
  // ==========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");


    try {

      // ------------------------------------------------------
      // CALL BACKEND
      // ------------------------------------------------------

      const response =
        await authService.adminLogin(
          form.username,
          form.password
        );


      console.log(
        "Admin login response:",
        response
      );


      // ------------------------------------------------------
      // SAVE JWT
      // ------------------------------------------------------

      authService.saveAuth(response);


      // ------------------------------------------------------
      // UPDATE AUTH CONTEXT
      // ------------------------------------------------------

      login(
        {
          id: response.user_id || null,
          username: form.username,
          role: response.role,
        },
        response.access_token
      );


      // ------------------------------------------------------
      // REDIRECT
      // ------------------------------------------------------

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


  // ==========================================================
  // GOOGLE LOGIN CALLBACK
  // ==========================================================

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


        // ----------------------------------------------------
        // SEND GOOGLE TOKEN TO BACKEND
        // ----------------------------------------------------

        const response =
          await authService.googleLogin(
            credentialResponse.credential
          );


        console.log(
          "Google login response:",
          response
        );


        // ----------------------------------------------------
        // SAVE JWT
        // ----------------------------------------------------

        authService.saveAuth(response);


        // ----------------------------------------------------
        // UPDATE AUTH CONTEXT
        // ----------------------------------------------------

        login(
          {
            id: response.user_id || null,
            email: response.email || null,
            full_name: response.full_name || null,
            role: response.role || "user",
          },
          response.access_token
        );


        // ----------------------------------------------------
        // REDIRECT
        // ----------------------------------------------------

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


  // ==========================================================
  // FILL DEMO ADMIN
  // ==========================================================

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


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="min-h-screen bg-slate-950 flex">

      {/* ================================================== */}
      {/* LEFT BRANDING PANEL */}
      {/* ================================================== */}

      <div
        className="
          hidden lg:flex
          flex-col
          justify-center
          px-16
          w-1/2
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-900
          via-slate-900
          to-slate-800
          border-r
          border-slate-800
        "
      >

        {/* Background glow */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(
              ellipse_at_top_left,
              rgba(6,182,212,0.12),
              transparent_60%
            )]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            w-96
            h-96
            bg-[radial-gradient(
              circle,
              rgba(14,165,233,0.07),
              transparent_70%
            )]
          "
        />


        <div className="relative z-10">

          {/* ------------------------------------------------ */}
          {/* LOGO */}
          {/* ------------------------------------------------ */}

          <div className="flex items-center gap-3 mb-14">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                flex
                items-center
                justify-center
                shadow-lg
                shadow-cyan-500/30
              "
            >

              <Train
                size={22}
                className="text-white"
              />

            </div>


            <div>

              <div
                className="
                  text-white
                  font-bold
                  text-xl
                  tracking-tight
                "
              >
                Metro CMS
              </div>

              <div
                className="
                  text-slate-400
                  text-sm
                "
              >
                Crowd Management System
              </div>

            </div>

          </div>


          {/* ------------------------------------------------ */}
          {/* HEADING */}
          {/* ------------------------------------------------ */}

          <h2
            className="
              text-4xl
              font-bold
              text-white
              leading-tight
              mb-4
            "
          >

            Smarter Metro

            <br />

            <span
              className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
              "
            >
              Crowd Control
            </span>

          </h2>


          <p
            className="
              text-slate-400
              text-base
              mb-10
              leading-relaxed
              max-w-sm
            "
          >
            Monitor passenger density, optimize train
            schedules, and respond to incidents — all
            from a single unified dashboard.
          </p>


          {/* ------------------------------------------------ */}
          {/* FEATURES */}
          {/* ------------------------------------------------ */}

          {features.map((feature) => (

            <div
              key={feature.title}
              className="
                flex
                items-start
                gap-4
                mb-5
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  text-lg
                  flex-shrink-0
                "
              >
                {feature.icon}
              </div>


              <div>

                <div
                  className="
                    text-white
                    font-semibold
                    text-sm
                  "
                >
                  {feature.title}
                </div>

                <div
                  className="
                    text-slate-400
                    text-xs
                    mt-0.5
                  "
                >
                  {feature.desc}
                </div>

              </div>

            </div>

          ))}


          {/* ------------------------------------------------ */}
          {/* STATUS */}
          {/* ------------------------------------------------ */}

          <div
            className="
              mt-12
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
            "
          >

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-green-500
                animate-pulse
              "
            />

            System operational — All 6 stations online

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* RIGHT LOGIN PANEL */}
      {/* ================================================== */}

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          p-8
          bg-slate-950
        "
      >

        <div
          className="
            w-full
            max-w-md
          "
        >

          {/* ------------------------------------------------ */}
          {/* MOBILE LOGO */}
          {/* ------------------------------------------------ */}

          <div
            className="
              flex
              items-center
              gap-2
              mb-8
              lg:hidden
            "
          >

            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                flex
                items-center
                justify-center
              "
            >

              <Train
                size={18}
                className="text-white"
              />

            </div>

            <span
              className="
                text-white
                font-bold
              "
            >
              Metro CMS
            </span>

          </div>


          {/* ------------------------------------------------ */}
          {/* LOGIN CARD */}
          {/* ------------------------------------------------ */}

          <div className="glass-card p-8">

            {/* Header */}

            <div className="mb-8">

              <h1
                className="
                  text-2xl
                  font-bold
                  text-white
                  mb-1
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


            {/* ------------------------------------------------ */}
            {/* ERROR */}
            {/* ------------------------------------------------ */}

            {error && (

              <div
                className="
                  flex
                  items-center
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
                  size={14}
                  className="flex-shrink-0"
                />

                <span>{error}</span>

              </div>

            )}


            {/* ================================================= */}
            {/* ADMIN LOGIN */}
            {/* ================================================= */}

            <div>

              <div
                className="
                  flex
                  items-center
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
                        username: e.target.value,
                      }))
                    }
                    className="
                      w-full
                      bg-slate-800
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
                          password: e.target.value,
                        }))
                      }
                      className="
                        w-full
                        bg-slate-800
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
                        pr-10
                      "
                      placeholder="••••••••"
                    />


                    <button
                      type="button"
                      id="toggle-password"
                      onClick={() =>
                        setShowPwd((value) => !value)
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


                {/* Admin button */}

                <button
                  id="login-btn"
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="
                    btn-primary
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-2
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    disabled:transform-none
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


            {/* ================================================= */}
            {/* DIVIDER */}
            {/* ================================================= */}

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


            {/* ================================================= */}
            {/* GOOGLE USER LOGIN */}
            {/* ================================================= */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-4
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
                  mb-4
                "
              >
                Sign in securely with your Google account.
              </p>


              {/* Google button */}

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


            {/* ================================================= */}
            {/* DEMO ADMIN */}
            {/* ================================================= */}

            <div
              className="
                mt-7
                p-4
                bg-slate-800/50
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
                Demo Admin Credentials — click to fill:
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


            {/* ------------------------------------------------ */}
            {/* SECURITY MESSAGE */}
            {/* ------------------------------------------------ */}

            <div
              className="
                mt-5
                text-center
                text-slate-500
                text-xs
              "
            >
              Admin access uses secure JWT authentication.
              <br />
              User access is authenticated through Google.
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}