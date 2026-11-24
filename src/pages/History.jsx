
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAnalysisHistory,
  getAnalysisHistory,
} from "../services/api";

const styles = {
  page: {
    padding: "22px",
    color: "#172554",
    fontFamily: "inherit",
  },
  heading: {
    fontSize: "30px",
    fontWeight: 750,
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#64748b",
    margin: "0 0 24px",
    lineHeight: 1.6,
  },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  tab: {
    border: "1px solid #ddd6fe",
    borderRadius: "12px",
    padding: "11px 16px",
    background: "#fff",
    color: "#5b21b6",
    cursor: "pointer",
    fontWeight: 650,
  },
  activeTab: {
    background: "#6d4aff",
    borderColor: "#6d4aff",
    color: "#fff",
  },
  search: {
    width: "100%",
    maxWidth: "440px",
    padding: "12px 14px",
    border: "1px solid #dbe3f0",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    border: "1px solid #dfe5f5",
    borderRadius: "17px",
    padding: "22px",
    marginBottom: "15px",
    boxShadow: "0 3px 12px rgba(30, 41, 59, 0.03)",
  },
  button: {
    border: "1px solid #ddd6fe",
    background: "#f5f3ff",
    color: "#6d4aff",
    borderRadius: "10px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: 650,
  },
  deleteButton: {
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#be123c",
    borderRadius: "10px",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: 650,
  },
  badge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: 700,
  },
  details: {
    background: "#faf9ff",
    border: "1px solid #ddd6fe",
    borderRadius: "16px",
    padding: "22px",
    marginTop: "22px",
    overflowWrap: "anywhere",
  },
};

const tabs = [
  { id: "all", label: "All Analyses" },
  { id: "sentiment", label: "Sentiment Analysis" },
  { id: "sarcasm", label: "Sarcasm Analysis" },
];

function hasSentiment(record) {
  return Boolean(
    record.sentiment &&
    record.sentiment !== "Not analyzed"
  );
}

function hasSarcasm(record) {
  return (
    record.sarcasm !== null &&
    record.sarcasm !== undefined &&
    record.sarcasm !== "" &&
    record.sarcasm !== "Not analyzed"
  );
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function formatConfidence(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return String(value);

  // Model APIs commonly return confidence as either 0–1 or 0–100.
  return `${(number <= 1 ? number * 100 : number).toFixed(1)}%`;
}

export default function History() {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAnalysisHistory();
      const list = Array.isArray(data) ? data : [];

      setRecords(list);

      setSelected((previous) =>
        previous
          ? list.find((record) => record.id === previous.id) || null
          : null
      );
    } catch (err) {
      setError(err.message || "Could not load analysis history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const counts = useMemo(
    () => ({
      all: records.length,
      sentiment: records.filter(hasSentiment).length,
      sarcasm: records.filter(hasSarcasm).length,
    }),
    [records]
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      if (activeTab === "sentiment" && !hasSentiment(record)) {
        return false;
      }

      if (activeTab === "sarcasm" && !hasSarcasm(record)) {
        return false;
      }

      if (!query) return true;

      return [
        record.text,
        record.sentiment,
        record.sarcasm,
        record.sentiment_model,
        record.sarcasm_model,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [records, activeTab, search]);

  async function handleDelete(record) {
    const confirmed = window.confirm(
      "Delete this analysis permanently? This will also remove it from history.json."
    );

    if (!confirmed) return;

    setDeletingId(record.id);
    setError("");
    setNotice("");

    try {
      await deleteAnalysisHistory(record.id);

      setRecords((previous) =>
        previous.filter((item) => item.id !== record.id)
      );

      setSelected((previous) =>
        previous?.id === record.id ? null : previous
      );

      setNotice("Analysis deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete this analysis.");
    } finally {
      setDeletingId(null);
    }
  }

  function renderDetails(record) {
    return (
      <div style={styles.details}>
        <h3 style={{ marginTop: 0, marginBottom: 18 }}>
          Analysis Details
        </h3>

        <p><strong>Text:</strong> {record.text}</p>

        <p>
          <strong>Sentiment:</strong>{" "}
          {record.sentiment || "Not analyzed"}
        </p>
        <p>
          <strong>Sentiment Model:</strong>{" "}
          {record.sentiment_model || "Not available"}
        </p>
        <p>
          <strong>Sentiment Confidence:</strong>{" "}
          {formatConfidence(record.sentiment_confidence)}
        </p>

        <hr style={{ border: 0, borderTop: "1px solid #e2e8f0" }} />

        <p>
          <strong>Sarcasm:</strong>{" "}
          {record.sarcasm || "Not analyzed"}
        </p>
        <p>
          <strong>Sarcasm Model:</strong>{" "}
          {record.sarcasm_model || "Not available"}
        </p>
        <p>
          <strong>Sarcasm Confidence:</strong>{" "}
          {formatConfidence(record.sarcasm_confidence)}
        </p>

        <p>
          <strong>Analyzed At:</strong>{" "}
          {formatDate(record.created_at)}
        </p>

        <button
          style={styles.button}
          onClick={() => setSelected(null)}
        >
          Close Details
        </button>
      </div>
    );
  }

  return (
    <main style={styles.page}>
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            color: "#6d4aff",
            letterSpacing: "2px",
            fontSize: "12px",
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          ANALYSIS LOG
        </div>

        <h1 style={styles.heading}>Analysis History</h1>

        <p style={styles.subtitle}>
          Review, search, and manage your previous Marathi
          sentiment and sarcasm analyses.
        </p>
      </div>

      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelected(null);
            }}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
          >
            {tab.label} ({counts[tab.id]})
          </button>
        ))}
      </div>

      <input
        type="search"
        aria-label="Search analysis history"
        placeholder="Search text, prediction, or model..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={styles.search}
      />

      {notice && (
        <div
          role="status"
          style={{
            marginBottom: 16,
            color: "#166534",
            background: "#dcfce7",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            marginBottom: 16,
            color: "#b91c1c",
            background: "#fee2e2",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {error}
          <button
            style={{ ...styles.button, marginLeft: 12 }}
            onClick={loadHistory}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.card}>Loading analysis history...</div>
      ) : filteredRecords.length === 0 ? (
        <div style={styles.card}>
          <h3>No analyses found</h3>
          <p style={{ color: "#64748b" }}>
            {records.length === 0
              ? "Your saved analyses will appear here."
              : "No records match this section or search."}
          </p>
        </div>
      ) : (
        filteredRecords.map((record) => (
          <article key={record.id} style={styles.card}>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                overflowWrap: "anywhere",
                marginTop: 0,
              }}
            >
              {record.text}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                color: "#64748b",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              {hasSentiment(record) && (
                <span style={styles.badge}>
                  {record.sentiment}
                </span>
              )}

              {hasSarcasm(record) && (
                <span
                  style={{
                    ...styles.badge,
                    background: "#fce7f3",
                    color: "#9d174d",
                  }}
                >
                  {record.sarcasm}
                </span>
              )}

              {!hasSarcasm(record) && (
                <span>Sarcasm not analyzed</span>
              )}

              <span>•</span>
              <span>{formatDate(record.created_at)}</span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={styles.button}
                onClick={() =>
                  setSelected((previous) =>
                    previous?.id === record.id ? null : record
                  )
                }
              >
                {selected?.id === record.id ? "Hide Details" : "View"}
              </button>

              <button
                style={styles.deleteButton}
                disabled={deletingId === record.id}
                onClick={() => handleDelete(record)}
              >
                {deletingId === record.id ? "Deleting..." : "Delete"}
              </button>
            </div>

            {selected?.id === record.id && renderDetails(record)}
          </article>
        ))
      )}
    </main>
  );
}
