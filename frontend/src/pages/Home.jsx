import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="hero">

        <div className="hero-content">

          <h1>🚇 AI MetroFlow</h1>

          <h2>Platform for Metro Crowd Management and Scheduling</h2>

          <p>
            AI-powered platform that predicts metro crowd levels,
            optimizes train scheduling, monitors station congestion,
            and helps improve passenger safety.
          </p>

          <Link to="/login">
            <button className="primary-btn">
              Get Started
            </button>
          </Link>

        </div>

      </div>

      {/* Features */}

      <section className="features">

        <h2>Platform Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>🚉 Crowd Prediction</h3>

            <p>
              Predict crowd level using Machine Learning.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Analytics</h3>

            <p>
              View passenger statistics and crowd trends.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚨 Smart Alerts</h3>

            <p>
              Generate alerts for overcrowded stations.
            </p>
          </div>

          <div className="feature-card">
            <h3>🤖 AI Recommendation</h3>

            <p>
              AI suggests train scheduling improvements.
            </p>
          </div>

          <div className="feature-card">
            <h3>📈 Reports</h3>

            <p>
              Generate operational reports automatically.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚆 Smart Scheduling</h3>

            <p>
              Optimize train frequency during peak hours.
            </p>
          </div>

        </div>

      </section>

      {/* Why MetroFlow */}

      <section className="why">

        <h2>Why AI MetroFlow?</h2>

        <ul>

          <li>✔ AI-Based Crowd Prediction</li>

          <li>✔ Better Passenger Safety</li>

          <li>✔ Reduced Congestion</li>

          <li>✔ Intelligent Scheduling</li>

          <li>✔ Real-Time Monitoring</li>

          <li>✔ Actionable AI Recommendations</li>

        </ul>

      </section>

      <Footer />

    </>
  );
}

export default Home;