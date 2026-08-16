"""
Dynamic Frequency Adjustment Model

Project:
    Platform for Metro Crowd Management and Scheduling

Target:
    frequency_action

Mapping:
    0 -> Decrease
    1 -> Maintain
    2 -> Increase
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

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

from xgboost import XGBClassifier, plot_importance


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "frequency_training.csv"
)

MODEL_DIR = (
    BASE_DIR
    / "ml"
    / "models"
)

METRICS_DIR = (
    BASE_DIR
    / "ml"
    / "metrics"
)

MODEL_PATH = (
    MODEL_DIR
    / "frequency_xgboost.pkl"
)

METRICS_PATH = (
    METRICS_DIR
    / "frequency_metrics.json"
)

BEST_PARAMETERS_PATH = (
    METRICS_DIR
    / "frequency_best_parameters.json"
)

CLASSIFICATION_REPORT_PATH = (
    METRICS_DIR
    / "frequency_classification_report.txt"
)

CONFUSION_MATRIX_PATH = (
    METRICS_DIR
    / "frequency_confusion_matrix.png"
)

FEATURE_IMPORTANCE_PATH = (
    METRICS_DIR
    / "frequency_feature_importance.png"
)


# ============================================================
# Create Directories
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

METRICS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# Load Dataset
# ============================================================

print("=" * 60)
print("Loading Frequency Training Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(
    f"\nDataset Shape : {df.shape}"
)

print("\nColumns:")

print(
    df.columns.tolist()
)


# ============================================================
# Required Columns
# ============================================================

TARGET = "frequency_action"

FEATURES = [
    "occupancy",
    "capacity",
    "occupancy_percentage",
    "occupancy_ratio",
    "hour",
    "minute",
    "day",
    "month",
    "day_of_week",
    "is_weekend",
    "peak_hour",
]


required_columns = FEATURES + [TARGET]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        f"Missing required columns: "
        f"{missing_columns}"
    )


# ============================================================
# Features and Target
# ============================================================

X = df[FEATURES].copy()

y = df[TARGET].copy()


print("\n" + "=" * 60)
print("ML FEATURES")
print("=" * 60)

for feature in FEATURES:

    print(
        f"  ✓ {feature}"
    )


print("\nTarget:")

print(
    "  ✓ frequency_action"
)


# ============================================================
# Target Distribution
# ============================================================

print("\n" + "=" * 60)
print("TARGET DISTRIBUTION")
print("=" * 60)

print(
    y.value_counts()
    .sort_index()
)


# ============================================================
# Train/Test Split
# ============================================================

print("\n" + "=" * 60)
print("Splitting Dataset...")
print("=" * 60)

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y,
)


print(
    f"Training Samples : {len(X_train)}"
)

print(
    f"Testing Samples  : {len(X_test)}"
)


# ============================================================
# Base XGBoost Model
# ============================================================

print("\n" + "=" * 60)
print("Preparing XGBoost Model...")
print("=" * 60)

base_model = XGBClassifier(

    objective="multi:softprob",

    num_class=3,

    eval_metric="mlogloss",

    random_state=42,

)


# ============================================================
# Hyperparameter Search
# ============================================================

param_grid = {

    "n_estimators": [
        100,
        200,
        300,
    ],

    "max_depth": [
        3,
        4,
        5,
        6,
        8,
    ],

    "learning_rate": [
        0.01,
        0.03,
        0.05,
        0.1,
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
        10,
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


# ============================================================
# Train
# ============================================================

print("\n" + "=" * 60)
print("Training Frequency XGBoost Model...")
print("=" * 60)

search.fit(
    X_train,
    y_train,
)


model = search.best_estimator_


print("\nTraining Complete")


# ============================================================
# Best Parameters
# ============================================================

print("\n" + "=" * 60)
print("BEST PARAMETERS")
print("=" * 60)

print(
    search.best_params_
)

print(
    f"\nBest CV Accuracy : "
    f"{search.best_score_:.4f}"
)


with open(
    BEST_PARAMETERS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        search.best_params_,
        file,
        indent=4,
    )


# ============================================================
# Prediction
# ============================================================

print("\n" + "=" * 60)
print("Generating Predictions...")
print("=" * 60)

y_pred = model.predict(
    X_test
)


# ============================================================
# Classification Report
# ============================================================

report = classification_report(

    y_test,

    y_pred,

    target_names=[
        "Decrease",
        "Maintain",
        "Increase",
    ],

    zero_division=0,
)


print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(report)


with open(
    CLASSIFICATION_REPORT_PATH,
    "w",
    encoding="utf-8",
) as file:

    file.write(report)


# ============================================================
# Metrics
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred,
)

precision = precision_score(

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


print("\n" + "=" * 60)
print("FREQUENCY MODEL METRICS")
print("=" * 60)

print(
    f"Accuracy  : {accuracy:.4f}"
)

print(
    f"Precision : {precision:.4f}"
)

print(
    f"Recall    : {recall:.4f}"
)

print(
    f"F1 Score  : {f1:.4f}"
)


# ============================================================
# Save Metrics
# ============================================================

metrics = {

    "accuracy": float(
        accuracy
    ),

    "precision": float(
        precision
    ),

    "recall": float(
        recall
    ),

    "f1_score": float(
        f1
    ),

    "best_cv_accuracy": float(
        search.best_score_
    ),

}


with open(
    METRICS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        metrics,
        file,
        indent=4,
    )


# ============================================================
# Save Model
# ============================================================

joblib.dump(
    model,
    MODEL_PATH,
)


print("\nModel Saved:")

print(
    MODEL_PATH
)


# ============================================================
# Confusion Matrix
# ============================================================

cm = confusion_matrix(
    y_test,
    y_pred,
)


disp = ConfusionMatrixDisplay(

    confusion_matrix=cm,

    display_labels=[
        "Decrease",
        "Maintain",
        "Increase",
    ],

)


disp.plot()


plt.title(
    "Frequency Adjustment Confusion Matrix"
)

plt.tight_layout()


plt.savefig(

    CONFUSION_MATRIX_PATH,

    dpi=300,

    bbox_inches="tight",

)


plt.close()


print(
    "\nConfusion Matrix Saved:"
)

print(
    CONFUSION_MATRIX_PATH
)


# ============================================================
# Feature Importance
# ============================================================

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

importance = pd.Series(

    model.feature_importances_,

    index=FEATURES,

).sort_values(
    ascending=False
)


print(
    importance.to_string()
)


plt.figure(
    figsize=(10, 6)
)


plot_importance(

    model,

    importance_type="gain",

    max_num_features=len(FEATURES),

)


plt.title(
    "Frequency Adjustment Feature Importance"
)

plt.tight_layout()


plt.savefig(

    FEATURE_IMPORTANCE_PATH,

    dpi=300,

    bbox_inches="tight",

)


plt.close()


print(
    "\nFeature Importance Saved:"
)

print(
    FEATURE_IMPORTANCE_PATH
)


# ============================================================
# Final Summary
# ============================================================

print("\n" + "=" * 60)
print("FREQUENCY MODEL TRAINING COMPLETED")
print("=" * 60)

print("\nML Features:")

for feature in FEATURES:

    print(
        f"  ✓ {feature}"
    )


print("\nTarget:")

print(
    "  ✓ frequency_action"
)


print("\nTarget Mapping:")

print(
    "  0 -> Decrease"
)

print(
    "  1 -> Maintain"
)

print(
    "  2 -> Increase"
)


print("\nStation Name:")

print(
    "  OPTIONAL / NOT USED BY MODEL"
)

print("\nSaved Files:")

print(
    "  ✓ frequency_xgboost.pkl"
)

print(
    "  ✓ frequency_metrics.json"
)

print(
    "  ✓ frequency_best_parameters.json"
)

print(
    "  ✓ frequency_confusion_matrix.png"
)

print(
    "  ✓ frequency_feature_importance.png"
)

print("=" * 60)