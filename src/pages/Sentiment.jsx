import { useState } from 'react'
import {
  Brain,
  CheckCircle2,
  CircleAlert,
  RotateCcw,
  Search,
  Trash2,
  Layers3,
} from 'lucide-react'
import { predictAllSentiments } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import './Sentiment.css'

const MAX_LENGTH = 1000

const samples = [
  {
    label: 'Positive',
    text: 'हा चित्रपट खूप छान आहे. मला खूप आवडला.',
  },
  {
    label: 'Negative',
    text: 'हा चित्रपट अजिबात आवडला नाही. खूप वाईट अनुभव होता.',
  },
  {
    label: 'Neutral',
    text: 'आज मी बाजारात गेलो आणि काही वस्तू खरेदी केल्या.',
  },
]

function formatPercent(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }

  return `${(value * 100).toFixed(1)}%`
}

function Sentiment() {
  const [text, setText] = useState('')
  const [previousText, setPreviousText] = useState('')
  const [result, setResult] = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useLanguage()

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError(t('pleaseEnterText'))
      return
    }

    setError('')
    setResult(null)
    setAnalyzedText('')
    setIsLoading(true)

    const submittedText = text.trim()

    try {
      const response = await predictAllSentiments(submittedText)
      setResult(response)
      setAnalyzedText(submittedText)
    } catch (requestError) {
      setError(requestError.message || t('couldNotConnect'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setPreviousText(text)
    setText('')
    setResult(null)
    setAnalyzedText('')
    setError('')
  }

  const handleReset = () => {
    setText(previousText)
    setResult(null)
    setAnalyzedText('')
    setError('')
  }

  const handleAnalyzeAnother = () => {
    setText('')
    setResult(null)
    setAnalyzedText('')
    setError('')
  }

  const finalSentiment = result?.final_sentiment
  const sentimentTone = finalSentiment?.toLowerCase() || 'neutral'

  const probabilities = result?.final_probabilities || {}
  const modelResults = result?.models || []

  return (
    <main className="tm-ensemble-page">
      <header className="tm-ensemble-page-header">
        <p>{t('sentimentPageDesc')}</p>
      </header>

      <div className="tm-ensemble-layout">
        {/* LEFT: INPUT CARD */}
        <section className="tm-ensemble-card tm-ensemble-input">
          <div className="tm-ensemble-heading">
            <div>
              <h2>{t('inputText')}</h2>
              <p>{t('inputTextDesc')}</p>
            </div>
          </div>

          <label className="tm-ensemble-label" htmlFor="sentiment-text">
            {t('marathiTextLabel')}
          </label>

          <textarea
            id="sentiment-text"
            className="tm-ensemble-textarea"
            value={text}
            maxLength={MAX_LENGTH}
            rows={5}
            placeholder={t('sentimentPlaceholder')}
            onChange={(event) => {
              setText(event.target.value)
              if (error) setError('')
            }}
          />

          <div className="tm-ensemble-meta">
            <span>{text.length}/{MAX_LENGTH} characters</span>
            <span>{t('unicodeSupported')}</span>
          </div>

          <div className="tm-ensemble-samples">
            <div className="tm-ensemble-section-heading">
              <h3>{t('sampleSentences')}</h3>
              <span>{t('tryOne')}</span>
            </div>

            <div className="tm-ensemble-sample-list">
              {samples.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  className={`tm-ensemble-sample ${sample.label.toLowerCase()}`}
                  onClick={() => {
                    setText(sample.text)
                    setError('')
                  }}
                >
                  <span>{sample.label}</span>
                  <small>{sample.text}</small>
                </button>
              ))}
            </div>
          </div>

          

          {error && (
            <div className="tm-ensemble-error" role="alert">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="tm-ensemble-primary"
            type="button"
            onClick={handleAnalyze}
            disabled={!text.trim() || isLoading}
          >
            <Search size={18} />
            {isLoading ? 'Analyzing All Models...' : 'Analyze All Models'}
          </button>

          <div className="tm-ensemble-actions">
            <button
              className="tm-ensemble-secondary"
              type="button"
              onClick={handleClear}
              disabled={!text || isLoading}
            >
              <Trash2 size={16} />
              {t('clearBtn')}
            </button>

            <button
              className="tm-ensemble-secondary"
              type="button"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw size={16} />
              {t('resetBtn')}
            </button>
          </div>
        </section>

        {/* RIGHT: RESULTS */}
        <section className="tm-ensemble-results">
          {!result ? (
            <div className="tm-ensemble-card tm-ensemble-empty">
              <div className="tm-ensemble-empty-icon">
                <Layers3 size={30} />
              </div>
              <h2>Ensemble Analysis Results</h2>
              <p>
                Enter Marathi text and analyze it to see the final weighted
                sentiment and predictions from individual models.
              </p>
            </div>
          ) : (
            <>
              {/* CARD 1: FINAL WEIGHTED RESULT */}
              <article
                className={`tm-ensemble-card tm-final-card ${sentimentTone}`}
                aria-live="polite"
              >
                <div className="tm-ensemble-result-heading">
                  <div>
                    <span className="tm-ensemble-eyebrow">
                      <CheckCircle2 size={17} />
                      FINAL WEIGHTED RESULT
                    </span>
                    <h2>Final Sentiment</h2>
                  </div>

                  <span className={`tm-ensemble-badge ${sentimentTone}`}>
                    {finalSentiment || 'Unknown'}
                  </span>
                </div>

                <div className="tm-ensemble-analyzed-text">
                  <span>{t('analyzedText')}</span>
                  <p>{analyzedText}</p>
                </div>

                <div className={`tm-final-value ${sentimentTone}`}>
                  {finalSentiment || 'Unknown'}
                </div>

                <div className="tm-ensemble-stats">
                  <div className="tm-ensemble-stat">
                    <span>Ensemble Confidence</span>
                    <strong>{formatPercent(result.final_confidence)}</strong>
                  </div>

                  <div className="tm-ensemble-stat">
                    <span>Models Successful</span>
                    <strong>
                      {result.successful_models ?? modelResults.length}
                      {' / '}
                      {result.total_models ?? modelResults.length}
                    </strong>
                  </div>
                </div>

                <div className="tm-ensemble-confidence">
                  <span
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, (result.final_confidence || 0) * 100)
                      )}%`,
                    }}
                  />
                </div>

                <div className="tm-ensemble-divider" />

                <h3 className="tm-ensemble-probability-title">
                  Combined Class Probabilities
                </h3>

                <div className="tm-ensemble-probabilities">
                  {Object.entries(probabilities).map(([label, probability]) => (
                    <div className="tm-ensemble-probability-row" key={label}>
                      <span>{label}</span>

                      <div className="tm-ensemble-probability-track">
                        <span
                          className={label.toLowerCase()}
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, (probability || 0) * 100)
                            )}%`,
                          }}
                        />
                      </div>

                      <strong>{formatPercent(probability)}</strong>
                    </div>
                  ))}
                </div>

                <p className="tm-ensemble-note">
                  The final result combines class probabilities from the models
                  that ran successfully. Confidence is an estimate, not a
                  guarantee of real-world accuracy.
                </p>
              </article>

              {/* CARD 2: ALL INDIVIDUAL MODEL RESULTS */}
              <article className="tm-ensemble-card tm-individual-card">
                <div className="tm-ensemble-result-heading">
                  <div>
                    <span className="tm-ensemble-eyebrow">
                      <Brain size={17} />
                      MODEL COMPARISON
                    </span>
                    <h2>Individual Model Predictions</h2>
                    <p>Compare each model's prediction and confidence.</p>
                  </div>

                  <span className="tm-ensemble-count">
                    {modelResults.length} models
                  </span>
                </div>

                {modelResults.length > 0 ? (
                  <div className="tm-individual-grid">
                    {modelResults.map((modelResult) => {
                      const modelTone =
                        modelResult.sentiment?.toLowerCase() || 'neutral'

                      return (
                        <div
                          className="tm-individual-model"
                          key={modelResult.model}
                        >
                          <div className="tm-individual-model-top">
                            <strong>{modelResult.model}</strong>
                            <span className={`tm-ensemble-badge ${modelTone}`}>
                              {modelResult.sentiment || 'Unknown'}
                            </span>
                          </div>

                          <div className="tm-individual-confidence">
                            <span>Confidence</span>
                            <strong>
                              {formatPercent(modelResult.confidence)}
                            </strong>
                          </div>

                          <div className="tm-ensemble-confidence">
                            <span
                              className={modelTone}
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    (modelResult.confidence || 0) * 100
                                  )
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="tm-ensemble-no-models">
                    No individual model predictions were returned.
                  </p>
                )}

                {result.errors?.length > 0 && (
                  <div className="tm-ensemble-model-errors">
                    <strong>Some models could not run</strong>
                    {result.errors.map((item) => (
                      <p key={item.model}>
                        {item.model}: {item.error}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  className="tm-ensemble-another"
                  type="button"
                  onClick={handleAnalyzeAnother}
                >
                  Analyze Another Text
                </button>
              </article>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Sentiment
