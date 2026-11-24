import { useState } from 'react'
import {
  Brain,
  CheckCircle2,
  CircleAlert,
  RotateCcw,
  Search,
  Trash2,
  Layers3,
  Sparkles,
} from 'lucide-react'
import {
  getSarcasmModels,
  predictSarcasm,
  saveAnalysisHistory,
} from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import './Sarcasm.css'

const MAX_LENGTH = 1000

const samples = [
  {
    label: 'Sarcastic',
    text: 'वा! किती वेळेवर आलास, कार्यक्रम तर संपलाच!',
  },
  {
    label: 'Non-Sarcastic',
    text: 'तू आज खूप छान काम केलेस. तुझ्या मदतीबद्दल धन्यवाद.',
  },
  {
    label: 'Sarcastic',
    text: 'वा! किती स्वच्छ रूम आहे तुझी... एखादा कचरा डेपो पण लाजेल!',
  },
]

function formatPercent(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '—'
  }

  return `${Math.round(value <= 1 ? value * 100 : value)}%`
}

function normalizePrediction(item) {
  return {
    model: item.model || 'Unknown Model',
    sarcasm: item.sarcasm || item.prediction || 'Unknown',
    confidence: item.confidence ?? null,
  }
}

function Sarcasm() {
  const [text, setText] = useState('')
  const [previousText, setPreviousText] = useState('')
  const [result, setResult] = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')
  const [error, setError] = useState('')
  const [historyWarning, setHistoryWarning] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useLanguage()

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError(t('pleaseEnterText'))
      return
    }

    if (text.length > MAX_LENGTH) {
      setError(t('textTooLong'))
      return
    }

    const submittedText = text.trim()

    setError('')
    setHistoryWarning('')
    setResult(null)
    setAnalyzedText('')
    setIsLoading(true)

    try {
      // Load the available models.
      const availableModels = await getSarcasmModels()

      if (!availableModels?.length) {
        throw new Error('No sarcasm models are available.')
      }

      // Run every model for the same input.
      const responses = await Promise.allSettled(
        availableModels.map((model) =>
          predictSarcasm(submittedText, model)
        )
      )

      const successfulResults = []
      const errors = []

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          successfulResults.push(
            normalizePrediction({
              ...response.value,
              model:
                response.value?.model ||
                availableModels[index],
            })
          )
        } else {
          errors.push({
            model: availableModels[index],
            error:
              response.reason?.message ||
              'Prediction failed',
          })
        }
      })

      if (!successfulResults.length) {
        throw new Error('All sarcasm models failed to analyze the text.')
      }

      const sarcasticVotes = successfulResults.filter(
        (item) => item.sarcasm.toLowerCase() === 'sarcastic'
      ).length

      const nonSarcasticVotes = successfulResults.filter(
        (item) =>
          item.sarcasm.toLowerCase() === 'non-sarcastic'
      ).length

      const finalPrediction =
        sarcasticVotes >= nonSarcasticVotes
          ? 'Sarcastic'
          : 'Non-Sarcastic'

      const majorityAgreement =
        (Math.max(sarcasticVotes, nonSarcasticVotes) /
          successfulResults.length) *
        100

      const sarcasmResult = {
        sarcasm: finalPrediction,
        models: successfulResults,
        errors,
        successful_models: successfulResults.length,
        total_models: availableModels.length,
        sarcastic_votes: sarcasticVotes,
        non_sarcastic_votes: nonSarcasticVotes,
        majority_agreement: majorityAgreement / 100,
      }

      setResult(sarcasmResult)
      setAnalyzedText(submittedText)

      // Preserve the existing history feature.
      try {
        await saveAnalysisHistory({
          text: submittedText,
          sentiment: 'Not analyzed',
          sarcasm: finalPrediction,
          sarcasmModel: 'All Models',
          sarcasmConfidence: majorityAgreement / 100,
        })
      } catch (historyError) {
        console.error('Could not save sarcasm history:', historyError)
        setHistoryWarning(t('predictionSavedWarning'))
      }
    } catch (requestError) {
      setError(
        requestError.message || t('couldNotConnect')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setAnalyzedText('')
    setHistoryWarning('')
  }

  const handleClear = () => {
    setPreviousText(text)
    setText('')
    clearResult()
    setError('')
  }

  const handleReset = () => {
    setText(previousText)
    clearResult()
    setError('')
  }

  const handleAnalyzeAnother = () => {
    setPreviousText(text)
    setText('')
    clearResult()
    setError('')
  }

  const finalPrediction = result?.sarcasm
  const resultTone =
    finalPrediction === 'Sarcastic'
      ? 'sarcastic'
      : 'non-sarcastic'

  const modelResults = result?.models || []
  const sarcasticVotes = result?.sarcastic_votes || 0
  const nonSarcasticVotes = result?.non_sarcastic_votes || 0

  return (
    <main className="tm-sarcasm-page">
      <header className="tm-sarcasm-page-header">
        <p>
          Analyze Marathi text to determine whether it expresses
          sarcasm or is non-sarcastic.
        </p>
      </header>

      {/* FULL-WIDTH INPUT CARD */}
      <section className="tm-sarcasm-card tm-sarcasm-input-card">
        <div className="tm-sarcasm-heading">
          <div>
            <h2>{t('inputText')}</h2>
            <p>{t('inputTextDesc')}</p>
          </div>

          <span className="tm-sarcasm-heading-icon">
            <Brain size={21} />
          </span>
        </div>

        <label
          className="tm-sarcasm-label"
          htmlFor="sarcasm-text"
        >
          {t('marathiTextLabel')}
        </label>

        <textarea
          id="sarcasm-text"
          className="tm-sarcasm-textarea"
          value={text}
          maxLength={MAX_LENGTH}
          rows={5}
          placeholder="Enter Marathi text for sarcasm detection..."
          onChange={(event) => {
            setText(event.target.value)
            if (error) setError('')
          }}
        />

        <div className="tm-sarcasm-meta">
          <span>
            {text.length}/{MAX_LENGTH} characters
          </span>
          <span>{t('unicodeSupported')}</span>
        </div>

        <div className="tm-sarcasm-samples">
          <div className="tm-sarcasm-section-heading">
            <h3>{t('sampleSentences')}</h3>
            <span>Try one</span>
          </div>

          <div className="tm-sarcasm-sample-list">
            {samples.map((sample, index) => (
              <button
                key={index}
                type="button"
                className="tm-sarcasm-sample"
                onClick={() => {
                  setText(sample.text)
                  setError('')
                }}
              >
                <span
                  className={
                    sample.label === 'Sarcastic'
                      ? 'sarcastic'
                      : 'non-sarcastic'
                  }
                >
                  {sample.label}
                </span>

                <small>{sample.text}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="tm-sarcasm-info">
          <Brain size={21} />
          <div>
            <strong>All Sarcasm Models</strong>
            <p>
              All available models analyze the same text.
              Compare their predictions and confidence scores
              in the results below.
            </p>
          </div>
        </div>

        {error && (
          <div className="tm-sarcasm-error" role="alert">
            <CircleAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {historyWarning && (
          <div className="tm-sarcasm-warning">
            {historyWarning}
          </div>
        )}

        <button
          className="tm-sarcasm-primary"
          type="button"
          onClick={handleAnalyze}
          disabled={!text.trim() || isLoading}
        >
          <Search size={18} />
          {isLoading
            ? 'Analyzing All Models...'
            : 'Analyze All Models'}
        </button>

        <div className="tm-sarcasm-actions">
          <button
            className="tm-sarcasm-secondary"
            type="button"
            onClick={handleClear}
            disabled={!text || isLoading}
          >
            <Trash2 size={16} />
            {t('clearBtn')}
          </button>

          <button
            className="tm-sarcasm-secondary"
            type="button"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={16} />
            {t('resetBtn')}
          </button>
        </div>
      </section>

      {/* TWO RESULT CARDS BELOW THE INPUT */}
      <section className="tm-sarcasm-results">
        {!result ? (
          <div className="tm-sarcasm-card tm-sarcasm-empty">
            <div className="tm-sarcasm-empty-icon">
              <Layers3 size={30} />
            </div>
            <h2>Sarcasm Analysis Results</h2>
            <p>
              Enter Marathi text and click Analyze All Models
              to view the final prediction and individual model
              results.
            </p>
          </div>
        ) : (
          <>
            {/* FINAL WEIGHTED / MAJORITY RESULT */}
            <article
              className={`tm-sarcasm-card tm-sarcasm-final ${resultTone}`}
              aria-live="polite"
            >
              <div className="tm-sarcasm-result-heading">
                <div>
                  <span className="tm-sarcasm-eyebrow">
                    <CheckCircle2 size={16} />
                    FINAL SARСASM RESULT
                  </span>
                  <h2>Final Prediction</h2>
                </div>

                <span
                  className={`tm-sarcasm-badge ${resultTone}`}
                >
                  {finalPrediction}
                </span>
              </div>

              <div className="tm-sarcasm-analyzed-text">
                <span>{t('analyzedText')}</span>
                <p>{analyzedText}</p>
              </div>

              <div className={`tm-sarcasm-final-value ${resultTone}`}>
                {finalPrediction}
              </div>

              <div className="tm-sarcasm-stats">
                <div>
                  <span>Models Successful</span>
                  <strong>
                    {result.successful_models} / {result.total_models}
                  </strong>
                </div>

                <div>
                  <span>Majority Agreement</span>
                  <strong>
                    {formatPercent(result.majority_agreement)}
                  </strong>
                </div>
              </div>

              <div className="tm-sarcasm-progress">
                <span
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, result.majority_agreement * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="tm-sarcasm-divider" />

              <h3 className="tm-sarcasm-vote-title">
                Model Vote Distribution
              </h3>

              <div className="tm-sarcasm-votes">
                <div className="tm-sarcasm-vote-row">
                  <span>Sarcastic</span>
                  <div className="tm-sarcasm-vote-track">
                    <span
                      className="sarcastic"
                      style={{
                        width: `${
                          (sarcasticVotes /
                            Math.max(modelResults.length, 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <strong>
                    {sarcasticVotes} / {modelResults.length}
                  </strong>
                </div>

                <div className="tm-sarcasm-vote-row">
                  <span>Non-Sarcastic</span>
                  <div className="tm-sarcasm-vote-track">
                    <span
                      className="non-sarcastic"
                      style={{
                        width: `${
                          (nonSarcasticVotes /
                            Math.max(modelResults.length, 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <strong>
                    {nonSarcasticVotes} / {modelResults.length}
                  </strong>
                </div>
              </div>

              <p className="tm-sarcasm-note">
                The final prediction is based on the majority of
                available model outputs. Sarcasm depends on context
                and implied meaning, so results may not always be correct.
              </p>

              {result.errors?.length > 0 && (
                <div className="tm-sarcasm-model-errors">
                  <strong>Some models could not run</strong>
                  {result.errors.map((item) => (
                    <p key={item.model}>
                      {item.model}: {item.error}
                    </p>
                  ))}
                </div>
              )}
            </article>

            {/* INDIVIDUAL MODEL RESULTS */}
            <article className="tm-sarcasm-card tm-sarcasm-individual">
              <div className="tm-sarcasm-result-heading">
                <div>
                  <span className="tm-sarcasm-eyebrow">
                    <Sparkles size={16} />
                    MODEL COMPARISON
                  </span>
                  <h2>Individual Model Predictions</h2>
                  <p>
                    Compare each model's prediction and confidence.
                  </p>
                </div>

                <span className="tm-sarcasm-count">
                  {modelResults.length} models
                </span>
              </div>

              <div className="tm-sarcasm-model-grid">
                {modelResults.map((item) => {
                  const tone =
                    item.sarcasm === 'Sarcastic'
                      ? 'sarcastic'
                      : 'non-sarcastic'

                  const confidence =
                    typeof item.confidence === 'number'
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            item.confidence <= 1
                              ? item.confidence * 100
                              : item.confidence
                          )
                        )
                      : 0

                  return (
                    <div
                      className="tm-sarcasm-model"
                      key={item.model}
                    >
                      <div className="tm-sarcasm-model-top">
                        <strong>{item.model}</strong>
                        <span className={`tm-sarcasm-badge ${tone}`}>
                          {item.sarcasm}
                        </span>
                      </div>

                      <div className="tm-sarcasm-model-confidence">
                        <span>Confidence</span>
                        <strong>
                          {formatPercent(item.confidence)}
                        </strong>
                      </div>

                      <div className="tm-sarcasm-progress">
                        <span
                          className={tone}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                className="tm-sarcasm-another"
                type="button"
                onClick={handleAnalyzeAnother}
              >
                Analyze Another Text
              </button>
            </article>
          </>
        )}
      </section>
    </main>
  )
}

export default Sarcasm
