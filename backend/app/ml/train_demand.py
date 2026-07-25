import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# -----------------------------
# Load Dataset
# -----------------------------
df = pd.read_csv(r"C:\MetroFlow\dataset\delhi_metro_updated.csv")

print("Dataset Loaded Successfully!")
print(df.head())

# -----------------------------
# Remove Missing Values
# -----------------------------
df = df.dropna()

# -----------------------------
# Convert Date Column
# -----------------------------
df["Date"] = pd.to_datetime(df["Date"], dayfirst=True) 

# -----------------------------
# Feature Engineering
# -----------------------------
df["Month"] = df["Date"].dt.month
df["Day"] = df["Date"].dt.day
df["DayOfWeek"] = df["Date"].dt.dayofweek

df["DayType"] = df["DayOfWeek"].apply(
    lambda x: "Weekend" if x >= 5 else "Weekday"
)

# -----------------------------
# Encode Categorical Columns
# -----------------------------
station_encoder = LabelEncoder()
day_encoder = LabelEncoder()

df["From_Station"] = station_encoder.fit_transform(df["From_Station"])
df["DayType"] = day_encoder.fit_transform(df["DayType"])

# -----------------------------
# Features & Target
# -----------------------------
X = df[
    [
        "From_Station",
        "Month",
        "Day",
        "DayOfWeek",
        "DayType",
    ]
]

y = df["Passengers"]

# -----------------------------
# Train Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# -----------------------------
# Train Model
# -----------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# -----------------------------
# Prediction
# -----------------------------
predictions = model.predict(X_test)

# -----------------------------
# Evaluation
# -----------------------------
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n==============================")
print("Mean Absolute Error :", round(mae, 2))
print("R2 Score            :", round(r2, 2))
print("==============================")

# -----------------------------
# Save Model
# -----------------------------
joblib.dump(model, "demand_model.pkl")
joblib.dump(station_encoder, "station_encoder.pkl")
joblib.dump(day_encoder, "day_encoder.pkl")

print("\nDemand Forecast Model Saved Successfully!")

print("Files Created:")
print("demand_model.pkl")
print("station_encoder.pkl")
print("day_encoder.pkl")