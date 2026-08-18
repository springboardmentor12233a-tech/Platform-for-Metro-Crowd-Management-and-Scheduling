import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // STEP 1 - SEND OTP
  // =====================================================

  const handleSendOTP = async (e) => {

    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to send OTP.");
        return;
      }

      alert(
  "OTP has been sent to your registered email."
);

      setStep(2);

    } catch (error) {

      console.error(error);

      alert(
        "Server Error. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // STEP 2 - VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Invalid OTP.");
        return;
      }

      alert("OTP verified successfully.");

      setStep(3);

    } catch (error) {

      console.error(error);

      alert("Server Error.");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // STEP 3 - RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Please enter both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Password reset failed.");
        return;
      }

      setStep(4);

    } catch (error) {

      console.error(error);

      alert("Server Error.");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // COMMON CONTAINER
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f9",
        padding: "20px",
      }}
    >

      <div
        style={{
          width: "400px",
          background: "white",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
      >

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (
          <>
            <h2 style={titleStyle}>
              🔐 Forgot Password
            </h2>

            <p style={descriptionStyle}>
              Enter your registered email address to reset
              your password.
            </p>

            <form onSubmit={handleSendOTP}>

              <input
                type="email"
                placeholder="Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

            </form>

            <p style={bottomTextStyle}>
              Remember your password?{" "}
              <Link to="/login" style={linkStyle}>
                Sign In
              </Link>
            </p>
          </>
        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (
          <>
            <h2 style={titleStyle}>
              📩 Verify OTP
            </h2>

            <p style={descriptionStyle}>
             Enter the 6-digit OTP sent to your email.
            </p>

            <form onSubmit={handleVerifyOTP}>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

            </form>

            <button
              onClick={() => setStep(1)}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "11px",
                background: "white",
                color: "#2563eb",
                border: "1px solid #2563eb",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Change Email
            </button>
          </>
        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (
          <>
            <h2 style={titleStyle}>
              🔑 Create New Password
            </h2>

            <p style={descriptionStyle}>
              Enter a new password for your account.
            </p>

            <form onSubmit={handleResetPassword}>

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

            </form>
          </>
        )}


        {/* =================================================
            STEP 4
        ================================================= */}

        {step === 4 && (
          <div style={{ textAlign: "center" }}>

            <div style={{ fontSize: "55px" }}>
              ✅
            </div>

            <h2
              style={{
                color: "#16a34a",
                marginTop: "15px",
              }}
            >
              Password Reset Successful!
            </h2>

            <p
              style={{
                color: "#64748b",
                marginTop: "15px",
                lineHeight: "1.6",
              }}
            >
              Your password has been changed successfully.
              You can now sign in using your new password.
            </p>

            <button
              onClick={() => navigate("/login")}
              style={buttonStyle}
            >
              Sign In
            </button>

          </div>
        )}

      </div>
    </div>
  );
}


// =========================================================
// STYLES
// =========================================================

const titleStyle = {
  textAlign: "center",
  color: "#0f172a",
  marginBottom: "10px",
};

const descriptionStyle = {
  textAlign: "center",
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "25px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};

const bottomTextStyle = {
  textAlign: "center",
  marginTop: "20px",
  color: "#64748b",
};

const linkStyle = {
  color: "#2563eb",
  fontWeight: "600",
  textDecoration: "none",
};

export default ForgotPassword;