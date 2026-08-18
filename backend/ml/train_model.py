import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASET = (
    BASE_DIR
    / "datasets"
    / "metro_crowd"
    / "delhi_metro_updated.csv"
)

MODEL_DIR = BASE_DIR / "ml" / "models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "crowd_prediction_model.pkl"


print("BASE_DIR:", BASE_DIR)
print("DATASET:", DATASET)
print("EXISTS:", DATASET.exists())


# =========================================================
# LOAD DATASET
# =========================================================

df = pd.read_csv(DATASET)

print("\nDataset Loaded Successfully!")
print("Dataset Shape:", df.shape)

print("\nDataset Columns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())


# =========================================================
# HANDLE MISSING VALUES
# =========================================================

df = df.ffill()


# =========================================================
# DATE PROCESSING
# =========================================================

df["Date"] = pd.to_datetime(df["Date"])

df["Day"] = df["Date"].dt.day
df["Month"] = df["Date"].dt.month


# =========================================================
# FEATURES
# =========================================================

features = [
    "From_Station",
    "To_Station",
    "Distance_km",
    "Fare",
    "Cost_per_passenger",
    "Ticket_Type",
    "Day",
    "Month",
]

target = "Passengers"


X = df[features]
y = df[target]


print("\nMODEL FEATURES:")
print(features)

print("\nTARGET:")
print(target)


# =========================================================
# CATEGORICAL FEATURES
# =========================================================

categorical_features = [
    "From_Station",
    "To_Station",
    "Ticket_Type",
]


numeric_features = [
    "Distance_km",
    "Fare",
    "Cost_per_passenger",
    "Day",
    "Month",
]


# =========================================================
# PREPROCESSING
# =========================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features,
        ),
        (
            "numeric",
            "passthrough",
            numeric_features,
        ),
    ]
)


# =========================================================
# MODEL
# =========================================================

model = RandomForestRegressor(
    n_estimators=50,
    random_state=42,
    n_jobs=-1,
)


# =========================================================
# PIPELINE
# =========================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)


# =========================================================
# TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)


print("\nTraining Samples:", len(X_train))
print("Testing Samples:", len(X_test))


# =========================================================
# TRAIN
# =========================================================

print("\nTraining AI Model...")

pipeline.fit(
    X_train,
    y_train,
)

print("Training Completed Successfully!")


# =========================================================
# PREDICTION
# =========================================================

predictions = pipeline.predict(X_test)


# =========================================================
# EVALUATION
# =========================================================

mae = mean_absolute_error(
    y_test,
    predictions,
)

rmse = mean_squared_error(
    y_test,
    predictions,
) ** 0.5

r2 = r2_score(
    y_test,
    predictions,
)


print("\n================================")
print("MODEL PERFORMANCE")
print("================================")

print("MAE :", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2 Score:", round(r2, 4))


# =========================================================
# SAVE MODEL
# =========================================================

joblib.dump(
    pipeline,
    MODEL_PATH,
)


print("\n================================")
print("AI MODEL SAVED SUCCESSFULLY!")
print("================================")

print(MODEL_PATH)