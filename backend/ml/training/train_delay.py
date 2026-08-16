from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from xgboost import XGBRegressor


BASE_DIR = Path(__file__).resolve().parents[2]

DATASET = (
    BASE_DIR
    / "ml"
    / "data"
    / "processed"
    / "delay_training.csv"
)

MODEL_DIR = BASE_DIR / "ml" / "models"
METRICS_DIR = BASE_DIR / "ml" / "metrics"

MODEL_PATH = MODEL_DIR / "delay_xgboost.pkl"
METRICS_PATH = METRICS_DIR / "delay_metrics.json"
BEST_PARAMS_PATH = METRICS_DIR / "delay_best_parameters.json"
FEATURE_IMPORTANCE_PATH = (
    METRICS_DIR / "delay_feature_importance.png"
)

MODEL_DIR.mkdir(parents=True, exist_ok=True)
METRICS_DIR.mkdir(parents=True, exist_ok=True)


FEATURES = [
    "transport_type",
    "route_id",
    "scheduled_departure_min",
    "scheduled_arrival_min",
    "travel_duration",
    "departure_hour",
    "weather_condition",
    "temperature_c",
    "humidity_percent",
    "wind_speed_kmh",
    "precipitation_mm",
    "weather_severity",
    "event_type",
    "event_attendance_est",
    "event_severity",
    "event_impact",
    "traffic_congestion_index",
    "traffic_severity",
    "traffic_weather_score",
    "rush_hour_score",
    "holiday",
    "peak_hour",
    "weekday",
    "season",
    "month",
    "day_of_week",
    "is_weekend",
    "is_extreme_weather",
]

TARGET = "actual_departure_delay_min"

CATEGORICAL_FEATURES = [
    "transport_type",
    "route_id",
    "weather_condition",
    "event_type",
    "season",
]

NUMERICAL_FEATURES = [
    feature
    for feature in FEATURES
    if feature not in CATEGORICAL_FEATURES
]


print("=" * 60)
print("DELAY PREDICTION MODEL TRAINING")
print("=" * 60)

print(f"Loading dataset: {DATASET}")

df = pd.read_csv(DATASET)

print(f"Dataset shape: {df.shape}")

missing_features = [
    feature
    for feature in FEATURES
    if feature not in df.columns
]

if missing_features:
    raise ValueError(
        f"Missing features: {missing_features}"
    )

if TARGET not in df.columns:
    raise ValueError(
        f"Missing target: {TARGET}"
    )


X = df[FEATURES].copy()
y = df[TARGET].copy()


for column in CATEGORICAL_FEATURES:
    X[column] = X[column].astype(str)

for column in NUMERICAL_FEATURES:
    X[column] = pd.to_numeric(
        X[column],
        errors="coerce",
    )

if X.isnull().sum().sum() > 0:
    raise ValueError(
        "Feature dataset contains missing values."
    )

if y.isnull().sum() > 0:
    raise ValueError(
        "Target contains missing values."
    )


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)


print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False,
            ),
            CATEGORICAL_FEATURES,
        ),
        (
            "numerical",
            "passthrough",
            NUMERICAL_FEATURES,
        ),
    ]
)


base_model = XGBRegressor(
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1,
)


pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor,
        ),
        (
            "model",
            base_model,
        ),
    ]
)


param_grid = {
    "model__n_estimators": [
        100,
        200,
        300,
        500,
    ],
    "model__max_depth": [
        3,
        4,
        5,
        6,
        8,
    ],
    "model__learning_rate": [
        0.01,
        0.03,
        0.05,
        0.1,
    ],
    "model__subsample": [
        0.7,
        0.8,
        0.9,
        1.0,
    ],
    "model__colsample_bytree": [
        0.7,
        0.8,
        0.9,
        1.0,
    ],
    "model__min_child_weight": [
        1,
        3,
        5,
        10,
    ],
    "model__gamma": [
        0,
        0.1,
        0.3,
        0.5,
    ],
}


print("=" * 60)
print("STARTING HYPERPARAMETER SEARCH")
print("=" * 60)

search = RandomizedSearchCV(
    estimator=pipeline,
    param_distributions=param_grid,
    n_iter=25,
    cv=5,
    scoring="neg_mean_absolute_error",
    random_state=42,
    verbose=2,
    n_jobs=-1,
)


search.fit(
    X_train,
    y_train,
)


model = search.best_estimator_


print("=" * 60)
print("TRAINING COMPLETE")
print("=" * 60)

print("Best Parameters:")
print(search.best_params_)

print(
    f"Best CV MAE: "
    f"{-search.best_score_:.4f}"
)


best_parameters = {
    key.replace("model__", ""): value
    for key, value in search.best_params_.items()
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


predictions = model.predict(X_test)

predictions = np.clip(
    predictions,
    0,
    None,
)


mae = mean_absolute_error(
    y_test,
    predictions,
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions,
    )
)

r2 = r2_score(
    y_test,
    predictions,
)


print("=" * 60)
print("DELAY MODEL PERFORMANCE")
print("=" * 60)

print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R²   : {r2:.4f}")


metrics = {
    "MAE": float(mae),
    "RMSE": float(rmse),
    "R2": float(r2),
    "training_samples": int(len(X_train)),
    "testing_samples": int(len(X_test)),
    "features": FEATURES,
    "categorical_features": CATEGORICAL_FEATURES,
    "numerical_features": NUMERICAL_FEATURES,
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


joblib.dump(
    model,
    MODEL_PATH,
)


print(
    f"Model saved:\n{MODEL_PATH}"
)


xgb_model = model.named_steps["model"]

encoded_feature_names = (
    model
    .named_steps["preprocessor"]
    .get_feature_names_out()
)

importance = pd.Series(
    xgb_model.feature_importances_,
    index=encoded_feature_names,
).sort_values(
    ascending=False
)


print("=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

print(
    importance.head(20).to_string()
)


plt.figure(
    figsize=(12, 8)
)

importance.head(15).sort_values().plot(
    kind="barh"
)

plt.title(
    "Delay Prediction Feature Importance"
)

plt.xlabel(
    "Importance"
)

plt.tight_layout()

plt.savefig(
    FEATURE_IMPORTANCE_PATH,
    dpi=300,
    bbox_inches="tight",
)

plt.close()


print(
    f"Feature importance saved:\n"
    f"{FEATURE_IMPORTANCE_PATH}"
)

print("=" * 60)
print("DELAY MODEL TRAINING COMPLETED")
print("=" * 60)

print("ML Target:")
print("  ✓ actual_departure_delay_min")

print("Categorical encoding:")
print("  ✓ OneHotEncoder")

print("Saved files:")
print("  ✓ delay_xgboost.pkl")
print("  ✓ delay_metrics.json")
print("  ✓ delay_best_parameters.json")
print("  ✓ delay_feature_importance.png")