function ResultCard({ result, recommendation }) {

  if (!result) return null;

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        border: "2px solid #1E3A8A",
        borderRadius: "10px",
        background: "#F3F8FF",
        width: "350px",
        margin: "30px auto"
      }}
    >
      <h2>Prediction Result</h2>

      <h3>Crowd Level</h3>
      <h1>{result}</h1>

      <hr />

      <h3>AI Recommendation</h3>
      <p>{recommendation}</p>
    </div>
  );
}

export default ResultCard;