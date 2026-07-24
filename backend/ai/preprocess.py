import os
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# ----------------------------
# Paths
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "synthetic_crowd_data.csv"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "processed_data",
    "processed_synthetic.csv"
)

ENCODER_FILE = os.path.join(
    BASE_DIR,
    "models",
    "label_encoders.pkl"
)

# ----------------------------
# Load Dataset
# ----------------------------
print("Loading dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Dataset Shape: {df.shape}")

# ----------------------------
# Encode categorical columns
# ----------------------------
categorical_columns = [
    "Weather",
    "Day_Name",
    "From_Station",
    "To_Station",
    "Ticket_Type"
]

encoders = {}

for column in categorical_columns:
    encoder = LabelEncoder()
    df[column] = encoder.fit_transform(df[column])

    encoders[column] = encoder

# ----------------------------
# Save Encoders
# ----------------------------
joblib.dump(encoders, ENCODER_FILE)

# ----------------------------
# Save Processed Dataset
# ----------------------------
df.to_csv(OUTPUT_FILE, index=False)

print("\nPreprocessing Completed Successfully!")

print(f"Processed dataset saved to:\n{OUTPUT_FILE}")

print(f"\nEncoders saved to:\n{ENCODER_FILE}")

print("\nFirst 5 Rows:")
print(df.head())