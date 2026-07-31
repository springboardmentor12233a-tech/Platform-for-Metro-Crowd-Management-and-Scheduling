"""
MetroFlow — Crowd Forecasting Model Training Script
====================================================
Thin orchestrator that calls the ml/ modules.

Usage:
    cd backend
    uv run python scripts/train_crowd_model.py
"""

import sys
import os

# Ensure backend/ is on the import path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import psycopg2
from ml.config import DB_URL
from ml.data_loader import extract_data
from ml.cleaner import clean_data
from ml.features import engineer_features
from ml.trainer import split_data, train_models, evaluate_models
from ml.exporter import export_and_register


def main():
    print("=" * 60)
    print("  MetroFlow — Crowd Forecasting Model Training")
    print("=" * 60)

    conn = psycopg2.connect(DB_URL)

    try:
        # Pipeline: extract → clean → features → split → train → evaluate → export
        df = extract_data(conn)
        df = clean_data(df)
        df = engineer_features(df)
        train, test = split_data(df)
        model_1h, model_4h = train_models(train)
        results = evaluate_models(model_1h, model_4h, test)
        export_and_register(model_1h, model_4h, results, conn)
    finally:
        conn.close()

    print("\n" + "=" * 60)
    print("  ✅ Training pipeline complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
