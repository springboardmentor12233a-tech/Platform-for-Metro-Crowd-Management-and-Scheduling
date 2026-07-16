function ResultCard({ result, recommendation }) {

  if (!result) return null;

  const actions = [
    "Deploy Extra Staff",
    "Increase Train Frequency",
    "Broadcast Passenger Announcements",
    "Open Extra Ticket Counters"
  ];

  return (
    <div className="result-card">

      <h2>🎯 Prediction Result</h2>

      <h3>Crowd Level</h3>

      <h1 className="crowd-level">
        {result}
      </h1>

      <hr />

      <h3>🤖 AI Recommendation</h3>

      <p>{recommendation}</p>

      <hr />

      <h3>Suggested Actions</h3>

      <ul>
        {actions.map((action, index) => (
          <li key={index}>✅ {action}</li>
        ))}
      </ul>

      <hr />

      <h3>Status</h3>

      <p style={{ color: "green", fontWeight: "bold" }}>
        🟢 Prediction Generated Successfully
      </p>

    </div>
  );
}

export default ResultCard;