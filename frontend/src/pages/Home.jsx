import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
        }}
      >
        <h2>🚆 Metro AI</h2>

        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/login">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#38bdf8",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: "#16a34a",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "52px" }}>
            AI Powered Metro Crowd Management System
          </h1>

          <p
            style={{
              fontSize: "20px",
              marginTop: "20px",
              lineHeight: "35px",
            }}
          >
            Predict crowd levels, monitor metro operations, manage schedules,
            book tickets, track trains and generate intelligent reports using AI.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "35px",
            }}
          >
            <Link to="/login">
              <button
                style={{
                  padding: "15px 35px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </Link>

            <button
              style={{
                padding: "15px 35px",
                background: "white",
                color: "#2563eb",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
              }}
            >
              Explore Features
            </button>
          </div>
        </div>

        <div style={{ fontSize: "180px" }}>
          🚇
        </div>
      </div>

      {/* Features */}
      <div
        style={{
          background: "white",
          color: "#0f172a",
          padding: "50px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Platform Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          <Feature icon="🚉" title="Metro Stations" />
          <Feature icon="🚆" title="Train Tracking" />
          <Feature icon="🎟" title="Ticket Booking" />
          <Feature icon="🤖" title="AI Prediction" />
          <Feature icon="📊" title="Analytics Dashboard" />
          <Feature icon="📥" title="Download Reports" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div
      style={{
        padding: "25px",
        background: "#f8fafc",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <div style={{ fontSize: "55px" }}>{icon}</div>
      <h3>{title}</h3>
    </div>
  );
}

export default Home;