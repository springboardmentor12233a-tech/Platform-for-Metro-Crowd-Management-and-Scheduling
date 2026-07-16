import pandas as pd

def generate_schedule(df):

    schedule = []

    for _, row in df.iterrows():

        passenger_count = row["Passenger_Count"]
        station = row["Station"]

        if passenger_count > 1500:
            crowd = "High"
            frequency = "Every 3 Minutes"

        elif passenger_count >= 700:
            crowd = "Medium"
            frequency = "Every 5 Minutes"

        else:
            crowd = "Low"
            frequency = "Every 10 Minutes"

        schedule.append({
            "Station": station,
            "Passenger_Count": int(passenger_count),
            "Crowd_Level": crowd,
            "Recommended_Frequency": frequency
        })

    return schedule