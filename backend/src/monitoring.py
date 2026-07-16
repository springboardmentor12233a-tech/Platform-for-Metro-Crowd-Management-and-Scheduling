import pandas as pd
import os

# ---------------------------------------
# Load Dataset
# ---------------------------------------
dataset_path = "../data/MetroFlow_Dataset.xlsx"

df = pd.read_excel(dataset_path)

print("=" * 60)
print("REAL-TIME OPERATIONAL MONITORING")
print("=" * 60)

# ---------------------------------------
# Current Operational Status
# ---------------------------------------
latest = df.iloc[-1]

print("\nCurrent Metro Status")
print("-" * 50)

print(f"Date                 : {latest['Date']}")
print(f"Time                 : {latest['Time']}")
print(f"Day                  : {latest['Day']}")
print(f"Station              : {latest['Station']}")
print(f"Passenger Entries    : {latest['Passenger_Entries']}")
print(f"Passenger Exits      : {latest['Passenger_Exits']}")
print(f"Passenger Count      : {latest['Passenger_Count']}")
print(f"Occupancy            : {latest['Occupancy_Percent']} %")
print(f"Crowd Level          : {latest['Crowd_Level']}")
print(f"Train Speed          : {latest['Train_Speed_kmph']} km/h")
print(f"Delay                : {latest['Delay_Minutes']} Minutes")
print(f"Trips                : {latest['Number_of_Trips']}")
print(f"Recommendation       : {latest['AI_Recommendation']}")

# ---------------------------------------
# Overall Statistics
# ---------------------------------------
print("\nOverall Statistics")
print("-" * 50)

print(f"Average Passenger Count : {df['Passenger_Count'].mean():.2f}")
print(f"Average Occupancy       : {df['Occupancy_Percent'].mean():.2f}%")
print(f"Average Delay           : {df['Delay_Minutes'].mean():.2f} Minutes")
print(f"Maximum Passenger Count : {df['Passenger_Count'].max()}")
print(f"Most Crowded Station    : {df.groupby('Station')['Passenger_Count'].mean().idxmax()}")

# ---------------------------------------
# Save Monitoring Report
# ---------------------------------------
os.makedirs("../outputs", exist_ok=True)

df.tail(50).to_csv("../outputs/monitoring_report.csv", index=False)

print("\nMonitoring Report Saved Successfully")
print("Monitoring Completed Successfully")