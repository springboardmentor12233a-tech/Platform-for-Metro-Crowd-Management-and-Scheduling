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

    // Demo credentials
    const DEMO_NAME = "admin";
    const DEMO_PASSWORD = "metroflow123";

    if (!name.trim() || !password) {
      setError("Please enter both name and password.");
      return;
    }

    if (
      name.trim().toLowerCase() !== DEMO_NAME ||
      password !== DEMO_PASSWORD
    ) {
      setError("Invalid name or password.");
      return;
    }

    // Store login state for the current browser
    localStorage.setItem(
      "metroflowAuthenticated",
      "true"
    );

    localStorage.setItem(
      "metroflowUser",
      name.trim()
    );

    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🚆
        </div>

        <h1>MetroFlow AI</h1>

        <p className="login-subtitle">
          AI-Powered Metro Crowd Management
        </p>

        <div className="login-divider" />

        <h2>Welcome Back</h2>

        <p className="login-description">
          Sign in to access the MetroFlow AI
          dashboard.
        </p>

        <form onSubmit={handleLogin}>

          {/* NAME */}

          <div className="login-field">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="username"
            />

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>

        </form>

        <div className="login-demo">
          <strong>Demo Access</strong>

          <span>
            Name: admin
          </span>

          <span>
            Password: metroflow123
          </span>
        </div>

        <p className="login-footer">
          MetroFlow AI • Smart Metro Operations
        </p>

      </div>

    </div>
  );
}

export default Login;