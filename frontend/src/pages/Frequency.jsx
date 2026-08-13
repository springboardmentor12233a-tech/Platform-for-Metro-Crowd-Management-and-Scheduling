import { useState } from "react";
import api from "../services/api";
import "../styles/Frequency.css";

function Frequency() {
  const [demandLevel, setDemandLevel] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async (e) => {
    e.preventDefault();

    if (!demandLevel) {
      setError("Please select a demand level.");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post("/frequency/recommend", {
        demand_level: demandLevel,
      });

      setResult(response.data);
    } catch (err) {
      console.error("Frequency recommendation error:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to generate frequency recommendation.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getLevelClass = () => {
    if (demandLevel === "High") return "high";
    if (demandLevel === "Medium") return "medium";
    if (demandLevel === "Low") return "low";
    return "";
  };

  return (
    <div className="frequency-page">

      {/* Header */}

      <div className="frequency-header">
        <div>
          <span className="frequency-eyebrow">
            METRO OPERATIONS
          </span>

          <h1>🚆 Dynamic Train Frequency</h1>

          <p>
            Adjust train frequency based on the current crowd
            demand level.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="frequency-error">
          ⚠️ {error}
        </div>
      )}

      {/* Recommendation Form */}

      <div className="frequency-form-card">

        <div className="frequency-form-header">
          <h2>Demand-Based Frequency Adjustment</h2>

          <p>
            Select the current crowd level to receive a recommended
            train frequency.
          </p>
        </div>

        <form onSubmit={handleRecommend}>

          <div className="frequency-field">

            <label>Current Demand Level</label>

            <select
              value={demandLevel}
              onChange={(e) => {
                setDemandLevel(e.target.value);
                setError("");
              }}
            >
              <option value="">
                Select demand level
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

          </div>

          <button
            type="submit"
            className="frequency-button"
            disabled={loading}
          >
            {loading
              ? "Calculating..."
              : "🚆 Recommend Frequency"}
          </button>

        </form>
      </div>

      {/* Result */}

      {result && (
        <div className="frequency-result-card">

          <div className="frequency-result-header">

            <div>
              <span className="frequency-result-eyebrow">
                FREQUENCY RECOMMENDATION
              </span>

              <h2>
                {result.demand_level} Demand
              </h2>
            </div>

            <span
              className={`frequency-level-badge ${getLevelClass()}`}
            >
              {result.status}
            </span>

          </div>

          <div className="frequency-result-grid">

            <div className="frequency-result-item">

              <span>
                🚆 Recommended Frequency
              </span>

              <strong>
                {result.recommended_frequency}
              </strong>

            </div>

            <div className="frequency-result-item">

              <span>
                🚇 Additional Trains
              </span>

              <strong>
                {result.additional_trains}
              </strong>

            </div>

            <div className="frequency-result-item">

              <span>
                📊 Demand Level
              </span>

              <strong>
                {result.demand_level}
              </strong>

            </div>

            <div className="frequency-result-item">

              <span>
                ⚡ Operational Status
              </span>

              <strong>
                {result.status}
              </strong>

            </div>

          </div>

          <div className="frequency-note">

            <strong>ℹ️ Recommendation:</strong>{" "}
            Train frequency is dynamically recommended according
            to the selected crowd demand level.

          </div>

        </div>
      )}

    </div>
  );
}

export default Frequency;