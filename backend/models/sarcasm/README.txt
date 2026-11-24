
SARCASM TRANSFORMER MODEL COMPARISON
====================================

Dataset
-------
Name: final_sarcasm_dataset.csv
Total samples: 5665

Labels:
0 = Non-Sarcastic
1 = Sarcastic

Dataset split:
Training: 4532
Validation: 566
Testing: 567

Models
------
1. BERT
2. mBERT
3. RoBERTa
4. XLM-RoBERTa
5. MuRIL
6. DistilBERT

Training Configuration
----------------------
Epochs: 3
Training batch size: 8
Learning rate: 2e-5
Maximum sequence length: 128

Final Test Results
------------------

Rank  Model           Accuracy   Precision   Recall   F1
1     mBERT           90.83%     90.87%      90.83%   90.79%
2     XLM-RoBERTa     90.48%     90.52%      90.48%   90.49%
3     DistilBERT      90.48%     90.81%      90.48%   90.38%
4     MuRIL           89.42%     89.43%      89.42%   89.38%
5     BERT            88.89%     89.61%      88.89%   88.70%
6     RoBERTa         88.71%     89.85%      88.71%   88.46%

Best Model
----------
mBERT

Accuracy: 90.83%
Precision: 90.87%
Recall: 90.83%
F1-Score: 90.79%

Conclusion
----------
Among the six evaluated Transformer models, mBERT achieved
the highest test accuracy and F1-score on the sarcasm dataset.

XLM-RoBERTa and DistilBERT achieved the next best overall
performance.

All six models were trained, evaluated on the same test set,
and saved in the models directory.

Directory Structure
-------------------
models/
    BERT/
    mBERT/
    RoBERTa/
    XLM-RoBERTa/
    MuRIL/
    DistilBERT/

comparison/
    sarcasm_transformer_comparison.csv
    sarcasm_transformer_metrics_comparison.png

confusion_matrices/
    Individual confusion matrix images for all six models.
