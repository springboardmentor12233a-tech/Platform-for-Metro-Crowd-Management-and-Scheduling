import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score

def train_ml_pipeline():
    print("[+] Starting ML Pipeline Model Training for AI MetroFlow...")
    
    # Target directories
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, "datasets", "public_transport_delays.csv")
    output_dir = os.path.join(base_dir, "ml", "models")
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate expanded synthetic training dataset if dataset has few rows
    if os.path.exists(dataset_path):
        raw_df = pd.read_csv(dataset_path)
    else:
        raw_df = pd.DataFrame()
        
    np.random.seed(42)
    n_samples = 1500
    
    hours = np.random.randint(5, 23, n_samples)
    days = np.random.randint(0, 7, n_samples)
    is_weekend = (days >= 5).astype(int)
    is_peak = (((hours >= 8) & (hours <= 10)) | ((hours >= 17) & (hours <= 20))).astype(int)
    traffic_index = np.round(np.random.uniform(0.2, 0.98, n_samples), 2)
    weather_codes = np.random.choice([0, 1, 2], n_samples, p=[0.6, 0.25, 0.15]) # 0: Clear, 1: Rain, 2: Fog
    signal_issues = np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
    
    # Base demand calculation
    base_demand = 400 + (is_peak * 800) + (traffic_index * 500) - (is_weekend * 250) + np.random.normal(0, 100, n_samples)
    demand = np.clip(base_demand, 150, 2200).astype(int)
    
    # Delay minutes calculation
    delay_noise = np.random.exponential(scale=3, size=n_samples)
    delay_minutes = (traffic_index * 8) + (weather_codes * 6) + (signal_issues * 18) + (is_peak * 5) + delay_noise
    delay_minutes = np.round(np.clip(delay_minutes, 0, 45), 1)
    
    # Delay risk tier categorization
    delay_risk = []
    for dm in delay_minutes:
        if dm < 5:
            delay_risk.append("Green")
        elif dm < 12:
            delay_risk.append("Yellow")
        elif dm < 22:
            delay_risk.append("Orange")
        else:
            delay_risk.append("Red")
            
    df = pd.DataFrame({
        "hour": hours,
        "day_of_week": days,
        "is_weekend": is_weekend,
        "is_peak_hour": is_peak,
        "traffic_index": traffic_index,
        "weather_code": weather_codes,
        "signal_issue": signal_issues,
        "demand": demand,
        "delay_minutes": delay_minutes,
        "delay_risk": delay_risk
    })
    
    feature_cols = ["hour", "day_of_week", "is_weekend", "is_peak_hour", "traffic_index", "weather_code", "signal_issue"]
    X = df[feature_cols]
    
    # 1. Train Demand Model
    y_demand = df["demand"]
    X_train_dem, X_test_dem, y_train_dem, y_test_dem = train_test_split(X, y_demand, test_size=0.2, random_state=42)
    demand_model = RandomForestRegressor(n_estimators=100, random_state=42)
    demand_model.fit(X_train_dem, y_train_dem)
    dem_preds = demand_model.predict(X_test_dem)
    
    dem_mae = float(mean_absolute_error(y_test_dem, dem_preds))
    dem_rmse = float(np.sqrt(mean_squared_error(y_test_dem, dem_preds)))
    dem_r2 = float(r2_score(y_test_dem, dem_preds))
    
    # 2. Train Delay Regressor
    y_delay = df["delay_minutes"]
    X_train_del, X_test_del, y_train_del, y_test_del = train_test_split(X, y_delay, test_size=0.2, random_state=42)
    delay_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    delay_regressor.fit(X_train_del, y_train_del)
    del_preds = delay_regressor.predict(X_test_del)
    
    del_mae = float(mean_absolute_error(y_test_del, del_preds))
    del_rmse = float(np.sqrt(mean_squared_error(y_test_del, del_preds)))
    del_r2 = float(r2_score(y_test_del, del_preds))
    
    # 3. Train Delay Risk Classifier
    y_risk = df["delay_risk"]
    X_train_cls, X_test_cls, y_train_cls, y_test_cls = train_test_split(X, y_risk, test_size=0.2, random_state=42)
    delay_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    delay_classifier.fit(X_train_cls, y_train_cls)
    cls_preds = delay_classifier.predict(X_test_cls)
    
    cls_acc = float(accuracy_score(y_test_cls, cls_preds))
    
    # Save model artifacts
    joblib.dump(demand_model, os.path.join(output_dir, "demand_model.pkl"))
    joblib.dump(delay_regressor, os.path.join(output_dir, "delay_regressor.pkl"))
    joblib.dump(delay_classifier, os.path.join(output_dir, "delay_classifier.pkl"))
    
    metrics = {
        "demand_model": {
            "mae": round(dem_mae, 2),
            "rmse": round(dem_rmse, 2),
            "r2_score": round(dem_r2, 4),
            "feature_importances": dict(zip(feature_cols, [round(x, 4) for x in demand_model.feature_importances_]))
        },
        "delay_regressor": {
            "mae": round(del_mae, 2),
            "rmse": round(del_rmse, 2),
            "r2_score": round(del_r2, 4),
            "feature_importances": dict(zip(feature_cols, [round(x, 4) for x in delay_regressor.feature_importances_]))
        },
        "delay_classifier": {
            "accuracy": round(cls_acc, 4),
            "classes": list(delay_classifier.classes_),
            "feature_importances": dict(zip(feature_cols, [round(x, 4) for x in delay_classifier.feature_importances_]))
        }
    }
    
    with open(os.path.join(output_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"[SUCCESS] Trained and saved ML models to {output_dir}")
    print(f" -> Demand Model R2: {dem_r2:.4f}, MAE: {dem_mae:.2f}")
    print(f" -> Delay Regressor R2: {del_r2:.4f}, MAE: {del_mae:.2f}")
    print(f" -> Delay Classifier Accuracy: {cls_acc:.4f}")

if __name__ == "__main__":
    train_ml_pipeline()
