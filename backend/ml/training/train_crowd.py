"""
Crowd Prediction Model Training

Author: Ankita Jana
Project: Metro Crowd Management System
"""

from pathlib import Path
import json

import joblib
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import (
    train_test_split,
    RandomizedSearchCV,
)

from sklearn.metrics import classification_report

import numpy as np

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

from sklearn.model_selection import train_test_split

from xgboost import (
    XGBClassifier,
    plot_importance,
)



# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "crowd_training.csv"
)

MODEL_DIR = BASE_DIR / "ml" / "models"

METRICS_DIR = BASE_DIR / "ml" / "metrics"

MODEL_PATH = MODEL_DIR / "crowd_xgboost.pkl"

METRICS_PATH = METRICS_DIR / "crowd_metrics.json"

CONFUSION_MATRIX_PATH = (
    METRICS_DIR / "crowd_confusion_matrix.png"
)

FEATURE_IMPORTANCE_PATH = (
    METRICS_DIR / "crowd_feature_importance.png"
)
BEST_PARAM_PATH = (
    METRICS_DIR /
    "crowd_best_parameters.json"
)
CLASSIFICATION_REPORT_PATH = (
    METRICS_DIR / "classification_report.txt"
)

BEST_PARAMETERS_PATH = (
    METRICS_DIR / "crowd_best_parameters.json"
)


MODEL_DIR.mkdir(parents=True, exist_ok=True)
METRICS_DIR.mkdir(parents=True, exist_ok=True)


# ==========================================================
# Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Processed Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(f"Dataset Shape : {df.shape}")
print()

print(df.head())
print()


# ==========================================================
# Features and Target
# ==========================================================

TARGET = "crowd_level"

X = df.drop(
    columns=[
        TARGET,
        "crowd_density",
    ]
)

y = df[TARGET]

print("Features:")
print(list(X.columns))
print()

print("Target:")
print(TARGET)
print()


# ==========================================================
# Train/Test Split
# ==========================================================

print("=" * 60)
print("Splitting Dataset...")
print("=" * 60)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print(f"Training Samples : {len(X_train)}")
print(f"Testing Samples  : {len(X_test)}")
print()


# ==========================================================
# Train Model
# ==========================================================

print("=" * 60)
print("Training XGBoost Model...")
print("=" * 60)

base_model = XGBClassifier(
    objective="multi:softprob",
    num_class=len(y.unique()),
    random_state=42,
    eval_metric="mlogloss",
)

param_grid = {

    "n_estimators": [100, 200, 300],

    "max_depth": [3, 5, 7, 9],

    "learning_rate": [
        0.01,
        0.05,
        0.1,
        0.2,
    ],

    "subsample": [
        0.7,
        0.8,
        0.9,
        1.0,
    ],

    "colsample_bytree": [
        0.7,
        0.8,
        0.9,
        1.0,
    ],

    "min_child_weight": [
        1,
        3,
        5,
    ],

    "gamma": [
        0,
        0.1,
        0.2,
        0.3,
    ],
}
search = RandomizedSearchCV(
    estimator=base_model,
    param_distributions=param_grid,
    n_iter=20,
    cv=5,
    scoring="accuracy",
    verbose=2,
    random_state=42,
    n_jobs=-1,
)

search.fit(
    X_train,
    y_train,
)

model = search.best_estimator_
print("Training Complete!")
print()

with open(
    BEST_PARAM_PATH,
    "w",
) as f:

    json.dump(
        search.best_params_,
        f,
        indent=4,
    )
# ==========================================================
# Prediction
# ==========================================================

print("=" * 60)
print("Best Parameters")
print("=" * 60)

print(search.best_params_)
print()
print(f"Best CV Score : {search.best_score_:.4f}")

y_pred = model.predict(X_test)
from sklearn.metrics import classification_report
print("=" * 60)
print("Classification Report")
print("=" * 60)

report = classification_report(
    y_test,
    y_pred,
    zero_division=0,
)
with open(
    CLASSIFICATION_REPORT_PATH,
    "w",
    encoding="utf-8",
) as f:
    f.write(report)

print(report)
with open(
    BEST_PARAMETERS_PATH,
    "w",
    encoding="utf-8",
) as f:
    json.dump(
        search.best_params_,
        f,
        indent=4,
    )
# ==========================================================
# Metrics
# ==========================================================

accuracy = accuracy_score(y_test, y_pred)

precision =precision_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0,
)

recall = recall_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0,
)

f1 = f1_score(
    y_test,
    y_pred,
    average="weighted",
    zero_division=0,
)

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print()


# ==========================================================
# Save Model
# ==========================================================

joblib.dump(model, MODEL_PATH)

print(f"Model Saved : {MODEL_PATH}")
print()


# ==========================================================
# Save Metrics
# ==========================================================

metrics = {
    "accuracy": float(accuracy),
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
}

with open(METRICS_PATH, "w", encoding="utf-8") as file:
    json.dump(metrics, file, indent=4)

print(f"Metrics Saved : {METRICS_PATH}")
print()


# ==========================================================
# Confusion Matrix
# ==========================================================

cm = confusion_matrix(
    y_test,
    y_pred,
)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)

disp.plot()

plt.title("Crowd Prediction Confusion Matrix")

plt.savefig(
    CONFUSION_MATRIX_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()

print(f"Confusion Matrix Saved : {CONFUSION_MATRIX_PATH}")
print()


# ==========================================================
# Feature Importance
# ==========================================================

print("=" * 60)
print("Generating Feature Importance...")
print("=" * 60)

plt.figure(figsize=(10, 6))

plot_importance(
    model,
    importance_type="gain",
    max_num_features=10,
)

plt.title("Crowd Prediction Feature Importance")

plt.tight_layout()

plt.savefig(
    FEATURE_IMPORTANCE_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()

print(f"Feature Importance Saved : {FEATURE_IMPORTANCE_PATH}")
print()


# ==========================================================
# Finish
# ==========================================================

print("=" * 60)
print("Crowd Model Training Completed Successfully")
print("=" * 60)