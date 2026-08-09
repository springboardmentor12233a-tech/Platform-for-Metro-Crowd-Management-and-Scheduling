import os
import json
import joblib
import sqlite3
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
DB_PATH = os.path.join(BASE_DIR, "metroflow.db")

os.makedirs(MODEL_DIR, exist_ok=True)

def train_models():
    print("=" * 60)
    print("AI MetroFlow: Training AI Prediction & Forecasting Models")
    print("=" * 60)

    # 1. Load Data from SQLite DB
    conn = sqlite3.connect(DB_PATH)
    
    flow_df = pd.read_sql_query("SELECT * FROM passenger_flow", conn)
    occ_df = pd.read_sql_query("SELECT * FROM train_occupancy", conn)
    conn.close()

    print(f"Loaded {len(flow_df):,} passenger flow records.")
    print(f"Loaded {len(occ_df):,} train occupancy records.")

    # -------------------------------------------------------------
    # MODEL 1: PASSENGER DEMAND FORECASTING (GradientBoostingRegressor)
    # -------------------------------------------------------------
    print("\n--- Training Model 1: Passenger Demand Forecaster ---")
    
    # Feature Engineering
    flow_df['Date'] = pd.to_datetime(flow_df['date'], errors='coerce')
    flow_df['hour'] = pd.to_datetime(flow_df['time'], format='%H:%M', errors='coerce').dt.hour.fillna(12).astype(int)
    flow_df['day_of_week'] = flow_df['Date'].dt.dayofweek.fillna(0).astype(int)
    flow_df['month'] = flow_df['Date'].dt.month.fillna(1).astype(int)

    encoders = {}
    for cat_col in ['station', 'line', 'weather', 'day']:
        le = LabelEncoder()
        flow_df[cat_col] = flow_df[cat_col].astype(str)
        flow_df[cat_col + '_encoded'] = le.fit_transform(flow_df[cat_col])
        encoders[cat_col] = le

    feature_cols = ['station_encoded', 'line_encoded', 'weather_encoded', 'day_encoded', 'hour', 'day_of_week', 'month']
    X_demand = flow_df[feature_cols]
    y_demand = flow_df['entry_count']

    X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_demand, y_demand, test_size=0.2, random_state=42)

    demand_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    demand_model.fit(X_train_d, y_train_d)

    preds_d = demand_model.predict(X_test_d)
    mae_d = mean_absolute_error(y_test_d, preds_d)
    rmse_d = np.sqrt(mean_squared_error(y_test_d, preds_d))
    r2_d = r2_score(y_test_d, preds_d)

    print(f"Demand Model Results:")
    print(f"  - MAE: {mae_d:.2f} entries/min")
    print(f"  - RMSE: {rmse_d:.2f}")
    print(f"  - R² Score: {r2_d:.4f}")

    # -------------------------------------------------------------
    # MODEL 2: CROWD LEVEL & OCCUPANCY CLASSIFIER (RandomForestClassifier)
    # -------------------------------------------------------------
    print("\n--- Training Model 2: Crowd Level Classifier ---")
    
    le_crowd = LabelEncoder()
    occ_df['crowd_level_encoded'] = le_crowd.fit_transform(occ_df['crowd_level'].astype(str))
    encoders['crowd_level'] = le_crowd

    le_line_occ = LabelEncoder()
    occ_df['line_encoded'] = le_line_occ.fit_transform(occ_df['line'].astype(str))
    encoders['occ_line'] = le_line_occ

    X_crowd = occ_df[['passenger_count', 'occupancy_percent', 'line_encoded']]
    y_crowd = occ_df['crowd_level_encoded']

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_crowd, y_crowd, test_size=0.2, random_state=42)

    crowd_model = RandomForestClassifier(n_estimators=100, random_state=42)
    crowd_model.fit(X_train_c, y_train_c)

    preds_c = crowd_model.predict(X_test_c)
    acc_c = accuracy_score(y_test_c, preds_c)

    print(f"Crowd Classifier Results:")
    print(f"  - Accuracy: {acc_c * 100:.2f}%")

    # Save artifacts
    print("\nSaving trained models and encoders to backend/models/...")
    joblib.dump(demand_model, os.path.join(MODEL_DIR, "demand_model.pkl"))
    joblib.dump(crowd_model, os.path.join(MODEL_DIR, "crowd_model.pkl"))
    joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))

    metrics = {
        "demand_model": {
            "mae": round(float(mae_d), 2),
            "rmse": round(float(rmse_d), 2),
            "r2_score": round(float(r2_d), 4)
        },
        "crowd_model": {
            "accuracy": round(float(acc_c * 100), 2)
        }
    }

    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print("Model training completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    train_models()
