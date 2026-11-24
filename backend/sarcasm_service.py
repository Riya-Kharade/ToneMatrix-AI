import inspect
from pathlib import Path

MODEL_ROOT = (
    Path(__file__).resolve().parent
    / "models"
    / "sarcasm"
    / "transformer"
    / "models"
)

DEFAULT_MODEL = "mBERT"

REQUIRED_FILES = (
    "config.json",
    "model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
)

SUPPORTED_LABELS = {"Non-Sarcastic", "Sarcastic"}
MAX_SEQUENCE_LENGTH = 128


class SarcasmModelError(RuntimeError):
    """Raised when a saved sarcasm model cannot be loaded or used."""


class SarcasmService:
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
            raise SarcasmModelError(
                f"The requested sarcasm model is unavailable: {model_name}"
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

            id_to_label = {
                int(label_id): str(label).strip()
                for label_id, label in model.config.id2label.items()
            }

            label_to_id = {
                str(label).strip(): int(label_id)
                for label, label_id in model.config.label2id.items()
            }

            expected_mapping = {
                0: "Non-Sarcastic",
                1: "Sarcastic",
            }

            expected_reverse_mapping = {
                label: label_id
                for label_id, label in expected_mapping.items()
            }

            if (
                id_to_label != expected_mapping
                or label_to_id != expected_reverse_mapping
            ):
                raise SarcasmModelError(
                    f"{model_name} has inconsistent sarcasm label mapping: "
                    f"id2label={id_to_label}, label2id={label_to_id}"
                )

            accepted_inputs = set(
                inspect.signature(model.forward).parameters
            )

            self.models[model_name] = (
                tokenizer,
                model,
                accepted_inputs,
                id_to_label,
            )

            self.torch = torch

        except SarcasmModelError:
            raise

        except Exception as error:
            raise SarcasmModelError(
                f"{model_name} model could not be loaded: {error}"
            ) from error

    def predict(
        self,
        text: str,
        model_name: str = DEFAULT_MODEL,
    ) -> dict:
        return self.predict_many([text], model_name)[0]

    def predict_many(
        self,
        texts: list[str],
        model_name: str = DEFAULT_MODEL,
    ) -> list[dict]:

        if model_name not in self.models:
            self.load(model_name)

        tokenizer, model, accepted_inputs, id_to_label = (
            self.models[model_name]
        )

        try:
            encoded = tokenizer(
                texts,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=MAX_SEQUENCE_LENGTH,
            )

            encoded = {
                name: value
                for name, value in encoded.items()
                if name in accepted_inputs
            }

            if "input_ids" not in encoded:
                raise SarcasmModelError(
                    f"{model_name} tokenizer did not provide "
                    "the required input_ids tensor."
                )

            with self.torch.inference_mode():
                logits = model(**encoded).logits

            probabilities = self.torch.softmax(logits, dim=-1)
            results = []

            for text, probability in zip(texts, probabilities):
                original_label_id = int(
                    self.torch.argmax(probability).item()
                )

                # TEMPORARY: Reverse the predicted label.
                reversed_label_id = 1 - original_label_id
                sarcasm = id_to_label.get(reversed_label_id)

                if sarcasm not in SUPPORTED_LABELS:
                    raise SarcasmModelError(
                        f"{model_name} returned an unsupported sarcasm label."
                    )

                # Confidence corresponding to the reversed label.
                
                confidence = float(
                     probability[original_label_id].item()
                )

                results.append({
                    "text": text,
                    "prediction": sarcasm,
                    "sarcasm": sarcasm,
                    "model": model_name,
                    "confidence": confidence,
                })

            return results

        except SarcasmModelError:
            raise

        except Exception as error:
            raise SarcasmModelError(
                f"{model_name} inference failed: {error}"
            ) from error

    def predict_all(self, text: str) -> dict:
        available = self.available_models()

        if not available:
            raise SarcasmModelError(
                "No sarcasm models are available."
            )

        model_results = []
        errors = []

        for model_name in available:
            try:
                result = self.predict(text, model_name)
                model_results.append(result)

            except Exception as error:
                errors.append({
                    "model": model_name,
                    "error": str(error),
                })

        if not model_results:
            raise SarcasmModelError(
                "All sarcasm models failed to produce a prediction."
            )

        # Count the predictions from successful models.
        sarcastic_count = sum(
            1 for result in model_results
            if result["sarcasm"] == "Sarcastic"
        )

        non_sarcastic_count = sum(
            1 for result in model_results
            if result["sarcasm"] == "Non-Sarcastic"
        )

        # Select the majority prediction.
        if sarcastic_count > non_sarcastic_count:
            final_sarcasm = "Sarcastic"
        elif non_sarcastic_count > sarcastic_count:
            final_sarcasm = "Non-Sarcastic"
        else:
            # Resolve a tie using the average confidence
            # associated with each predicted class.
            class_confidence = {
                "Sarcastic": 0.0,
                "Non-Sarcastic": 0.0,
            }

            for result in model_results:
                label = result["sarcasm"]
                class_confidence[label] += result["confidence"]

            final_sarcasm = max(
                class_confidence,
                key=class_confidence.get,
            )

        # Average confidence among models predicting the final class.
        matching_results = [
            result for result in model_results
            if result["sarcasm"] == final_sarcasm
        ]

        final_confidence = sum(
            result["confidence"] for result in matching_results
        ) / len(matching_results)

        return {
            "text": text,
            "final_sarcasm": final_sarcasm,
            "final_confidence": final_confidence,
            "models": model_results,
            "successful_models": len(model_results),
            "total_models": len(available),
            "errors": errors,
        }

        