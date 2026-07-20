import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_excel(
    r"C:\MetroFlow\dataset\multi-year-station-entry-and-exit-figures.xls",
    sheet_name="2017 Entry & Exit",
    header=6
)

print("Dataset Loaded Successfully!")

# Clean column names
df.columns = df.columns.astype(str).str.strip()

print("\nColumns:")
print(df.columns.tolist())

# -----------------------------
# Keep Required Columns
# -----------------------------
df = df[[
    "Station",
    "Weekday",
    "Saturday",
    "Sunday"
]]

# Remove missing values
df = df.dropna()

# Convert passenger columns to numeric
df["Weekday"] = pd.to_numeric(df["Weekday"], errors="coerce")
df["Saturday"] = pd.to_numeric(df["Saturday"], errors="coerce")
df["Sunday"] = pd.to_numeric(df["Sunday"], errors="coerce")

df = df.dropna()

# -----------------------------
# Convert Wide → Long
# -----------------------------
df = df.melt(
    id_vars="Station",
    value_vars=["Weekday", "Saturday", "Sunday"],
    var_name="Day_Type",
    value_name="Passengers"
)

# -----------------------------
# Create Demand Level
# -----------------------------
df["Demand_Level"] = pd.qcut(
    df["Passengers"],
    q=3,
    labels=["Low", "Medium", "High"]
)

print("\nDemand Distribution")
print(df["Demand_Level"].value_counts())

# -----------------------------
# Features
# -----------------------------
X = df[["Station", "Day_Type"]].copy()
y = df["Demand_Level"]

# -----------------------------
# Encode
# -----------------------------
station_encoder = LabelEncoder()
day_encoder = LabelEncoder()
demand_encoder = LabelEncoder()

X["Station"] = station_encoder.fit_transform(X["Station"])
X["Day_Type"] = day_encoder.fit_transform(X["Day_Type"])

y = demand_encoder.fit_transform(y)

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# Prediction
# -----------------------------
y_pred = model.predict(X_test)

print("\nAccuracy :", round(accuracy_score(y_test, y_pred) * 100, 2), "%")

print("\nClassification Report\n")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=demand_encoder.classes_
    )
)

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(model, "demand_model.pkl")
joblib.dump(station_encoder, "station_encoder.pkl")
joblib.dump(day_encoder, "day_encoder.pkl")
joblib.dump(demand_encoder, "demand_encoder.pkl")

print("\nDemand Forecast Model Saved Successfully!")