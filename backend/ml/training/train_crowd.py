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
    confusion_matrix,
    ConfusionMatrixDisplay,
    classification_report,
)

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

MODEL_PATH = (
    MODEL_DIR
    / "crowd_xgboost.pkl"
)

METRICS_PATH = (
    METRICS_DIR
    / "crowd_metrics.json"
)

CONFUSION_MATRIX_PATH = (
    METRICS_DIR
    / "crowd_confusion_matrix.png"
)

FEATURE_IMPORTANCE_PATH = (
    METRICS_DIR
    / "crowd_feature_importance.png"
)

BEST_PARAMETERS_PATH = (
    METRICS_DIR
    / "crowd_best_parameters.json"
)

CLASSIFICATION_REPORT_PATH = (
    METRICS_DIR
    / "classification_report.txt"
)


MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

METRICS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================================
# Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Processed Crowd Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(f"Dataset Shape : {df.shape}")
print()

print("Available Columns:")
print(list(df.columns))
print()

print("First 5 Records:")
print(df.head())
print()


# ==========================================================
# Target
# ==========================================================

TARGET = "crowd_level"

# Explicitly map categories to logical integers



# ==========================================================
# Features
# ==========================================================
#
# IMPORTANT:
#
# station_name is intentionally NOT used.
#
# The model predicts crowd based on passenger flow,
# crowd counts and temporal patterns.
#
# Station name can remain optional at the API/UI level
# but is NOT an ML feature.
#
# ==========================================================

FEATURES = [
    "entry_count",
    "exit_count",
    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",
]

# ==========================================================
# Validate Required Columns
# ==========================================================

print("=" * 60)
print("Validating Required Columns...")
print("=" * 60)

REQUIRED_COLUMNS = [
    "entry_count",
    "exit_count",
    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",
    "crowd_level",
]


missing_columns = [
    column
    for column in REQUIRED_COLUMNS
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )

print("All required columns are available.")
print()


# ==========================================================
# Features and Target
# ==========================================================

X = df[FEATURES].copy()

y = df[TARGET].copy()


print("=" * 60)
print("Model Features")
print("=" * 60)

for i, feature in enumerate(
    FEATURES,
    start=1,
):
    print(f"{i}. {feature}")

print()

print(
    "Station name used as ML feature: NO"
)

print(
    f"Number of ML features: {len(FEATURES)}"
)

print()

print("Target:")
print(TARGET)

print()

print("Target Distribution:")

print(
    y.value_counts()
    .sort_index()
)

print()


# ==========================================================
# Check Missing Values
# ==========================================================

print("=" * 60)
print("Checking Missing Values...")
print("=" * 60)

missing_values = X.isna().sum()

print(missing_values)

if missing_values.sum() > 0:

    raise ValueError(
        "Missing values found in training features."
    )

if y.isna().sum() > 0:

    raise ValueError(
        "Missing values found in target column."
    )

print("No missing values found.")
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

print(
    f"Training Samples : {len(X_train)}"
)

print(
    f"Testing Samples  : {len(X_test)}"
)

print()


# ==========================================================
# Train XGBoost Model
# ==========================================================

print("=" * 60)
print("Training XGBoost Crowd Model...")
print("=" * 60)

num_classes = y.nunique()

print(
    f"Number of Crowd Classes: {num_classes}"
)

print()


base_model = XGBClassifier(
    objective="multi:softprob",
    num_class=num_classes,
    random_state=42,
    eval_metric="mlogloss",
)


# ==========================================================
# Hyperparameter Search
# ==========================================================

param_grid = {

    "n_estimators": [
        100,
        200,
        300,
    ],

    "max_depth": [
        3,
        5,
        7,
        9,
    ],

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


# ==========================================================
# Fit Model
# ==========================================================

search.fit(
    X_train,
    y_train,
)

model = search.best_estimator_


print()
print("=" * 60)
print("Training Complete!")
print("=" * 60)

print(
    f"Best CV Accuracy: "
    f"{search.best_score_:.4f}"
)

print()


# ==========================================================
# Best Parameters
# ==========================================================

print("=" * 60)
print("Best Parameters")
print("=" * 60)

print(search.best_params_)
print()


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

print(
    f"Best parameters saved: "
    f"{BEST_PARAMETERS_PATH}"
)

print()


# ==========================================================
# Prediction
# ==========================================================

print("=" * 60)
print("Generating Predictions...")
print("=" * 60)

y_pred = model.predict(X_test)


# ==========================================================
# Classification Report
# ==========================================================

print("=" * 60)
print("Classification Report")
print("=" * 60)

report = classification_report(
    y_test,
    y_pred,
    zero_division=0,
)

print(report)


with open(
    CLASSIFICATION_REPORT_PATH,
    "w",
    encoding="utf-8",
) as file:

    file.write(report)


print(
    f"Classification report saved: "
    f"{CLASSIFICATION_REPORT_PATH}"
)

print()


# ==========================================================
# Metrics
# ==========================================================

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


print("=" * 60)
print("Model Performance")
print("=" * 60)

print(
    f"Accuracy : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1 Score : {f1:.4f}"
)

print()


# ==========================================================
# Save Model
# ==========================================================

print("=" * 60)
print("Saving Model...")
print("=" * 60)

joblib.dump(
    model,
    MODEL_PATH,
)

print(
    f"Model Saved: {MODEL_PATH}"
)

print()


# ==========================================================
# Save Metrics
# ==========================================================

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

    "best_cv_score": float(
        search.best_score_
    ),

    "features": FEATURES,

    "station_name_used": False,

    "number_of_features": len(
        FEATURES
    ),

    "training_samples": len(
        X_train
    ),

    "testing_samples": len(
        X_test
    ),

    "number_of_classes": int(
        num_classes
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


print(
    f"Metrics Saved: {METRICS_PATH}"
)

print()


# ==========================================================
# Confusion Matrix
# ==========================================================

print("=" * 60)
print("Generating Confusion Matrix...")
print("=" * 60)

cm = confusion_matrix(
    y_test,
    y_pred,
)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
)

disp.plot()

plt.title(
    "Crowd Prediction Confusion Matrix"
)

plt.savefig(
    CONFUSION_MATRIX_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()


print(
    f"Confusion Matrix Saved: "
    f"{CONFUSION_MATRIX_PATH}"
)

print()


# ==========================================================
# Feature Importance
# ==========================================================

print("=" * 60)
print("Generating Feature Importance...")
print("=" * 60)

plt.figure(
    figsize=(10, 6)
)

plot_importance(
    model,
    importance_type="gain",
    max_num_features=len(FEATURES),
)

plt.title(
    "Crowd Prediction Feature Importance"
)

plt.tight_layout()

plt.savefig(
    FEATURE_IMPORTANCE_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()


print(
    f"Feature Importance Saved: "
    f"{FEATURE_IMPORTANCE_PATH}"
)

print()


# ==========================================================
# Final Summary
# ==========================================================

print("=" * 60)
print("Crowd Model Training Completed Successfully")
print("=" * 60)

print()

print("Final ML Features:")

for feature in FEATURES:
    print(f"  ✓ {feature}")

print()

print(
    "Station Name: OPTIONAL / NOT USED BY MODEL"
)

print(
    f"Accuracy : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1 Score : {f1:.4f}"
)

print()

print(
    "Model:",
    MODEL_PATH,
)

print("=" * 60)