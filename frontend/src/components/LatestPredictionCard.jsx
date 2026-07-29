import "../styles/LatestPredictionCard.css";

function LatestPredictionCard({ prediction }) {

  if (!prediction) {
    return null;
  }

  return (
    <div className="prediction-card">

      <div className="prediction-header">
        <h2>🚆 Latest Passenger Prediction</h2>
      </div>

      <div className="prediction-grid">

        <div className="prediction-item">
          <span className="label">From Station</span>
          <span className="value">{prediction.from_station}</span>
        </div>

        <div className="prediction-item">
          <span className="label">To Station</span>
          <span className="value">{prediction.to_station}</span>
        </div>

        <div className="prediction-item">
          <span className="label">Predicted Passengers</span>
          <span className="value">{prediction.predicted_passengers}</span>
        </div>

        <div className="prediction-item">
          <span className="label">Crowd Level</span>
          <span className="value">
            {prediction.crowd_level}
          </span>
        </div>

        <div className="prediction-item">
          <span className="label">Platform Status</span>
          <span className="value">{prediction.platform_status}</span>
        </div>

        <div className="prediction-item">
          <span className="label">Train Interval</span>
          <span className="value">
            {prediction.recommended_train_interval}
          </span>
        </div>

        <div className="prediction-item">
          <span className="label">Extra Trains</span>
          <span className="value">{prediction.extra_trains}</span>
        </div>

        <div className="prediction-item">
          <span className="label">Prediction Time</span>
          <span className="value">
            {new Date(prediction.prediction_time).toLocaleString()}
          </span>
        </div>

      </div>

    </div>
  );
}

export default LatestPredictionCard;