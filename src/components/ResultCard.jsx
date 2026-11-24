function ResultCard({ title, result }) {
  return (
    <div className="result-card">
      <div className="result-header">
        <h3>{title}</h3>
        <span className="confidence-pill">{result.confidence}% confidence</span>
      </div>

      <div className="result-grid">
        <div>
          <span className="result-label">Sentiment</span>
          <strong>{result.sentiment}</strong>
        </div>
        <div>
          <span className="result-label">Sarcasm</span>
          <strong>{result.sarcasm}</strong>
        </div>
      </div>

      <p className="result-summary">{result.summary}</p>
    </div>
  )
}

export default ResultCard
