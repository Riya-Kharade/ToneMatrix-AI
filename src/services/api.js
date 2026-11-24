const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      `Cannot connect to the API at ${API_BASE_URL}. Start the FastAPI backend and try again.`
    );
  }
  let payload;

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.detail === "string"
        ? payload.detail
        : `API request failed (${response.status}).`
    );
  }

  return payload;
}

// ---------------- SENTIMENT ANALYSIS ----------------

export async function predictSentiment(text, model = "MuRIL") {
  return apiRequest("/api/sentiment/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, model }),
  });
}

export async function predictAllSentiments(text) {
  return apiRequest("/api/sentiment/predict-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export async function getSentimentModels() {
  const payload = await apiRequest("/api/sentiment/models");
  return Array.isArray(payload.models) ? payload.models : [];
}

// ---------------- SARCASM ANALYSIS ----------------

export async function getSarcasmModels() {
  const payload = await apiRequest("/api/sarcasm/models");
  return Array.isArray(payload.models) ? payload.models : [];
}

export async function predictSarcasm(text, model = "mBERT") {
  return apiRequest("/api/sarcasm/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, model }),
  });
}

export async function predictAllSarcasms(text) {
  return apiRequest("/api/sarcasm/predict-all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

// ---------------- ANALYSIS HISTORY ----------------

export async function getAnalysisHistory() {
  return apiRequest("/api/history");
}

export async function saveAnalysisHistory(analysis) {
  return apiRequest("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: analysis.text,
      sentiment: analysis.sentiment ?? "Not analyzed",
      sentiment_confidence: analysis.sentimentConfidence ?? null,
      sentiment_model: analysis.sentimentModel ?? null,
      sarcasm: analysis.sarcasm ?? null,
      sarcasm_confidence: analysis.sarcasmConfidence ?? null,
      sarcasm_model: analysis.sarcasmModel ?? null,
    }),
  });
}

export async function deleteAnalysisHistory(recordId) {
  return apiRequest(`/api/history/${encodeURIComponent(recordId)}`, {
    method: "DELETE",
  });
}
