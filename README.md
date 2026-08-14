# ToneMatrix AI

### Decoding Sentiment and Sarcasm in Marathi Text

ToneMatrix AI is an NLP-based project designed to understand Marathi text through **Sentiment Analysis and Sarcasm Detection** using **Machine Learning, Deep Learning, and Transformer-based approaches**.

## Project Overview

ToneMatrix AI focuses on two major Marathi NLP tasks:

- **Sentiment Analysis:** Positive, Negative, or Neutral
- **Sarcasm Detection:** Sarcastic or Non-Sarcastic

The project compares multiple ML, DL, and Transformer approaches to study effective techniques for Marathi language understanding.

## Objectives

- Analyze sentiment in Marathi text.
- Detect sarcastic expressions in Marathi text.
- Apply Machine Learning and Deep Learning approaches.
- Experiment with Transformer-based language models.
- Compare models using Accuracy, Precision, Recall, and F1-score.
- Identify effective models for Marathi sentiment and sarcasm analysis.

## Technologies

- Python
- Machine Learning
- Deep Learning
- NLP
- PyTorch
- Hugging Face Transformers
- Hugging Face Datasets
- Scikit-learn
- Pandas
- NumPy
- Matplotlib
- JavaScript

## Transformer Models

The sarcasm detection experiment compares:

1. BERT
2. mBERT
3. RoBERTa
4. XLM-RoBERTa
5. MuRIL
6. DistilBERT

## Sarcasm Dataset

The final sarcasm dataset contains **5,665 samples**.

| Property | Value |
|---|---:|
| Total Samples | 5,665 |
| Training | 4,532 |
| Validation | 566 |
| Testing | 567 |
| Classes | 2 |

| Label | Class |
|---:|---|
| 0 | Non-Sarcastic |
| 1 | Sarcastic |

Dataset quality:
- No missing values
- No duplicate rows
- No duplicate texts
- No empty text samples

Distribution:

| Class | Samples |
|---|---:|
| Non-Sarcastic | 3,221 |
| Sarcastic | 2,444 |

Dataset: `dataset/final_sarcasm_dataset.csv`

## Sentiment Dataset

The sentiment component classifies Marathi text into:

- Positive
- Negative
- Neutral

Dataset: `dataset/final_sentiment_dataset.csv`

## Transformer Training Configuration

| Parameter | Value |
|---|---|
| Epochs | 3 |
| Training Batch Size | 8 |
| Learning Rate | 2e-5 |
| Maximum Sequence Length | 128 |

## Transformer Results

| Rank | Model | Accuracy | Precision | Recall | F1-Score |
|---:|---|---:|---:|---:|---:|
| 1 | **mBERT** | **90.83%** | **90.87%** | **90.83%** | **90.79%** |
| 2 | XLM-RoBERTa | 90.48% | 90.52% | 90.48% | 90.49% |
| 3 | DistilBERT | 90.48% | 90.81% | 90.48% | 90.38% |
| 4 | MuRIL | 89.42% | 89.43% | 89.42% | 89.38% |
| 5 | BERT | 88.89% | 89.61% | 88.89% | 88.70% |
| 6 | RoBERTa | 88.71% | 89.85% | 88.71% | 88.46% |

### Best Model — mBERT

- **Accuracy:** 90.83%
- **Precision:** 90.87%
- **Recall:** 90.83%
- **F1-Score:** 90.79%

mBERT achieved the highest overall performance among the six evaluated Transformer models for the sarcasm detection experiment.

## Repository Structure

```text
ToneMatrix-AI/
├── backend/
│   └── models/
│       ├── sentiment/
│       │   ├── ml/
│       │   ├── dl/
│       │   └── transformer/
│       └── sarcasm/
│           ├── ml/
│           ├── dl/
│           └── transformer/
├── dataset/
│   ├── final_sentiment_dataset.csv
│   ├── final_sarcasm_dataset.csv
│   ├── Sentiment Module.csv
│   └── Sarcasm Model.csv
├── frontend/
├── public/
├── src/
├── package.json
├── package-lock.json
├── index.html
├── .gitignore
└── README.md
```

## Transformer Model Weights

The trained Transformer checkpoint files are **not included in this GitHub repository** because the combined model weights are several GB in size and exceed practical GitHub storage/file-size limits.

The repository contains the Transformer-related code, configurations, datasets, and experimental results. Trained checkpoints can be stored separately using Hugging Face or cloud storage.

The ML and DL components are included in the repository as available.

## Evaluation

Models are evaluated using:

- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix

## Key Findings

- mBERT achieved the highest accuracy and F1-score.
- XLM-RoBERTa achieved the second-best overall performance.
- DistilBERT achieved similar accuracy with a smaller architecture.
- MuRIL performed competitively but did not outperform mBERT.
- Different Transformer architectures produced different results on Marathi sarcasm detection.

## Future Scope

- Larger Marathi sentiment and sarcasm datasets
- Marathi-English code-mixed text analysis
- Context-aware sarcasm detection
- Explainable AI
- Transformer ensembles
- Real-time Marathi text analysis
- REST API deployment
- Web-based Marathi sentiment and sarcasm analyzer
- Mobile application integration

## Running the Project

Clone the repository:

```bash
git clone https://github.com/<your-username>/ToneMatrix-AI.git
cd ToneMatrix-AI
```

Install dependencies:

```bash
pip install -r requirements.txt
```

For the frontend:

```bash
npm install
npm run dev
```

## Project Highlights

- 🇮🇳 Marathi-focused NLP
- 🧠 Machine Learning + Deep Learning + Transformers
- 💬 Sentiment Analysis
- 😏 Sarcasm Detection
- 🤖 Six Transformer models compared
- 📊 Comprehensive evaluation
- 📈 Model comparison
- 🔲 Confusion matrix analysis
- 🌐 Frontend + backend project structure

## Project Title

# ToneMatrix AI

### *Decoding Sentiment and Sarcasm in Marathi Text*

## Conclusion

ToneMatrix AI provides a comparative approach to Marathi sentiment and sarcasm analysis by combining Machine Learning, Deep Learning, and Transformer-based NLP techniques.

The sarcasm experiments showed that **mBERT achieved the best performance**, with **90.83% accuracy and 90.79% F1-score**, among the six evaluated Transformer models.
