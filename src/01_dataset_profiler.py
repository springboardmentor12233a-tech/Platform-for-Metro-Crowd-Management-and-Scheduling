import pandas as pd

# ==========================
# Load Dataset
# ==========================
file_path = "../datasets/raw/delhi_metro_updated.csv"
df = pd.read_csv(file_path)

# ==========================
# Dataset Overview
# ==========================
print("=" * 70)
print("             DELHI METRO DATASET PROFILE")
print("=" * 70)

print(f"\nDataset Shape      : {df.shape}")
print(f"Rows               : {df.shape[0]}")
print(f"Columns            : {df.shape[1]}")

print("\n" + "=" * 70)
print("COLUMN NAMES")
print("=" * 70)
print(df.columns.tolist())

print("\n" + "=" * 70)
print("DATA TYPES")
print("=" * 70)
print(df.dtypes)

print("\n" + "=" * 70)
print("MISSING VALUES")
print("=" * 70)
print(df.isnull().sum())

print("\n" + "=" * 70)
print("DUPLICATE ROWS")
print("=" * 70)
print(df.duplicated().sum())

print("\n" + "=" * 70)
print("UNIQUE VALUES")
print("=" * 70)
print(df.nunique())

print("\n" + "=" * 70)
print("MEMORY USAGE")
print("=" * 70)
print(round(df.memory_usage(deep=True).sum()/1024/1024,2),"MB")

print("\n" + "=" * 70)
print("STATISTICAL SUMMARY")
print("=" * 70)
print(df.describe())

print("\n" + "=" * 70)
print("FIRST FIVE ROWS")
print("=" * 70)
print(df.head())