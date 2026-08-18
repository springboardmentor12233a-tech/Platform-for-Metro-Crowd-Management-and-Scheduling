import { useState } from "react";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  if (!username.trim() || !password.trim()) {
    setError("Please enter your email/mobile and password.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      }
    );

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      setError(
        data.detail || "Invalid Email/Mobile or Password."
      );
      return;
    }

    // Save login information
    sessionStorage.setItem(
      "token",
      data.access_token
    );

    sessionStorage.setItem(
      "isLoggedIn",
      "true"
    );

    if (data.role) {
      sessionStorage.setItem(
        "role",
        data.role
      );
    }

    console.log("LOGIN SUCCESS");

    // Go to dashboard
    onLogin();

  } catch (error) {
    console.error("Login error:", error);

    setError(
      "Unable to connect to the server. Please make sure the backend is running."
    );

  } finally {
    setLoading(false);
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #e0f2fe, #f8fafc)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "380px",
          maxWidth: "100%",
          background: "rgba(255,255,255,0.96)",
          padding: "35px",
          borderRadius: "18px",
          boxShadow:
            "0 15px 40px rgba(15,23,42,0.18)",
          boxSizing: "border-box",
        }}
      >

        {/* LOGO */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "45px",
            }}
          >
            🚆
          </div>

          <h2
            style={{
              margin: "8px 0 5px",
              color: "#0f172a",
            }}
          >
            Metro AI
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Crowd Management & Scheduling
          </p>
        </div>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* USERNAME */}

          <label
            style={{
              display: "block",
              color: "#334155",
              fontWeight: "600",
              marginBottom: "7px",
            }}
          >
            Email or Mobile Number
          </label>

          <input
            type="text"
            placeholder="Enter email or mobile number"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />

          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              color: "#334155",
              fontWeight: "600",
              marginTop: "18px",
              marginBottom: "7px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              fontSize: "15px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "20px",
              background: loading
                ? "#93c5fd"
                : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "9px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {loading
              ? "⏳ Authenticating..."
              : "🔐 Login"}
          </button>

        </form>

        {/* FORGOT PASSWORD */}

        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "12px",
            marginTop: "25px",
          }}
        >
          Secure Metro Management System
        </p>

      </div>
    </div>
  );
}

export default Login;