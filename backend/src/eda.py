import pandas as pd
import matplotlib.pyplot as plt
import os

# -------------------------------
# Load Dataset
# -------------------------------
dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 50)
print("METROFLOW DATASET LOADED SUCCESSFULLY")
print("=" * 50)

# -------------------------------
# Basic Information
# -------------------------------
print("\nFirst 5 Rows")
print(df.head())

print("\nDataset Shape")
print(df.shape)

print("\nColumn Names")
print(df.columns.tolist())

print("\nDataset Information")
print(df.info())

print("\nMissing Values")
print(df.isnull().sum())

print("\nDuplicate Rows")
print(df.duplicated().sum())

print("\nStatistical Summary")
print(df.describe(include="all"))

# -------------------------------
# Create outputs folder if missing
# -------------------------------
os.makedirs("../outputs", exist_ok=True)

# -------------------------------
# Passenger Count Distribution
# -------------------------------
plt.figure(figsize=(8,5))
df["Passenger_Count"].hist(bins=20)

plt.title("Passenger Count Distribution")
plt.xlabel("Passenger Count")
plt.ylabel("Frequency")

plt.savefig("../outputs/passenger_distribution.png")
plt.close()

# -------------------------------
# Crowd Level Count
# -------------------------------
plt.figure(figsize=(6,5))
df["Crowd_Level"].value_counts().plot(kind="bar")

plt.title("Crowd Level")
plt.xlabel("Crowd")
plt.ylabel("Count")

plt.savefig("../outputs/crowd_level.png")
plt.close()

# -------------------------------
# Station Passenger Count
# -------------------------------
plt.figure(figsize=(10,6))

df.groupby("Station")["Passenger_Count"].mean().plot(kind="bar")

plt.title("Average Passenger Count by Station")
plt.xlabel("Station")
plt.ylabel("Average Passenger Count")

plt.savefig("../outputs/station_passenger.png")
plt.close()

print("\nEDA Completed Successfully!")
print("Graphs saved inside outputs folder.")