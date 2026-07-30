import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# -------------------------
# Load Dataset
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET = BASE_DIR / "datasets" / "metro_crowd" / "delhi_metro_updated.csv"
print("BASE_DIR:", BASE_DIR)
print("DATASET:", DATASET)
print("EXISTS:", DATASET.exists())

df = pd.read_csv(DATASET)

print("Dataset Loaded Successfully")
print(df.head())

# -------------------------
# Handle Missing Values
# -------------------------
df = df.ffill()

# -------------------------
# Convert Date
# -------------------------
df["Date"] = pd.to_datetime(df["Date"])

df["Day"] = df["Date"].dt.day
df["Month"] = df["Date"].dt.month
df["Year"] = df["Date"].dt.year

# -------------------------
# Encode Categorical Columns
# -------------------------
# Remove extra spaces
df["From_Station"] = df["From_Station"].astype(str).str.strip()
df["To_Station"] = df["To_Station"].astype(str).str.strip()
df["Ticket_Type"] = df["Ticket_Type"].astype(str).str.strip()

encoder = LabelEncoder()

df["From_Station"] = encoder.fit_transform(df["From_Station"])
df["To_Station"] = encoder.fit_transform(df["To_Station"])
df["Ticket_Type"] = encoder.fit_transform(df["Ticket_Type"])
# -------------------------
# Features & Target
# -------------------------
# -------------------------
# Features & Target
# -------------------------
X = df[
    [
        "From_Station",
        "To_Station",
        "Distance_km",
        "Fare",
        "Cost_per_passenger",
        "Ticket_Type",
        "Day",
        "Month",
    ]
]

y = df["Passengers"]

# -------------------------
# Train/Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Samples :", len(X_train))
print("Testing Samples :", len(X_test))

# -------------------------
# Train Random Forest Model
# -------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

print("\nTraining AI Model...")
model.fit(X_train, y_train)

print("Training Completed Successfully!")

# -------------------------
# Predictions
# -------------------------
predictions = model.predict(X_test)

# -------------------------
# Evaluation
# -------------------------
mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\n========== MODEL PERFORMANCE ==========")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R² Score : {r2:.4f}")

# -------------------------
# Save Model
# -------------------------
MODEL_DIR = BASE_DIR / "ml" / "models"
MODEL_DIR.mkdir(exist_ok=True)

MODEL_PATH = MODEL_DIR / "crowd_prediction_model.pkl"

joblib.dump(model, MODEL_PATH)

print("\nAI Model Saved Successfully!")
print(MODEL_PATH)
# -------------------------
# Train/Test Split
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# -------------------------
# Train Model
# -------------------------
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
)

model.fit(X_train, y_train)

# -------------------------
# Prediction
# -------------------------
predictions = model.predict(X_test)

# -------------------------
# Evaluation
# -------------------------
print("\nModel Performance")

print("MAE :", mean_absolute_error(y_test, predictions))

print("RMSE :", mean_squared_error(y_test, predictions) ** 0.5)

print("R2 Score :", r2_score(y_test, predictions))

# -------------------------
# Save Model
# -------------------------
MODEL_PATH = BASE_DIR / "ml" / "models" / "crowd_prediction_model.pkl"

joblib.dump(model, MODEL_PATH)

print("\nModel Saved Successfully!")
print(MODEL_PATH)