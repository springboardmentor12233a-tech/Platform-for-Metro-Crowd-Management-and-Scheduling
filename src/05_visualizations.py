import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# =====================================
# Load Feature Engineered Dataset
# =====================================
file_path = "../datasets/processed/delhi_metro_featured.csv"

df = pd.read_csv(file_path)

# Convert Date back to datetime
df["Date"] = pd.to_datetime(df["Date"])

# =====================================
# Create Output Folder
# =====================================
graph_folder = "../output/graphs"
os.makedirs(graph_folder, exist_ok=True)

sns.set_style("whitegrid")

# =====================================
# Graph 1 - Passenger Distribution
# =====================================
plt.figure(figsize=(8,5))
plt.hist(df["Passengers"], bins=30)
plt.title("Passenger Distribution")
plt.xlabel("Passengers")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(f"{graph_folder}/01_passenger_distribution.png")
plt.close()

# =====================================
# Graph 2 - Fare Distribution
# =====================================
plt.figure(figsize=(8,5))
plt.hist(df["Fare"], bins=30)
plt.title("Fare Distribution")
plt.xlabel("Fare")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(f"{graph_folder}/02_fare_distribution.png")
plt.close()

# =====================================
# Graph 3 - Distance Distribution
# =====================================
plt.figure(figsize=(8,5))
plt.hist(df["Distance_km"], bins=30)
plt.title("Distance Distribution")
plt.xlabel("Distance (km)")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig(f"{graph_folder}/03_distance_distribution.png")
plt.close()

# =====================================
# Graph 4 - Top 10 Source Stations
# =====================================
plt.figure(figsize=(10,6))
df["From_Station"].value_counts().head(10).plot(kind="bar")
plt.title("Top 10 Source Stations")
plt.xlabel("Station")
plt.ylabel("Trips")
plt.tight_layout()
plt.savefig(f"{graph_folder}/04_top_source_stations.png")
plt.close()

# =====================================
# Graph 5 - Top 10 Destination Stations
# =====================================
plt.figure(figsize=(10,6))
df["To_Station"].value_counts().head(10).plot(kind="bar")
plt.title("Top 10 Destination Stations")
plt.xlabel("Station")
plt.ylabel("Trips")
plt.tight_layout()
plt.savefig(f"{graph_folder}/05_top_destination_stations.png")
plt.close()

# =====================================
# Graph 6 - Ticket Type Distribution
# =====================================
plt.figure(figsize=(7,7))
df["Ticket_Type"].value_counts().plot(kind="pie", autopct="%1.1f%%")
plt.ylabel("")
plt.title("Ticket Type Distribution")
plt.tight_layout()
plt.savefig(f"{graph_folder}/06_ticket_type_distribution.png")
plt.close()

# =====================================
# Graph 7 - Monthly Trips
# =====================================
monthly = df.groupby("Month_Name").size()

month_order = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
]

monthly = monthly.reindex(month_order)

plt.figure(figsize=(10,5))
monthly.plot(kind="line", marker="o")
plt.title("Monthly Trips")
plt.xlabel("Month")
plt.ylabel("Trips")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(f"{graph_folder}/07_monthly_trips.png")
plt.close()

# =====================================
# Graph 8 - Weekday Analysis
# =====================================
weekday = df["Day_Name"].value_counts()

day_order = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
]

weekday = weekday.reindex(day_order)

plt.figure(figsize=(9,5))
weekday.plot(kind="bar")
plt.title("Trips by Day of Week")
plt.xlabel("Day")
plt.ylabel("Trips")
plt.tight_layout()
plt.savefig(f"{graph_folder}/08_weekday_analysis.png")
plt.close()

# =====================================
# Graph 9 - Top Routes
# =====================================
plt.figure(figsize=(12,6))
df["Route"].value_counts().head(10).plot(kind="bar")
plt.title("Top 10 Routes")
plt.xlabel("Route")
plt.ylabel("Trips")
plt.tight_layout()
plt.savefig(f"{graph_folder}/09_top_routes.png")
plt.close()

# =====================================
# Graph 10 - Correlation Heatmap
# =====================================
numeric = df.select_dtypes(include=["number"])

plt.figure(figsize=(8,6))
sns.heatmap(numeric.corr(), annot=True, cmap="coolwarm")
plt.title("Correlation Heatmap")
plt.tight_layout()
plt.savefig(f"{graph_folder}/10_correlation_heatmap.png")
plt.close()

print("="*60)
print("ALL VISUALIZATIONS GENERATED SUCCESSFULLY")
print("="*60)

print("\nGraphs saved in:")
print(graph_folder)