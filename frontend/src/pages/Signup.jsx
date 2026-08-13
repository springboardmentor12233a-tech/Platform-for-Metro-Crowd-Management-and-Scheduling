import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTrain, FaUser, FaEnvelope, FaLock } from "react-icons/fa6";
import api from "../services/api";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) return alert("Please fill all fields.");
    if (password !== confirmPassword) return alert("Passwords do not match.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    try {
      await api.post("/register", { name, email, password, role: "Passenger" });
      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Registration Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration">
        <div className="auth-orb orb-one" /><div className="auth-orb orb-two" />
        <div className="auth-brand"><div className="auth-brand-icon"><FaTrain /></div><strong>MetroFlow</strong></div>
        <div className="auth-hero-text"><span>SMART METRO</span><h1>Connect stations.<br />Coordinate smarter.</h1><p>Create your account to access monitoring, analytics and AI-powered metro tools.</p></div>
      </div>

      <div className="auth-panel">
        <div className="auth-card signup-card">
          <div className="mobile-auth-logo"><FaTrain /></div>
          <span className="auth-kicker">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="auth-description">Join the MetroFlow management platform.</p>

          <div className="auth-field"><label>Full Name</label><div className="auth-input"><FaUser /><input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} /></div></div>
          <div className="auth-field"><label>Email Address</label><div className="auth-input"><FaEnvelope /><input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
          <div className="auth-field"><label>Password</label><div className="auth-input"><FaLock /><input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} /></div></div>
          <div className="auth-field"><label>Confirm Password</label><div className="auth-input"><FaLock /><input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div></div>

          <button className="auth-button" onClick={handleSignup}>Create Account</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
