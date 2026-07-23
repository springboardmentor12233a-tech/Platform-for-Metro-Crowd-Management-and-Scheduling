import pandas as pd
import joblib
import numpy as np

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

# ==========================
# Load Dataset
# ==========================
df = pd.read_excel("dataset/delhi_metro_featured_final.csv.xlsx")

print("First 5 Rows")
print(df.head())

print("\nDataset Information")
print(df.info())

# ==========================
# Encode Categorical Columns
# ==========================
text_columns = [
    "From_Station",
    "To_Station",
    "Ticket_Type",
    "Remarks",
    "Month_Name",
    "Day_Name",
    "Route",
    "Capacity Status",
    "AI Recommendation",
    "Recommended Frequency",
    "Delay Risk"
]

encoders = {}

for col in text_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

# Save Label Encoders
joblib.dump(encoders, "model/label_encoders.pkl")

# ==========================
# Dataset Analysis
# ==========================
print("\nPassenger Statistics")
print(df["Passengers"].describe())

print("\nPassenger Distribution")
print(df["Passengers"].value_counts().head(20))

print("\nCorrelation with Passengers")
print(df.corr(numeric_only=True)["Passengers"])

# ==========================
# Features and Target
# ==========================
X = df[
    [
        "From_Station",
        "To_Station",
        "Distance_km",
        "Fare",
        "Cost_per_passenger",
        "Ticket_Type",
        "Year",
        "Month",
        "Day",
        "Day_Name",
        "Is_Weekend",
        "Route",
    ]
]

y = df["Passengers"]

# ==========================
# Train-Test Split
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)

# ==========================
# Train Model
# ==========================
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
)

model.fit(X_train, y_train)

# ==========================
# Predictions
# ==========================
predictions = model.predict(X_test)

# ==========================
# Evaluation
# ==========================
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print("\n========== MODEL PERFORMANCE ==========")
print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R²   : {r2:.4f}")

# ==========================
# Save Model
# ==========================
joblib.dump(model, "model/passenger_prediction_model.pkl")

print("\nModel Saved Successfully!")
print("Label Encoders Saved Successfully!")