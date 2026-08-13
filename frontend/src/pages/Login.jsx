import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrain, FaEnvelope, FaLock } from "react-icons/fa6";
import api from "../services/api";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", response.data.access_token);
      const userResponse = await api.get("/me");
      localStorage.setItem("name", userResponse.data.name);
      localStorage.setItem("email", userResponse.data.email);
      localStorage.setItem("role", userResponse.data.role);

      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-orb orb-one" /><div className="auth-orb orb-two" />
        <div className="auth-brand"><div className="auth-brand-icon"><FaTrain /></div><strong>MetroFlow</strong></div>
        <div className="auth-hero-text"><span>SMART METRO</span><h1>Manage crowds.<br />Move people smarter.</h1><p>A unified platform for metro monitoring, analytics and AI-powered passenger communication.</p></div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="mobile-auth-logo"><FaTrain /></div>
          <span className="auth-kicker">WELCOME BACK</span>
          <h2>Sign in to MetroFlow</h2>
          <p className="auth-description">Access your metro operations dashboard.</p>

          <div className="auth-field"><label>Email Address</label><div className="auth-input"><FaEnvelope /><input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
          <div className="auth-field"><label>Password</label><div className="auth-input"><FaLock /><input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div>

          <button className="auth-button" onClick={handleLogin}>Sign In</button>
          <p className="auth-switch">Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
