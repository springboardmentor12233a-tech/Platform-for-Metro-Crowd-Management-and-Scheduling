import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
        color: "white",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "18px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(15, 23, 42, 0.8)",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #38bdf8, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 4px 14px rgba(56, 189, 248, 0.3)",
            }}
          >
            🚆
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "800",
                color: "white",
                letterSpacing: "-0.5px",
                lineHeight: "1.1",
              }}
            >
              Metro AI
            </h2>
            <span style={{ fontSize: "11px", color: "#93c5fd", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
              Crowd & Scheduling Platform
            </span>
          </div>
        </Link>

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <Link
            to="/login"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              Login
            </button>
          </Link>

          <Link
            to="/register"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Register Now
            </button>
          </Link>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          maxWidth: "1250px",
          width: "90%",
          margin: "0 auto",
          padding: "70px 0 50px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "center",
          gap: "50px",
          boxSizing: "border-box",
        }}
      >
        {/* Hero Text */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "30px",
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "24px",
              letterSpacing: "0.5px",
            }}
          >
            <span>🤖</span> Next-Gen AI Metro Management Platform
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: " clamp(36px, 5vw, 54px)",
              lineHeight: "1.15",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "white",
            }}
          >
            AI-Driven <br />
            <span
              style={{
                background: "linear-gradient(135deg, #38bdf8, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Metro Crowd Management
            </span>
            <br />
            & Train Scheduling
          </h1>

          <p
            style={{
              margin: "24px 0 0",
              maxWidth: "620px",
              fontSize: "18px",
              lineHeight: "1.7",
              color: "#cbd5e1",
            }}
          >
            Optimize station congestion, dynamically schedule train dispatches,
            track real-time metro movements, predict peak passenger rushes, and book tickets seamless via artificial intelligence.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "36px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  padding: "14px 32px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Get Started Free →
              </button>
            </Link>

            <a
              href="#features"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  padding: "14px 28px",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                }}
              >
                Explore Modules
              </button>
            </a>

            <Link
              to="/dashboard"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  padding: "14px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#93c5fd",
                  border: "1px solid rgba(147, 197, 253, 0.3)",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Live Dashboard 📊
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "rgba(255, 255, 255, 0.07)",
              backdropFilter: "blur(16px)",
              borderRadius: "24px",
              padding: "32px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>📊</span>
                <h3 style={{ margin: 0, fontSize: "17px", color: "white" }}>Live System Metrics</h3>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "#10b981",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                ONLINE
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Active Metro Stations</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>286</div>
                <div style={{ fontSize: "11px", color: "#4ade80", marginTop: "4px" }}>10 Lines Connected</div>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Active Trains</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#60a5fa", marginTop: "4px" }}>150+</div>
                <div style={{ fontSize: "11px", color: "#38bdf8", marginTop: "4px" }}>Real-time Simulated</div>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>AI Prediction Accuracy</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>94.2%</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>ML XGBoost / Random Forest</div>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Daily Passenger Flow</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>1.2M</div>
                <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "4px" }}>Peak Hour Optimization</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYSTEM MODULES BREAKDOWN ================= */}
      <section
        id="features"
        style={{
          background: "#f8fafc",
          color: "#0f172a",
          padding: "80px 6%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Section Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "55px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "20px",
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "12px",
              }}
            >
              Core Capabilities
            </span>

            <h2
              style={{
                margin: "0",
                fontSize: "36px",
                fontWeight: "800",
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              Comprehensive System Modules
            </h2>

            <p
              style={{
                margin: "14px auto 0",
                maxWidth: "680px",
                color: "#64748b",
                fontSize: "17px",
                lineHeight: "1.6",
              }}
            >
              Designed for metro transit authorities, station managers, and daily commuters to maintain efficiency and eliminate overcrowding.
            </p>
          </div>

          {/* Module Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "28px",
            }}
          >
            <ModuleCard
              icon="🚉"
              badge="Module 01"
              title="Metro Crowd Management"
              description="Monitor real-time station crowding, passenger density heatmaps, station capacity thresholds, and automated peak-hour congestion alerts."
              route="/stations"
              routeText="View Stations →"
            />

            <ModuleCard
              icon="📅"
              badge="Module 02"
              title="Dynamic Train Scheduling"
              description="Automated schedule generator adjusting train dispatch frequencies based on forecasted commuter demand and station congestion spikes."
              route="/schedules"
              routeText="View Schedules →"
            />

            <ModuleCard
              icon="📍"
              badge="Module 03"
              title="Real-Time Train Tracking"
              description="Track train positions along metro lines with route progress indicators, departure/arrival ETAs, and live station status updates."
              route="/trains"
              routeText="Track Trains →"
            />

            <ModuleCard
              icon="🤖"
              badge="Module 04"
              title="AI Predictions & Assistant"
              description="Predict crowd density using machine learning algorithms and converse with Gemini AI assistant for natural language metro queries."
              route="/prediction"
              routeText="Explore AI Features →"
            />

            <ModuleCard
              icon="🎟️"
              badge="Module 05"
              title="Ticket Booking System"
              description="Calculate distance-based metro fares, book single/return digital tickets, manage passenger counts, and access booking history."
              route="/login"
              routeText="Book Tickets →"
            />

            <ModuleCard
              icon="📈"
              badge="Module 06"
              title="Analytics & Export Reports"
              description="Analyze passenger growth trends, line utilization charts, peak-hour stats, and generate downloadable PDF & CSV data reports."
              route="/analytics"
              routeText="View Analytics →"
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section
        style={{
          background: "#0f172a",
          padding: "80px 6%",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: "#38bdf8", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
            Intelligent Architecture
          </span>
          <h2 style={{ fontSize: "34px", fontWeight: "800", marginTop: "8px", marginBottom: "48px" }}>
            How Metro AI Operates
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            <StepCard
              step="01"
              title="Data Ingestion"
              desc="Collect real station turnstile data, schedule timetables, and train capacities from database models."
            />
            <StepCard
              step="02"
              title="AI & ML Inference"
              desc="Machine learning models analyze historical traffic patterns to predict passenger surges before peak hours."
            />
            <StepCard
              step="03"
              title="Smart Dispatch"
              desc="Algorithms adjust train dispatch frequencies dynamically to prevent bottleneck congestion."
            />
            <StepCard
              step="04"
              title="Passenger Services"
              desc="Commuters book tickets, check live train positions, view crowd levels, and get AI guidance."
            />
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          padding: "60px 6%",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 16px" }}>
            Experience Next-Generation Metro Management Today
          </h2>
          <p style={{ fontSize: "17px", color: "#bfdbfe", margin: "0 0 28px", lineHeight: "1.6" }}>
            Join station operators and passengers in utilizing intelligent crowd predictions, automated schedules, and smart ticketing.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 32px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(16, 185, 129, 0.4)",
                }}
              >
                Create Account
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 32px",
                  background: "white",
                  color: "#1e40af",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          background: "#090d16",
          padding: "40px 6% 30px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h3 style={{ color: "white", margin: "0 0 6px", fontSize: "18px" }}>
              Metro Crowd Management & Scheduling System
            </h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              AI-Powered Metro Solution • Infosys Springboard Internship Project
            </p>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/login" style={{ color: "#93c5fd", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "#93c5fd", textDecoration: "none" }}>Register</Link>
            <Link to="/dashboard" style={{ color: "#93c5fd", textDecoration: "none" }}>Dashboard</Link>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "13px", color: "#475569" }}>
          © {new Date().getFullYear()} Metro AI Platform. Built with React + FastAPI + Gemini AI.
        </div>
      </footer>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function ModuleCard({ icon, badge, title, description, route, routeText }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "30px 26px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 18px 40px rgba(15, 23, 42, 0.12)";
        e.currentTarget.style.borderColor = "#93c5fd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(15, 23, 42, 0.06)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <span style={{ fontSize: "40px" }}>{icon}</span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "12px",
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            {badge}
          </span>
        </div>

        <h3 style={{ margin: "0 0 10px", fontSize: "20px", color: "#0f172a", fontWeight: "700" }}>
          {title}
        </h3>

        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#64748b" }}>
          {description}
        </p>
      </div>

      <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
        <Link to={route} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            {routeText}
          </span>
        </Link>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "18px",
        padding: "24px 20px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        textAlign: "left",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "800", color: "#38bdf8", marginBottom: "12px" }}>
        {step}
      </div>
      <h4 style={{ color: "white", margin: "0 0 8px", fontSize: "17px" }}>{title}</h4>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>{desc}</p>
    </div>
  );
}

export default Home;