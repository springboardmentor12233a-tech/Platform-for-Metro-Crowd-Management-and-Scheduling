"""
Ridership Prediction Model Training

Author: Ankita Jana
Project: Metro Crowd Management System

Models:
    1. Entry Count Prediction
    2. Exit Count Prediction

Features:
    hour
    day
    month
    day_of_week
    weekend

Station name is NOT used by the model.
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
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from xgboost import (
    XGBRegressor,
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
    / "ridership_training.csv"
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

ENTRY_MODEL_PATH = (
    MODEL_DIR
    / "entry_xgboost.pkl"
)

EXIT_MODEL_PATH = (
    MODEL_DIR
    / "exit_xgboost.pkl"
)

ENTRY_METRICS_PATH = (
    METRICS_DIR
    / "entry_metrics.json"
)

EXIT_METRICS_PATH = (
    METRICS_DIR
    / "exit_metrics.json"
)

ENTRY_IMPORTANCE_PATH = (
    METRICS_DIR
    / "entry_feature_importance.png"
)

EXIT_IMPORTANCE_PATH = (
    METRICS_DIR
    / "exit_feature_importance.png"
)

BEST_PARAMS_PATH = (
    METRICS_DIR
    / "ridership_best_parameters.json"
)


# ==========================================================
# Create Directories
# ==========================================================

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
print("Loading Processed Ridership Dataset...")
print("=" * 60)

df = pd.read_csv(
    DATASET
)

print()
print(
    f"Dataset Shape : {df.shape}"
)

print()
print(
    "Available Columns:"
)

print(
    df.columns.tolist()
)

print()
print(
    "First 5 Records:"
)

print(
    df.head()
)


# ==========================================================
# Validate Required Columns
# ==========================================================

print()
print("=" * 60)
print("Validating Required Columns...")
print("=" * 60)

FEATURES = [
    "hour",
    "day",
    "month",
    "day_of_week",
    "weekend",
]

TARGETS = [
    "entry_count",
    "exit_count",
]

REQUIRED_COLUMNS = (
    FEATURES
    + TARGETS
)

missing_columns = [
    column
    for column in REQUIRED_COLUMNS
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        "Missing required columns: "
        f"{missing_columns}"
    )

print(
    "All required columns are present."
)


# ==========================================================
# Prepare Features
# ==========================================================

X = df[
    FEATURES
].copy()


# ==========================================================
# Prepare Targets
# ==========================================================

y_entry = df[
    "entry_count"
].copy()

y_exit = df[
    "exit_count"
].copy()


# ==========================================================
# Train/Test Split
# ==========================================================

print()
print("=" * 60)
print("Splitting Dataset...")
print("=" * 60)

X_train, X_test, y_entry_train, y_entry_test, y_exit_train, y_exit_test = (
    train_test_split(
        X,
        y_entry,
        y_exit,
        test_size=0.20,
        random_state=42,
    )
)


print()
print(
    f"Training Samples : {len(X_train)}"
)

print(
    f"Testing Samples  : {len(X_test)}"
)


# ==========================================================
# Base XGBoost Model
# ==========================================================

base_model = XGBRegressor(
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1,
)


# ==========================================================
# Hyperparameter Search
# ==========================================================

param_grid = {

    "n_estimators": [
        100,
        200,
        300,
        500,
    ],

    "max_depth": [
        3,
        5,
        7,
        9,
    ],

    "learning_rate": [
        0.01,
        0.03,
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
        10,
    ],

    "gamma": [
        0,
        0.1,
        0.2,
        0.3,
    ],
}


# ==========================================================
# Train Entry Model
# ==========================================================

print()
print("=" * 60)
print("Training Entry Count Model...")
print("=" * 60)

entry_search = RandomizedSearchCV(
    estimator=base_model,
    param_distributions=param_grid,
    n_iter=20,
    cv=5,
    scoring="neg_mean_absolute_error",
    verbose=2,
    random_state=42,
    n_jobs=-1,
)

entry_search.fit(
    X_train,
    y_entry_train,
)

entry_model = (
    entry_search.best_estimator_
)

print()
print(
    "Entry Model Training Complete!"
)

print()
print(
    "Best Entry Parameters:"
)

print(
    entry_search.best_params_
)

print()
print(
    f"Best Entry CV MAE: "
    f"{-entry_search.best_score_:.4f}"
)


# ==========================================================
# Train Exit Model
# ==========================================================

print()
print("=" * 60)
print("Training Exit Count Model...")
print("=" * 60)

exit_search = RandomizedSearchCV(
    estimator=base_model,
    param_distributions=param_grid,
    n_iter=20,
    cv=5,
    scoring="neg_mean_absolute_error",
    verbose=2,
    random_state=42,
    n_jobs=-1,
)

exit_search.fit(
    X_train,
    y_exit_train,
)

exit_model = (
    exit_search.best_estimator_
)

print()
print(
    "Exit Model Training Complete!"
)

print()
print(
    "Best Exit Parameters:"
)

print(
    exit_search.best_params_
)

print()
print(
    f"Best Exit CV MAE: "
    f"{-exit_search.best_score_:.4f}"
)


# ==========================================================
# Predictions
# ==========================================================

print()
print("=" * 60)
print("Generating Predictions...")
print("=" * 60)

entry_pred = (
    entry_model.predict(X_test)
)

exit_pred = (
    exit_model.predict(X_test)
)


# ==========================================================
# Prevent Negative Predictions
# ==========================================================

entry_pred = entry_pred.clip(
    min=0
)

exit_pred = exit_pred.clip(
    min=0
)


# ==========================================================
# Evaluation Function
# ==========================================================

def calculate_metrics(
    y_true,
    y_pred,
):

    mae = mean_absolute_error(
        y_true,
        y_pred,
    )

    rmse = mean_squared_error(
        y_true,
        y_pred,
    ) ** 0.5

    r2 = r2_score(
        y_true,
        y_pred,
    )

    return {
        "mae": float(mae),
        "rmse": float(rmse),
        "r2_score": float(r2),
    }


# ==========================================================
# Calculate Metrics
# ==========================================================

entry_metrics = calculate_metrics(
    y_entry_test,
    entry_pred,
)

exit_metrics = calculate_metrics(
    y_exit_test,
    exit_pred,
)


# ==========================================================
# Print Entry Metrics
# ==========================================================

print()
print("=" * 60)
print("ENTRY COUNT MODEL")
print("=" * 60)

print(
    f"MAE  : "
    f"{entry_metrics['mae']:.4f}"
)

print(
    f"RMSE : "
    f"{entry_metrics['rmse']:.4f}"
)

print(
    f"R²   : "
    f"{entry_metrics['r2_score']:.4f}"
)


# ==========================================================
# Print Exit Metrics
# ==========================================================

print()
print("=" * 60)
print("EXIT COUNT MODEL")
print("=" * 60)

print(
    f"MAE  : "
    f"{exit_metrics['mae']:.4f}"
)

print(
    f"RMSE : "
    f"{exit_metrics['rmse']:.4f}"
)

print(
    f"R²   : "
    f"{exit_metrics['r2_score']:.4f}"
)


# ==========================================================
# Save Models
# ==========================================================

joblib.dump(
    entry_model,
    ENTRY_MODEL_PATH,
)

joblib.dump(
    exit_model,
    EXIT_MODEL_PATH,
)

print()
print(
    f"Entry Model Saved:"
)

print(
    ENTRY_MODEL_PATH
)

print()
print(
    f"Exit Model Saved:"
)

print(
    EXIT_MODEL_PATH
)


# ==========================================================
# Save Metrics
# ==========================================================

with open(
    ENTRY_METRICS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        entry_metrics,
        file,
        indent=4,
    )


with open(
    EXIT_METRICS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        exit_metrics,
        file,
        indent=4,
    )


# ==========================================================
# Save Best Parameters
# ==========================================================

best_parameters = {

    "entry_model":
        entry_search.best_params_,

    "exit_model":
        exit_search.best_params_,
}


with open(
    BEST_PARAMS_PATH,
    "w",
    encoding="utf-8",
) as file:

    json.dump(
        best_parameters,
        file,
        indent=4,
    )


# ==========================================================
# Feature Importance - Entry
# ==========================================================

print()
print("=" * 60)
print("Generating Entry Feature Importance...")
print("=" * 60)

plt.figure(
    figsize=(10, 6)
)

plot_importance(
    entry_model,
    importance_type="gain",
    max_num_features=len(FEATURES),
)

plt.title(
    "Entry Count Prediction - Feature Importance"
)

plt.tight_layout()

plt.savefig(
    ENTRY_IMPORTANCE_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()


# ==========================================================
# Feature Importance - Exit
# ==========================================================

print()
print("=" * 60)
print("Generating Exit Feature Importance...")
print("=" * 60)

plt.figure(
    figsize=(10, 6)
)

plot_importance(
    exit_model,
    importance_type="gain",
    max_num_features=len(FEATURES),
)

plt.title(
    "Exit Count Prediction - Feature Importance"
)

plt.tight_layout()

plt.savefig(
    EXIT_IMPORTANCE_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()


# ==========================================================
# Final Summary
# ==========================================================

print()
print("=" * 60)
print("RIDERSHIP MODEL TRAINING COMPLETED")
print("=" * 60)

print()

print("ML Features:")

for feature in FEATURES:

    print(
        f"  ✓ {feature}"
    )

print()

print("Models:")

print(
    "  ✓ entry_xgboost.pkl"
)

print(
    "  ✓ exit_xgboost.pkl"
)

print()

print(
    "Station Name: "
    "OPTIONAL / NOT USED BY MODEL"
)

print()

print(
    "Predicted Ridership:"
)

print(
    "  predicted_entries "
    "+ predicted_exits"
)

print()

print("=" * 60)