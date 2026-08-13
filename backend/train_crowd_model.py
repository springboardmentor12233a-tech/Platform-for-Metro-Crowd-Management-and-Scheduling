from pathlib import Path
import json
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed_station_demand.csv"
)

MODEL_DIR = BASE_DIR / "models"

MODEL_FILE = (
    MODEL_DIR
    / "crowd_prediction_model.joblib"
)

METADATA_FILE = (
    MODEL_DIR
    / "model_metadata.json"
)


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("METROFLOW CROWD PREDICTION MODEL TRAINING")
print("=" * 60)

print("\nLoading processed dataset...")

df = pd.read_csv(DATA_FILE)

df["Date"] = pd.to_datetime(
    df["Date"],
    errors="coerce"
)

df = df.dropna(
    subset=[
        "Date",
        "station",
        "passenger_demand"
    ]
)

print("Rows:", len(df))
print("Stations:", df["station"].nunique())


# ============================================================
# SORT BY DATE
# ============================================================

df = df.sort_values(
    "Date"
).reset_index(drop=True)


# ============================================================
# FEATURES
# ============================================================

features = [
    "station",
    "day_of_week",
    "day",
    "month",
    "year",
    "is_weekend"
]

target = "passenger_demand"


X = df[features]
y = df[target]


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

split_index = int(
    len(df) * 0.80
)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))


# ============================================================
# PREPROCESSOR
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "station",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            ["station"]
        )
    ],
    remainder="passthrough"
)


# ============================================================
# RANDOM FOREST MODEL
# ============================================================

model = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),

        (
            "regressor",
            RandomForestRegressor(
                n_estimators=250,
                random_state=42,
                n_jobs=-1,
                min_samples_leaf=2
            )
        )
    ]
)


# ============================================================
# TRAIN
# ============================================================

print("\nTraining Random Forest model...")

model.fit(
    X_train,
    y_train
)


print("Training completed.")


# ============================================================
# PREDICTION
# ============================================================

print("\nEvaluating model...")

predictions = model.predict(
    X_test
)


# ============================================================
# METRICS
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)


print("\n" + "=" * 60)
print("MODEL RESULTS")
print("=" * 60)

print(
    f"MAE : {mae:.2f}"
)

print(
    f"R2  : {r2:.4f}"
)


# ============================================================
# SAVE MODEL
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


joblib.dump(
    model,
    MODEL_FILE
)


print("\nModel saved to:")

print(
    MODEL_FILE
)


# ============================================================
# SAVE METADATA
# ============================================================

metadata = {

    "model":
        "RandomForestRegressor",

    "dataset":
        "processed_station_demand.csv",

    "rows":
        int(len(df)),

    "stations":
        int(df["station"].nunique()),

    "features":
        features,

    "target":
        target,

    "train_rows":
        int(len(X_train)),

    "test_rows":
        int(len(X_test)),

    "mae":
        float(mae),

    "r2":
        float(r2),

    "crowd_levels":
        sorted(
            df["crowd_level"]
            .dropna()
            .unique()
            .tolist()
        ),

    "note":
        "The p90 demand value is a historical demand proxy and is not physical station capacity."
}


with open(
    METADATA_FILE,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        metadata,
        f,
        indent=4
    )


print("\nMetadata saved to:")

print(
    METADATA_FILE
)


print("\nTraining completed successfully.")