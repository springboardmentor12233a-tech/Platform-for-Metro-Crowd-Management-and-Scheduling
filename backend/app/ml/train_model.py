import pandas as pd
import joblib

from sqlalchemy import create_engine

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

DATABASE_URL = "postgresql://postgres:2709@localhost:5432/metroflow"

engine = create_engine(DATABASE_URL)

print("Loading data from PostgreSQL...")

df = pd.read_sql("SELECT * FROM trip_records", engine)

print(f"Dataset Shape: {df.shape}")

# -------------------------
# Features & Target
# -------------------------

X = df[
    [
        "from_station",
        "to_station",
        "distance_km",
        "fare",
        "cost_per_passenger",
        "ticket_type",
        "remarks",
    ]
]

y = df["passengers"]

# -------------------------
# Preprocessing
# -------------------------

categorical_features = [
    "from_station",
    "to_station",
    "ticket_type",
    "remarks",
]

numeric_features = [
    "distance_km",
    "fare",
    "cost_per_passenger",
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features,
        ),
        (
            "num",
            "passthrough",
            numeric_features,
        ),
    ]
)

# -------------------------
# Model
# -------------------------
model = RandomForestRegressor(
    n_estimators=20,
    random_state=42,
    n_jobs=-1,
)

pipeline = Pipeline(
    [
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)

# -------------------------
# Train/Test Split
# -------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print("Training Model...")

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("=" * 50)
print("Model Training Completed Successfully")
print("=" * 50)

print(f"MAE : {mae:.2f}")
print(f"R2 Score : {r2:.4f}")

joblib.dump(pipeline, "app/ml/passenger_prediction_model.pkl")

print("\nModel Saved Successfully!")