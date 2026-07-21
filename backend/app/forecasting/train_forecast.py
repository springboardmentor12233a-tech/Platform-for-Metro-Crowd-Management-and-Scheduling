import joblib
import pandas as pd

from sqlalchemy import create_engine

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# ==========================
# Database Connection
# ==========================

DATABASE_URL = "postgresql://postgres:2709@localhost:5432/metroflow"

engine = create_engine(DATABASE_URL)

# ==========================
# Load Data
# ==========================

query = """
SELECT
    trip_date,
    from_station,
    SUM(passengers) AS total_passengers
FROM trip_records
GROUP BY trip_date, from_station
ORDER BY trip_date;
"""

df = pd.read_sql(query, engine)

print("=" * 50)
print("Dataset Loaded Successfully")
print("=" * 50)
print(df.head())
print()

# ==========================
# Feature Engineering
# ==========================

df["trip_date"] = pd.to_datetime(df["trip_date"])

df["year"] = df["trip_date"].dt.year
df["month"] = df["trip_date"].dt.month
df["day"] = df["trip_date"].dt.day
df["day_of_week"] = df["trip_date"].dt.dayofweek

# ==========================
# Features & Target
# ==========================

X = df[
    [
        "from_station",
        "year",
        "month",
        "day",
        "day_of_week",
    ]
]

y = df["total_passengers"]

# ==========================
# Preprocessing
# ==========================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "station",
            OneHotEncoder(handle_unknown="ignore"),
            ["from_station"],
        ),
        (
            "date",
            "passthrough",
            [
                "year",
                "month",
                "day",
                "day_of_week",
            ],
        ),
    ]
)

# ==========================
# Model
# ==========================

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
)

pipeline = Pipeline(
    [
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)

# ==========================
# Train/Test Split
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

print("=" * 50)
print("Training Forecast Model...")
print("=" * 50)

pipeline.fit(X_train, y_train)

# ==========================
# Evaluation
# ==========================

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print()
print("=" * 50)
print("Forecast Model Trained Successfully")
print("=" * 50)

print(f"MAE      : {mae:.2f}")
print(f"R2 Score : {r2:.4f}")

# ==========================
# Save Model
# ==========================

joblib.dump(
    pipeline,
    "app/forecasting/forecast_model.pkl",
)

print()
print("Forecast Model Saved Successfully!")