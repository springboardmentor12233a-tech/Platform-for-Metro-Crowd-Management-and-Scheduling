import pandas as pd
import os

# ==========================
# Load Dataset
# ==========================
df = pd.read_csv("../datasets/processed/delhi_metro_featured.csv")

# ==========================
# Calculate Insights
# ==========================

total_trips = len(df)
avg_fare = df["Fare"].mean()
avg_distance = df["Distance_km"].mean()
avg_passengers = df["Passengers"].mean()

most_used_ticket = df["Ticket_Type"].mode()[0]

top_source = df["From_Station"].value_counts().idxmax()
top_destination = df["To_Station"].value_counts().idxmax()

top_route = df["Route"].value_counts().idxmax()

# ==========================
# Save Report
# ==========================

os.makedirs("../output/reports", exist_ok=True)

report_path = "../output/reports/business_insights.txt"
with open(report_path, "w", encoding="utf-8") as f:

    f.write("METROFLOW BUSINESS INSIGHTS\n")
    f.write("="*50 + "\n\n")

    f.write(f"Total Trips : {total_trips}\n")
    f.write(f"Average Fare : ₹{avg_fare:.2f}\n")
    f.write(f"Average Distance : {avg_distance:.2f} km\n")
    f.write(f"Average Passengers : {avg_passengers:.2f}\n\n")

    f.write(f"Most Used Ticket : {most_used_ticket}\n")
    f.write(f"Top Source Station : {top_source}\n")
    f.write(f"Top Destination Station : {top_destination}\n")
    f.write(f"Most Popular Route : {top_route}\n")

print("Business Insight Report Generated Successfully!")