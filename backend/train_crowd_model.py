import os
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "MetroFlow_Dataset.xlsx"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "..",
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "metro_crowd_model.pkl"
)


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("METROFLOW AI CROWD MODEL TRAINING")
print("=" * 60)

print("\nLoading dataset...")

df = pd.read_excel(DATA_PATH)

print("Rows:", len(df))
print("Columns:", len(df.columns))


# ============================================================
# DATE + TIME PROCESSING
# ============================================================

df["Date"] = pd.to_datetime(
    df["Date"],
    errors="coerce"
)

df["Time"] = pd.to_datetime(
    df["Time"].astype(str),
    format="%H:%M",
    errors="coerce"
)

df = df.dropna(
    subset=["Date", "Time", "Passenger_Count"]
).copy()


# ============================================================
# FEATURE ENGINEERING
# ============================================================

df["Year"] = df["Date"].dt.year

df["Month"] = df["Date"].dt.month

df["Day_of_Month"] = df["Date"].dt.day

df["Day_of_Week"] = df["Date"].dt.dayofweek

df["Hour"] = df["Time"].dt.hour

df["Minute"] = df["Time"].dt.minute

df["Time_in_Minutes"] = (
    df["Hour"] * 60
    + df["Minute"]
)

df["Is_Weekend_Calc"] = (
    df["Day_of_Week"] >= 5
).astype(int)


# ============================================================
# SORT CHRONOLOGICALLY
# ============================================================

df = df.sort_values(
    ["Date", "Time"]
).reset_index(drop=True)


# ============================================================
# FEATURES
# ============================================================

categorical_features = [
    "Station",
    "Weather"
]

numeric_features = [
    "Year",
    "Month",
    "Day_of_Month",
    "Day_of_Week",
    "Hour",
    "Minute",
    "Time_in_Minutes",
    "Is_Holiday",
    "Is_Weekend_Calc"
]


FEATURES = (
    categorical_features
    + numeric_features
)

TARGET = "Passenger_Count"


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = FEATURES + [TARGET]

missing_columns = [
    col
    for col in required_columns
    if col not in df.columns
]

if missing_columns:

    raise ValueError(
        "Missing required columns: "
        + str(missing_columns)
    )


# ============================================================
# REMOVE MISSING VALUES
# ============================================================

model_df = df[
    required_columns
].dropna().copy()


print("\nTraining features:")

for feature in FEATURES:
    print(" -", feature)

print("\nTarget:", TARGET)

print("Usable rows:", len(model_df))


# ============================================================
# TIME-AWARE TRAIN / TEST SPLIT
# ============================================================

# 80% earliest observations for training
# 20% latest observations for testing

split_index = int(
    len(model_df) * 0.80
)

X = model_df[FEATURES]

y = model_df[TARGET]

X_train = X.iloc[:split_index]

X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]

y_test = y.iloc[split_index:]


print("\nTrain rows:", len(X_train))

print("Test rows:", len(X_test))

print(
    "Training target date range:",
    df["Date"].iloc[0].date(),
    "to",
    df["Date"].iloc[split_index - 1].date()
)

print(
    "Testing target date range:",
    df["Date"].iloc[split_index].date(),
    "to",
    df["Date"].iloc[-1].date()
)


# ============================================================
# PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[

        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),

        (
            "numeric",
            "passthrough",
            numeric_features
        )

    ]
)


# ============================================================
# RANDOM FOREST MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=18,
    min_samples_leaf=2,
    min_samples_split=4,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# COMPLETE PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[

        (
            "preprocessor",
            preprocessor
        ),

        (
            "model",
            model
        )

    ]
)


# ============================================================
# TRAIN
# ============================================================

print("\nTraining Random Forest...")

pipeline.fit(
    X_train,
    y_train
)

print("Training completed.")


# ============================================================
# PREDICTION
# ============================================================

print("\nEvaluating model...")

predictions = pipeline.predict(
    X_test
)


# ============================================================
# METRICS
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)


print("\n" + "=" * 60)

print("MODEL PERFORMANCE")

print("=" * 60)

print(
    f"MAE  : {mae:.2f}"
)

print(
    f"RMSE : {rmse:.2f}"
)

print(
    f"R²   : {r2:.4f}"
)


# ============================================================
# SAMPLE PREDICTIONS
# ============================================================

comparison = pd.DataFrame({

    "Actual": y_test.values[:10],

    "Predicted": np.round(
        predictions[:10],
        2
    )

})

print("\nSample Predictions:")

print(
    comparison.to_string(
        index=False
    )
)


# ============================================================
# SAVE MODEL
# ============================================================

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

joblib.dump(
    pipeline,
    MODEL_PATH
)


print("\n" + "=" * 60)

print(
    "MODEL SAVED:"
)

print(
    MODEL_PATH
)

print("=" * 60)