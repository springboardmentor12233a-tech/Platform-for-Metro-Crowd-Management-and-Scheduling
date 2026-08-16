from pathlib import Path

import json
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)

from xgboost import XGBClassifier


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "schedule_training.csv"
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

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

METRICS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("SCHEDULE OPTIMIZER TRAINING - VERSION 2")
print("=" * 60)

df = pd.read_csv(INPUT_FILE)

print(f"Dataset shape: {df.shape}")


# ============================================================
# FEATURES
# ============================================================
#
# IMPORTANT:
#
# We intentionally DO NOT use:
#
#   expected_delay
#   median_delay
#   delay_std
#   delay_samples
#
# These features were used to create the schedule_action
# target and would therefore cause target leakage.
#
# The model now learns from independent trip and
# time-related operational features.
#
# ============================================================

features = [

    "distance_km",

    "average_speed_kmh",

    "trip_duration_min",

    "speed_efficiency",

    "departure_hour",

    "departure_minute",

    "departure_minute_of_day",

    "day",

    "day_of_week",

    "month",

    "is_weekend",

    "peak_hour",

]


target = "schedule_action"


# ============================================================
# VALIDATE FEATURES
# ============================================================

missing_features = [
    feature
    for feature in features
    if feature not in df.columns
]

if missing_features:

    raise ValueError(
        "Missing required features: "
        f"{missing_features}"
    )


if target not in df.columns:

    raise ValueError(
        f"Target column '{target}' "
        "not found in dataset."
    )


# ============================================================
# PREPARE X AND Y
# ============================================================

X = df[features].copy()

y = df[target].astype(int)


# ============================================================
# CHECK TARGET
# ============================================================

print("\nTarget distribution:")

print(
    y.value_counts()
    .sort_index()
)


# ============================================================
# TARGET MAPPING
# ============================================================

target_mapping = {
    0: "Maintain",
    1: "Shift Earlier",
    2: "Shift Later",
}


print("\nTarget mapping:")

for code, label in target_mapping.items():

    print(
        f"{code} -> {label}"
    )


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = (
    train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )
)


print(
    "\nTraining samples:",
    len(X_train),
)

print(
    "Testing samples :",
    len(X_test),
)


# ============================================================
# CLASS WEIGHTS
# ============================================================

class_counts = (
    y_train
    .value_counts()
    .sort_index()
)

total = len(y_train)

num_classes = len(class_counts)

class_weights = {

    cls: total / (
        num_classes * count
    )

    for cls, count
    in class_counts.items()

}


print("\nClass weights:")

for cls, weight in class_weights.items():

    print(
        f"Class {cls} "
        f"({target_mapping.get(cls, 'Unknown')}): "
        f"{weight:.4f}"
    )


sample_weights = y_train.map(
    class_weights
)


# ============================================================
# MODEL
# ============================================================

model = XGBClassifier(

    n_estimators=250,

    max_depth=5,

    learning_rate=0.04,

    subsample=0.8,

    colsample_bytree=0.8,

    min_child_weight=3,

    gamma=0.1,

    objective="multi:softprob",

    num_class=3,

    eval_metric="mlogloss",

    random_state=42,

    n_jobs=-1,
)


# ============================================================
# TRAIN
# ============================================================

print("\n" + "=" * 60)
print("TRAINING")
print("=" * 60)

model.fit(
    X_train,
    y_train,
    sample_weight=sample_weights,
)


print("\nTraining complete.")


# ============================================================
# PREDICTION
# ============================================================

y_pred = model.predict(
    X_test
)


# ============================================================
# METRICS
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred,
)

macro_f1 = f1_score(
    y_test,
    y_pred,
    average="macro",
)

weighted_f1 = f1_score(
    y_test,
    y_pred,
    average="weighted",
)

cm = confusion_matrix(
    y_test,
    y_pred,
)


# ============================================================
# PERFORMANCE
# ============================================================

print("\n" + "=" * 60)
print("SCHEDULE MODEL PERFORMANCE")
print("=" * 60)

print(
    f"Accuracy    : {accuracy:.4f}"
)

print(
    f"Macro F1    : {macro_f1:.4f}"
)

print(
    f"Weighted F1 : {weighted_f1:.4f}"
)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        labels=[
            0,
            1,
            2,
        ],
        target_names=[
            "Maintain",
            "Shift Earlier",
            "Shift Later",
        ],
        zero_division=0,
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

print("\nConfusion Matrix:")

print(
    cm
)


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

importance = pd.Series(
    model.feature_importances_,
    index=features,
).sort_values(
    ascending=False
)


print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

print(
    importance
)


# ============================================================
# SAVE MODEL
# ============================================================

MODEL_PATH = (
    MODEL_DIR
    / "schedule_xgboost.pkl"
)

joblib.dump(
    model,
    MODEL_PATH,
)


# ============================================================
# SAVE METRICS
# ============================================================

metrics = {

    "model_version": "v2_leakage_free",

    "accuracy": float(
        accuracy
    ),

    "macro_f1": float(
        macro_f1
    ),

    "weighted_f1": float(
        weighted_f1
    ),

    "training_samples": int(
        len(X_train)
    ),

    "testing_samples": int(
        len(X_test)
    ),

    "features": features,

    "excluded_leakage_features": [

        "expected_delay",

        "median_delay",

        "delay_std",

        "delay_samples",

    ],

    "target": target,

    "target_mapping": {

        "0": "Maintain",

        "1": "Shift Earlier",

        "2": "Shift Later",

    },

}


with open(
    METRICS_DIR
    / "schedule_metrics.json",
    "w",
) as f:

    json.dump(
        metrics,
        f,
        indent=4,
    )


# ============================================================
# SAVE FEATURE IMPORTANCE
# ============================================================

importance.to_csv(
    METRICS_DIR
    / "schedule_feature_importance.csv"
)


# ============================================================
# COMPLETION
# ============================================================

print("\n" + "=" * 60)
print("SCHEDULE MODEL TRAINING COMPLETED")
print("=" * 60)

print("\nModel Version:")
print("✓ V2 - Leakage Free")

print("\nFeatures used:")

for feature in features:

    print(
        f"  ✓ {feature}"
    )


print("\nExcluded leakage features:")

print(
    "  ✗ expected_delay"
)

print(
    "  ✗ median_delay"
)

print(
    "  ✗ delay_std"
)

print(
    "  ✗ delay_samples"
)


print("\nSaved files:")

print(
    f"✓ {MODEL_PATH}"
)

print(
    f"✓ {METRICS_DIR / 'schedule_metrics.json'}"
)

print(
    f"✓ {METRICS_DIR / 'schedule_feature_importance.csv'}"
)

print("=" * 60)