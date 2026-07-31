"""
MetroFlow ML — Model Trainer
Handles train/test split, model training, and evaluation.
"""

import time
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from ml.config import FEATURES, MODEL_PARAMS, SPLIT_DATE


def split_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Time-based train/test split to prevent data leakage.

    Returns (train_df, test_df).
    """
    train = df[df["timestamp"] < SPLIT_DATE]
    test = df[df["timestamp"] >= SPLIT_DATE]

    print(f"\n[Trainer] Split at {SPLIT_DATE}")
    print(f"          Train: {len(train):,} rows ({len(train)/len(df)*100:.1f}%)")
    print(f"          Test:  {len(test):,} rows ({len(test)/len(df)*100:.1f}%)")
    return train, test


def train_model(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    label: str,
) -> GradientBoostingRegressor:
    """Train a single Gradient Boosting model."""
    t0 = time.time()
    model = GradientBoostingRegressor(**MODEL_PARAMS)
    model.fit(X_train, y_train)
    elapsed = time.time() - t0
    print(f"[Trainer] {label} model trained in {elapsed:.1f}s")
    return model


def train_models(
    train: pd.DataFrame,
) -> tuple[GradientBoostingRegressor, GradientBoostingRegressor]:
    """
    Train both 1-hour and 4-hour prediction models.

    Returns (model_1h, model_4h).
    """
    print(f"\n[Trainer] Training models with {len(FEATURES)} features...")
    X_train = train[FEATURES]

    model_1h = train_model(X_train, train["target_1h"], "1-hour")
    model_4h = train_model(X_train, train["target_4h"], "4-hour")

    return model_1h, model_4h


def evaluate_model(
    model: GradientBoostingRegressor,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    label: str,
) -> dict:
    """Evaluate a single model, return metrics dict."""
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"[Eval] {label} — MAE: {mae:.2f}, RMSE: {rmse:.2f}, R²: {r2:.4f}")
    return {"mae": mae, "rmse": rmse, "r2": r2}


def evaluate_models(
    model_1h: GradientBoostingRegressor,
    model_4h: GradientBoostingRegressor,
    test: pd.DataFrame,
) -> dict:
    """
    Evaluate both models on the test set.

    Returns dict with '1h' and '4h' metric dicts.
    """
    print(f"\n[Eval] Evaluating on {len(test):,} test rows...")
    X_test = test[FEATURES]

    results = {
        "1h": evaluate_model(model_1h, X_test, test["target_1h"], "1-hour"),
        "4h": evaluate_model(model_4h, X_test, test["target_4h"], "4-hour"),
    }

    # Feature importance
    print(f"\n[Eval] Top 5 features (1h model):")
    imp = pd.Series(model_1h.feature_importances_, index=FEATURES).sort_values(ascending=False)
    for feat, val in imp.head(5).items():
        print(f"         {feat:20s} {val:.4f}")

    return results
