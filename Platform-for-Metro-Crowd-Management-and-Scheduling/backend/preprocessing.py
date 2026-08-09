import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

# ==========================
# Load Dataset
# ==========================
file = "data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(file, sheet_name="MetroFlow")

# ==========================
# Exploratory Data Analysis
# ==========================
print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Information:")
print(df.info())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

# ==========================
# Encode Categorical Columns
# ==========================
encoder = LabelEncoder()

categorical_columns = [
    "Day",
    "Weather",
    "Station",
    "From_Station",
    "To_Station",
    "Crowd_Level",
    "Congestion_Level",
    "AI_Recommendation"
]

for col in categorical_columns:
    df[col] = encoder.fit_transform(df[col])

# ==========================
# Convert Date and Time
# ==========================
df["Date"] = pd.to_datetime(df["Date"])

df["Year"] = df["Date"].dt.year
df["Month"] = df["Date"].dt.month
df["Day_of_Month"] = df["Date"].dt.day

# Remove original Date column
df.drop("Date", axis=1, inplace=True)

# Convert Time (HH:MM) to Hour
df["Time"] = pd.to_datetime(df["Time"], format="%H:%M").dt.hour

# ==========================
# Scale Numerical Features
# ==========================
scaler = StandardScaler()

numerical_columns = [
    "Year",
    "Month",
    "Day_of_Month",
    "Time",
    "Passenger_Entries",
    "Passenger_Exits",
    "Passenger_Count",
    "Occupancy_Percent",
    "Train_Speed_kmph",
    "Number_of_Trips",
    "Delay_Minutes",
    "Train_Frequency_Per_Hour"
]

df[numerical_columns] = scaler.fit_transform(df[numerical_columns])

# ==========================
# Save Preprocessed Dataset
# ==========================
df.to_csv("data/preprocessed_data.csv", index=False)

print("\nPreprocessing completed successfully!")
print("Preprocessed dataset saved as: data/preprocessed_data.csv")