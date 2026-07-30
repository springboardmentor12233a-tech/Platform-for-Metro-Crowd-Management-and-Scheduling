function AIResponseCard({
  response,
  onCopy,
  onClear,
}) {
  if (!response) return null;

  return (
    <div className="response-card">

      <div className="response-title">
        🤖 AI Generated Response
      </div>

      <textarea
        value={response}
        readOnly
        rows={10}
      />

      <div className="response-actions">

        <button onClick={onCopy}>
          📋 Copy
        </button>

        <button onClick={onClear}>
          🗑 Clear
        </button>

      </div>

      <div className="powered">
        Generated using Groq Llama 3.3
      </div>

    </div>
  );
}

export default AIResponseCard;