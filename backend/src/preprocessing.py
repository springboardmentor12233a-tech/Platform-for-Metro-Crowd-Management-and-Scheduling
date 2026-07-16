import pandas as pd
import os
import joblib

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

# ------------------------------------
# Load Dataset
# ------------------------------------
dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 50)
print("DATASET LOADED SUCCESSFULLY")
print("=" * 50)

# ------------------------------------
# Remove Duplicates
# ------------------------------------
duplicates = df.duplicated().sum()
print(f"Duplicate Rows : {duplicates}")

df = df.drop_duplicates()

# ------------------------------------
# Handle Missing Values
# ------------------------------------
print("\nMissing Values Before:")
print(df.isnull().sum())

df = df.ffill()

print("\nMissing Values After:")
print(df.isnull().sum())

# ------------------------------------
# Encode Categorical Columns
# ------------------------------------
label_encoders = {}

categorical_columns = df.select_dtypes(include="object").columns

for column in categorical_columns:
    encoder = LabelEncoder()
    df[column] = encoder.fit_transform(df[column].astype(str))
    label_encoders[column] = encoder

print("\nCategorical Columns Encoded Successfully")

# ------------------------------------
# Features and Target
# ------------------------------------
X = df.drop("Crowd_Level", axis=1)
y = df["Crowd_Level"]

print("\nFeature Shape :", X.shape)
print("Target Shape :", y.shape)

# ------------------------------------
# Feature Scaling
# ------------------------------------
scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# ------------------------------------
# Train Test Split
# ------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Data :", X_train.shape)
print("Testing Data :", X_test.shape)

# ------------------------------------
# Save Scaler
# ------------------------------------
os.makedirs("../models", exist_ok=True)

joblib.dump(scaler, "../models/scaler.pkl")

print("\nScaler Saved Successfully")

# ------------------------------------
# Save Processed Dataset
# ------------------------------------
processed = pd.DataFrame(X_scaled, columns=X.columns)
processed["Crowd_Level"] = y.values

os.makedirs("../outputs", exist_ok=True)

processed.to_csv("../outputs/processed_dataset.csv", index=False)

print("Processed Dataset Saved")

print("\nPREPROCESSING COMPLETED SUCCESSFULLY")