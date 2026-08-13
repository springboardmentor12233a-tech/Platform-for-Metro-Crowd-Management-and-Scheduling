import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Schedule.css";

function Schedule() {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoadingStations(true);
      setError("");

      const response = await api.get("/data/stations");

      const stationList = response.data.stations || [];

      setStations(stationList);
    } catch (err) {
      console.error("Station loading error:", err);

      setError(
        "Unable to load metro stations. Please make sure the FastAPI server is running."
      );
    } finally {
      setLoadingStations(false);
    }
  };

  const handleRecommend = async (e) => {
    e.preventDefault();

    if (!source || !destination) {
      setError("Please select both source and destination stations.");
      return;
    }

    if (source === destination) {
      setError("Source and destination stations cannot be the same.");
      return;
    }

    try {
      setLoadingRecommendation(true);
      setError("");
      setResult(null);

      const response = await api.post("/schedule/recommend", {
        source: source,
        destination: destination,
      });

      setResult(response.data);
    } catch (err) {
      console.error("Schedule recommendation error:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to generate schedule recommendation.";

      setError(message);
    } finally {
      setLoadingRecommendation(false);
    }
  };

  return (
    <div className="schedule-page">

      {/* Header */}

      <div className="schedule-header">
        <div>
          <span className="schedule-eyebrow">
            METRO OPERATIONS
          </span>

          <h1>🚆 Metro Travel Recommendation</h1>

          <p>
            Select your source and destination to get a recommended
            metro travel plan.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="schedule-error">
          ⚠️ {error}
        </div>
      )}

      {/* Recommendation Form */}

      <div className="schedule-form-card">

        <div className="schedule-form-header">
          <div>
            <h2>Plan Your Journey</h2>

            <p>
              Choose the stations to calculate distance,
              travel time and recommended frequency.
            </p>
          </div>
        </div>

        <form onSubmit={handleRecommend}>

          <div className="schedule-form-grid">

            {/* Source */}

            <div className="schedule-field">
              <label>Source Station</label>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={loadingStations}
              >
                <option value="">
                  {loadingStations
                    ? "Loading stations..."
                    : "Select source station"}
                </option>

                {stations.map((station) => (
                  <option
                    key={`source-${station}`}
                    value={station}
                  >
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}

            <div className="schedule-field">
              <label>Destination Station</label>

              <select
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                disabled={loadingStations}
              >
                <option value="">
                  {loadingStations
                    ? "Loading stations..."
                    : "Select destination station"}
                </option>

                {stations.map((station) => (
                  <option
                    key={`destination-${station}`}
                    value={station}
                  >
                    {station}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="schedule-recommend-button"
            disabled={
              loadingStations ||
              loadingRecommendation
            }
          >
            {loadingRecommendation
              ? "Calculating..."
              : "🚆 Recommend Journey"}
          </button>

        </form>
      </div>

      {/* Recommendation Result */}

      {result && (
        <div className="schedule-result-card">

          <div className="schedule-result-header">
            <div>
              <span className="schedule-result-eyebrow">
                RECOMMENDED JOURNEY
              </span>

              <h2>
                {result.source} → {result.destination}
              </h2>
            </div>

            <span className="schedule-status">
              Recommended
            </span>
          </div>

          <div className="schedule-result-grid">

            <div className="schedule-result-item">
              <span>🚇 Metro Line</span>
              <strong>{result.line}</strong>
            </div>

            <div className="schedule-result-item">
              <span>📏 Distance</span>
              <strong>
                {result.distance_km} km
              </strong>
            </div>

            <div className="schedule-result-item">
              <span>⏱ Estimated Travel Time</span>
              <strong>
                {result.estimated_travel_time}
              </strong>
            </div>

            <div className="schedule-result-item">
              <span>🔄 Recommended Frequency</span>
              <strong>
                {result.recommended_frequency}
              </strong>
            </div>

          </div>

          <div className="schedule-note">
            <strong>ℹ️ Note:</strong>{" "}
            Travel time and frequency are recommendations
            calculated from the metro network dataset.
          </div>

        </div>
      )}

    </div>
  );
}

export default Schedule;