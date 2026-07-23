import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

STATION_MAP = {
    "HUB": 0, "NTH": 1, "APT": 2, "FID": 3, "TEC": 4, "UNI": 5, "OLD": 6, "STH": 7
}

WEATHER_MAP = {
    "Clear": 0, "Rainy": 1, "Snowy": 2, "Stormy": 3
}

def train_model():
    csv_path = "ml_pipeline/data/metro_crowd_data.csv"
    if not os.path.exists(csv_path):
        print(f"Error: Dataset {csv_path} not found. Generate it first.")
        return
        
    df = pd.read_csv(csv_path)
    
    # Preprocessing
    df['station_code_encoded'] = df['station_code'].map(STATION_MAP)
    
    features = [
        "station_code_encoded", 
        "hour_of_day", 
        "day_of_week", 
        "month", 
        "is_holiday", 
        "is_special_event", 
        "weather_code", 
        "lag_passenger_count"
    ]
    target = "passenger_count"
    
    # Handle any nulls (though synthetic should have none)
    df = df.dropna(subset=features + [target])
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training Random Forest Regressor on {len(X_train)} samples...")
    # Using 50 estimators to keep training quick and file size small while maintaining high accuracy
    model = RandomForestRegressor(n_estimators=50, max_depth=12, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluation
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Training Completed.")
    print(f"MAE: {mae:.2f} passengers")
    print(f"RMSE: {rmse:.2f} passengers")
    print(f"R-squared: {r2:.4f}")
    
    # Save directory
    os.makedirs("ml_pipeline/models", exist_ok=True)
    model_path = "ml_pipeline/models/crowd_model.pkl"
    
    model_artifact = {
        "model": model,
        "station_mapping": STATION_MAP,
        "weather_mapping": WEATHER_MAP,
        "features": features
    }
    
    joblib.dump(model_artifact, model_path)
    print(f"Model artifact successfully saved to {model_path}")
    
    # Compile Model Evaluation Report
    report = f"""# MetroFlow - Machine Learning Model Report

Generated on: {pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")}
Model Architecture: Random Forest Regressor (n_estimators=50, max_depth=12)

---

## 1. Evaluation Performance Metrics
The model is validated on a hold-out test set (20% split):

* **Mean Absolute Error (MAE)**: {mae:.2f} passengers
* **Root Mean Squared Error (RMSE)**: {rmse:.2f} passengers
* **Coefficient of Determination ($R^2$ Score)**: {r2:.4f}

*Interpretation: An $R^2$ of {r2:.4f} indicates that over {r2*100:.1f}% of the hourly variance in station passenger volumes is explained by the input features (hour, day of week, events, weather, and lag occupancy).*

---

## 2. Feature Importance Analysis
Relative contribution of each feature to crowd forecasts:
"""
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    report += "\n| Rank | Feature Name | Relative Importance % |\n| :---: | :--- | :---: |\n"
    for i, idx in enumerate(indices):
        report += f"| {i+1} | `{features[idx]}` | {importances[idx]*100:.2f}% |\n"
        
    report += """
---

## 3. Integration & Deployment Details
* **Inference Endpoint**: Embedded inside FastAPI startup lifecycle.
* **Loading Mechanism**: Auto-loads `ml_pipeline/models/crowd_model.pkl` on application boot.
* **Dynamic Refinement**: Predictions are mapped against station capacity. If predicted occupancy exceeds 85%, automated warning events are emitted into the dashboard in real-time.
"""
    
    os.makedirs("docs", exist_ok=True)
    with open("docs/model_report.md", "w") as f:
        f.write(report)
    print("Model report written to docs/model_report.md")

if __name__ == "__main__":
    train_model()
