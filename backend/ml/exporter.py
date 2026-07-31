"""
MetroFlow ML — Model Exporter
Saves trained models to disk and registers metadata in PostgreSQL.
"""

import os
import joblib
from sklearn.ensemble import GradientBoostingRegressor

from ml.config import MODELS_DIR, MODEL_VERSION


def save_model(model: GradientBoostingRegressor, name: str) -> str:
    """
    Save a model to the models_ml directory.

    Returns the filename (relative path for DB storage).
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    filename = f"crowd_xgb_{name}_{MODEL_VERSION}.joblib"
    path = os.path.join(MODELS_DIR, filename)
    joblib.dump(model, path)

    size_kb = os.path.getsize(path) / 1024
    print(f"[Exporter] Saved {filename} ({size_kb:.0f} KB)")
    return filename


def register_model(conn, name: str, target_metric: str, metrics: dict, filename: str):
    """Register a trained model in the prediction_models table."""
    model_name = f"crowd_xgb_{name}_{MODEL_VERSION}"
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO prediction_models
            (name, model_type, target_metric, version,
             accuracy_score, rmse, model_path, is_active, trained_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, NOW())
        ON CONFLICT DO NOTHING
        """,
        (
            model_name, "gradient_boosting", target_metric, MODEL_VERSION,
            float(round(metrics["r2"], 4)), float(round(metrics["rmse"], 4)),
            f"models_ml/{filename}",
        ),
    )
    conn.commit()
    cursor.close()
    print(f"[Exporter] Registered {model_name} in prediction_models table")


def export_and_register(
    model_1h: GradientBoostingRegressor,
    model_4h: GradientBoostingRegressor,
    results: dict,
    conn,
):
    """
    Save both models and register them in the database.

    Args:
        model_1h: Trained 1-hour prediction model.
        model_4h: Trained 4-hour prediction model.
        results: Dict with '1h' and '4h' evaluation metrics.
        conn: psycopg2 database connection.
    """
    print(f"\n[Exporter] Exporting models to {MODELS_DIR}/")

    file_1h = save_model(model_1h, "1h")
    file_4h = save_model(model_4h, "4h")

    register_model(conn, "1h", "entry_count_1h", results["1h"], file_1h)
    register_model(conn, "4h", "entry_count_4h", results["4h"], file_4h)

    print("[Exporter] Done ✅")
