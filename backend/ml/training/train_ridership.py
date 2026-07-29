"""
Ridership Prediction Model Training

Author: Ankita Jana
Project: Metro Crowd Management System
"""

from pathlib import Path
import json

import joblib
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

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

MODEL_DIR = BASE_DIR / "ml" / "models"

METRICS_DIR = BASE_DIR / "ml" / "metrics"

MODEL_DIR.mkdir(parents=True, exist_ok=True)
METRICS_DIR.mkdir(parents=True, exist_ok=True)


# ==========================================================
# Model Paths
# ==========================================================

ENTRY_MODEL_PATH = (
    MODEL_DIR
    / "entry_xgboost.pkl"
)

EXIT_MODEL_PATH = (
    MODEL_DIR
    / "exit_xgboost.pkl"
)


# ==========================================================
# Metric Paths
# ==========================================================

ENTRY_METRICS_PATH = (
    METRICS_DIR
    / "entry_metrics.json"
)

EXIT_METRICS_PATH = (
    METRICS_DIR
    / "exit_metrics.json"
)

ENTRY_FEATURE_PATH = (
    METRICS_DIR
    / "entry_feature_importance.png"
)

EXIT_FEATURE_PATH = (
    METRICS_DIR
    / "exit_feature_importance.png"
)

ENTRY_PARAMETER_PATH = (
    METRICS_DIR
    / "entry_best_parameters.json"
)

EXIT_PARAMETER_PATH = (
    METRICS_DIR
    / "exit_best_parameters.json"
)


# ==========================================================
# Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Ridership Dataset...")
print("=" * 60)

df = pd.read_csv(DATASET)

print(f"Dataset Shape : {df.shape}")
print()

print(df.head())
print()


# ==========================================================
# Features
# ==========================================================

FEATURES = [

    "station_name",

    "platform_count",

    "concourse_count",

    "hour",

    "day",

    "month",

    "day_of_week",

    "weekend",

]

X = df[FEATURES]

y_entry = df["entry_count"]

y_exit = df["exit_count"]


print("Features:")

print(FEATURES)

print()

print("Targets:")

print("Entry Count")

print("Exit Count")

print()


# ==========================================================
# Train Test Split
# ==========================================================

print("=" * 60)
print("Splitting Dataset...")
print("=" * 60)

X_train, X_test, y_entry_train, y_entry_test = train_test_split(

    X,

    y_entry,

    test_size=0.20,

    random_state=42,

)

_, _, y_exit_train, y_exit_test = train_test_split(

    X,

    y_exit,

    test_size=0.20,

    random_state=42,

)

print(f"Training Samples : {len(X_train)}")

print(f"Testing Samples  : {len(X_test)}")

print()


# ==========================================================
# Hyperparameter Grid
# ==========================================================

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
# ==========================================================
# Training Function
# ==========================================================

def train_model(
    target_name,
    y_train,
    y_test,
    model_path,
    metrics_path,
    parameter_path,
    feature_path,
):

    print("=" * 60)
    print(f"Training {target_name} Model...")
    print("=" * 60)

    base_model = XGBRegressor(
        objective="reg:squarederror",
        random_state=42,
    )

    search = RandomizedSearchCV(
        estimator=base_model,
        param_distributions=param_grid,
        n_iter=20,
        cv=5,
        scoring="neg_mean_absolute_error",
        verbose=2,
        random_state=42,
        n_jobs=-1,
    )

    search.fit(
        X_train,
        y_train,
    )

    model = search.best_estimator_

    print()
    print("Training Complete!")
    print()

    print("=" * 60)
    print(f"{target_name} Best Parameters")
    print("=" * 60)

    print(search.best_params_)
    print()

    print(
        f"Best CV Score : {-search.best_score_:.4f}"
    )

    # ==========================================
    # Prediction
    # ==========================================

    prediction = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        prediction,
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            prediction,
        )
    )

    r2 = r2_score(
        y_test,
        prediction,
    )

    print()
    print(f"{target_name} Metrics")
    print("-" * 30)

    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R²   : {r2:.4f}")

    print()

    # ==========================================
    # Save Model
    # ==========================================

    joblib.dump(
        model,
        model_path,
    )

    print(f"Model Saved : {model_path}")

    # ==========================================
    # Save Metrics
    # ==========================================

    metrics = {

        "MAE": float(mae),

        "RMSE": float(rmse),

        "R2": float(r2),

    }

    with open(
        metrics_path,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            metrics,
            file,
            indent=4,
        )

    print(
        f"Metrics Saved : {metrics_path}"
    )

    # ==========================================
    # Save Best Parameters
    # ==========================================

    with open(
        parameter_path,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            search.best_params_,
            file,
            indent=4,
        )

    print(
        f"Best Parameters Saved : {parameter_path}"
    )

    # ==========================================
    # Feature Importance
    # ==========================================

    print()
    print("=" * 60)
    print("Generating Feature Importance...")
    print("=" * 60)

    plt.figure(figsize=(10, 6))

    plot_importance(
        model,
        importance_type="gain",
        max_num_features=10,
    )

    plt.title(
        f"{target_name} Feature Importance"
    )

    plt.tight_layout()

    plt.savefig(
        feature_path,
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()

    print(
        f"Feature Importance Saved : {feature_path}"
    )

    print()

    return model# ==========================================================
# Train Entry Model
# ==========================================================

entry_model = train_model(

    target_name="Entry",

    y_train=y_entry_train,

    y_test=y_entry_test,

    model_path=ENTRY_MODEL_PATH,

    metrics_path=ENTRY_METRICS_PATH,

    parameter_path=ENTRY_PARAMETER_PATH,

    feature_path=ENTRY_FEATURE_PATH,

)


# ==========================================================
# Train Exit Model
# ==========================================================

exit_model = train_model(

    target_name="Exit",

    y_train=y_exit_train,

    y_test=y_exit_test,

    model_path=EXIT_MODEL_PATH,

    metrics_path=EXIT_METRICS_PATH,

    parameter_path=EXIT_PARAMETER_PATH,

    feature_path=EXIT_FEATURE_PATH,

)


# ==========================================================
# Finish
# ==========================================================

print("=" * 60)
print("Ridership Model Training Completed Successfully")
print("=" * 60)
