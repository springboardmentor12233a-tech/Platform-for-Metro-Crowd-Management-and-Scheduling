import pandas as pd
import os

# ==========================
# Load Cleaned Dataset
# ==========================
file_path = "../datasets/processed/delhi_metro_cleaned.csv"
df = pd.read_csv(file_path)

# ==========================
# Convert Date to Datetime
# ==========================
df["Date"] = pd.to_datetime(df["Date"])

# ==========================
# Feature Engineering
# ==========================

# Year
df["Year"] = df["Date"].dt.year

# Month Number
df["Month"] = df["Date"].dt.month

# Month Name
df["Month_Name"] = df["Date"].dt.month_name()

# Day
df["Day"] = df["Date"].dt.day

# Day Name
df["Day_Name"] = df["Date"].dt.day_name()

# Weekend Flag
df["Is_Weekend"] = df["Day_Name"].isin(["Saturday", "Sunday"])

# Route
df["Route"] = df["From_Station"] + " → " + df["To_Station"]

# ==========================
# Save Engineered Dataset
# ==========================
os.makedirs("../datasets/processed", exist_ok=True)

output_path = "../datasets/processed/delhi_metro_featured.csv"
df.to_csv(output_path, index=False)

print("=" * 60)
print("FEATURE ENGINEERING COMPLETED")
print("=" * 60)

print("\nNew Features Added:")
print("- Year")
print("- Month")
print("- Month_Name")
print("- Day")
print("- Day_Name")
print("- Is_Weekend")
print("- Route")

print("\nDataset Shape:", df.shape)
print("\nFeature-engineered dataset saved successfully!")