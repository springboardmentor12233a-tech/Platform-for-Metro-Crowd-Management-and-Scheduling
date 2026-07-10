import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

# ==============================
# Load Dataset
# ==============================

file_path = "data/MetroFlow_Dataset.xlsx"
df = pd.read_excel(file_path)

print("=" * 60)
print("DATA PREPROCESSING")
print("=" * 60)

# ==============================
# Remove Duplicate Rows
# ==============================

duplicates = df.duplicated().sum()
print(f"Duplicate Rows Before Removal : {duplicates}")

df.drop_duplicates(inplace=True)

duplicates = df.duplicated().sum()
print(f"Duplicate Rows After Removal  : {duplicates}")

# ==============================
# Check Missing Values
# ==============================

print("\nMissing Values")
print(df.isnull().sum())

# ==============================
# Encode Categorical Columns
# ==============================

categorical_columns = [
    "Date",
    "Time",
    "Day",
    "Weather",
    "Station",
    "From_Station",
    "To_Station",
    "Crowd_Level",
    "Congestion_Level",
    "AI_Recommendation"
]

encoders = {}

for column in categorical_columns:
    encoder = LabelEncoder()
    df[column] = encoder.fit_transform(df[column])

    encoders[column] = encoder

print("\nCategorical columns encoded successfully.")

# ==============================
# Scale Numerical Features
# ==============================

numerical_columns = [
    "Is_Holiday",
    "Passenger_Entries",
    "Passenger_Exits",
    "Passenger_Count",
    "Occupancy_Percent",
    "Train_Speed_kmph",
    "Number_of_Trips",
    "Delay_Minutes",
    "Peak_Hour",
    "Train_Frequency_Per_Hour"
]

scaler = StandardScaler()

df[numerical_columns] = scaler.fit_transform(df[numerical_columns])

print("Numerical columns scaled successfully.")

# ==============================
# Create output folders if needed
# ==============================

os.makedirs("outputs", exist_ok=True)
os.makedirs("models", exist_ok=True)

# ==============================
# Save Cleaned Dataset
# ==============================

df.to_csv("outputs/preprocessed_data.csv", index=False)

# ==============================
# Save Scaler
# ==============================

joblib.dump(scaler, "models/scaler.pkl")

# ==============================
# Save Label Encoders
# ==============================

joblib.dump(encoders, "models/label_encoders.pkl")

print("\nPreprocessed dataset saved to outputs/preprocessed_data.csv")
print("Scaler saved to models/scaler.pkl")
print("Label encoders saved to models/label_encoders.pkl")

print("\nFirst 5 Rows")
print(df.head())