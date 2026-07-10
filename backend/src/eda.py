import pandas as pd

# -------------------------------
# Load Dataset
# -------------------------------

file_path = "data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(file_path)

# -------------------------------
# Display first 5 rows
# -------------------------------

print("=" * 60)
print("FIRST 5 ROWS")
print("=" * 60)

print(df.head())

# -------------------------------
# Dataset Shape
# -------------------------------

print("\n")
print("=" * 60)
print("DATASET SHAPE")
print("=" * 60)

print(df.shape)
# -------------------------------
# Column Names
# -------------------------------

print("\n")
print("=" * 60)
print("COLUMN NAMES")
print("=" * 60)

print(df.columns)
# -------------------------------
# Dataset Information
# -------------------------------

print("\n")
print("=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

print(df.info())
# -------------------------------
# Statistical Summary
# -------------------------------

print("\n")
print("=" * 60)
print("STATISTICAL SUMMARY")
print("=" * 60)

print(df.describe())
# -------------------------------
# Missing Values
# -------------------------------

print("\n")
print("=" * 60)
print("MISSING VALUES")
print("=" * 60)

print(df.isnull().sum())
# -------------------------------
# Duplicate Rows
# -------------------------------

print("\n")
print("=" * 60)
print("DUPLICATE ROWS")
print("=" * 60)

print(df.duplicated().sum())
# -------------------------------
# Data Types
# -------------------------------

print("\n")
print("=" * 60)
print("DATA TYPES")
print("=" * 60)

print(df.dtypes)
import pandas as pd

df = pd.read_excel("data/MetroFlow_Dataset.xlsx")

print("Days:")
print(df["Day"].unique())

print("\nWeather:")
print(df["Weather"].unique())

print("\nStations:")
print(df["Station"].unique())

print("\nFrom Stations:")
print(df["From_Station"].unique())

print("\nTo Stations:")
print(df["To_Station"].unique())