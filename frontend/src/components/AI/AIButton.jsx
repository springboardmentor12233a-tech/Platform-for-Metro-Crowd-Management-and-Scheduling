function AIButton({ loading, text, onClick }) {
  return (
    <button
      className="ai-button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Generating..." : text}
    </button>
  );
}

export default AIButton;