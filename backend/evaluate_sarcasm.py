import argparse
import gc
import json
from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

from .sarcasm_service import SarcasmModelError, SarcasmService


def held_out_dataset(dataset_path: Path) -> tuple[list[str], list[int]]:
    dataframe = pd.read_csv(dataset_path)
    data = dataframe[["clean_tweet_v2", "Label"]].dropna().copy()
    data["label"] = data["Label"].map({-1: 0, 1: 1})
    if data["label"].isna().any():
        raise ValueError("Dataset contains labels outside the trained {-1, 1} mapping.")

    train_data, temporary_data = train_test_split(
        data[["clean_tweet_v2", "label"]],
        test_size=0.20,
        random_state=42,
        stratify=data["label"],
    )
    _, test_data = train_test_split(
        temporary_data,
        test_size=0.50,
        random_state=42,
        stratify=temporary_data["label"],
    )
    del train_data
    return test_data["clean_tweet_v2"].tolist(), test_data["label"].astype(int).tolist()


def evaluate_model(
    service: SarcasmService,
    model_name: str,
    texts: list[str],
    labels: list[int],
    batch_size: int,
) -> dict:
    predictions = []
    for start in range(0, len(texts), batch_size):
        results = service.predict_many(texts[start:start + batch_size], model_name)
        predictions.extend(0 if result["prediction"] == "Non-Sarcastic" else 1 for result in results)

    report = classification_report(
        labels,
        predictions,
        labels=[0, 1],
        target_names=["Non-Sarcastic", "Sarcastic"],
        output_dict=True,
        zero_division=0,
    )
    return {
        "model": model_name,
        "samples": len(labels),
        "accuracy": accuracy_score(labels, predictions),
        "precision": report["weighted avg"]["precision"],
        "recall": report["weighted avg"]["recall"],
        "f1": report["weighted avg"]["f1-score"],
        "per_class": {
            "Non-Sarcastic": report["Non-Sarcastic"],
            "Sarcastic": report["Sarcastic"],
        },
        "confusion_matrix": confusion_matrix(labels, predictions, labels=[0, 1]).tolist(),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate saved Marathi sarcasm transformer models.")
    parser.add_argument("--dataset", type=Path, default=Path(__file__).resolve().parent.parent / "dataset" / "final_sarcasm_dataset.csv")
    parser.add_argument("--limit", type=int, help="Evaluate only the first N held-out rows for a quick smoke test.")
    parser.add_argument("--batch-size", type=int, default=32, help="Number of held-out rows per inference batch.")
    parser.add_argument("--model", action="append", dest="models", help="Evaluate one model; repeat for multiple models.")
    args = parser.parse_args()

    texts, labels = held_out_dataset(args.dataset)
    if args.limit:
        texts, labels = texts[:args.limit], labels[:args.limit]

    service = SarcasmService()
    models = args.models or service.available_models()
    results = []
    for model_name in models:
        try:
            results.append(evaluate_model(service, model_name, texts, labels, args.batch_size))
        except SarcasmModelError as error:
            raise SystemExit(f"{model_name} evaluation failed: {error}") from error
        finally:
            service.models.pop(model_name, None)
            gc.collect()

    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()