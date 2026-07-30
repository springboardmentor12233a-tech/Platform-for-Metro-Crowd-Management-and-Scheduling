function AIHeader({ title, subtitle }) {
  return (
    <div className="ai-header">
      <h1>{title}</h1>

      <p>{subtitle}</p>

      <span className="ai-badge">
        🤖 Powered by Groq • Llama 3.3 70B
      </span>
    </div>
  );
}

export default AIHeader;