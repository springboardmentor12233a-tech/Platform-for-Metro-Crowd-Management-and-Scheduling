import pandas as pd
import os

# ==========================
# Load Dataset
# ==========================
file_path = "../datasets/raw/delhi_metro_updated.csv"
df = pd.read_csv(file_path)

print("=" * 70)
print("               DATA CLEANING")
print("=" * 70)

# ==========================
# Convert Date
# ==========================
df["Date"] = pd.to_datetime(df["Date"])

print("✓ Date converted to datetime")

# ==========================
# Remove Duplicate Rows
# ==========================
before = len(df)

df.drop_duplicates(inplace=True)

after = len(df)

print(f"✓ Duplicate rows removed : {before-after}")

# ==========================
# Fill Missing Values
# ==========================

df["Passengers"] = df["Passengers"].fillna(df["Passengers"].median())

df["Ticket_Type"] = df["Ticket_Type"].fillna(df["Ticket_Type"].mode()[0])

df["Remarks"] = df["Remarks"].fillna("Unknown")

print("✓ Missing values handled")

# ==========================
# Verify Cleaning
# ==========================

print("\nRemaining Missing Values")
print(df.isnull().sum())

# ==========================
# Save Clean Dataset
# ==========================

os.makedirs("../datasets/processed", exist_ok=True)

df.to_csv("../datasets/processed/delhi_metro_cleaned.csv", index=False)

print("\n✓ Cleaned dataset saved successfully!")