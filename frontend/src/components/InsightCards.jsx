import "../styles/InsightCards.css";

function InsightCards({ insights }) {

  if (!insights) {
    return null;
  }

  const summary = insights.summary;

  return (
    <div className="insight-section">

      <div className="insight-card">
        <h4>Total Predictions</h4>
        <h2>{summary.total_predictions}</h2>
      </div>


      <div className="insight-card">
        <h4>High Alerts</h4>
        <h2>{summary.high_priority_alerts}</h2>
      </div>


      <div className="insight-card">
        <h4>Avg Passengers</h4>
        <h2>{summary.average_predicted_passengers}</h2>
      </div>


      <div className="insight-card">
        <h4>Extra Trains Today</h4>
        <h2>{summary.total_extra_trains_recommended}</h2>
      </div>


    </div>
  );
}

export default InsightCards;