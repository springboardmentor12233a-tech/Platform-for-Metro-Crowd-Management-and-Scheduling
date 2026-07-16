import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# ----------------------------------
# Load Dataset
# ----------------------------------
df = pd.read_excel("../data/MetroFlow_Dataset.xlsx")

print("=" * 60)
print("PASSENGER DEMAND FORECASTING")
print("=" * 60)

# ----------------------------------
# Encode Categorical Columns
# ----------------------------------
categorical_columns = df.select_dtypes(include=["object", "string"]).columns
encoders = {}

for col in categorical_columns:
    encoder = LabelEncoder()
    df[col] = encoder.fit_transform(df[col].astype(str))
    encoders[col] = encoder

# ----------------------------------
# Features and Target
# ----------------------------------
X = df.drop("Passenger_Count", axis=1)

y = df["Passenger_Count"]

# ----------------------------------
# Split Dataset
# ----------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# ----------------------------------
# Train Model
# ----------------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# ----------------------------------
# Prediction
# ----------------------------------
predictions = model.predict(X_test)

# ----------------------------------
# Evaluation
# ----------------------------------
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"Mean Absolute Error : {mae:.2f}")
print(f"R2 Score : {r2:.4f}")

# ----------------------------------
# Save Model
# ----------------------------------
os.makedirs("../models", exist_ok=True)

joblib.dump(model, "../models/forecast_model.pkl")

print("\nForecast Model Saved Successfully")