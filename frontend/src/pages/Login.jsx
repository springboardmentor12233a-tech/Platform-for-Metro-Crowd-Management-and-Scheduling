import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    const enteredName = name.trim().toLowerCase();

    // Demo accounts
    const accounts = {
      admin: {
        password: "metroflow123",
        role: "admin",
      },

      user: {
        password: "metroflow123",
        role: "user",
      },
    };

    // Empty field validation
    if (!enteredName || !password) {
      setError("Please enter both name and password.");
      return;
    }

    // Find account
    const account = accounts[enteredName];

    // Credential validation
    if (!account || account.password !== password) {
      setError("Invalid name or password.");
      return;
    }

    // Store authentication state
    localStorage.setItem(
      "metroflowAuthenticated",
      "true"
    );

    // Store username
    localStorage.setItem(
      "metroflowUser",
      enteredName
    );

    // Store user role
    localStorage.setItem(
      "metroflowRole",
      account.role
    );

    // Navigate to dashboard
    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="login-page">

      <div className="login-layout">

        {/* =================================================
            LEFT BRANDING
        ================================================= */}

        <div className="login-brand-panel">

          <div className="brand-badge">
            METROFLOW AI
          </div>

          <div className="brand-icon">
            🚆
          </div>

          <h1>
            Smarter Metro.
            <br />
            <span>Better Decisions.</span>
          </h1>

          <p className="brand-description">
            AI-powered passenger demand forecasting,
            crowd management and intelligent train
            scheduling for modern metro operations.
          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="login-card">

          {/* Header */}

          <div className="login-card-header">

            <div className="login-logo">
              🚇
            </div>

            <div>
              <h2>Welcome Back</h2>

              <p>
                Sign in to access MetroFlow AI
              </p>
            </div>

          </div>


          <div className="login-divider" />


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form onSubmit={handleLogin}>

            {/* NAME */}

            <div className="login-field">

              <label htmlFor="name">
                Name
              </label>

              <div className="name-input-container">

                <span
                  className="name-icon"
                  aria-hidden="true"
                >
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-input-container">

                <span
                  className="password-icon"
                  aria-hidden="true"
                >
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
            >
              Sign In to MetroFlow
              <span>→</span>
            </button>

          </form>


          {/* =================================================
              DEMO ACCOUNTS
          ================================================= */}

          <div className="login-demo">

            <div className="demo-title">

              <span className="demo-dot" />

              Demo Accounts

            </div>


            {/* ADMIN */}

            <div className="demo-account">

              <div>

                <strong>
                  Admin
                </strong>

                <span>
                  Full operational access
                </span>

              </div>

              <code>
                admin
              </code>

            </div>


            {/* USER */}

            <div className="demo-account">

              <div>

                <strong>
                  User
                </strong>

                <span>
                  Read-only access
                </span>

              </div>

              <code>
                user
              </code>

            </div>


            {/* PASSWORD */}

            <p className="demo-password">
              Password:{" "}
              <code>
                metroflow123
              </code>
            </p>

          </div>


          {/* FOOTER */}

          <p className="login-footer">
            MetroFlow AI • Smart Metro Operations
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;