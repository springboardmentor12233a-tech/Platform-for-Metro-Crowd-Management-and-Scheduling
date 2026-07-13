import pandas as pd

# ==========================
# Load Dataset
# ==========================
file_path = "../datasets/raw/delhi_metro_updated.csv"
df = pd.read_csv(file_path)

print("=" * 70)
print("              DATA QUALITY REPORT")
print("=" * 70)

# ==========================
# Missing Values
# ==========================
print("\n1. Missing Values")
print("-" * 70)
print(df.isnull().sum())

print("\nMissing Value Percentage")
print("-" * 70)
print((df.isnull().sum() / len(df)) * 100)

# ==========================
# Duplicate Records
# ==========================
print("\n2. Duplicate Records")
print("-" * 70)
print("Duplicate Rows:", df.duplicated().sum())

# ==========================
# Unique Values
# ==========================
print("\n3. Unique Values")
print("-" * 70)
print(df.nunique())

# ==========================
# Check Negative Values
# ==========================
print("\n4. Negative Distance")
print("-" * 70)
print((df["Distance_km"] < 0).sum())

print("\nNegative Fare")
print("-" * 70)
print((df["Fare"] < 0).sum())

print("\nNegative Passengers")
print("-" * 70)
print((df["Passengers"] < 0).sum())

# ==========================
# Date Format Check
# ==========================
print("\n5. Date Conversion Check")
print("-" * 70)

try:
    pd.to_datetime(df["Date"])
    print("Date column can be converted successfully.")
except Exception as e:
    print("Date conversion failed.")
    print(e)