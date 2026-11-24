from pathlib import Path

MODEL_ROOT = (
    Path(__file__).resolve().parent
    / "models"
    / "sentiment"
    / "transformer"
    / "models"
)

DEFAULT_MODEL = "MuRIL"

REQUIRED_FILES = (
    "config.json",
    "model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
)

SUPPORTED_LABELS = {"Positive", "Neutral", "Negative"}


class SentimentModelError(RuntimeError):
    """Raised when a saved sentiment model cannot be loaded or used."""


class SentimentService:
    def __init__(self, model_root: Path = MODEL_ROOT):
        self.model_root = model_root
        self.models = {}
        self.torch = None

    def available_models(self) -> list[str]:
        if not self.model_root.is_dir():
            return []

        return sorted(
            path.name
            for path in self.model_root.iterdir()
            if path.is_dir()
            and all(
                (path / filename).is_file()
                for filename in REQUIRED_FILES
            )
        )

    def load(self, model_name: str = DEFAULT_MODEL):
        if model_name not in self.available_models():
            raise SentimentModelError(
                f"The requested sentiment model is unavailable: {model_name}"
            )

        model_path = self.model_root / model_name

        try:
            import torch
            from transformers import (
                AutoModelForSequenceClassification,
                AutoTokenizer,
            )

            tokenizer = AutoTokenizer.from_pretrained(
                str(model_path),
                local_files_only=True,
            )

            model = (
                AutoModelForSequenceClassification.from_pretrained(
                    str(model_path),
                    local_files_only=True,
                ).to("cpu")
            )

            model.eval()

            self.models[model_name] = (tokenizer, model)
            self.torch = torch

        except Exception as error:
            raise SentimentModelError(
                f"{model_name} model could not be loaded: {error}"
            ) from error

    def _get_label_probabilities(
        self,
        probabilities,
        model,
    ) -> dict[str, float]:
        id2label = model.config.id2label
        result = {}

        for label_id, probability in enumerate(probabilities):
            label = id2label.get(
                label_id,
                id2label.get(str(label_id)),
            )

            if not isinstance(label, str):
                continue

            label = label.strip().capitalize()

            if label in SUPPORTED_LABELS:
                result[label] = float(probability.item())

        if set(result) != SUPPORTED_LABELS:
            raise SentimentModelError(
                "Model labels must map to Positive, Negative, and Neutral. "
                f"Received: {id2label}"
            )

        return result

    def _predict_probabilities(
        self,
        text: str,
        model_name: str,
    ) -> dict:
        if model_name not in self.models:
            self.load(model_name)

        tokenizer, model = self.models[model_name]

        encoded = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
        )

        # DistilBERT does not accept token_type_ids.
        if "distilbert" in model.config.model_type.lower():
            encoded.pop("token_type_ids", None)

        with self.torch.inference_mode():
            logits = model(**encoded).logits

        probabilities = self.torch.softmax(logits, dim=-1)[0]
        label_probabilities = self._get_label_probabilities(
            probabilities,
            model,
        )

        sentiment = max(
            label_probabilities,
            key=label_probabilities.get,
        )

        return {
            "model": model_name,
            "sentiment": sentiment,
            "confidence": label_probabilities[sentiment],
            "probabilities": label_probabilities,
        }

    def predict(
        self,
        text: str,
        model_name: str = DEFAULT_MODEL,
    ) -> dict:
        try:
            result = self._predict_probabilities(text, model_name)

            return {
                "sentiment": result["sentiment"],
                "model": result["model"],
                "confidence": result["confidence"],
            }

        except SentimentModelError:
            raise

        except Exception as error:
            raise SentimentModelError(
                f"{model_name} inference failed: {error}"
            ) from error

    def predict_all(self, text: str) -> dict:
        available = self.available_models()

        if not available:
            raise SentimentModelError(
                "No sentiment models are available."
            )

        model_results = []
        errors = []

        for model_name in available:
            try:
                result = self._predict_probabilities(
                    text,
                    model_name,
                )
                model_results.append(result)

            except Exception as error:
                errors.append({
                    "model": model_name,
                    "error": str(error),
                })

        if not model_results:
            raise SentimentModelError(
                "All sentiment models failed to produce a prediction."
            )

        # Average the class probabilities from every model that succeeded.
        # This is a soft-voting ensemble.
        final_probabilities = {
            label: sum(
                result["probabilities"][label]
                for result in model_results
            ) / len(model_results)
            for label in SUPPORTED_LABELS
        }

        final_sentiment = max(
            final_probabilities,
            key=final_probabilities.get,
        )

        return {
            "text": text,
            "final_sentiment": final_sentiment,
            "final_confidence": final_probabilities[final_sentiment],
            "final_probabilities": final_probabilities,
            "models": model_results,
            "successful_models": len(model_results),
            "total_models": len(available),
            "errors": errors,
        }