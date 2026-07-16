import pandas as pd
import os

# ----------------------------------------
# Load Dataset
# ----------------------------------------
dataset_path = "../data/MetroFlow_Dataset.xlsx"
df = pd.read_excel(dataset_path)

print("=" * 60)
print("TRAFFIC ANALYSIS REPORT")
print("=" * 60)

# ----------------------------------------
# Calculate Statistics
# ----------------------------------------

total_passengers = df["Passenger_Count"].sum()

average_passengers = df["Passenger_Count"].mean()

maximum_passengers = df["Passenger_Count"].max()

minimum_passengers = df["Passenger_Count"].min()

average_delay = df["Delay_Minutes"].mean()

maximum_occupancy = df["Occupancy_Percent"].max()

average_speed = df["Train_Speed_kmph"].mean()

total_trips = df["Number_of_Trips"].sum()

most_crowded_station = (
    df.groupby("Station")["Passenger_Count"]
    .mean()
    .idxmax()
)

peak_hour = (
    df.groupby("Peak_Hour")["Passenger_Count"]
    .mean()
    .idxmax()
)

# ----------------------------------------
# Display Report
# ----------------------------------------

print(f"Total Passengers        : {total_passengers}")

print(f"Average Passenger Count : {average_passengers:.2f}")

print(f"Maximum Passenger Count : {maximum_passengers}")

print(f"Minimum Passenger Count : {minimum_passengers}")

print(f"Average Delay           : {average_delay:.2f} Minutes")

print(f"Maximum Occupancy       : {maximum_occupancy:.2f}%")

print(f"Average Train Speed     : {average_speed:.2f} km/h")

print(f"Total Trips             : {total_trips}")

print(f"Peak Hour              : {peak_hour}")

print(f"Most Crowded Station   : {most_crowded_station}")

# ----------------------------------------
# Create Report DataFrame
# ----------------------------------------

report = pd.DataFrame({

    "Metric": [

        "Total Passengers",
        "Average Passenger Count",
        "Maximum Passenger Count",
        "Minimum Passenger Count",
        "Average Delay",
        "Maximum Occupancy",
        "Average Train Speed",
        "Total Trips",
        "Peak Hour",
        "Most Crowded Station"

    ],

    "Value": [

        total_passengers,
        round(average_passengers,2),
        maximum_passengers,
        minimum_passengers,
        round(average_delay,2),
        round(maximum_occupancy,2),
        round(average_speed,2),
        total_trips,
        peak_hour,
        most_crowded_station

    ]

})

# ----------------------------------------
# Save Report
# ----------------------------------------

os.makedirs("../outputs", exist_ok=True)

report.to_csv("../outputs/traffic_analysis_report.csv", index=False)

print("\nTraffic Analysis Report Saved Successfully")