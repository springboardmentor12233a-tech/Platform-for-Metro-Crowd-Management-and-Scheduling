import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# ----------------------------
# Paths
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FILE = os.path.join(
    BASE_DIR,
    "processed_data",
    "processed_synthetic.csv"
)

MODEL_FILE = os.path.join(
    BASE_DIR,
    "models",
    "crowd_prediction.pkl"
)

# ----------------------------
# Load Dataset
# ----------------------------
print("Loading processed dataset...")

df = pd.read_csv(DATA_FILE)

print(df.shape)

# ----------------------------
# Features
# ----------------------------
X = df[
    [
        "Hour",
        "Day_Name",
        "Month",
        "Is_Holiday",
        "Weather",
        "From_Station",
        "To_Station",
        "Distance_km",
        "Ticket_Type",
        "Is_Interchange"
    ]
]

y = df["Passenger_Count"]

# ----------------------------
# Train Test Split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ----------------------------
# Train Model
# ----------------------------
print("\nTraining model...")

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# ----------------------------
# Predictions
# ----------------------------
predictions = model.predict(X_test)

# ----------------------------
# Evaluation
# ----------------------------
mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\nModel Performance")
print("-" * 40)
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")

# ----------------------------
# Feature Importance
# ----------------------------
print("\nFeature Importance")
print("-" * 40)

importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print(importance)

# ----------------------------
# Save Model
# ----------------------------
joblib.dump(model, MODEL_FILE)

print("\nModel saved successfully!")
print(MODEL_FILE)