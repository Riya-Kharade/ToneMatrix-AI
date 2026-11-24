import { useState } from "react";
import {
  predictAllSentiments,
  predictAllSarcasms,
  saveAnalysisHistory,
} from "../services/api";
import "./AnalyzeBoth.css";

const SAMPLE_SENTENCES = [
  {
    label: "Positive",
    type: "positive",
    text: "हा चित्रपट खूप छान आहे. मला खूप आवडला.",
  },
  {
    label: "Negative",
    type: "negative",
    text: "हा चित्रपट अजिबात आवडला नाही. खूप वाईट अनुभव होता.",
  },
  {
    label: "Sarcastic",
    type: "sarcastic",
    text: "वा! किती वेळेवर आलास, कार्यक्रम तर संपलाच!",
  },
];

function getLabel(result, keys) {
  for (const key of keys) {
    if (result?.[key] !== undefined && result?.[key] !== null) {
      return result[key];
    }
  }

  return "Unavailable";
}

function getConfidence(result, keys) {
  for (const key of keys) {
    const value = result?.[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
    }
  }

  return 0;
}

function normalizeLabel(value) {
  const label = String(value).toLowerCase();

  if (label.includes("non-sarcastic") || label.includes("non sarcastic")) {
    return "Non-Sarcastic";
  }

  if (label.includes("sarcastic")) {
    return "Sarcastic";
  }

  if (label.includes("positive")) return "Positive";
  if (label.includes("negative")) return "Negative";
  if (label.includes("neutral")) return "Neutral";

  return value;
}

function ResultBadge({ label }) {
  const normalized = normalizeLabel(label);
  const type = String(normalized).toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`both-badge ${type}`}>
      {normalized}
    </span>
  );
}

function ProgressBar({ confidence, label }) {
  const colors = {
    Positive: "#0ba968",
    Negative: "#ef4056",
    Neutral: "#8060f7",
    Sarcastic: "#ed7900",
    "Non-Sarcastic": "#0ba968",
  };

  return (
    <div className="both-progress-track">
      <div
        className="both-progress-fill"
        style={{
          width: `${confidence}%`,
          backgroundColor: colors[normalizeLabel(label)] || "#8060f7",
        }}
      />
    </div>
  );
}

export default function AnalyzeBoth() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  const characterLimit = 1000;

  const handleAnalyze = async () => {
    const cleanedText = text.trim();

    if (!cleanedText) {
      setError("Please enter Marathi text before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      // Both APIs should run all available models and return
      // their weighted/aggregated results.
      const [sentimentResponse, sarcasmResponse] = await Promise.all([
        predictAllSentiments(cleanedText),
        predictAllSarcasms(cleanedText),
      ]);

      const sentiment =
        sentimentResponse.final_result ??
        sentimentResponse.weighted_result ??
        sentimentResponse.result ??
        sentimentResponse;

      const sarcasm =
        sarcasmResponse.final_result ??
        sarcasmResponse.weighted_result ??
        sarcasmResponse.result ??
        sarcasmResponse;

      const combinedResults = {
        text: cleanedText,
        sentiment: {
          label: normalizeLabel(
            getLabel(sentiment, [
              "sentiment",
              "prediction",
              "label",
              "final_sentiment",
              "final_prediction",
            ])
          ),
          confidence: getConfidence(sentiment, [
            "confidence",
            "ensemble_confidence",
            "weighted_confidence",
            "final_confidence",
          ]),
          modelsSuccessful:
            sentiment.models_successful ??
            sentiment.successful_models ??
            null,
        },
        sarcasm: {
          label: normalizeLabel(
            getLabel(sarcasm, [
              "sarcasm",
              "prediction",
              "label",
              "final_sarcasm",
              "final_prediction",
            ])
          ),
          confidence: getConfidence(sarcasm, [
            "confidence",
            "ensemble_confidence",
            "weighted_confidence",
            "final_confidence",
          ]),
          modelsSuccessful:
            sarcasm.models_successful ??
            sarcasm.successful_models ??
            null,
        },
      };

      setResults(combinedResults);

      // Save the final model-generated results to history.
      try {
        await saveAnalysisHistory({
          text: cleanedText,
          sentiment: combinedResults.sentiment.label,
          sentimentConfidence: combinedResults.sentiment.confidence,
          sentimentModel: "All sentiment models",
          sarcasm: combinedResults.sarcasm.label,
          sarcasmConfidence: combinedResults.sarcasm.confidence,
          sarcasmModel: "All sarcasm models",
        });
      } catch (historyError) {
        console.error("Could not save analysis history:", historyError);
      }
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResults(null);
    setError("");
  };

  const handleReset = () => {
    setText("");
    setResults(null);
    setError("");
  };

  return (
    <div className="analyze-both-page">
      <div className="both-page-intro">
        Analyze Marathi text to understand its sentiment and sarcasm using
        your trained NLP models.
      </div>

      {/* FULL-WIDTH INPUT CARD */}
      <section className="both-card both-input-card">
        <div className="both-card-heading">
          <div>
            <h2>Input Text</h2>
            <p>Enter Marathi text for both analyses.</p>
          </div>

          <span className="both-heading-icon">✧</span>
        </div>

        <label className="both-label" htmlFor="both-text">
          Marathi text
        </label>

        <textarea
          id="both-text"
          className="both-textarea"
          value={text}
          maxLength={characterLimit}
          onChange={(event) => setText(event.target.value)}
          placeholder="Enter Marathi text for sentiment and sarcasm analysis..."
        />

        <div className="both-text-meta">
          <span>
            {text.length}/{characterLimit} characters
          </span>
          <span>Marathi Unicode supported</span>
        </div>

        <div className="both-samples-heading">
          <h3>Sample Sentences</h3>
          <span>Choose one to try</span>
        </div>

        <div className="both-samples">
          {SAMPLE_SENTENCES.map((sample) => (
            <button
              type="button"
              key={sample.label}
              className="both-sample"
              onClick={() => {
                setText(sample.text);
                setError("");
                setResults(null);
              }}
            >
              <span className={`both-sample-tag ${sample.type}`}>
                {sample.label}
              </span>
              <span className="both-sample-text">{sample.text}</span>
            </button>
          ))}
        </div>

        <div className="both-model-info">
          <div className="both-model-icon">♧</div>
          <div>
            <strong>All Sentiment & Sarcasm Models</strong>
            <p>
              All available models analyze the same text automatically.
              The final weighted results appear below.
            </p>
          </div>
        </div>

        {error && <div className="both-error">{error}</div>}

        <button
          type="button"
          className="both-analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="both-spinner" />
              Analyzing with all models...
            </>
          ) : (
            <>⌕ &nbsp; Analyze Sentiment & Sarcasm</>
          )}
        </button>

        <div className="both-action-row">
          <button
            type="button"
            className="both-secondary-button"
            onClick={handleClear}
            disabled={loading}
          >
            ♜ &nbsp; Clear
          </button>

          <button
            type="button"
            className="both-secondary-button"
            onClick={handleReset}
            disabled={loading}
          >
            ↻ &nbsp; Reset
          </button>
        </div>
      </section>

      {/* ONLY TWO FINAL RESULT CARDS */}
      {results && (
        <section className="both-results-grid">
          {/* SENTIMENT RESULT */}
          <article className="both-card both-result-card sentiment-result">
            <div className="both-result-heading">
              <div>
                <div className="both-eyebrow">✓ &nbsp; FINAL WEIGHTED RESULT</div>
                <h2>Final Sentiment</h2>
              </div>

              <ResultBadge label={results.sentiment.label} />
            </div>

            <div className="both-analyzed-text">
              <strong>Analyzed Text</strong>
              <p>{results.text}</p>
            </div>

            <div
              className={`both-result-value ${String(
                results.sentiment.label
              ).toLowerCase()}`}
            >
              {results.sentiment.label}
            </div>

            <div className="both-stats">
              <div>
                <span>Ensemble Confidence</span>
                <strong>{results.sentiment.confidence.toFixed(1)}%</strong>
              </div>

              <div>
                <span>Models Successful</span>
                <strong>
                  {results.sentiment.modelsSuccessful ?? "All available"}
                </strong>
              </div>
            </div>

            <ProgressBar
              confidence={results.sentiment.confidence}
              label={results.sentiment.label}
            />

            <p className="both-result-note">
              The final sentiment is based on the available trained model
              outputs. Confidence is an estimate, not a guarantee of accuracy.
            </p>
          </article>

          {/* SARCASM RESULT */}
          <article className="both-card both-result-card sarcasm-result">
            <div className="both-result-heading">
              <div>
                <div className="both-eyebrow">✓ &nbsp; FINAL SARCASM RESULT</div>
                <h2>Final Sarcasm</h2>
              </div>

              <ResultBadge label={results.sarcasm.label} />
            </div>

            <div className="both-analyzed-text">
              <strong>Analyzed Text</strong>
              <p>{results.text}</p>
            </div>

            <div
              className={`both-result-value ${String(
                results.sarcasm.label
              ).toLowerCase().replace(/\s+/g, "-")}`}
            >
              {results.sarcasm.label}
            </div>

            <div className="both-stats">
              <div>
                <span>Final Confidence</span>
                <strong>{results.sarcasm.confidence.toFixed(1)}%</strong>
              </div>

              <div>
                <span>Models Successful</span>
                <strong>
                  {results.sarcasm.modelsSuccessful ?? "All available"}
                </strong>
              </div>
            </div>

            <ProgressBar
              confidence={results.sarcasm.confidence}
              label={results.sarcasm.label}
            />

            <p className="both-result-note">
              Sarcasm depends on context, wording, and implied meaning.
              The model-generated result may not capture every interpretation.
            </p>
          </article>
        </section>
      )}
    </div>
  );
}