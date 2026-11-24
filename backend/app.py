
import json
import threading
import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .sentiment_service import (
    DEFAULT_MODEL,
    SentimentModelError,
    SentimentService,
)
from .sarcasm_service import (
    DEFAULT_MODEL as DEFAULT_SARCASM_MODEL,
    SarcasmModelError,
    SarcasmService,
)


class SentimentRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1000)
    model: str = Field(default=DEFAULT_MODEL, min_length=1)


class SarcasmRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1000)
    model: str = Field(default=DEFAULT_SARCASM_MODEL, min_length=1)


class HistoryRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1000)
    sentiment: str = "Not analyzed"
    sentiment_confidence: float | None = None
    sentiment_model: str | None = None
    sarcasm: str | None = None
    sarcasm_confidence: float | None = None
    sarcasm_model: str | None = None


HISTORY_FILE = Path(__file__).resolve().parent / "data" / "history.json"
history_lock = threading.Lock()


def read_history():
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)

    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text("[]", encoding="utf-8")

    with HISTORY_FILE.open("r", encoding="utf-8") as file:
        records = json.load(file)

    if not isinstance(records, list):
        raise ValueError("History JSON must contain a list.")

    return records


sentiment_service = SentimentService()
sarcasm_service = SarcasmService()


@asynccontextmanager
async def lifespan(application: FastAPI):
    try:
        sentiment_service.load(DEFAULT_MODEL)
        application.state.sentiment_model_error = None
    except SentimentModelError as error:
        application.state.sentiment_model_error = str(error)

    try:
        sarcasm_service.load(DEFAULT_SARCASM_MODEL)
        application.state.sarcasm_model_error = None
    except SarcasmModelError as error:
        application.state.sarcasm_model_error = str(error)

    yield


app = FastAPI(title="ToneMatrix AI Sentiment API", lifespan=lifespan)

frontend_origin = os.getenv("FRONTEND_ORIGIN")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin
        for origin in [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            frontend_origin,
        ]
        if origin
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.post("/api/sentiment/predict")
async def predict_sentiment(payload: SentimentRequest, request: Request):
    text = payload.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Text must contain at least one non-whitespace character.",
        )

    model_error = getattr(request.app.state, "sentiment_model_error", None)

    if model_error:
        raise HTTPException(status_code=503, detail=model_error)

    try:
        return sentiment_service.predict(text, payload.model)
    except SentimentModelError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.get("/api/sarcasm/models")
async def get_sarcasm_models():
    return {
        "models": sarcasm_service.available_models(),
        "default": DEFAULT_SARCASM_MODEL,
    }


@app.post("/api/sarcasm/predict")
async def predict_sarcasm(payload: SarcasmRequest, request: Request):
    text = payload.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Text must contain at least one non-whitespace character.",
        )

    model_error = getattr(request.app.state, "sarcasm_model_error", None)

    if model_error and payload.model == DEFAULT_SARCASM_MODEL:
        raise HTTPException(status_code=503, detail=model_error)

    try:
        return sarcasm_service.predict(text, payload.model)
    except SarcasmModelError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@app.get("/api/history")
async def get_history():
    try:
        with history_lock:
            records = read_history()

        return sorted(
            records,
            key=lambda item: item.get("created_at", ""),
            reverse=True,
        )

    except (OSError, json.JSONDecodeError, ValueError) as error:
        raise HTTPException(
            status_code=500,
            detail="Could not read analysis history.",
        ) from error


@app.post("/api/history")
async def save_history(payload: HistoryRequest):
    text = payload.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Text cannot be empty.",
        )

    if (
        payload.sentiment == "Not analyzed"
        and payload.sarcasm is None
    ):
        raise HTTPException(
            status_code=422,
            detail="At least one analysis result is required.",
        )

    record = {
        "id": str(uuid4()),
        "text": text,
        "sentiment": payload.sentiment,
        "sentiment_confidence": payload.sentiment_confidence,
        "sentiment_model": payload.sentiment_model,
        "sarcasm": payload.sarcasm,
        "sarcasm_confidence": payload.sarcasm_confidence,
        "sarcasm_model": payload.sarcasm_model,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        with history_lock:
            records = read_history()
            records.append(record)

            with HISTORY_FILE.open("w", encoding="utf-8") as file:
                json.dump(
                    records,
                    file,
                    ensure_ascii=False,
                    indent=2,
                )

        return record

    except (OSError, json.JSONDecodeError, ValueError) as error:
        raise HTTPException(
            status_code=500,
            detail="Could not save analysis history.",
        ) from error


@app.delete("/api/history/{record_id}")
async def delete_history(record_id: str):
    try:
        with history_lock:
            records = read_history()

            updated_records = [
                record
                for record in records
                if record.get("id") != record_id
            ]

            if len(updated_records) == len(records):
                raise HTTPException(
                    status_code=404,
                    detail="History record not found.",
                )

            with HISTORY_FILE.open("w", encoding="utf-8") as file:
                json.dump(
                    updated_records,
                    file,
                    ensure_ascii=False,
                    indent=2,
                )

        return {"message": "History record deleted successfully."}

    except HTTPException:
        raise
    except (OSError, json.JSONDecodeError, ValueError) as error:
        raise HTTPException(
            status_code=500,
            detail="Could not delete history record.",
        ) from error

@app.get("/api/sentiment/models")
async def get_sentiment_models():
    return {
        "models": sentiment_service.available_models(),
        "default": DEFAULT_MODEL,
    }
@app.post("/api/sentiment/predict-all")
async def predict_all_sentiments(
    payload: SentimentRequest,
    request: Request,
):
    text = payload.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Text must contain at least one non-whitespace character.",
        )

    try:
        return sentiment_service.predict_all(text)

    except SentimentModelError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error
@app.post("/api/sarcasm/predict-all")
async def predict_all_sarcasms(
    payload: SarcasmRequest,
    request: Request,
):
    text = payload.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Text must contain at least one non-whitespace character.",
        )

    model_error = getattr(
        request.app.state,
        "sarcasm_model_error",
        None,
    )

    if model_error:
        raise HTTPException(
            status_code=503,
            detail=model_error,
        )

    try:
        return sarcasm_service.predict_all(text)

    except SarcasmModelError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error